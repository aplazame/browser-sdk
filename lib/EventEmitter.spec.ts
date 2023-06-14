
import { EventEmitter, nextTick } from './EventEmitter'

test('EventEmitter', () => {
    expect(EventEmitter).toBeDefined()
})

test('EventEmitter', () => {
    const ee = new EventEmitter()
    expect(ee).toBeInstanceOf(EventEmitter)
})

test('EventEmitter', () => {
    const ee = new EventEmitter()
    
    expect(ee.on).toBeInstanceOf(Function)
    expect(ee.once).toBeInstanceOf(Function)
    expect(ee.off).toBeInstanceOf(Function)
    expect(ee.onAny).toBeInstanceOf(Function)
    expect(ee.emit).toBeInstanceOf(Function)
    expect(ee.emitSync).toBeInstanceOf(Function)  
})

test('EventEmitter', async () => {
    const ee = new EventEmitter()
    const listener = jest.fn()
    ee.on('test', listener)
    ee.emit('test')

    await nextTick()
    
    expect(listener).toHaveBeenCalledTimes(1)
})

test('EventEmitter', async () => {
    const ee = new EventEmitter()
    const listener = jest.fn()

    ee.on('test', listener)
    ee.emit('test')

    await nextTick()
    
    expect(listener).toHaveBeenCalledTimes(1)

    ee.off('test', listener)
    ee.emit('test')

    await nextTick()

    expect(listener).toHaveBeenCalledTimes(1)
})

test('EventEmitter', async () => {
    const ee = new EventEmitter()
    const listener = jest.fn()

    ee.onAny(listener)

    ee.emit('test')
    // ee.emit('test2')

    await nextTick()

    expect(listener).toHaveBeenCalledTimes(1)
    expect(listener).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
            type: 'test',
        }),
    )
})

test('EventEmitter', async () => {
    const ee = new EventEmitter()
    const listener = jest.fn()

    ee.onAny(listener)

    ee.emitSync('test')
    // ee.emit('test2')

    // await nextTick()

    expect(listener).toHaveBeenCalledTimes(1)
    expect(listener).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
            type: 'test',
        }),
    )
})
