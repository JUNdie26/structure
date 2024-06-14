const dotenv = require('dotenv');
dotenv.config();
const crypto = require('crypto');
const mongoose = require('mongoose');
const Record = require('./models/record');
const BTree = require('./btree');

class Database {
    constructor() {
        this.key = process.env.SECRET_KEY;
        this.btree = new BTree(2);
        this.init();
    }

    async init() {
        try {
            await mongoose.connect(process.env.MONGODB_URI, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });
            console.log('MongoDB connected');
        } catch (error) {
            console.error('MongoDB connection error:', error);
        }
    }

    encrypt(data) {
        const cipher = crypto.createCipher('aes-256-cbc', this.key);
        let encrypted = cipher.update(data, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return encrypted;
    }

    decrypt(data) {
        const decipher = crypto.createDecipher('aes-256-cbc', this.key);
        let decrypted = decipher.update(data, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    }

    async put(key, value) {
        const encryptedValue = this.encrypt(value);
        const record = new Record({ key, value: encryptedValue });
        await record.save();
        this.btree.insert({ key, value: encryptedValue });
    }

    async get(key) {
        const node = this.btree.search(key);
        if (node) {
            return this.decrypt(node.value);
        } else {
            const record = await Record.findOne({ key });
            if (record) {
                return this.decrypt(record.value);
            } else {
                return null;
            }
        }
    }
}

module.exports = Database;
