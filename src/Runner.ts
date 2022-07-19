export class Runner {
  readonly #distance: number
  constructor (distance: number) {
    this.#distance = distance
  }

  get targetDistance () {
    return this.#distance
  }
}
