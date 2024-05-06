
import { EventEmitter, DetailsEvent } from './EventEmitter.js'

const copyObject = (obj: any) => JSON.parse(JSON.stringify(obj))

export class AplazameEvent extends DetailsEvent {}

const iframeStylesPresets: {
  [key: string]: { [key: string]: string }
} = {
  fullscreen: {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    border: 'none',
    zIndex: '9999'
  },
  fill_absolute: {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    border: 'none',
  },
}

export class AplazameIFrame extends EventEmitter {
  allowFilter = (e: MessageEvent) => e.data?.source === 'aplazame'
  sendData: { [key: string]: string } = { source: 'aplazame' }
  requestTimeout = 60000

  url: URL
  mount_el?: HTMLElement
  iframe?: HTMLIFrameElement

  currentStyles: { [key: string]: string } = {}

  constructor ({
    url = null,
    searchParams = null,
    requestTimeout = null,
    allowFilter = null,
    sendData = null
  }: {
    url?: string | null,
    searchParams?: { [key: string]: unknown } | null,
    requestTimeout?: number | null,
    allowFilter?: ((e: { data?: any }) => boolean) | null,
    sendData?: { [key: string]: string } | null
  } = {}) {
    super({ Event: AplazameEvent })

    if (!url) throw new Error('url is required')

    this.url = new URL(url)

    if (searchParams) {
      for (const key in searchParams) this.url.searchParams.append(key, searchParams[key] as string)
    }

    if (allowFilter) this.allowFilter = allowFilter
    if (sendData) this.sendData = sendData
    if (requestTimeout) this.requestTimeout = requestTimeout
  }

  onMessage (e: MessageEvent) {
    if (!this.allowFilter(e)) return

    if (e.data?.event) {
      const { event, payload = null } = e.data
      this.emit(event, payload)
    }
  }

  async request (request: string, _payload: any = null) {
    const payload = _payload ? copyObject(_payload) : _payload

    return new Promise((resolve: (value: unknown) => void) => {
      this.iframe?.contentWindow?.postMessage({ ...this.sendData, request, payload }, '*')

      const onResponse = () => {
        this.off(request, onResponse)
        resolve(null)
      }

      setTimeout(onResponse, this.requestTimeout)
      this.on(request, onResponse)
    })
  }

  async send (event: string, _payload: unknown = null) {
    const payload = _payload ? copyObject(_payload) : _payload
    this.iframe?.contentWindow?.postMessage({ ...this.sendData, event, payload }, '*')
  }

  mount (el: HTMLElement) {
    this.mount_el = el

    this.iframe = document.createElement('iframe')
    this.iframe.src = this.url.toString()

    Object.assign(this.iframe.style, this.currentStyles)

    el.appendChild(this.iframe)

    // listening messages
    const _onMessage = this.onMessage.bind(this)

    window.addEventListener('message', _onMessage)
    this.once('unmount', () => window.removeEventListener('message', _onMessage))

    return this
  }

  setStyles (styles: string | { [key: string]: string }) {
    const newSytles = typeof styles === 'string'
      ? (iframeStylesPresets[styles] ?? {})
      : styles

    this.currentStyles = { ...this.currentStyles, ...newSytles }

    if (this.iframe) {
      Object.assign(this.iframe.style, this.currentStyles)
    }
    return this
  }

  resetStyles () {
    this.currentStyles = {}

    const style = this.iframe?.style

    if (style?.length) {
      Array.from(style).forEach(key => style.removeProperty(key))
    }
    
    return this
  }

  unmount () {
    this.emit('unmount')

    if (this.iframe && this.mount_el?.contains(this.iframe)) {
      this.mount_el.removeChild(this.iframe)
    }
  }
}
