const bcrypt = require('bcrypt');
const { performance } = require('perf_hooks');

const SALT_ROUNDS = 10;
const PASSWORDS = Array.from({ length: 13 }, (_, i) => `password_${i + 1}`);

async function hashOne(password) {
  const start = performance.now();
  const hash = await bcrypt.hash(password, SALT_ROUNDS);
  const end = performance.now();
  const timeMs = end - start;
  console.log(`Пароль "${password}" зашифрован за ${timeMs.toFixed(2)} ms`);
  return { password, hash, timeMs };
}

async function main() {
  console.log('=== BCRYPT 13 PASSWORDS ===');
  const startAll = performance.now();

  const results = await Promise.all(PASSWORDS.map((p) => hashOne(p)));

  const endAll = performance.now();
  const total = endAll - startAll;
  const avg = results.reduce((sum, r) => sum + r.timeMs, 0) / results.length;

  console.log('--- ИТОГИ ---');
  console.log(`Общее время (параллельно): ${total.toFixed(2)} ms`);
  console.log(`Среднее время на один пароль: ${avg.toFixed(2)} ms`);
  console.log(
    'Комментарий: bcrypt использует CPU-ёмкий алгоритм. При одновременном шифровании нескольких паролей они конкурируют за ресурсы процессора, поэтому время для каждого может немного отличаться. Чем больше потоков и чем слабее процессор, тем сильнее разброс во времени.',
  );
}

main().catch((e) => {
  console.error('bcrypt task error:', e);
});

