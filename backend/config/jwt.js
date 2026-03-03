module.exports = {
  secret: process.env.JWT_SECRET || 'cd47948a3e9ac09c37d6fea48573d91526906a95726371f12882b9fa916280c7f4e6539f5bde6834dea3ae4df39589b506c6c9989ff189ba18ec1c9bc22824c1',
  expiresIn: process.env.JWT_EXPIRE || '7d',
  
  generateToken(payload) {
    const jwt = require('jsonwebtoken');
    return jwt.sign(payload, this.secret, { expiresIn: this.expiresIn });
  },
  
  verifyToken(token) {
    const jwt = require('jsonwebtoken');
    return jwt.verify(token, this.secret);
  }
};
