const LOG_LEVELS = { ERROR: 'ERROR', WARN: 'WARN', INFO: 'INFO', DEBUG: 'DEBUG' };
const COLORS = { ERROR: '#E63946', WARN: '#E9A23B', INFO: '#2A9D8F', DEBUG: '#B0ADA7' };

function logger(file, func, level, message, data = null) {
  const ts = new Date().toLocaleTimeString();
  const prefix = `[${ts}] [${level}] [${file} → ${func}]`;
  const style = `color: ${COLORS[level]}; font-weight: bold;`;
  
  if (level === LOG_LEVELS.ERROR) {
    console.groupCollapsed(`%c${prefix} ${message}`, style);
    if (data) { console.error('Data:', data); if (data.response) console.error('Status:', data.response.status, 'Body:', data.response.data); }
    console.trace('Stack Trace');
    console.groupEnd();
  } else {
    console.log(`%c${prefix} ${message}`, style, data || '');
  }
}

export const logError = (f, fn, m, d) => logger(f, fn, 'ERROR', m, d);
export const logInfo = (f, fn, m, d) => logger(f, fn, 'INFO', m, d);
export const logDebug = (f, fn, m, d) => logger(f, fn, 'DEBUG', m, d);