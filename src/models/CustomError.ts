class CustomError extends Error {
  constructor(customMessage?: string) {
    super(customMessage)
    this._customMessage = customMessage
  }

  private _customMessage?: string

  public get customMessage(): string | undefined {
    return this._customMessage
  }
}

export default CustomError
