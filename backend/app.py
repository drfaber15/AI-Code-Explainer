
from flask import Flask, request, jsonify
from flask_cors import CORS
try:
    from prompts import build_prompt
    from llm_client import call_llm
    from parser import parse_response
except ImportError as e:
    print(f"Error importing CLI modules: {e}")
    build_prompt = None
    call_llm = None
    parse_response = None

app = Flask(__name__)
CORS(app)

@app.route('/explain', methods=['POST'])
def explain_code():
    data = request.get_json()
    code = data.get('code', '')
    language = data.get('language', '')
    if build_prompt and call_llm and parse_response:
        try:
            prompt = build_prompt(code, lang_hint=language)
            print(f"[DEBUG] Prompt: {prompt}")
            raw_response = call_llm(prompt)
            print(f"[DEBUG] Raw LLM response: {raw_response}")
            parsed = parse_response(raw_response)
            print(f"[DEBUG] Parsed response: {parsed}")
            return jsonify(parsed)
        except Exception as e:
            print(f"[ERROR] Explainer exception: {e}", flush=True)
            import traceback
            traceback.print_exc()
            return jsonify({"summary": f"Explainer error: {str(e)}", "line_explanations": [], "tests": []}), 500
    print("[ERROR] Falling back to mock response. CLI modules not loaded or other error.", flush=True)
    return jsonify({
        "summary": f"This code snippet is written in {language}. To get AI-powered explanations, integrate your explainer logic here.",
        "line_explanations": [
            {"line": i+1, "code": line, "explanation": "Explanation for this line."} for i, line in enumerate(code.split('\n'))
        ],
        "tests": [
            {"name": "ExampleTest", "description": "This is a sample test.", "example": "assert True"}
        ]
    })

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "ok"})

import os

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
