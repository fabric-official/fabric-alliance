import * as path from 'path';
import Mocha from 'mocha';
import glob from 'glob'; // ✅ Use default import for glob@7

async function run(): Promise<void> {
  const mocha = new Mocha({ ui: 'tdd', color: true });
  const testsRoot = path.resolve(__dirname);

  return new Promise((resolve, reject) => {
    (glob as any)('**/*.test.js', { cwd: testsRoot }, (err: Error | null, files: string[]) => {
      if (err) return reject(err);
      (files as string[]).forEach((f: string) => mocha.addFile(path.resolve(testsRoot, f)));
      mocha.run((failures: number) =>
        failures > 0 ? reject(new Error(`${failures} tests failed.`)) : resolve()
      );
    });
  });
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});




