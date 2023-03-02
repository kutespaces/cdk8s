import https from 'https';
import { requestDefaults, headerDefaults } from './defaults.js';

export const sendLog = function(spaceID, hostname, level, message, jsonMessage) {
  return new Promise((resolve, reject) => {
    let data = JSON.stringify({
      log: {
        spaceID,
        hostname,
        level,
        message,
        jsonMessage
      }
    });

    let req = https.request({
      ...requestDefaults,
      method: 'POST',
      path: '/logs',
      headers: {
        ...headerDefaults,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'Content-Type': 'application/json',
      },
    }, (resp) => {
      if(resp.statusCode !== 204) {
        reject(`Expected status 204, got ${resp.statusCode}`);
      }
      resp.on('data', () => {});
      resp.on('error', reject);
      resp.on('end', resolve);
    });

    req.on('error', reject);

    req.write(data);
    req.end();
  });
};
