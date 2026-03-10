const path = require('path');
const fsModule = require('./fsModule');

async function runDemo() {
  const rootDir = __dirname;
  const demoDir = path.join(rootDir, 'demo');
  const fileA = path.join(demoDir, 'a.txt');
  const fileB = path.join(demoDir, 'b.txt');

  console.log('=== FS DEMO (sync) ===');
  fsModule.createDirSync(demoDir);
  fsModule.writeFileSync(fileA, 'Hello123 WORLD');
  console.log('fileA content:', fsModule.readFileSync(fileA));
  fsModule.cleanNoiseInFileSync(fileA);
  console.log('fileA after clean:', fsModule.readFileSync(fileA));
  fsModule.copyFileSync(fileA, fileB);
  console.log('fileB content (copied):', fsModule.readFileSync(fileB));

  console.log('=== FS DEMO (async) ===');
  await fsModule.writeFile(fileA, 'Async456 TEST');
  console.log('fileA content (async):', await fsModule.readFile(fileA));
  await fsModule.cleanNoiseInFile(fileA);
  console.log('fileA after clean (async):', await fsModule.readFile(fileA));

  console.log('=== List project files (non-service) ===');
  const files = await fsModule.listProjectFiles(rootDir);
  console.log(files);
}

runDemo().catch((e) => {
  console.error('FS demo error:', e);
});

