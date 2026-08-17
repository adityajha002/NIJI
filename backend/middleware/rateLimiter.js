const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 5, 
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.body.username, 
  skipSuccessfulRequests: true, 
  message: { error: 'Too many failed login attempts for this account. Please try again in 15 minutes.' },
});

module.exports = { loginLimiter };