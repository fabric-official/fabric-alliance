import * as path from 'path';
import * as glob from 'glob';
import * as Mocha from 'mocha';

export function run(): Promise<void> {
  const mocha = new Mocha({ ui: 'tdd', color: true });
  const testsRoot = path.resolve(__dirname);

  return new Promise((resolve, reject) => {
    glob('**/*.test.js', { cwd: testsRoot }, (err: any, files: string[]) => {
      if (err) return reject(err);
      files.forEach(f => mocha.addFile(path.resolve(testsRoot, f)));
      try {
        mocha.run(failures => (failures ? reject(new Error(`${failures} tests failed.`)) : resolve()));
      } catch (err) {
        reject(err);
      }
    });
  });
}
