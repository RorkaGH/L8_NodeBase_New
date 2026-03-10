const fs = require('fs');
const path = require('path');

// Служебные пути, которые нельзя трогать при очистке проекта
const SERVICE_PATHS = new Set([
  'node_modules',
  '.git',
  '.gitignore',
  '.env',
  '.env.production',
  '.env.development',
  '.env.domain',
  'package.json',
  'package-lock.json',
  'fsModule.js',
  'index.js',
  'os',
  'runWithEnv.js',
  'printMode.js',
  'fsDemo.js',
  'bcryptTask.js',
  'sortStrings.js',
  'dataLoader.js',
  'use.js',
]);

// ---------- ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ----------

function isService(relativePath) {
  const parts = relativePath.split(path.sep);
  return parts.some((part) => SERVICE_PATHS.has(part));
}

function ensureDirSync(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// ---------- СИНХРОННЫЕ ФУНКЦИИ ----------

// Запись (перезапись) в файл
function writeFileSync(targetPath, content) {
  const dir = path.dirname(targetPath);
  ensureDirSync(dir);
  fs.writeFileSync(targetPath, content, 'utf8');
}

// Чтение файла
function readFileSync(targetPath) {
  return fs.readFileSync(targetPath, 'utf8');
}

// Полная замена содержимого
function replaceFileContentSync(targetPath, newContent) {
  writeFileSync(targetPath, newContent);
}

// Удаление информации из файла (очистка, но не удаление файла)
function clearFileSync(targetPath) {
  writeFileSync(targetPath, '');
}

// Удаление "шума" — цифр и приводим все буквы к нижнему регистру
function cleanNoiseInFileSync(targetPath) {
  const content = readFileSync(targetPath);
  const cleaned = content
    .replace(/[0-9]/g, '')
    .toLowerCase();
  writeFileSync(targetPath, cleaned);
}

// Копирование файла
function copyFileSync(sourcePath, destPath) {
  const dir = path.dirname(destPath);
  ensureDirSync(dir);
  fs.copyFileSync(sourcePath, destPath);
}

// Создание папки
function createDirSync(dirPath) {
  ensureDirSync(dirPath);
}

// Удаление папки рекурсивно
function removeDirSync(dirPath) {
  if (!fs.existsSync(dirPath)) return;
  const stat = fs.statSync(dirPath);
  if (!stat.isDirectory()) return;

  for (const entry of fs.readdirSync(dirPath)) {
    const full = path.join(dirPath, entry);
    const s = fs.statSync(full);
    if (s.isDirectory()) {
      removeDirSync(full);
    } else {
      fs.unlinkSync(full);
    }
  }
  fs.rmdirSync(dirPath);
}

// Вывод всех путей к файлам (кроме служебных)
function listProjectFilesSync(rootDir) {
  const result = [];

  function walk(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      const relative = path.relative(rootDir, fullPath);
      if (isService(relative)) continue;

      if (entry.isDirectory()) {
        walk(fullPath);
      } else {
        result.push(relative);
      }
    }
  }

  walk(rootDir);
  return result;
}

// Удаление всех файлов и папок (кроме служебных)
function clearProjectSync(rootDir) {
  const entries = fs.readdirSync(rootDir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(rootDir, entry.name);
    const relative = path.relative(rootDir, fullPath);

    if (isService(relative)) continue;

    if (entry.isDirectory()) {
      removeDirSync(fullPath);
    } else {
      fs.unlinkSync(fullPath);
    }
  }
}

// ---------- АСИНХРОННЫЕ ФУНКЦИИ (Promise-based) ----------

function writeFile(targetPath, content) {
  return new Promise((resolve, reject) => {
    const dir = path.dirname(targetPath);
    ensureDirSync(dir);
    fs.writeFile(targetPath, content, 'utf8', (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

function readFile(targetPath) {
  return new Promise((resolve, reject) => {
    fs.readFile(targetPath, 'utf8', (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
}

function replaceFileContent(targetPath, newContent) {
  return writeFile(targetPath, newContent);
}

function clearFile(targetPath) {
  return writeFile(targetPath, '');
}

async function cleanNoiseInFile(targetPath) {
  const content = await readFile(targetPath);
  const cleaned = content
    .replace(/[0-9]/g, '')
    .toLowerCase();
  await writeFile(targetPath, cleaned);
}

function copyFile(sourcePath, destPath) {
  return new Promise((resolve, reject) => {
    const dir = path.dirname(destPath);
    ensureDirSync(dir);
    fs.copyFile(sourcePath, destPath, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

function createDir(dirPath) {
  return new Promise((resolve, reject) => {
    fs.mkdir(dirPath, { recursive: true }, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

async function removeDir(dirPath) {
  if (!fs.existsSync(dirPath)) return;
  const stat = fs.statSync(dirPath);
  if (!stat.isDirectory()) return;

  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dirPath, entry.name);
    const s = fs.statSync(full);
    if (s.isDirectory()) {
      await removeDir(full);
    } else {
      await new Promise((resolve, reject) => {
        fs.unlink(full, (err) => (err ? reject(err) : resolve()));
      });
    }
  }

  await new Promise((resolve, reject) => {
    fs.rmdir(dirPath, (err) => (err ? reject(err) : resolve()));
  });
}

async function listProjectFiles(rootDir) {
  const result = [];

  async function walk(currentDir) {
    const entries = await fs.promises.readdir(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      const relative = path.relative(rootDir, fullPath);
      if (isService(relative)) continue;

      if (entry.isDirectory()) {
        await walk(fullPath);
      } else {
        result.push(relative);
      }
    }
  }

  await walk(rootDir);
  return result;
}

async function clearProject(rootDir) {
  const entries = await fs.promises.readdir(rootDir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(rootDir, entry.name);
    const relative = path.relative(rootDir, fullPath);

    if (isService(relative)) continue;

    if (entry.isDirectory()) {
      await removeDir(fullPath);
    } else {
      await fs.promises.unlink(fullPath);
    }
  }
}

module.exports = {
  // sync
  writeFileSync,
  readFileSync,
  replaceFileContentSync,
  clearFileSync,
  cleanNoiseInFileSync,
  copyFileSync,
  createDirSync,
  removeDirSync,
  listProjectFilesSync,
  clearProjectSync,
  // async
  writeFile,
  readFile,
  replaceFileContent,
  clearFile,
  cleanNoiseInFile,
  copyFile,
  createDir,
  removeDir,
  listProjectFiles,
  clearProject,
};

