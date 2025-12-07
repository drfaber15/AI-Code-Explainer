from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/explain', methods=['POST'])
def explain_code():
    data = request.get_json()
    code = data.get('code', '')
    language = data.get('language', '')
    # TODO: Integrate your AI code explainer logic here
    # For now, return a mock response
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

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
