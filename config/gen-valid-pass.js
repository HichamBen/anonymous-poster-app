const crypto = require("crypto");

function generatePass(password) {
    const genSalt = crypto.randomBytes(32).toString("hex");
    const genHash = crypto.pbkdf2Sync(password, genSalt, 100000, 64, "sha512").toString("hex");
    return {
        salt: genSalt,
        hash: genHash
    }
};

function validationPass(password, salt, hash) {

    const genPass = crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex");

    return genPass === hash;
}

module.exports.generatePass = generatePass;
module.exports.validationPass = validationPass;