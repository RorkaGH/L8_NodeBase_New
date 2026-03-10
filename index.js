const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

function printStudentInfo() {
  const {
    FIRST_NAME,
    LAST_NAME,
    GROUP,
    GROUP_INDEX,
    MODE,
  } = process.env;

  console.log('=== Student info from .env ===');
  console.log(`First name: ${FIRST_NAME}`);
  console.log(`Last name: ${LAST_NAME}`);
  console.log(`Group: ${GROUP}`);
  console.log(`Index in group: ${GROUP_INDEX}`);
  console.log(`Access MODE: ${MODE}`);
}

function main() {
  console.log('Project root:', path.resolve(__dirname));
  printStudentInfo();
}

main();

