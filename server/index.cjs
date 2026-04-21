require('dotenv').config({ path: __dirname + '/.env' });
const express = require('express');
const cors = require('cors');
const { initDB, getPool } = require('./database.cjs');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json({ limit: '100mb' }));

// Initialize DB before starting server
initDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}).catch(err => {
    console.error('Failed to initialize DB:', err);
    process.exit(1);
});

app.get('/', (req, res) => {
    res.send('DigiLocker Server is running');
});

// --- Auth Endpoints ---

app.post('/api/register', async (req, res) => {
    const { name, email, password, id, storageLimit, createdAt, role } = req.body;
    const isApproved = (role === 'ADMIN' || role === 'admin') ? 1 : 0;
    try {
        const db = await getPool();
        await db.query(
            'INSERT INTO users (id, name, email, password, role, createdAt, storageLimit, isApproved) VALUES (?,?,?,?,?,?,?,?)',
            [id, name, email, password, role || 'USER', createdAt, storageLimit, isApproved]
        );
        res.json({ message: 'User registered', id, isApproved });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const db = await getPool();
        const [rows] = await db.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password]);
        if (rows.length === 0) return res.status(401).json({ error: 'Invalid credentials' });
        const user = rows[0];
        if (user.isApproved === 0) return res.status(403).json({ error: 'Account pending approval' });
        res.json({ user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- Admin User Management ---

app.patch('/api/users/:id/approve', async (req, res) => {
    try {
        const db = await getPool();
        await db.query('UPDATE users SET isApproved = 1 WHERE id = ?', [req.params.id]);
        res.json({ message: 'User approved' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.delete('/api/users/:id', async (req, res) => {
    try {
        const db = await getPool();
        await db.query('DELETE FROM users WHERE id = ?', [req.params.id]);
        res.json({ message: 'User deleted' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// --- Data Bootstrap ---

app.get('/api/bootstrap', async (req, res) => {
    try {
        const db = await getPool();
        const [users] = await db.query('SELECT * FROM users');
        const [docRows] = await db.query('SELECT * FROM documents');
        const documents = docRows.map(doc => ({
            ...doc,
            isStarred: !!doc.isStarred,
            isDeleted: !!doc.isDeleted,
            isFolder: !!doc.isFolder
        }));
        const [shares] = await db.query('SELECT * FROM shares');
        const [logs] = await db.query('SELECT * FROM logs');
        res.json({ users, documents, shares, logs, currentUser: null });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- Documents ---

app.post('/api/documents', async (req, res) => {
    const { id, userId, fileName, fileType, fileSize, parentId, isStarred, isDeleted, isFolder, uploadedAt, previewData } = req.body;
    try {
        const db = await getPool();
        await db.query(
            `INSERT INTO documents (id, userId, fileName, fileType, fileSize, parentId, isStarred, isDeleted, isFolder, uploadedAt, previewData)
             VALUES (?,?,?,?,?,?,?,?,?,?,?)`,
            [id, userId, fileName, fileType, fileSize, parentId || null, isStarred ? 1 : 0, isDeleted ? 1 : 0, isFolder ? 1 : 0, uploadedAt, previewData || null]
        );
        res.json({ message: 'Document created', id });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.patch('/api/documents/:id', async (req, res) => {
    const updates = req.body;
    const fields = Object.keys(updates).map(k => `\`${k}\` = ?`).join(', ');
    const values = Object.values(updates).map(v => typeof v === 'boolean' ? (v ? 1 : 0) : v);
    values.push(req.params.id);
    if (!fields) return res.status(400).json({ error: 'No fields to update' });
    try {
        const db = await getPool();
        const [result] = await db.query(`UPDATE documents SET ${fields} WHERE id = ?`, values);
        res.json({ message: 'Document updated', changes: result.affectedRows });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.delete('/api/documents/:id', async (req, res) => {
    try {
        const db = await getPool();
        const [result] = await db.query('DELETE FROM documents WHERE id = ?', [req.params.id]);
        res.json({ message: 'Document deleted', changes: result.affectedRows });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// --- Shares ---

app.post('/api/shares', async (req, res) => {
    const { id, docId, ownerId, sharedWithEmail, permission, sharedAt } = req.body;
    try {
        const db = await getPool();
        await db.query(
            'INSERT INTO shares (id, docId, ownerId, sharedWithEmail, permission, sharedAt) VALUES (?,?,?,?,?,?)',
            [id, docId, ownerId, sharedWithEmail, permission, sharedAt]
        );
        res.json({ message: 'Share created' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.delete('/api/shares/:id', async (req, res) => {
    try {
        const db = await getPool();
        await db.query('DELETE FROM shares WHERE id = ?', [req.params.id]);
        res.json({ message: 'Share deleted' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// --- Logs ---

app.post('/api/logs', async (req, res) => {
    const { id, userId, userName, action, timestamp } = req.body;
    try {
        const db = await getPool();
        await db.query(
            'INSERT INTO logs (id, userId, userName, action, timestamp) VALUES (?,?,?,?,?)',
            [id, userId, userName, action, timestamp]
        );
        res.json({ message: 'Log added' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});
