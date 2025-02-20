const crypto = require('crypto');
require('dotenv').config();

const algorithm = 'aes-256-cbc';
const key = crypto.scryptSync(process.env.ENCRYPTION_KEY, 'salt', 32);

exports.encrypt = (data) => {
    if (!data) throw new Error('Data to encrypt is required');
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return `${iv.toString('hex')}:${encrypted}`;
};

exports.decrypt = (data) => {
    if (!data) throw new Error('Data to decrypt is required');
    const [ivHex, encryptedData] = data.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
};