import axios from 'axios'

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000'

export interface ExplanationResponse {
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
  error?: string
}

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const explainCode = async (
  code: string,
  language: string
): Promise<ExplanationResponse> => {
  try {
    const response = await apiClient.post<ExplanationResponse>('/explain', {
      code,
      language,
    })
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.data) {
        throw new Error(
          error.response.data.error || 'Failed to explain code'
        )
      }
      throw new Error(error.message || 'Failed to connect to the server')
    }
    throw error
  }
}

export const healthCheck = async (): Promise<boolean> => {
  try {
    await apiClient.get('/health')
    return true
  } catch {
    return false
  }
}
