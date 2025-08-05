import * as path from 'path';
import Mocha from 'mocha';
import glob from 'glob';

async function run(): Promise<void> {
  const mocha = new Mocha({ ui: 'tdd', color: true });
  const testsRoot = path.resolve(__dirname);

  return new Promise((resolve, reject) => {
    glob('**/*.test.js', { cwd: testsRoot }, (err, files) => {
      if (err) return reject(err);
      files.forEach(f => mocha.addFile(path.resolve(testsRoot, f)));
      mocha.run(failures => failures > 0 ? reject(new Error(`${failures} tests failed.`)) : resolve());
    });
  });
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
