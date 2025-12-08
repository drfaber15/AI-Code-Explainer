# src/llm_client.py
import os
import shlex
import subprocess
import shutil
import json
import time
from typing import Optional
import requests

# Ollama config
OLLAMA_AUTO = os.getenv("OLLAMA_AUTO", "0") == "1"
DEFAULT_OLLAMA_MODEL = "code-llama-7b"

# Hugging Face config
HF_TOKEN = os.getenv("HF_TOKEN") or os.getenv("HUGGINGFACE_API_KEY")
DEFAULT_HF_MODEL = "Qwen/Qwen2.5-Coder-32B-Instruct"
# Use Hugging Face serverless inference endpoint
SERVERLESS_API_URL = "https://api-inference.huggingface.co/models/"
SERVERLESS_API_URL = "https://api-inference.huggingface.co/models/"

# Import huggingface_hub if available
try:
    from huggingface_hub import InferenceClient
except Exception:
    InferenceClient = None


def _call_ollama(prompt: str, model: Optional[str], timeout: int = 60) -> str:
    model = model or DEFAULT_OLLAMA_MODEL
    if shutil.which("ollama") is None:
        raise RuntimeError("Ollama not found on PATH.")
    cmd = f"ollama run {shlex.quote(model)} {shlex.quote(prompt)} --temperature 0.1"
    try:
        proc = subprocess.run(cmd, shell=True, capture_output=True, text=True, timeout=timeout)
    except subprocess.TimeoutExpired:
        raise RuntimeError("Ollama call timed out.")
    if proc.returncode != 0:
        raise RuntimeError(f"Ollama error (exit {proc.returncode}): {proc.stderr.strip()}")
    return proc.stdout.strip()


def _parse_router_response(data) -> Optional[str]:
    if isinstance(data, str):
        return data
    if isinstance(data, dict):
        if "generated_text" in data and isinstance(data["generated_text"], str):
            return data["generated_text"]
        if "text" in data and isinstance(data["text"], str):
            return data["text"]
        outputs = data.get("outputs")
        if isinstance(outputs, list) and outputs:
            first = outputs[0]
            if isinstance(first, dict):
                if "generated_text" in first:
                    return first["generated_text"]
                if "text" in first:
                    return first["text"]
        choices = data.get("choices")
        if isinstance(choices, list) and choices:
            c = choices[0]
            if isinstance(c, dict):
                return c.get("text") or c.get("generated_text")
    if isinstance(data, list) and data:
        first = data[0]
        if isinstance(first, dict):
            if "generated_text" in first:
                return first["generated_text"]
            if "text" in first:
                return first["text"]
        try:
            return json.dumps(first)
        except Exception:
            pass
    return None


def _call_hf_inference(prompt: str, model: str, max_new_tokens: int = 512, timeout: int = 60) -> str:
    """
    Call the Hugging Face serverless inference API using huggingface_hub client.
    - Requires HF_TOKEN to be set in the environment.
    - Uses InferenceClient from huggingface_hub library.
    - Uses chat_completion API for better model support.
    """
    if not HF_TOKEN:
        raise RuntimeError("HF_TOKEN environment variable not set. Set it with: export HF_TOKEN='hf_xxx'")

    # Use huggingface_hub InferenceClient (required as old API is deprecated)
    if InferenceClient is None:
        raise RuntimeError("huggingface_hub not installed. Install with: pip install huggingface_hub")
    
    try:
        client = InferenceClient(token=HF_TOKEN)
        
        # Use chat_completion which has better model support
        response = client.chat_completion(
            messages=[{"role": "user", "content": prompt}],
            model=model,
            max_tokens=max_new_tokens,
            temperature=0.1
        )
        
        # Extract the text from the response
        if hasattr(response, 'choices') and len(response.choices) > 0:
            return response.choices[0].message.content
        
        # Fallback: try to get content from response
        return str(response)
        
    except Exception as e:
        error_msg = str(e)
        
        # Handle common errors
        if "401" in error_msg or "Invalid API token" in error_msg:
            raise RuntimeError("Invalid API token (401). Check your HF_TOKEN.")
        
        if "404" in error_msg or "does not exist" in error_msg:
            raise RuntimeError(f"Model not found: {model} (404). Verify model exists on huggingface.co")
        
        if "503" in error_msg or "loading" in error_msg.lower():
            print(f"⏳ Model loading, this may take 20-60 seconds on first call...")
            raise RuntimeError(f"Model is loading. Please wait and try again: {error_msg}")
        
        if "429" in error_msg or "rate limit" in error_msg.lower():
            raise RuntimeError(f"Rate limit exceeded. Wait a moment and try again: {error_msg}")
        
        # Generic error
        raise RuntimeError(f"Hugging Face API error: {error_msg if error_msg else repr(e)}")


def call_llm(prompt: str, model: Optional[str] = None, prefer_ollama: bool = False, timeout: int = 60, max_new_tokens: int = 2000) -> str:
    """
    Unified LLM caller:
      - If Ollama is available and OLLAMA_AUTO=1 or prefer_ollama=True, try Ollama first.
      - Otherwise call Hugging Face Inference via huggingface_hub.InferenceClient.
    """
    # Try Ollama if requested/auto
    ollama_available = shutil.which("ollama") is not None
    if ollama_available and (OLLAMA_AUTO or prefer_ollama):
        try:
            return _call_ollama(prompt, model, timeout=timeout)
        except Exception as e:
            # If Ollama fails and HF is available, fall back
            if InferenceClient is None and (not HF_TOKEN):
                raise
            print(f"Ollama failed: {e}. Falling back to Hugging Face Inference.")

    # Use HF model (default small model for quick tests)
    hf_model = model or DEFAULT_HF_MODEL
    return _call_hf_inference(prompt, hf_model, max_new_tokens=max_new_tokens)
