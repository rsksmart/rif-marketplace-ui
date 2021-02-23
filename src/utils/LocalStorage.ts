import Logger from './Logger'

const logger = Logger.getInstance()

export default class LocalStorage {
  public static getInstance (): LocalStorage {
    if (!LocalStorage.instance) {
      LocalStorage.instance = new LocalStorage()
    }

    return LocalStorage.instance
  }

  private static instance: LocalStorage

  private readonly storage: Storage

  private constructor () {
    this.storage = localStorage
  }

  public setItem (key: string, item: string | object): void {
    try {
      const value = typeof item === 'object' ? JSON.stringify(item) : item
      this.storage.setItem(key, value)
    } catch (e) {
      logger.error(`Persistence Error: ${e.message}`)
    }
  }

  public getItem (key: string): unknown | string {
    const value = this.storage.getItem(key) ?? ''
    let item: unknown
    try {
      item = JSON.parse(value)
    } catch { }
    return item || value
  }

  public clear (): void {
    this.storage.clear()
  }
}
