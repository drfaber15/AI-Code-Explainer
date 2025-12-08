import json
import re

def parse_response(raw):
    """Parse LLM response into structured JSON, with multiple fallback strategies."""
    
    # Strategy 1: Direct JSON parse
    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        pass
    
    # Strategy 2: Extract JSON from markdown code block (non-greedy)
    json_match = re.search(r'```json\s*(\{.*?\})\s*```', raw, re.DOTALL)
    if not json_match:
        # Try without json tag
        json_match = re.search(r'```\s*(\{.*?\})\s*```', raw, re.DOTALL)
    
    if json_match:
        try:
            json_str = json_match.group(1)
            # Handle nested braces properly - find matching closing brace
            brace_count = 0
            end_pos = 0
            for i, char in enumerate(json_str):
                if char == '{':
                    brace_count += 1
                elif char == '}':
                    brace_count -= 1
                    if brace_count == 0:
                        end_pos = i + 1
                        break
            if end_pos > 0:
                json_str = json_str[:end_pos]
            return json.loads(json_str)
        except json.JSONDecodeError:
            pass
    
    # Strategy 3: Find JSON object with proper brace matching
    if '{' in raw:
        start = raw.find('{')
        brace_count = 0
        for i in range(start, len(raw)):
            if raw[i] == '{':
                brace_count += 1
            elif raw[i] == '}':
                brace_count -= 1
                if brace_count == 0:
                    try:
                        return json.loads(raw[start:i+1])
                    except json.JSONDecodeError:
                        pass
                    break
    
    # Strategy 4: More aggressive JSON extraction
    json_match = re.search(r'(\{.*\})', raw, re.DOTALL)
    if json_match:
        try:
            return json.loads(json_match.group(1))
        except json.JSONDecodeError:
            pass
    
    # Fallback: Return error structure with raw response for debugging
    return {
        "summary": "Failed to parse LLM response into valid JSON",
        "line_explanations": [],
        "tests": [],
        "error": "Parser could not extract valid JSON",
        "raw_response": raw[:500]  # First 500 chars for debugging
    }