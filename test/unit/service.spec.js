import Service from '../../src/index'

describe('Service', function () {
  let myService
  beforeEach(function () {
    const MyService = Service.extend({
      setup: jest.fn(),
      start: jest.fn(),
      onError: jest.fn(),

      requests: {
        foo: 'foo',
        bar: 'bar2'
      },

      foo: jest.fn(),
      bar2: jest.fn()
    })

    myService = new MyService()
  })

  it('should bind requests where the key and value match', function () {
    return myService.request('foo').then(() => {
      expect(myService.foo).toHaveBeenCalledTimes(1)
    })
  })

  it('should bind requests where the key and value don\'t match', function () {
    return myService.request('bar').then(() => {
      expect(myService.bar2).toHaveBeenCalledTimes(1)
    })
  })

  it('should call start() before calling the function', function () {
    // toHaveBeenCalledBefore is not accurate. https://github.com/jest-community/jest-extended#tohavebeencalledbefore
    // waiting for Jest 23: https://github.com/facebook/jest/pull/5867
    let callTick = 0
    let startCallTick, fooCallTick
    myService.start.mockImplementation(() => {
      startCallTick = callTick
      callTick++
    })

    myService.foo.mockImplementation(() => {
      fooCallTick = callTick
      callTick++
    })
    return myService.request('foo').then(() => {
      // expect(myService.start).toHaveBeenCalledBefore(myService.foo)
      expect(startCallTick).toBeLessThan(fooCallTick)
    })
  })

  it('should only call start() once', function () {
    return Promise.all([
      myService.request('foo'),
      myService.request('bar')
    ]).then(() => {
      expect(myService.start).toHaveBeenCalledTimes(1)
    })
  })

  it('should call onError when a request errors', function () {
    this.err = new Error('Err!')
    myService.foo.mockRejectedValue(this.err)

    return myService.request('foo').then(() => {
      expect(myService.foo).toThrow(this.err)
    }, (err) => {
      expect(err).toBe(this.err)
      expect(myService.onError).toHaveBeenCalledWith(this.err)
    })
  })
})
