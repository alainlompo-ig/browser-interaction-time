import BrowserInteractionTime, {
  TimeIntervalEllapsedCallbackData,
  AbsoluteTimeEllapsedCallbackData
} from '../../src/browser-interaction-time'
import 'jest-extended'
const exec = (testTimerFn: Function) => {
  setInterval(testTimerFn, 1000)
}

/**
 * BrowserInteractionTime test
 */
describe('BrowserInteractionTime', () => {
  describe('is instantiable', () => {
    let defaultBrowserInteractionTime: BrowserInteractionTime
    beforeEach(() => {
      defaultBrowserInteractionTime = new BrowserInteractionTime({})
    })

    it('creates an instance', () => {
      expect(defaultBrowserInteractionTime).toBeInstanceOf(
        BrowserInteractionTime
      )
    })

    it('starts a timer', () => {
      expect(defaultBrowserInteractionTime.isRunning).toBeTruthy()
    })
  })

  describe('API', () => {
    let defaultBrowserInteractionTime: BrowserInteractionTime
    let intervalCallback: TimeIntervalEllapsedCallbackData

    beforeEach(() => {
      intervalCallback = {
        timeInMilliseconds: 2000,
        callback: jest.fn(),
        multiplier: x => x * 2
      }

      defaultBrowserInteractionTime = new BrowserInteractionTime({
        timeIntervalEllapsedCallbacks: [intervalCallback]
      })
    })

    it('.start() and .stop() returns time in milliseconds', () => {
      defaultBrowserInteractionTime.startTimer()
      defaultBrowserInteractionTime.stopTimer()
      expect(
        defaultBrowserInteractionTime.getTimeInMilliseconds()
      ).toBeDefined()

      expect(defaultBrowserInteractionTime.isRunning()).toBe(false)
    })

    it('.start() and .stop() multiple times returns time in milliseconds', () => {
      defaultBrowserInteractionTime.startTimer()
      defaultBrowserInteractionTime.stopTimer()
      defaultBrowserInteractionTime.startTimer()
      defaultBrowserInteractionTime.stopTimer()
      expect(
        defaultBrowserInteractionTime.getTimeInMilliseconds()
      ).toBeDefined()

      expect(defaultBrowserInteractionTime.isRunning()).toBe(false)
    })

    it('.reset() returns 0 as timeInMilliseconds', () => {
      defaultBrowserInteractionTime.reset()
      expect(defaultBrowserInteractionTime.getTimeInMilliseconds()).toEqual(0)
    })
  })

  describe('absolute time callbacks are called when time is reached', () => {
    let defaultBrowserInteractionTime: BrowserInteractionTime
    let absoluteTimeEllapsedCallbacks: AbsoluteTimeEllapsedCallbackData[]

    beforeEach(() => {
      jest.useFakeTimers()

      absoluteTimeEllapsedCallbacks = [
        {
          timeInMilliseconds: 2000,
          callback: jest.fn(),
          pending: false
        },
        {
          timeInMilliseconds: 6000,
          callback: jest.fn(),
          pending: false
        }
      ]

      defaultBrowserInteractionTime = new BrowserInteractionTime({
        absoluteTimeEllapsedCallbacks: absoluteTimeEllapsedCallbacks
      })
    })

    afterEach(() => {
      jest.clearAllTimers()
    })

    it('no callback is called', () => {
      expect(defaultBrowserInteractionTime.isRunning()).toBe(true)
      absoluteTimeEllapsedCallbacks.forEach(callbackObject => {
        expect(callbackObject.callback).not.toBeCalled()
      })
    })

    it('fake timers work as expected', () => {
      const testfn = jest.fn()
      exec(testfn)
      jest.advanceTimersByTime(10100)
      expect(testfn).toBeCalled()
      expect(testfn).toHaveBeenCalledTimes(10)
    })

    it('absoluteTimeEllapsedCallbacks are called on time', () => {
      expect(defaultBrowserInteractionTime.isRunning()).toBe(true)
      expect(absoluteTimeEllapsedCallbacks[0].callback).toBeFunction()
      expect(absoluteTimeEllapsedCallbacks[0].callback).not.toBeCalled()
      expect(absoluteTimeEllapsedCallbacks[1].callback).not.toBeCalled()

      jest.advanceTimersByTime(3000)
      expect(defaultBrowserInteractionTime.getTimeInMilliseconds()).toEqual(
        3000
      )
      expect(absoluteTimeEllapsedCallbacks[0].callback).toBeCalled()
      expect(absoluteTimeEllapsedCallbacks[1].callback).not.toBeCalled()

      jest.advanceTimersByTime(4000)
      expect(defaultBrowserInteractionTime.getTimeInMilliseconds()).toEqual(
        7000
      )
      expect(absoluteTimeEllapsedCallbacks[1].callback).toBeCalled()
    })

    it('.start() and .stop() multiple times returns time in milliseconds', () => {
      defaultBrowserInteractionTime.startTimer()
      defaultBrowserInteractionTime.stopTimer()
      defaultBrowserInteractionTime.startTimer()
      defaultBrowserInteractionTime.stopTimer()
      jest.advanceTimersByTime(5100)

      expect(
        defaultBrowserInteractionTime.getTimeInMilliseconds()
      ).toBeDefined()
      expect(defaultBrowserInteractionTime.getTimeInMilliseconds()).toEqual(
        10200
      )

      expect(defaultBrowserInteractionTime.isRunning()).toBe(false)
    })

    it('.reset() returns 0 as timeInMilliseconds', () => {
      jest.advanceTimersByTime(4000)
      expect(defaultBrowserInteractionTime.getTimeInMilliseconds()).toEqual(
        4000
      )
      defaultBrowserInteractionTime.reset()
      expect(defaultBrowserInteractionTime.getTimeInMilliseconds()).toEqual(0)
    })
  })
})
