const path = require('path');
const dotenv = require('dotenv');

const mode = process.argv[2] || 'development';

const envMap = {
  production: '.env.production',
  development: '.env.development',
  domain: '.env.domain',
};

const envFile = envMap[mode] || '.env.development';

dotenv.config({ path: path.join(__dirname, envFile) });

console.log('Текущий режим работы (MODE из env):', process.env.MODE);

// Здесь может быть реальная логика приложения, сейчас просто выводим MODE.

