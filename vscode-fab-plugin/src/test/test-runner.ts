import * as path from 'path';
import Mocha from 'mocha';
// ✅ Correctly import glob for CommonJS
const glob: any = require('glob');

async function run(): Promise<void> {
  const mocha = new Mocha({ ui: 'tdd', color: true });
  const testsRoot = path.resolve(__dirname);

  return new Promise((resolve, reject) => {
    glob('**/*.test.js', { cwd: testsRoot }, (err: Error | null, files: string[]) => {
      if (err) return reject(err);
      files.forEach((f: string) => mocha.addFile(path.resolve(testsRoot, f)));
      mocha.run((failures: number) => {
        if (failures > 0) {
          reject(new Error(`${failures} tests failed.`));
        } else {
          resolve();
        }
      });
    });
  });
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});



