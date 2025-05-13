const bcrypt = require('bcrypt');

const hashPassword = async () => {
  const plainPassword = 'admin'; // Change this to your desired password
  const hashedPassword = await bcrypt.hash(plainPassword, 10);
  console.log('Hashed Password:', hashedPassword);
};

hashPassword();
