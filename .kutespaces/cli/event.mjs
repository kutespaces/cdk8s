import fs from 'fs';
import { parseArgs } from "node:util";
import { sendLog } from '../api/logs.js';

function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}

process.on('uncaughtException', function(err) {
  console.error(`Unhandled exception: ${err}`);
  process.exit(0);
});

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

const idPath = '/.kutespaces/state/space_id'
if(!fs.existsSync(idPath)) {
  console.error(`${idPath} doesn't exist, cannot send event`);
  process.exit(0);
}
const spaceID = fs.readFileSync(idPath, 'utf-8');

let tries = 0;
const maxTries = 5;
while(tries < maxTries) {
  try {
    await sendLog(spaceID, process.env.HOSTNAME, 'info', `${name} Event`, { eventName: name })
    break;
  } catch(err) {
    console.error(`Error sending event: ${err}`);
    await delay(1000);
  }
  tries++;
}
