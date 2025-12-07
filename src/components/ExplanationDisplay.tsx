import React from 'react'
import { ChevronDown } from 'lucide-react'

interface ExplanationItem {
  line: number
  code: string
  explanation: string
}

interface TestItem {
  name: string
  description: string
  example: string
}

interface ExplanationDisplayProps {
  result: {
    summary: string
    line_explanations: ExplanationItem[]
    tests: TestItem[]
    error?: string
  }
}

const ExplanationDisplay: React.FC<ExplanationDisplayProps> = ({ result }) => {
  const [expandedLines, setExpandedLines] = React.useState<Set<number>>(new Set())

  const toggleLine = (line: number) => {
    const newExpanded = new Set(expandedLines)
    if (newExpanded.has(line)) {
      newExpanded.delete(line)
    } else {
      newExpanded.add(line)
    }
    setExpandedLines(newExpanded)
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
          <h2 className="text-lg font-semibold text-green-300 mb-3 flex items-center gap-2">
            🔍 Line-by-Line Explanation
          </h2>
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
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform ${
                      expandedLines.has(item.line) ? 'rotate-180' : ''
                    }`}
                  />
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
          <h2 className="text-lg font-semibold text-purple-300 mb-3 flex items-center gap-2">
            🧪 Suggested Tests
          </h2>
          <div className="space-y-3">
            {result.tests.map((test, index) => (
              <div
                key={index}
                className="bg-slate-700 rounded-lg border border-slate-600 p-4"
              >
                <div className="flex items-start gap-2 mb-2">
                  <span className="text-purple-400 font-semibold">{test.name}</span>
                </div>
                <p className="text-slate-300 text-sm mb-3">{test.description}</p>
                <div className="bg-slate-800 rounded p-3 border-l-2 border-purple-500">
                  <code className="text-lime-300 text-xs font-mono break-words">
                    {test.example}
                  </code>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error handling */}
      {result.error && (
        <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded-lg">
          <p className="font-semibold mb-1">⚠️ Parsing Error</p>
          <p className="text-sm">{result.error}</p>
        </div>
      )}
    </div>
  )
}

export default ExplanationDisplay
