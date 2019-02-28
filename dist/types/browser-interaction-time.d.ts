interface BaseTimeEllapsedCallbackData {
    callback: (timeInMs: number) => void;
    timeInMilliseconds: number;
}
declare type BasicCallback = (timeInMs: number) => void;
export interface TimeIntervalEllapsedCallbackData extends BaseTimeEllapsedCallbackData {
    multiplier: (time: number) => number;
}
export interface AbsoluteTimeEllapsedCallbackData extends BaseTimeEllapsedCallbackData {
    pending: boolean;
}
interface Settings {
    timeIntervalEllapsedCallbacks?: TimeIntervalEllapsedCallbackData[];
    absoluteTimeEllapsedCallbacks?: AbsoluteTimeEllapsedCallbackData[];
    browserTabInactiveCallbacks?: BasicCallback[];
    browserTabActiveCallbacks?: BasicCallback[];
    idleTimeoutMs?: number;
    checkCallbacksIntervalMs?: number;
}
interface Mark {
    time: number;
}
interface Measure {
    name: string;
    startTime: number;
    duration: number;
}
export default class BrowserInteractionTime {
    private running;
    private times;
    private idle;
    private checkCallbackIntervalId?;
    private currentIdleTimeMs;
    private idleTimeoutMs;
    private checkCallbacksIntervalMs;
    private browserTabActiveCallbacks;
    private browserTabInactiveCallbacks;
    private timeIntervalEllapsedCallbacks;
    private absoluteTimeEllapsedCallbacks;
    private marks;
    private measures;
    constructor({ timeIntervalEllapsedCallbacks, absoluteTimeEllapsedCallbacks, checkCallbacksIntervalMs, browserTabInactiveCallbacks, browserTabActiveCallbacks, idleTimeoutMs }: Settings);
    private onBrowserTabInactive;
    private onBrowserTabActive;
    private onTimePassed;
    private resetIdleTime;
    private registerEventListeners;
    private unregisterEventListeners;
    private checkCallbacksOnInterval;
    startTimer: () => void;
    stopTimer: () => void;
    addTimeIntervalEllapsedCallback: (timeIntervalEllapsedCallback: TimeIntervalEllapsedCallbackData) => void;
    addAbsoluteTimeEllapsedCallback: (absoluteTimeEllapsedCallback: AbsoluteTimeEllapsedCallbackData) => void;
    addBrowserTabInactiveCallback: (browserTabInactiveCallback: BasicCallback) => void;
    addBrowserTabActiveCallback: (browserTabActiveCallback: BasicCallback) => void;
    getTimeInMilliseconds: () => number;
    isRunning: () => boolean;
    reset: () => void;
    destroy: () => void;
    mark(key: string): void;
    getMarks(name: string): Mark[] | undefined;
    measure(name: string, startMarkName: string, endMarkName: string): void;
    getMeasures(name: string): Measure[] | undefined;
}
export {};
