import os
import openai

def explain_code_with_openai(code: str, language: str) -> dict:
    openai.api_key = os.getenv('OPENAI_API_KEY')
    prompt = f"""
Explain the following {language} code in detail, including a summary, line-by-line explanations, and suggest some tests:

{code}
"""
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=800
    )
    content = response.choices[0].message['content']
    # For demo, just return the raw content. You can parse it for summary, lines, and tests.
    return {
        "summary": content,
        "line_explanations": [],
        "tests": []
    }
