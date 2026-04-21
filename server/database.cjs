require('dotenv').config({ path: __dirname + '/.env' });
const mysql = require('mysql2/promise');

const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

let pool;

const getPool = async () => {
    if (pool) return pool;

    // First connect without DB to create it if needed
    const tempCon = await mysql.createConnection({
        host: DB_HOST || 'localhost',
        port: DB_PORT || 3306,
        user: DB_USER || 'root',
        password: DB_PASSWORD || ''
    });
    await tempCon.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME || 'digilocker'}\``);
    await tempCon.end();

    pool = mysql.createPool({
        host: DB_HOST || 'localhost',
        port: DB_PORT || 3306,
        user: DB_USER || 'root',
        password: DB_PASSWORD || '',
        database: DB_NAME || 'digilocker',
        waitForConnections: true,
        connectionLimit: 10,
        multipleStatements: false
    });

    console.log('Connected to MySQL database.');
    return pool;
};

const initDB = async () => {
    const db = await getPool();

    // Users table
    await db.query(`
        CREATE TABLE IF NOT EXISTS users (
            id VARCHAR(50) PRIMARY KEY,
            name VARCHAR(255),
            email VARCHAR(255) UNIQUE,
            password VARCHAR(255),
            role VARCHAR(50),
            createdAt VARCHAR(50),
            storageLimit BIGINT,
            isApproved TINYINT DEFAULT 0
        )
    `);

    // Seed admin user
    const adminId = 'admin_001';
    await db.query(`
        INSERT IGNORE INTO users (id, name, email, password, role, createdAt, storageLimit, isApproved)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [adminId, 'System Admin', 'admin@digilocker.com', 'admin', 'admin', new Date().toISOString(), 15 * 1024 * 1024 * 1024, 1]);

    // Ensure admin role is lowercase
    await db.query(`UPDATE users SET role = 'admin' WHERE email = 'admin@digilocker.com'`);

    // Documents table
    await db.query(`
        CREATE TABLE IF NOT EXISTS documents (
            id VARCHAR(50) PRIMARY KEY,
            userId VARCHAR(50),
            fileName VARCHAR(500),
            fileType VARCHAR(100),
            fileSize BIGINT,
            parentId VARCHAR(50),
            isStarred TINYINT DEFAULT 0,
            isDeleted TINYINT DEFAULT 0,
            isFolder TINYINT DEFAULT 0,
            uploadedAt VARCHAR(50),
            previewData LONGTEXT,
            FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
        )
    `);

    // Seed default documents for admin if none exist
    const [rows] = await db.query(`SELECT COUNT(*) as count FROM documents WHERE userId = ?`, [adminId]);
    if (rows[0].count === 0) {
        const now = new Date().toISOString();
        const myDocsId = 'admin_docs_root';
        await db.query(`
            INSERT IGNORE INTO documents (id, userId, fileName, fileType, fileSize, parentId, isStarred, isDeleted, isFolder, uploadedAt)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [myDocsId, adminId, 'My Documents', 'folder', 0, null, 0, 0, 1, now]);

        const categories = [
            'Identity Documents', 'Address / Residence Proof', 'Family & Personal Certificates',
            'Education Documents', 'Transport Documents', 'Financial & Tax Documents',
            'Health & Welfare', 'Employment & Social Security', 'Other Important Documents'
        ];

        for (let i = 0; i < categories.length; i++) {
            await db.query(`
                INSERT IGNORE INTO documents (id, userId, fileName, fileType, fileSize, parentId, isStarred, isDeleted, isFolder, uploadedAt)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [`admin_cat_${i}`, adminId, categories[i], 'folder', 0, myDocsId, 0, 0, 1, now]);
        }
    }

    // Shares table
    await db.query(`
        CREATE TABLE IF NOT EXISTS shares (
            id VARCHAR(50) PRIMARY KEY,
            docId VARCHAR(50),
            ownerId VARCHAR(50),
            sharedWithEmail VARCHAR(255),
            permission VARCHAR(50),
            sharedAt VARCHAR(50),
            FOREIGN KEY (docId) REFERENCES documents(id) ON DELETE CASCADE,
            FOREIGN KEY (ownerId) REFERENCES users(id) ON DELETE CASCADE
        )
    `);

    // Logs table
    await db.query(`
        CREATE TABLE IF NOT EXISTS logs (
            id VARCHAR(50) PRIMARY KEY,
            userId VARCHAR(50),
            userName VARCHAR(255),
            action TEXT,
            timestamp VARCHAR(50)
        )
    `);

    console.log('All tables ready.');
    return db;
};

module.exports = { initDB, getPool };
