import * as path from 'path';
import Mocha from 'mocha';
import * as glob from 'glob';

async function run(): Promise<void> {
  const mocha = new Mocha({ ui: 'tdd', color: true });
  const testsRoot = path.resolve(__dirname);

  return new Promise((resolve, reject) => {
    (glob as any)('**/*.test.js', { cwd: testsRoot }, (err: any, files: string[]) => {
      if (err) return reject(err);
      files.forEach((f: string) => mocha.addFile(path.resolve(testsRoot, f)));
      mocha.run(failures => failures > 0 ? reject(new Error(`${failures} tests failed.`)) : resolve());
    });
  });
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});

