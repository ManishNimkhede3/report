// const jwt = require('jsonwebtoken');
// require('dotenv').config();

// const verifyToken = (req, res, next) => {
//     let token = req.headers['authorization'];

//     if (!token) {
//         return res.status(403).send({ message: "No token provided!" });
//     }

//     if (token.startsWith('Bearer ')) {
//         token = token.slice(7, token.length);
//     }

//     jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//         if (err) {
//             return res.status(401).send({ message: "Unauthorized! Invalid Token." });
//         }
//         req.userId = decoded.id;
//         next();
//     });
// };

// module.exports = verifyToken;


// const jwt = require('jsonwebtoken');
// require('dotenv').config();

// const verifyToken = (req, res, next) => {
//     let token = req.headers['authorization'];

//     if (!token) {
//         return res.status(403).send({ message: "No token provided!" });
//     }

//     if (token.startsWith('Bearer ')) {
//         token = token.slice(7, token.length);
//     }

//     jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//         if (err) {
//             // This error still likely means the JWT_SECRET in your .env is wrong
//             // or the token is expired/malformed.
//             console.error("JWT Verification Error:", err.message);
//             return res.status(401).send({ message: "Unauthorized! Invalid Token." });
//         }

//         // --- THIS IS THE CRITICAL CHANGE ---
//         // Your token has the user ID inside a 'claims' object.
//         // We get it from decoded.claims.user_ID instead of decoded.id
//         const userId = decoded?.claims?.user_ID;

//         if (!userId) {
//             // This is a safety check in case the token structure is unexpected.
//             return res.status(401).send({ message: "Unauthorized! Token is missing user ID." });
//         }
        
//         // Attach the user ID from the token to the request object
//         req.userId = userId;
//         next();
//     });
// };

// module.exports = verifyToken;















// middleware/auth.middleware.js (This is already correct)






// const jwt = require('jsonwebtoken');
// require('dotenv').config();

// const verifyToken = (req, res, next) => {
//     // ... (code to get token from header)

//     jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//         if (err) {
//             console.error("JWT Verification Error:", err.message);
//             return res.status(401).send({ message: "Unauthorized! Invalid Token." });
//         }

//         const userId = decoded?.claims?.user_ID;

//         if (!userId) {
//             return res.status(401).send({ message: "Unauthorized! Token is missing user ID." });
//         }
        
//         req.userId = userId;
//         next();
//     });
// };

// module.exports = verifyToken;


















const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = (req, res, next) => {
    let token = req.headers['authorization'];

    if (!token) {
        return res.status(403).send({ message: "No token provided!" });
    }

    if (token.startsWith('Bearer ')) {
        token = token.slice(7, token.length);
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.error("JWT Verification Error:", err.message);
            return res.status(401).send({ message: "Unauthorized! Invalid Token." });
        }

        const userId = decoded?.claims?.user_ID;
        if (!userId) {
            return res.status(401).send({ message: "Unauthorized! Token is missing user ID." });
        }
        
        req.userId = userId;
        next();
    });
};

module.exports = verifyToken;














