import moment from 'moment'

// anything you'd expect to be passed to a console.log()
type Logs = any[]

type LogFn = (...l: Logs) => void

enum LOG_TYPE {
  TRACE = 'trace',
  INFO = 'info',
  ERROR = 'error',
}

type Logger = {
  [LOG_TYPE.TRACE]: LogFn
  [LOG_TYPE.INFO]: LogFn
  [LOG_TYPE.ERROR]: LogFn
}

// custom log categories
export enum FLAVORS {
  SPOTIFY = 1,
  AUTH,
  DEFAULT,
}

const styles: { [key in FLAVORS]: any } = {
  [FLAVORS.SPOTIFY]: {
    trace: 'color: #3ace3a', // spotify green
    info: 'background: #3ace3a; color: #ffffff',
  },
  [FLAVORS.AUTH]: {
    trace: 'color: #EF746E', // dark peach
    info: 'background: #EF746E; color: #ffffff',
  },
  [FLAVORS.DEFAULT]: {
    trace: 'color: #24bbeb', // seaside blue
    info: 'background: #24bbeb; color: #ffffff', // blue
    error: 'background: #e2312b; color: #ffffff', // red bg, white text
  },
}

const _log = (logType: LOG_TYPE) => (...logs) => {
  // if the first argument is a style category, apply it!
  const arg0 = logs[0]
  const isFlavor = arg0 in FLAVORS
  const defaultStyles = styles[FLAVORS.DEFAULT]
  const style = isFlavor
    ? styles[arg0][logType] ?? defaultStyles[logType]
    : defaultStyles[logType]
  const _logs = isFlavor ? logs.slice(1) : logs
  _logWithStyle(style, ..._logs)
}

const logger: Logger = {
  trace: _log(LOG_TYPE.TRACE),
  info: _log(LOG_TYPE.INFO),
  error: _log(LOG_TYPE.ERROR),
}

const _logWithStyle = (style: string, ...logs: Logs) => {
  const ts = moment().format('hh:mm:ss')
  logs.forEach((msg, i) => {
    const indent = i === 0 ? '' : ' '
    const output =
      typeof msg === 'object'
        ? [`%c[${ts}]`, style, indent, msg]
        : [`%c[${ts}] ${indent}${msg}`, style]
    console.log(...output)
  })
}

export default logger
