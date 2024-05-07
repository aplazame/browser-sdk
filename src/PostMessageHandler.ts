
export type RequestListener = (payload: unknown) => void
export type MessageListener = (payload: unknown) => void

export class PostMessageHandler {
  filterFn: ((e: MessageEvent) => boolean) | null
  target: HTMLElement | Window
  eventData: { [key: string]: unknown }

  requestListeners: { [key: string]: RequestListener[] }
  anyRequestListeners: RequestListener[]

  eventListeners: { [key: string]: MessageListener[] }
  anyMessageListeners: MessageListener[]

  constructor ({
    filterFn = (e: MessageEvent) => e.data?.source === 'aplazame',
    target = window.parent,
    eventData = { source: 'aplazame' }
  }: {
    filterFn?: ((e: MessageEvent) => boolean) | null
    target?: HTMLElement | Window
    eventData?: { [key: string]: unknown }
  } = {}) {
    this.requestListeners = {}
    this.anyRequestListeners = []
    this.eventListeners = {}
    this.anyMessageListeners = []

    this.filterFn = filterFn
    this.target = target
    this.eventData = eventData

    ;(this.target as Window).addEventListener('message', (e: MessageEvent) => {
      if (!filterFn?.(e)) return

      this.anyMessageListeners.forEach(listener => listener(e.data))

      if (e.data.event && this.eventListeners[e.data.event]) {
        this.eventListeners[e.data.event].forEach(listener => listener(e.data.payload))
      }

      if (e.data.request) {
        this.anyRequestListeners.forEach(listener => listener(e.data))
        if (this.requestListeners[e.data.request]) {
          this.requestListeners[e.data.request].forEach(listener => listener(e.data.payload))
        }
      }
    })
  }

  send (event: string, _payload: unknown = null) {
    const payload = _payload ? JSON.parse(JSON.stringify(_payload)) : null
    ;(this.target as Window).postMessage({ ...this.eventData, event, payload }, '*')
  }

  onRequest (request: string | RequestListener, listener: RequestListener) {
    if (typeof request === 'function') {
      this.anyRequestListeners.push(request)
      return this
    }

    if (this.requestListeners[request]) this.requestListeners[request] = []
    this.requestListeners[request].push(listener)
    return this
  }

  on (event: string | MessageListener, listener: MessageListener) {
    if (typeof event === 'function') {
      this.anyMessageListeners.push(event)
      return this
    }

    if (this.eventListeners[event]) this.eventListeners[event] = []
    this.eventListeners[event].push(listener)
    return this
  }
}
  