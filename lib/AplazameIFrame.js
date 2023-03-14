
import { EventEmitter, DetailsEvent } from './EventEmitter.js'

const copyObject = obj => JSON.parse(JSON.stringify(obj))

export class AplazameEvent extends DetailsEvent {}

export class AplazameIFrame extends EventEmitter {
  #allowFilter = e => e.data?.source === 'aplazame'
  #sendData = { source: 'aplazame' }
  #requestTimeout = 60000

  constructor ({ url = null, searchParams = null, requestTimeout = null, allowFilter = null, messageData = null } = {}) {
    super({ Event: AplazameEvent })

    this.url = new URL(url)

    if (searchParams) {
      for (const key in searchParams) this.url.searchParams.append(key, searchParams[key])
    }

    if (allowFilter) this.#allowFilter = allowFilter
    if (messageData) this.#messageData = messageData
    if (requestTimeout) this.#requestTimeout = requestTimeout
  }

  #onMessage (e) {
    if (!this.#allowFilter(e)) return

    if (e.data?.event) {
      const { event, payload = null } = e.data
      this.emit(event, payload)
    }
  }

  async request (request, _payload) {
    const payload = _payload ? copyObject(_payload) : _payload
    return new Promise(resolve => {
      this.iframe.contentWindow.postMessage({ ...this.#sendData, request, payload }, '*')
      const onResponse = () => {
        this.off(request, onResponse)
        resolve()
      }

      setTimeout(onResponse, this.#requestTimeout)
      this.on(request, onResponse)
    })
  }

  async send (event, _payload) {
    const payload = _payload ? copyObject(_payload) : _payload
    this.iframe.contentWindow.postMessage({ ...this.#sendData, event, payload }, '*')
  }

  mount (el) {
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

    if (this.mount_el.contains(this.iframe)) {
      this.mount_el.removeChild(this.iframe)
    }
  }
}
