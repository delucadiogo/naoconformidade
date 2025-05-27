const bcrypt = require('bcryptjs');

async function generateHash() {
  const password = 'Xinxuan99';
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  console.log('Hash gerado:', hash);
}

generateHash(); 