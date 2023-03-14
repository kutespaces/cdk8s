import winston, { format } from 'winston';
import Transport = require('winston-transport');
import { getSpaceID } from './api/defaults';
import { sendLog } from './api/logs';

class APITransport extends Transport {
  constructor(opts: any) {
    super(opts);
  }

  log(info: any, callback: () => void) {
    setImmediate(() => {
      this.emit('logged', info);
    });

    if(!('metadata' in info)) {
      throw new Error('cannot log, expected metadata key to exist in info');
    }
    const { level, message } = info;
    const { spaceID } = info.metadata;
    const hostname = process.env.HOSTNAME || '';
    const meta: any = {};
    for(const key of Object.keys(info.metadata)) {
      if(key !== 'spaceID') {
        meta[key] = info.metadata[key];
      }
    }
    if(Object.keys(meta).length === 0) {
      sendLog(spaceID, hostname, level, message);
    } else {
      sendLog(spaceID, hostname, level, message, meta);
    }

    callback();
  }
};

const transports: Transport[] = [
  new winston.transports.File({
    filename: process.env.KUTESPACES_LOG_FILE || '/.kutespaces/state/extension.log', level: 'debug'
  }),
  new winston.transports.Console({
    format: winston.format.simple(),
  })
];

const spaceID = getSpaceID();
if(spaceID) {
  transports.push(new APITransport({}));
}

export const logger = winston.createLogger({
  level: 'debug',
  format: format.combine(
    format.errors({ stack: true }),
    format.metadata(),
    format.json(),
  ),
  defaultMeta: { spaceID },
  transports,
});

export type Logger = typeof logger;
