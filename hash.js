const bcrypt = require('bcrypt');

async function hashPassword(password) {
  const saltRounds = 10; // Number of salt rounds (adjust as needed)
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}

module.exports = { hashPassword };
