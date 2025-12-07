# Code Explainer Frontend

A modern React web UI for the Code Explainer CLI tool. Provides a user-friendly interface to upload code, get AI-powered explanations, and view structured output.

## Features

- 🎨 Beautiful, modern UI built with React and Tailwind CSS
- 📝 Code editor with syntax highlighting and language detection
- 💡 Real-time code explanations with:
  - Summary of code functionality
  - Line-by-line detailed explanations
  - Suggested unit tests
- 📁 File upload support for multiple programming languages
- 🎯 Quick example templates for common algorithms
- 📱 Responsive design for desktop and tablet
- 🌙 Dark mode theme by default

## Supported Languages

- Python
- JavaScript / TypeScript
- Java
- C / C++
- C#
- Ruby
- Go
- Rust
- PHP
- Swift
- Kotlin
- And more!

## Installation

### Prerequisites

- Node.js 18+ and npm

### Setup

```bash
# Install dependencies
npm install

# Set the API URL (optional, defaults to http://localhost:5000)
export REACT_APP_API_URL=http://localhost:5000
```

## Running the Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Building for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── CodeEditor.tsx       # Code input with syntax highlighting
│   │   └── ExplanationDisplay.tsx # Results display
│   ├── services/
│   │   └── api.ts               # API client
│   ├── App.tsx                  # Main app component
│   ├── main.tsx                 # React entry point
│   └── index.css                # Tailwind styles
├── public/                      # Static assets
├── vite.config.ts              # Vite configuration
├── tailwind.config.js          # Tailwind configuration
├── package.json
└── tsconfig.json               # TypeScript configuration
```

## Environment Variables

- `REACT_APP_API_URL` - Backend API URL (default: `http://localhost:5000`)

## Integration with Backend

This frontend communicates with a Python Flask/FastAPI backend. The backend should expose:

- `POST /explain` - Explain code
  - Request body: `{ code: string, language: string }`
  - Response: Explanation object with summary, line_explanations, and tests
- `GET /health` - Health check endpoint

## Development

### Add New Components

Create new components in `src/components/` and export them in `App.tsx`.

### Update Styling

Tailwind CSS is configured. Update the `tailwind.config.js` for custom theme colors.

### API Configuration

Update `src/services/api.ts` to modify API endpoints or add new ones.

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## License

MIT
