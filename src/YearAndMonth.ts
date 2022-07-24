import { type NumUnionBool } from './interfaces/CliOptions.js'

export class YearAndMonth {
  readonly #year: NumUnionBool
  readonly #month: NumUnionBool
  constructor (year: NumUnionBool, month: NumUnionBool) {
    this.#year = year
    this.#month = month
  }

  #isInvalidYear () {
    return this.#year > 3000
  }

  #isBoolean (yearOrMonth: NumUnionBool): yearOrMonth is boolean {
    return typeof yearOrMonth === 'boolean'
  }

  get year () {
    if (this.#isBoolean(this.#year)) return new Date().getFullYear()

    try {
      if (this.#isInvalidYear()) {
        throw new Error(`${this.#year}は不正な値です。3000以内で指定してください。`)
      }
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message)
        process.exit()
      }
    }
    return this.#year
  }

  #isInvalidMonth () {
    return this.#month > 12
  }

  get month () {
    if (this.#isBoolean(this.#month)) return (new Date().getMonth() + 1)

    try {
      if (this.#isInvalidMonth()) {
        throw new Error(`${this.#month}は不正です。1〜12の範囲で指定してください。`)
      }
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message)
        process.exit()
      }
    }
    return this.#month
  }

  get property () {
    return {
      year: this.year,
      month: this.month
    }
  }
}
