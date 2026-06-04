const http = require('http');
const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'db.json');

// Initialize local JSON database file
function initDbFile() {
    if (!fs.existsSync(DB_FILE)) {
        const initialData = {
            users: [
                {
                    username: 'user',
                    password: 'password',
                    name: 'Demo Client',
                    email: 'client@finflow.com',
                    role: 'user'
                },
                {
                    username: 'admin',
                    password: 'password',
                    name: 'Administrator',
                    email: 'admin@finflow.com',
                    role: 'admin'
                }
            ],
            loans: [],
            messages: []
        };
        fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2));
    }
}

// Database readers & writers
function readDb() {
    initDbFile();
    const data = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(data);
}

function writeDb(data) {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// Read body stream parser
function getRequestBody(req) {
    return new Promise((resolve) => {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                resolve(body ? JSON.parse(body) : {});
            } catch (err) {
                resolve({});
            }
        });
    });
}

const server = http.createServer(async (req, res) => {
    // CORS Headers for API requests
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-User-Role, X-Username'
    };

    if (req.method === 'OPTIONS') {
        res.writeHead(204, headers);
        res.end();
        return;
    }

    let parsedUrl = req.url.split('?')[0].split('#')[0];

    // API REST Endpoints
    if (parsedUrl.startsWith('/api/')) {
        res.writeHead(200, { ...headers, 'Content-Type': 'application/json' });
        const db = readDb();
        const body = await getRequestBody(req);

        // POST /api/auth/login
        if (parsedUrl === '/api/auth/login' && req.method === 'POST') {
            const user = db.users.find(u => u.username === body.username && u.password === body.password);
            if (user) {
                if (user.role !== body.role) {
                    res.end(JSON.stringify({ success: false, message: 'Access denied. Selected role incorrect.' }));
                    return;
                }
                res.end(JSON.stringify({
                    success: true,
                    user: { username: user.username, name: user.name, email: user.email, role: user.role }
                }));
            } else {
                res.end(JSON.stringify({ success: false, message: 'Invalid username or password.' }));
            }
            return;
        }

        // POST /api/auth/register
        if (parsedUrl === '/api/auth/register' && req.method === 'POST') {
            const exists = db.users.find(u => u.username === body.username);
            if (exists) {
                res.end(JSON.stringify({ success: false, message: 'Username is already taken.' }));
                return;
            }
            db.users.push(body);
            writeDb(db);
            res.end(JSON.stringify({ success: true }));
            return;
        }

        // GET /api/loans
        if (parsedUrl === '/api/loans' && req.method === 'GET') {
            const userRole = req.headers['x-user-role'];
            const username = req.headers['x-username'];

            if (userRole === 'admin') {
                res.end(JSON.stringify({ success: true, loans: db.loans }));
            } else {
                const userLoans = db.loans.filter(l => l.applicantUsername === username);
                res.end(JSON.stringify({ success: true, loans: userLoans }));
            }
            return;
        }

        // POST /api/loans
        if (parsedUrl === '/api/loans' && req.method === 'POST') {
            const username = req.headers['x-username'];
            const user = db.users.find(u => u.username === username);

            if (!user) {
                res.end(JSON.stringify({ success: false, message: 'Unauthorized user context.' }));
                return;
            }

            const newLoan = {
                id: Date.now(),
                applicantUsername: user.username,
                applicantName: user.name,
                amount: body.amount,
                interest: body.interest,
                years: body.years,
                loanType: body.loanType,
                status: 'Pending',
                date: new Date().toISOString()
            };
            db.loans.push(newLoan);
            writeDb(db);
            res.end(JSON.stringify({ success: true, loan: newLoan }));
            return;
        }

        // PATCH /api/loans/status
        if (parsedUrl === '/api/loans/status' && req.method === 'PATCH') {
            const userRole = req.headers['x-user-role'];
            if (userRole !== 'admin') {
                res.end(JSON.stringify({ success: false, message: 'Unauthorized. Admin role required.' }));
                return;
            }

            const loan = db.loans.find(l => l.id === body.id);
            if (loan) {
                loan.status = body.status;
                writeDb(db);
                res.end(JSON.stringify({ success: true }));
            } else {
                res.end(JSON.stringify({ success: false, message: 'Loan entry not found.' }));
            }
            return;
        }

        // POST /api/loans/delete
        if (parsedUrl === '/api/loans/delete' && req.method === 'POST') {
            db.loans = db.loans.filter(l => l.id !== body.id);
            writeDb(db);
            res.end(JSON.stringify({ success: true }));
            return;
        }

        // POST /api/messages
        if (parsedUrl === '/api/messages' && req.method === 'POST') {
            const newMsg = {
                id: Date.now(),
                name: body.name,
                email: body.email,
                phone: body.phone,
                subject: body.subject,
                message: body.message,
                date: new Date().toISOString()
            };
            db.messages.push(newMsg);
            writeDb(db);
            res.end(JSON.stringify({ success: true }));
            return;
        }

        // GET /api/messages
        if (parsedUrl === '/api/messages' && req.method === 'GET') {
            res.end(JSON.stringify({ success: true, messages: db.messages }));
            return;
        }

        // POST /api/messages/delete
        if (parsedUrl === '/api/messages/delete' && req.method === 'POST') {
            db.messages = db.messages.filter(m => m.id !== body.id);
            writeDb(db);
            res.end(JSON.stringify({ success: true }));
            return;
        }

        res.end(JSON.stringify({ success: false, message: 'Endpoint not implemented' }));
        return;
    }

    // Static Server Routing
    let filePath = '.' + parsedUrl;
    if (filePath == './') {
        filePath = './index.html';
    }

    const extname = String(path.extname(filePath)).toLowerCase();
    const mimeTypes = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'text/javascript',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.ico': 'image/x-icon'
    };
    const contentType = mimeTypes[extname] || 'text/html';
    
    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 File Not Found</h1>');
            } else {
                res.writeHead(500);
                res.end('Error: ' + error.code + ' ..\n');
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(8080, () => {
    console.log('Server running at http://127.0.0.1:8080/');
});
