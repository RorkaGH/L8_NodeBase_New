const path = require('path');
const fsModule = require('./fsModule');
const { sortStringsIgnoringSpaces } = require('./sortStrings');
const { loadData } = require('./dataLoader');

const USERS_URL = 'https://jsonplaceholder.typicode.com/users';

async function main() {
  console.log('=== LOAD USERS FROM JSONPlaceholder ===');
  const state = await loadData(USERS_URL);

  if (state.error) {
    console.error('Ошибка при загрузке данных:', state.error);
    return;
  }

  console.log('Данные успешно загружены. Количество пользователей:', state.data.length);

  const users = state.data;

  // Сортируем по именам (name) с помощью модуля сортировок
  const names = users.map((u) => u.name);
  const sortedNames = sortStringsIgnoringSpaces(names);

  // Привязываем отсортированные имена к объектам пользователей
  const sortedUsers = sortedNames.map((name) => users.find((u) => u.name === name));

  const rootDir = __dirname;
  const usersDir = path.join(rootDir, 'users');
  const namesFile = path.join(usersDir, 'names.txt');
  const emailsFile = path.join(usersDir, 'emails.txt');

  fsModule.createDirSync(usersDir);

  const namesContent = sortedUsers.map((u) => u.name).join('\n');
  const emailsContent = sortedUsers.map((u) => u.email).join('\n');

  fsModule.writeFileSync(namesFile, namesContent);
  fsModule.writeFileSync(emailsFile, emailsContent);

  console.log('Файлы созданы:');
  console.log(' -', path.relative(rootDir, namesFile));
  console.log(' -', path.relative(rootDir, emailsFile));
}

main().catch((e) => {
  console.error('use.js error:', e);
});

