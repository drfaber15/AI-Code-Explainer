import { useState } from 'react'
import { explainCode } from './services/api'
import { FileCode, Loader, Copy, Check } from 'lucide-react'

interface ExplanationResult {
  summary: string
  line_explanations: Array<{
    line: number
    code: string
    explanation: string
  }>
  tests: Array<{
    name: string
    description: string
    example: string
  }>
}


function CodeEditor({ code, language, onCodeChange, onLanguageChange }: any) {
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const content = event.target?.result as string
        onCodeChange(content)
        const ext = file.name.split('.').pop()?.toLowerCase()
        const langMap: Record<string, string> = {
          py: 'python',
          js: 'javascript',
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
          ts: 'typescript',
          tsx: 'typescript',
          jsx: 'javascript',
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
            <span className="text-sm text-slate-400 hover:text-slate-300">📁 Upload</span>
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
            <option value="csharp">C#</option>
            <option value="ruby">Ruby</option>
            <option value="go">Go</option>
            <option value="rust">Rust</option>
            <option value="php">PHP</option>
          </select>
        </div>
      </div>

      <textarea
        value={code}
        onChange={(e) => onCodeChange(e.target.value)}
        placeholder="Paste your code here..."
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

function ExplanationDisplay({ result }: { result: ExplanationResult }) {
  const [expandedLines, setExpandedLines] = useState<Set<number>>(new Set())
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const toggleLine = (line: number) => {
    const newExpanded = new Set(expandedLines)
    if (newExpanded.has(line)) {
      newExpanded.delete(line)
    } else {
      newExpanded.add(line)
    }
    setExpandedLines(newExpanded)
  }

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="space-y-6">
      {/* Summary Section */}
      <div className="bg-slate-700 rounded-lg p-4 border border-slate-600">
        <h2 className="text-lg font-semibold text-blue-300 mb-2">📝 Summary</h2>
        <p className="text-slate-100 leading-relaxed">{result.summary}</p>
      </div>

      {/* Line by Line Explanations */}
      {result.line_explanations && result.line_explanations.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-green-300 mb-3">🔍 Line-by-Line</h2>
          <div className="space-y-2">
            {result.line_explanations.map((item) => (
              <div
                key={item.line}
                className="bg-slate-700 rounded-lg border border-slate-600 overflow-hidden"
              >
                <button
                  onClick={() => toggleLine(item.line)}
                  className="w-full flex items-center gap-3 p-4 hover:bg-slate-600 transition text-left"
                >
                  <span className={`transition-transform ${expandedLines.has(item.line) ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                  <span className="text-slate-400 font-mono text-sm flex-shrink-0">
                    Line {item.line}:
                  </span>
                  <code className="text-amber-300 font-mono text-sm flex-1 truncate">
                    {item.code}
                  </code>
                </button>

                {expandedLines.has(item.line) && (
                  <div className="px-4 py-3 bg-slate-800 border-t border-slate-600">
                    <p className="text-slate-100 text-sm leading-relaxed">
                      {item.explanation}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Suggested Tests */}
      {result.tests && result.tests.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-purple-300 mb-3">🧪 Tests</h2>
          <div className="space-y-3">
            {result.tests.map((test, index) => (
              <div
                key={index}
                className="bg-slate-700 rounded-lg border border-slate-600 p-4"
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="text-purple-400 font-semibold">{test.name}</span>
                </div>
                <p className="text-slate-300 text-sm mb-3">{test.description}</p>
                <div className="bg-slate-800 rounded p-3 border-l-2 border-purple-500 flex items-center justify-between">
                  <code className="text-lime-300 text-xs font-mono flex-1">
                    {test.example}
                  </code>
                  <button
                    onClick={() => copyToClipboard(test.example, `test-${index}`)}
                    className="ml-2 p-1 hover:bg-slate-700 rounded transition"
                  >
                    {copiedId === `test-${index}` ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4 text-slate-400" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function App() {
  const [code, setCode] = useState('def add(a, b):\n    return a + b')
  const [language, setLanguage] = useState('python')
  const [result, setResult] = useState<ExplanationResult | null>(null)
  const [loading, setLoading] = useState(false)

  const handleExplain = async () => {
    if (!code.trim()) {
      console.log('[DEBUG] No code to explain.')
      return
    }

    setLoading(true)
    setResult(null)
    console.log('[DEBUG] Sending explain request:', { code, language })

    try {
      const explanation = await explainCode(code, language)
      console.log('[DEBUG] Received explanation:', explanation)
      setResult(explanation)
    } catch (err: any) {
      console.error('[DEBUG] Error from explainCode:', err)
      setResult({
        summary: err.message || 'Failed to get explanation from backend.',
        line_explanations: code.split('\n').map((line, idx) => ({
          line: idx + 1,
          code: line.trim(),
          explanation: 'Error: Could not get explanation.'
        })),
        tests: []
      })
    } finally {
      setLoading(false)
    }
  }

  const handleLoadExample = (exampleCode: string, lang: string) => {
    setCode(exampleCode)
    setLanguage(lang)
    setResult(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <header className="bg-slate-950 border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <FileCode className="w-8 h-8 text-blue-400" />
            <h1 className="text-3xl font-bold text-white">Code Explainer</h1>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Paste code to get AI-powered explanations and suggested tests
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
              <CodeEditor
                code={code}
                language={language}
                onCodeChange={setCode}
                onLanguageChange={setLanguage}
              />
            </div>

            <button
              onClick={handleExplain}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white font-medium py-3 px-4 rounded-lg transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Explaining...
                </>
              ) : (
                'Explain Code'
              )}
            </button>

            <div className="bg-slate-800 rounded-lg border border-slate-700 p-4">
              <h3 className="text-sm font-semibold text-slate-300 mb-3">Examples</h3>
              <div className="space-y-2">
                <button
                  onClick={() => handleLoadExample('def add(a, b):\n    return a + b', 'python')}
                  className="w-full text-left px-3 py-2 rounded bg-slate-700 hover:bg-slate-600 text-sm text-slate-100 transition"
                >
                  Python: Add
                </button>
                <button
                  onClick={() => handleLoadExample('function quickSort(arr) {\n  if (arr.length <= 1) return arr;\n  const pivot = arr[0];\n  const left = arr.slice(1).filter(x => x < pivot);\n  const right = arr.slice(1).filter(x => x >= pivot);\n  return [...quickSort(left), pivot, ...quickSort(right)];\n}', 'javascript')}
                  className="w-full text-left px-3 py-2 rounded bg-slate-700 hover:bg-slate-600 text-sm text-slate-100 transition"
                >
                  JavaScript: QuickSort
                </button>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
            {!result && !loading && (
              <div className="text-center py-12">
                <FileCode className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                <p className="text-slate-400">
                  Paste code and click "Explain Code"
                </p>
              </div>
            )}

            {loading && (
              <div className="flex items-center justify-center py-12">
                <Loader className="w-8 h-8 animate-spin text-blue-400" />
                <span className="ml-3 text-slate-300">Analyzing...</span>
              </div>
            )}

            {result && <ExplanationDisplay result={result} />}
          </div>
        </div>
      </main>

      <footer className="bg-slate-950 border-t border-slate-700 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-slate-400 text-sm text-center">
            Code Explainer • Built with React + Tailwind
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
