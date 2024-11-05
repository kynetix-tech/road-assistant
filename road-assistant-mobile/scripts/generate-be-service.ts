#!/usr/bin/env node
import { config } from 'dotenv';
import * as fs from 'fs';
import { generate } from 'openapi-typescript-codegen';
import * as path from 'path';

config();

const { serviceName, swaggerUrl } = {
  serviceName: 'Api',
  swaggerUrl: process.env.EXPO_PUBLIC_APP_CORE_URL + '/api-json',
};

const exists = (path: string): Promise<boolean> => {
  return new Promise((resolve) => {
    return fs.access(path, fs.constants.F_OK, (err) => resolve(!err));
  });
};

(async () => {
  const swaggerDirPath = path.join(__dirname, '..', 'temp');
  const swaggerFilepath = path.join(swaggerDirPath, `swagger_${serviceName}.json`);
  const outputPath = path.join(__dirname, '..', 'service', serviceName);

  try {
    const apiDocs = await fetch(swaggerUrl, { method: 'GET' }).then((res) => res.json());

    const fileExists = await exists(swaggerDirPath);
    if (!fileExists) {
      await fs.promises.mkdir(swaggerDirPath);
    }

    await fs.promises.writeFile(
      swaggerFilepath,
      Buffer.from(JSON.stringify(apiDocs), 'utf-8'),
    );

    await generate({
      input: swaggerFilepath,
      output: outputPath,
      useUnionTypes: true,
    });
  } catch (err) {
    console.log(err);
    return;
  }

  console.log('Success');
})();
