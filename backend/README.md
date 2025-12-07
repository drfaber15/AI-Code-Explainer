# Code Explainer Backend

This is a simple Flask backend for code explanation.

## Endpoints
- `POST /explain` — Get code explanations
- `GET /health` — Health check

## Local Development
```sh
pip install -r requirements.txt
python app.py
```

## Docker
```sh
docker build -t code-explainer-backend .
docker run -p 5000:5000 code-explainer-backend
```
