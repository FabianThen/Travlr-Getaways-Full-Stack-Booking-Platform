const passport = require('passport');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');
const User = mongoose.model('users');

// Simple, dependency-free email format check. Not a full RFC 5322
// validator, but enough to reject obviously malformed input.
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Minimum password strength: at least 8 characters, containing at least
// one letter and one number. This is intentionally simple; a production
// system would likely layer in a breached-password check as well.
const isStrongPassword = (password) => {
    if (typeof password !== 'string' || password.length < 8) {
        return false;
    }
    const hasLetter = /[A-Za-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    return hasLetter && hasNumber;
};

/**
 * Sends a sanitized 500 response instead of leaking a raw driver/DB error
 * object back to the client. The real error is still logged server-side.
 */
const handleServerError = (res, context, err) => {
    console.error(`[authentication.js] ${context}:`, err);
    return res.status(500).json({ message: 'An unexpected server error occurred. Please try again later.' });
};

/**
 * Rate limiter for the login route: caps repeated attempts from the same
 * IP to slow down brute-force password guessing. The original controller
 * had no protection against this at all.
 *
 * Wire this into the routes file, e.g.:
 *   const { login, loginRateLimiter } = require('./authentication');
 *   router.post('/login', loginRateLimiter, login);
 */
const loginRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10,                  // limit each IP to 10 login attempts per window
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Too many login attempts. Please try again later.' }
});

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'All fields required' });
        }
        if (!EMAIL_REGEX.test(email)) {
            return res.status(400).json({ message: 'Please provide a valid email address' });
        }
        if (!isStrongPassword(password)) {
            return res.status(400).json({
                message: 'Password must be at least 8 characters and include at least one letter and one number'
            });
        }

        // Explicit duplicate check instead of relying on the database to
        // throw a duplicate-key error (which the original code returned
        // to the client verbatim).
        const existingUser = await User.findOne({ email }).exec();
        if (existingUser) {
            return res.status(409).json({ message: 'An account with that email already exists' });
        }

        const user = new User();
        user.name = name;
        user.email = email;
        user.setPassword(password);

        await user.save();
        const token = user.generateJWT();
        // 201, not 200: this endpoint creates a new user resource.
        return res.status(201).json({ token });
    } catch (err) {
        return handleServerError(res, 'register failed', err);
    }
};

const login = (req, res) => {
    if (!req.body.email || !req.body.password) {
        return res.status(400).json({ message: 'All fields required' });
    }

    passport.authenticate('local', (err, user, info) => {
        if (err) {
            // 500, not 404: this branch means authentication itself broke
            // (e.g. a database error), not that a resource was missing.
            return handleServerError(res, 'login authentication error', err);
        }
        if (user) {
            const token = user.generateJWT();
            return res.status(200).json({ token });
        }
        return res.status(401).json(info);
    })(req, res);
};

module.exports = { register, login, loginRateLimiter };
