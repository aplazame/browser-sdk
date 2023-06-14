
const isArray = Array.isArray

const promiseResolved = Promise.resolve()
export const nextTick = (fn?: () => void) => promiseResolved.then(fn)

function _removeItemFromList (list: Array<any>, item: any) {
  if (!list) return
  for (var i = list.length - 1; i >= 0; i--) {
    if (item === list[i]) list.splice(i, 1)
  }
}

export class DetailsEvent extends Event {
  details: any = null
  
  constructor (eventName: string, { details = null } = {}) {
    super(eventName)

    this.details = details
  }
}

export type Listener = (event: DetailsEvent) => void
export type ListenersList = Array<Listener>
export type ListenersMap = { [key: string]: ListenersList }

export class EventEmitter {
  listeners: ListenersMap = {}
  listenersOnce: ListenersMap = {}
  listenersAny: ListenersList = []

  Event: typeof DetailsEvent = DetailsEvent

  constructor ({ Event }: { Event?: typeof DetailsEvent } = {}) {
    if(Event) this.Event = Event
  }

  emit (event: string | string[], details?: any) {
    if (isArray(event)) {
      event.forEach(_event => this.emit(_event, details))
      return this
    }

    const onNextTick = (listener: Listener) => nextTick(() => listener(new this.Event(event, { details })))

    this.listenersAny.forEach(onNextTick)
    this.listeners[event]?.forEach(onNextTick)
    this.listenersOnce[event]?.splice(0).forEach(onNextTick)
  }

  emitSync (event: string | string[], details?: any) {
    if (isArray(event)) {
      event.forEach(_event => this.emit(_event, details))
      return this
    }

    const runListener = (listener: Listener) => listener(new this.Event(event, { details }))

    this.listenersAny.forEach(runListener)
    this.listeners[event]?.forEach(runListener)
    this.listenersOnce[event]?.splice(0).forEach(runListener)
  }

  on (event: string | string[], listener: Listener) {
    if (isArray(event)) {
      event.forEach(_event => this.on(_event, listener))
      return this
    }
    if (!this.listeners[event]) this.listeners[event] = []
    this.listeners[event].push(listener)
    return this
  }

  once (event: string | string[], listener: Listener) {
    if (isArray(event)) {
      event.forEach(_event => this.once(_event, listener))
      return this
    }
    if (!this.listenersOnce[event]) this.listenersOnce[event] = []
    this.listenersOnce[event].push(listener)
    return this
  }

  off (event: string | string[], listener: Listener) {
    if (isArray(event)) {
      event.forEach(_event => this.off(_event, listener))
      return this
    }
    _removeItemFromList(this.listeners[event], listener)
    _removeItemFromList(this.listenersOnce[event], listener)
    return this
  }

  onAny (listener: (event: DetailsEvent) => void) {
    this.listenersAny.push(listener)
    return this
  }

  offAny (listener: Listener) {
    _removeItemFromList(this.listenersAny, listener)
    return this
  }
}
