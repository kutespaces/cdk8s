import fs from 'fs';

export const headerDefaults = {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpwYnhoeWNzc3d0ZWJ4cnF5aHpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzUzOTgyODMsImV4cCI6MTk5MDk3NDI4M30.wCj7GeOBN7Veo2EsX-zTtgcfpXgL7NvCMDwDHLg2zNg',
};

export const requestDefaults = {
  hostname: 'zpbxhycsswtebxrqyhzd.functions.supabase.co',
  port: 443,
  headers: headerDefaults,
};

export const getSpaceID = function(): string | undefined {
  if(process.env.KUTESPACES_SPACE_ID) {
    return process.env.KUTESPACES_SPACE_ID;
  }
  const idPath = '/.kutespaces/state/space_id';
  if(!fs.existsSync(idPath)) {
    return undefined;
  }
  return fs.readFileSync('/.kutespaces/state/space_id', 'utf-8');
};
