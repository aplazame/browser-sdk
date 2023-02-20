

const isArray = Array.isArray

// const promiseResolved = Promise.resolve()
const nextTick = async (fn: Function) => fn()

function _removeItemFromList (list: Array<Function>, item: any) {
  if (!list) return
  for (var i = list.length - 1; i >= 0; i--) {
    if (item === list[i]) list.splice(i, 1)
  }
}

export class DetailsEvent extends Event {
  details = null
  
  constructor (eventName: string, { details = null } = {}) {
    super(eventName)

    this.details = details
  }
}

function enableMultiEvents (_target: object, _methodName: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value

    descriptor.value = function (event: string | Array<string>, ...args: any[]) {
        if (isArray(event)) {
            event.forEach((_event: string) => originalMethod.apply(this, [_event].concat(args)))
            return
        }

        return originalMethod.apply(this, [event].concat(args))
    }

    return descriptor
}

export class EventEmitter {
  #listeners = {}
  #listenersOnce = {}
  #listenersAny = []

  #Event = DetailsEvent

  constructor ({ Event = null } = {}) {
    if (Event) this.#Event = Event
  }

  @enableMultiEvents
  emit (event: string, details: any) {
    this.#listenersAny.forEach(listener => nextTick(listener.bind(null, new this.#Event(event, { details }))))
    this.#listeners[event]?.forEach(listener => nextTick(listener.bind(null, new this.#Event(event, { details }))))
    this.#listenersOnce[event]?.splice(0).forEach(listener => nextTick(listener.bind(null, new this.#Event(event, { details }))))
  }

  @enableMultiEvents
  emitSync (event: string, details: any) {
    this.#listenersAny.forEach(listener => listener(new this.#Event(event, { details })))
    this.#listeners[event]?.forEach(listener => listener(new this.#Event(event, { details })))
    this.#listenersOnce[event]?.splice(0).forEach(listener => listener(new this.#Event(event, { details })))
  }

  @enableMultiEvents
  on (event: string, listener: Function) {
    if (!this.#listeners[event]) this.#listeners[event] = []
    this.#listeners[event].push(listener)
    return this
  }

  @enableMultiEvents
  once (event: string, listener: Function) {
    if (!this.#listenersOnce[event]) this.#listenersOnce[event] = []
    this.#listenersOnce[event].push(listener)
    return this
  }

  @enableMultiEvents
  off (event: string, listener: Function) {
    _removeItemFromList(this.#listeners[event], listener)
    _removeItemFromList(this.#listenersOnce[event], listener)
    return this
  }

  onAny (listener: Function) {
    this.#listenersAny.push(listener)
    return this
  }

  offAny (listener: Function) {
    _removeItemFromList(this.#listenersAny, listener)
    return this
  }
}
