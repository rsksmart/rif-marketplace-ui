import Logger from './Logger'

export enum UNIT_PREFIX_POW2 {
  KILO = 1024,
  MEGA = UNIT_PREFIX_POW2.KILO ** 2,
  GIGA = UNIT_PREFIX_POW2.KILO ** 3,
}

export const getTabValueFromLocation = (
  tabs: {
    label: string
    to: string
    value: string
  }[],
  defaultRoute: string,
) => (currentPath: string): string => {
  const activeTab = tabs.find((tab) => currentPath.includes(tab.to))
  return activeTab?.to || defaultRoute
}

export const logNotImplemented = (name: string) => (info?: unknown): void => {
  Logger.getInstance().warn(`We have yet to implement "${name}".`, info)
}
