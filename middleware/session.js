const session = require('express-session');

module.exports = session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 3600000, // Sets the cookie expiration time in milliseconds (1 hour here)
        httpOnly: true, // Reduces client-side script control over the cookie
        secure: false, // Ensures cookies are only sent over HTTPS
      }
})