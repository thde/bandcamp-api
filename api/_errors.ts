export class ParameterError extends Error {
  constructor(m: string) {
    super(m)

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, ParameterError.prototype)
  }
}
