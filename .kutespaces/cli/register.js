const https = require('https');
const fs = require('fs');

let data = JSON.stringify({
  "register": {
    "spaceTemplate": "cdk8s",
    "gitHubUser": process.env.GITHUB_USER,
    "gitHubRepository": process.env.GITHUB_REPOSITORY,
    "cloudenvEnvironmentID": process.env.CLOUDENV_ENVIRONMENT_ID,
    "hostname": process.env.HOSTNAME,
  }
});

let req = https.request({
  hostname: 'zpbxhycsswtebxrqyhzd.functions.supabase.co',
  port: 443,
  path: '/registration',
  method: 'POST',
  headers: {
    'Content-Length': data.length,
    'Content-Type': 'application/json',
    // Supabase Anon token - ok to be committed
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpwYnhoeWNzc3d0ZWJ4cnF5aHpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzUzOTgyODMsImV4cCI6MTk5MDk3NDI4M30.wCj7GeOBN7Veo2EsX-zTtgcfpXgL7NvCMDwDHLg2zNg'
  }
}, (resp) => {
  if(resp.statusCode != 200) {
    throw new Error(`Expected status 200, got ${resp.statusCode}`);
  }
  let data = '';
  resp.on('data', (chunk) => { data += chunk; });

  resp.on('end', () => {
    const { registration } = JSON.parse(data);
    if(typeof registration !== 'object') {
      throw new Error(`Expected object in response, got ${typeof registration}`);
    }
    const { spaceID } = registration;
    if(typeof spaceID !== 'string') {
      throw new Error(`Expected spaceID in registration, got ${JSON.stringify(registration)}`);
    }
    fs.writeFileSync('/.kutespaces/state/space_id', spaceID);
  });
});

req.on('error', err => {
  throw new Error(`Error making registration request: ${err}`)
});

req.write(data);
