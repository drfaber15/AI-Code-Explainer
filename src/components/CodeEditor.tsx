import { SyntaxHighlighter, docco } from 'react-syntax-highlighter'
import { Upload } from 'lucide-react'
import React from 'react'

interface CodeEditorProps {
  code: string
  language: string
  onCodeChange: (code: string) => void
  onLanguageChange: (language: string) => void
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  language,
  onCodeChange,
  onLanguageChange,
}) => {
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const content = event.target?.result as string
        onCodeChange(content)
        
        // Auto-detect language from file extension
        const ext = file.name.split('.').pop()?.toLowerCase()
        const langMap: Record<string, string> = {
          py: 'python',
          js: 'javascript',
          jsx: 'javascript',
          ts: 'typescript',
          tsx: 'typescript',
          java: 'java',
          cpp: 'cpp',
          c: 'c',
          cs: 'csharp',
          rb: 'ruby',
          go: 'go',
          rs: 'rust',
          php: 'php',
          swift: 'swift',
          kt: 'kotlin',
        }
        if (ext && ext in langMap) {
          onLanguageChange(langMap[ext])
        }
      }
      reader.readAsText(file)
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="bg-slate-900 border-b border-slate-700 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          <label className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition">
            <Upload className="w-4 h-4 text-slate-400" />
            <span className="text-sm text-slate-400 hover:text-slate-300">Upload File</span>
            <input
              type="file"
              onChange={handleFileUpload}
              className="hidden"
              accept=".py,.js,.java,.cpp,.c,.cs,.rb,.go,.rs,.php,.swift,.kt,.ts,.tsx,.jsx"
            />
          </label>
          <div className="flex-1" />
          <select
            value={language}
            onChange={(e) => onLanguageChange(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-slate-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-blue-500"
          >
            <option value="python">Python</option>
            <option value="javascript">JavaScript</option>
            <option value="typescript">TypeScript</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
            <option value="c">C</option>
            <option value="csharp">C#</option>
            <option value="ruby">Ruby</option>
            <option value="go">Go</option>
            <option value="rust">Rust</option>
            <option value="php">PHP</option>
            <option value="swift">Swift</option>
            <option value="kotlin">Kotlin</option>
          </select>
        </div>
      </div>

      <textarea
        value={code}
        onChange={(e) => onCodeChange(e.target.value)}
        placeholder="Enter or paste your code here..."
        className="flex-1 bg-slate-900 text-slate-100 p-4 font-mono text-sm focus:outline-none resize-none"
        spellCheck="false"
      />

      <div className="bg-slate-900 border-t border-slate-700 px-4 py-2">
        <p className="text-xs text-slate-500">
          {code.split('\n').length} lines • {code.length} characters
        </p>
      </div>
    </div>
  )
}

export default CodeEditor
