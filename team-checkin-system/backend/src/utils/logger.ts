type LogFields = Record<string, unknown>;

function format(fields?: LogFields): string {
  if (!fields) return "";
  try {
    return ` ${JSON.stringify(fields)}`;
  } catch {
    return "";
  }
}

export const logger = {
  info: (msg: string, fields?: LogFields) => console.log(`[INFO] ${msg}${format(fields)}`),
  error: (msg: string, fields?: LogFields) => console.error(`[ERROR] ${msg}${format(fields)}`),
};

