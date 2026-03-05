export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

const currentLogLevel =
  (process.env.LOG_LEVEL?.toUpperCase() as keyof typeof LogLevel) || "INFO";
const targetLevel = LogLevel[currentLogLevel] ?? LogLevel.INFO;

export class Logger {
  static debug(message: string, ...optionalParams: any[]) {
    if (targetLevel <= LogLevel.DEBUG) {
      console.debug(`[DEBUG] ${message}`, ...optionalParams);
    }
  }

  static info(message: string, ...optionalParams: any[]) {
    if (targetLevel <= LogLevel.INFO) {
      console.log(`[INFO] ${message}`, ...optionalParams);
    }
  }

  static warn(message: string, ...optionalParams: any[]) {
    if (targetLevel <= LogLevel.WARN) {
      console.warn(`[WARN] ${message}`, ...optionalParams);
    }
  }

  static error(message: string, ...optionalParams: any[]) {
    if (targetLevel <= LogLevel.ERROR) {
      console.error(`[ERROR] ${message}`, ...optionalParams);
    }
  }
}
