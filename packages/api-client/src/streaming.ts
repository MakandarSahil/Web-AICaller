export type SseDataHandler = (data: string) => void

export async function readSseStream(
  response: Response,
  onData: SseDataHandler,
  signal?: AbortSignal
): Promise<void> {
  const body = response.body
  if (!body) {
    return
  }

  const reader = body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  while (true) {
    if (signal?.aborted) {
      throw new DOMException('The operation was aborted.', 'AbortError')
    }

    const { done, value } = await reader.read()

    if (done) {
      if (buffer.trim()) {
        emitSseData(buffer, onData)
      }
      break
    }

    // Normalize CRLF from proxies/load balancers so block splitting is stable.
    buffer += decoder.decode(value, { stream: true }).replace(/\r\n/g, '\n')
    const blocks = buffer.split('\n\n')
    buffer = blocks.pop() ?? ''

    for (const block of blocks) {
      emitSseData(block, onData)
    }
  }
}

function emitSseData(block: string, onData: SseDataHandler): void {
  const lines = block.split('\n')
  const parts: string[] = []

  for (const line of lines) {
    if (line.startsWith('data:')) {
      const payload = line.slice(5).trimStart()
      parts.push(payload)
    }
  }

  if (parts.length > 0) {
    onData(parts.join('\n'))
  }
}
