// src/config/auth.config.js
export default {
  secret: process.env.JWT_SECRET || 'robospark-secret-key',
  jwtExpiration: parseInt(process.env.JWT_EXPIRATION) || 86400, // 24 hours
  jwtRefreshExpiration: parseInt(process.env.JWT_REFRESH_EXPIRATION) || 604800 // 7 days
};