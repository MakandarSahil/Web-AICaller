export class ApiError extends Error {
  status: number
  details: string

  constructor(status: number, message: string, details?: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.details = details ?? message
  }
}

export async function throwIfNotOk(response: Response): Promise<void> {
  if (response.ok) {
    return
  }

  let details = `Request failed with status ${response.status}`
  try {
    const contentType = response.headers.get('content-type') ?? ''
    if (contentType.includes('application/json')) {
      const json = await response.json()
      if (typeof json?.detail === 'string') {
        details = json.detail
      }
    } else {
      const text = await response.text()
      if (text.trim()) {
        details = text
      }
    }
  } catch {
    // keep fallback details
  }

  throw new ApiError(response.status, details, details)
}
