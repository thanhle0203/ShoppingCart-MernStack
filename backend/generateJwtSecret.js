const crypto = require('crypto');

const generateJwtSecret = () => {
    const secretLength = 64; // Adjust the length as desired
    return crypto.randomBytes(secretLength).toString('hex');
  };
  
  const jwtSecret = generateJwtSecret();
  console.log('JWT Secret:', jwtSecret);
  
