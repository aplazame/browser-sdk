
import { EventEmitter, DetailsEvent } from './EventEmitter.js'

const copyObject = (obj: any) => JSON.parse(JSON.stringify(obj))

export class AplazameEvent extends DetailsEvent {}

export class AplazameIFrame extends EventEmitter {
  #allowFilter = (e: MessageEvent) => e.data?.source === 'aplazame'
  #sendData: { [key: string]: string } = { source: 'aplazame' }
  #requestTimeout = 60000

  url: URL
  mount_el?: HTMLElement
  iframe?: HTMLIFrameElement

  constructor ({
    url = null,
    searchParams = null,
    requestTimeout = null,
    allowFilter = null,
    sendData = null
  }: {
    url?: string | null,
    searchParams?: { [key: string]: string } | null,
    requestTimeout?: number | null,
    allowFilter?: ((e: { data?: { source?: string } }) => boolean) | null,
    sendData?: { [key: string]: string } | null
  } = {}) {
    super({ Event: AplazameEvent })

    if (!url) throw new Error('url is required')

    this.url = new URL(url)

    if (searchParams) {
      for (const key in searchParams) this.url.searchParams.append(key, searchParams[key])
    }

    if (allowFilter) this.#allowFilter = allowFilter
    if (sendData) this.#sendData = sendData
    if (requestTimeout) this.#requestTimeout = requestTimeout
  }

  #onMessage (e: MessageEvent) {
    if (!this.#allowFilter(e)) return

    if (e.data?.event) {
      const { event, payload = null } = e.data
      this.emit(event, payload)
    }
  }

  async request (request: string, _payload: any = null) {
    const payload = _payload ? copyObject(_payload) : _payload

    return new Promise((resolve: (value: unknown) => void) => {
      this.iframe?.contentWindow?.postMessage({ ...this.#sendData, request, payload }, '*')

      const onResponse = () => {
        this.off(request, onResponse)
        resolve(null)
      }

      setTimeout(onResponse, this.#requestTimeout)
      this.on(request, onResponse)
    })
  }

  async send (event: string, _payload: unknown = null) {
    const payload = _payload ? copyObject(_payload) : _payload
    this.iframe?.contentWindow?.postMessage({ ...this.#sendData, event, payload }, '*')
  }

  mount (el: HTMLElement) {
    this.mount_el = el

    this.iframe = document.createElement('iframe')

    this.iframe.src = this.url.toString()

    el.appendChild(this.iframe)

    // listening messages
    const _onMessage = this.#onMessage.bind(this)

    window.addEventListener('message', _onMessage)
    this.once('unmount', () => window.removeEventListener('message', _onMessage))

    return this
  }

  unmount () {
    this.emit('unmount')

    if (this.iframe && this.mount_el?.contains(this.iframe)) {
      this.mount_el.removeChild(this.iframe)
    }
  }
}
