import { debounceTime, distinctUntilChanged, fromEvent, map, Observable, shareReplay, startWith, switchMap, tap } from "rxjs"
import { ajax, AjaxResponse } from "rxjs/ajax"

interface Character {
  name: string
}

const inputRef: HTMLInputElement = document.querySelector("#input")
const resultRef: HTMLDivElement = document.querySelector("#result")

const characters: Observable<string[]> = ajax.get("https://rickandmortyapi.com/api/character").pipe(
  map((response: AjaxResponse<unknown>) => (response.response as any).results),
  map((results: Character[]) => results.map(c => c.name)),
  shareReplay({ refCount: true, bufferSize: 1 })
)

calculateCharacters().subscribe((characterNames: string[]) => {
  resultRef.innerHTML = characterNames.join(", ")
})

calculateCharacters().subscribe(console.log)

function calculateCharacters(): Observable<string[]> {
  return fromEvent<InputEvent>(inputRef, "input").pipe(
    debounceTime(300),
    map((event: InputEvent) => (event.target as HTMLInputElement).value),
    distinctUntilChanged(),
    startWith(inputRef.value),
    switchMap((inputValue: string) => {
      return characters.pipe(
        map((characters: string[]) => {
          return characters.filter((name) => {
            const preparedName = inputValue
              .replaceAll(" ", "")
              .toLowerCase()

            return name
              .replaceAll(" ", "")
              .toLowerCase()
              .includes(preparedName)
          })
        })
      )
    })
  )
}
