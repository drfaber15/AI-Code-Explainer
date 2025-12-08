FEW_SHOT = """Input code:
def add(a, b):
    return a + b

Desired JSON:
{
  "summary": "Adds two numbers and returns the result.",
  "line_explanations": [
    {"line": 1, "code": "def add(a, b):", "explanation": "Defines function add with parameters a and b."},
    {"line": 2, "code": "    return a + b", "explanation": "Returns the sum of a and b."}
  ],
  "tests": [
    {"name": "test_add_positive", "description": "adds 2 and 3 returns 5", "example": "assert add(2,3) == 5"}
  ]
}
"""

def build_prompt(code, lang_hint=None):
    header = "You are a senior software engineer who explains code clearly and concisely."
    if lang_hint:
        header += f" Language hint: {lang_hint}."
    return f"{header}\n\n{FEW_SHOT}\n\nInput code:\n{code}\n\nReturn only valid JSON following the schema above."