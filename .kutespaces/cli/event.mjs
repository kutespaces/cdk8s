import fs from 'fs';
import { parseArgs } from "node:util";
import { sendLog } from '../api/logs.js';

const {
  values: { name },
} = parseArgs({
  options: {
    name: {
      type: 'string',
      short: 'n',
    }
  },
});

const spaceID = fs.readFileSync('/.kutespaces/state/space_id', 'utf-8');
await sendLog(spaceID, process.env.HOSTNAME, 'info', 'Event', { eventName: name })
