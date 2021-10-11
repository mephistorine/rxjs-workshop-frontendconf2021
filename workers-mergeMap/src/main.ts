import { finalize, fromEvent, mergeMap, take, timer } from "rxjs"
import TestWorker from './worker?worker'

timer(0, 10).pipe(
  mergeMap((index: number) => {
    const worker = new TestWorker()
    worker.postMessage(`Index: ${ index }`)
    return fromEvent<MessageEvent<void>>(worker, "message").pipe(
      take(1),
      finalize(() => worker.terminate())
    )
  }, navigator.hardwareConcurrency)
).subscribe()
