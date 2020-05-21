export interface ILogger {
  debug(message: string, ...rest: any): void;
  error(message: string, ...rest: any): void;
  info(message: string, ...rest: any): void;
  warn(message: string, ...rest: any): void;
}

enum LOG_LEVELS {
  DEBUG = 'debug',
  ERROR = 'error',
  INFO = 'info',
  WARN = 'warn',
}

enum VERBOSITY_LEVELS {
  'error' = 0,
  'warn' = 1,
  'info' = 2,
  'debug' = 3,
}

const DEFAULT_LOG_LEVEL = LOG_LEVELS.ERROR;

const envLogLevel: string | undefined =
  process.env.REACT_APP_LOG_LEVEL &&
  process.env.REACT_APP_LOG_LEVEL.toUpperCase();

class Logger implements ILogger {

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }

    return Logger.instance;
  }
  private static instance: Logger;
  private logLevel: LOG_LEVELS;

  private constructor() {
    this.logLevel = LOG_LEVELS[envLogLevel || DEFAULT_LOG_LEVEL];
  }

  public debug = (message: any, ...rest: any): void => {
    if (this.isLogLevelEnabled(LOG_LEVELS.DEBUG)) {
      this.log(LOG_LEVELS.DEBUG, message, ...rest);
    }
  };
  public error = (message: string, ...rest: any): void => {
    if (this.isLogLevelEnabled(LOG_LEVELS.ERROR)) {
      this.log(LOG_LEVELS.ERROR, message, ...rest);
    }
  };
  public info = (message: string, ...rest: any): void => {
    if (this.isLogLevelEnabled(LOG_LEVELS.INFO)) {
      this.log(LOG_LEVELS.INFO, message, ...rest);
    }
  };
  public warn = (message: string, ...rest: any): void => {
    if (this.isLogLevelEnabled(LOG_LEVELS.WARN)) {
      this.log(LOG_LEVELS.WARN, message, ...rest);
    }
  };

  private now = (): Date => new Date(Date.now());

  private getReadableTime = (now: Date): string =>
    `${now.getHours()}:${now.getMinutes()}.${now.getSeconds()}`;

  private getReadableNow = (): string => this.getReadableTime(this.now());

  private log = (msgType: LOG_LEVELS, msg: string, ...rest: any): void => {
    const logger = console[msgType];
    const time = this.getReadableNow();
    const message = `${time} ${msg}`;
    logger(message, ...rest);
  };

  private isLogLevelEnabled = (logLevel: LOG_LEVELS): boolean =>
    VERBOSITY_LEVELS[this.logLevel] >= VERBOSITY_LEVELS[logLevel];
}

export default Logger;
