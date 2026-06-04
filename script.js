// EMI Calculator
function calculateLoan() {
    let name = document.getElementById("name").value;
    let amount = parseFloat(document.getElementById("amount").value);
    let interest = parseFloat(document.getElementById("interest").value);
    let years = parseFloat(document.getElementById("years").value);
    let loanType = document.getElementById("loanType").value;
    let resultDiv = document.getElementById("result");

    if (name === "" || isNaN(amount) || isNaN(interest) || isNaN(years)) {
        resultDiv.style.display = "block";
        resultDiv.innerHTML = "⚠️ Please fill all details properly with valid numbers.";
        resultDiv.style.border = "1px solid rgba(255, 100, 100, 0.3)";
        resultDiv.style.background = "rgba(255, 100, 100, 0.05)";
        return;
    }

    let monthlyInterest = interest / 100 / 12;
    let months = years * 12;

    let emi = (amount * monthlyInterest * Math.pow(1 + monthlyInterest, months)) / (Math.pow(1 + monthlyInterest, months) - 1);
    let totalPayment = emi * months;
    let totalInterest = totalPayment - amount;

    resultDiv.style.display = "block";
    resultDiv.style.border = "1px solid rgba(0, 212, 255, 0.2)";
    resultDiv.style.background = "rgba(0, 212, 255, 0.05)";
    resultDiv.innerHTML = `
        <strong>Applicant:</strong> ${name}<br>
        <strong>Loan Type:</strong> ${loanType}<br>
        <hr style="border:0; border-top:1px solid rgba(255,255,255,0.1); margin:10px 0;">
        <strong style="color:var(--primary); font-size:18px;">Monthly EMI: ₹${emi.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong><br>
        <strong>Total Interest:</strong> ₹${totalInterest.toLocaleString('en-IN', { minimumFractionDigits: 2 })}<br>
        <strong>Total Payment:</strong> ₹${totalPayment.toLocaleString('en-IN', { minimumFractionDigits: 2 })}<br>
        <button class="apply-now-btn" style="margin-top: 15px; width: 100%; border: none;" onclick="triggerDirectApply('${name}', ${amount}, ${interest}, ${years}, '${loanType}')">Apply for this Loan</button>
    `;
}

async function triggerDirectApply(name, amount, interest, years, loanType) {
    const user = getCurrentUser();
    const resultDiv = document.getElementById("result");
    
    if (user) {
        if (user.role === 'admin') {
            alert('Administrators cannot apply for loans.');
            return;
        }
        
        // Disable button to prevent double submission
        const applyBtn = resultDiv.querySelector('.apply-now-btn');
        applyBtn.disabled = true;
        applyBtn.textContent = 'Submitting...';
        
        try {
            const result = await submitLoanApplication({ amount, interest, years, loanType });
            if (result.success) {
                applyBtn.textContent = '✓ Applied Successfully!';
                applyBtn.style.background = '#10b981';
                applyBtn.style.borderColor = '#10b981';
                applyBtn.style.color = '#fff';
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1200);
            } else {
                applyBtn.disabled = false;
                applyBtn.textContent = 'Apply for this Loan';
                alert(result.message || 'Failed to submit loan application.');
            }
        } catch (err) {
            applyBtn.disabled = false;
            applyBtn.textContent = 'Apply for this Loan';
            alert('Error submitting loan application.');
            console.error(err);
        }
    } else {
        // Not logged in. Store details locally and redirect to login
        localStorage.setItem('pending_loan_app', JSON.stringify({ amount, interest, years, loanType }));
        resultDiv.innerHTML += `
            <div style="color: #f59e0b; font-size: 13px; font-weight:600; margin-top: 10px; text-align: center;">
                ⚠️ Redirecting to login to complete application...
            </div>
        `;
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
    }
}

// FAQ Accordion & Mobile Menu
document.addEventListener('DOMContentLoaded', () => {
    // FAQ Accordion
    document.querySelectorAll('.faq-question').forEach(button => {
        button.addEventListener('click', () => {
            const faqItem = button.parentElement;
            const isActive = faqItem.classList.contains('active');
            
            // Close all
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
                item.querySelector('.faq-icon').textContent = '+';
            });

            // Open clicked if it wasn't active
            if (!isActive) {
                faqItem.classList.add('active');
                button.querySelector('.faq-icon').textContent = '×';
            }
        });
    });

    // Mobile Menu Toggle
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.querySelector('header nav');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            menuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking a link
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }
});

// AUTH & DATABASE SYSTEM

// Database Initialization (localStorage seed data)
function initLocalDb() {
    if (!localStorage.getItem('ff_users')) {
        const defaultUsers = [
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
        ];
        localStorage.setItem('ff_users', JSON.stringify(defaultUsers));
    }
    if (!localStorage.getItem('ff_loans')) {
        localStorage.setItem('ff_loans', JSON.stringify([]));
    }
    if (!localStorage.getItem('ff_messages')) {
        localStorage.setItem('ff_messages', JSON.stringify([]));
    }
}

// Session Helpers
function getCurrentUser() {
    const user = localStorage.getItem('ff_session');
    return user ? JSON.parse(user) : null;
}

function setCurrentUser(user) {
    if (user) {
        localStorage.setItem('ff_session', JSON.stringify(user));
    } else {
        localStorage.removeItem('ff_session');
    }
}

function handleLogout() {
    setCurrentUser(null);
    window.location.href = 'index.html';
}

// Unified API Wrapper with Local Fallback
async function apiCall(endpoint, method = 'GET', body = null) {
    const baseUrl = 'http://127.0.0.1:8080';
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
            'X-User-Role': getCurrentUser() ? getCurrentUser().role : 'guest',
            'X-Username': getCurrentUser() ? getCurrentUser().username : ''
        }
    };
    if (body) {
        options.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(`${baseUrl}${endpoint}`, options);
        if (response.ok) {
            return await response.json();
        }
        const errorData = await response.json().catch(() => ({}));
        return { success: false, message: errorData.message || 'Request failed' };
    } catch (err) {
        // Network error (Server not running, file:// protocol, etc.) - Fallback to LocalStorage
        console.warn(`Server API unreachable. Falling back to client-side LocalStorage for ${endpoint}`);
        return mockLocalApi(endpoint, method, body);
    }
}

// Client-Side Mock Database Fallback (runs in browser when Server is offline)
function mockLocalApi(endpoint, method, body) {
    initLocalDb();
    
    // Login
    if (endpoint === '/api/auth/login' && method === 'POST') {
        const users = JSON.parse(localStorage.getItem('ff_users'));
        const user = users.find(u => u.username === body.username && u.password === body.password);
        if (user) {
            if (user.role !== body.role) {
                return { success: false, message: `Access denied. Selected role incorrect.` };
            }
            return { success: true, user: { username: user.username, name: user.name, email: user.email, role: user.role } };
        }
        return { success: false, message: 'Invalid username or password.' };
    }

    // Register
    if (endpoint === '/api/auth/register' && method === 'POST') {
        const users = JSON.parse(localStorage.getItem('ff_users'));
        const exists = users.find(u => u.username === body.username);
        if (exists) {
            return { success: false, message: 'Username is already taken.' };
        }
        users.push(body);
        localStorage.setItem('ff_users', JSON.stringify(users));
        return { success: true };
    }

    // Submit Loan
    if (endpoint === '/api/loans' && method === 'POST') {
        const currentUser = getCurrentUser();
        if (!currentUser) return { success: false, message: 'Unauthorized' };
        
        const loans = JSON.parse(localStorage.getItem('ff_loans'));
        const newLoan = {
            id: Date.now(),
            applicantUsername: currentUser.username,
            applicantName: currentUser.name,
            amount: body.amount,
            interest: body.interest,
            years: body.years,
            loanType: body.loanType,
            status: 'Pending',
            date: new Date().toISOString()
        };
        loans.push(newLoan);
        localStorage.setItem('ff_loans', JSON.stringify(loans));
        return { success: true, loan: newLoan };
    }

    // Get User Loans
    if (endpoint === '/api/loans' && method === 'GET') {
        const currentUser = getCurrentUser();
        if (!currentUser) return { success: false, message: 'Unauthorized' };
        
        const loans = JSON.parse(localStorage.getItem('ff_loans'));
        // If Admin, return all. If User, return only theirs.
        if (currentUser.role === 'admin') {
            return { success: true, loans };
        } else {
            const userLoans = loans.filter(l => l.applicantUsername === currentUser.username);
            return { success: true, loans: userLoans };
        }
    }

    // Update Loan Status (Admin)
    if (endpoint.startsWith('/api/loans/status') && method === 'PATCH') {
        const currentUser = getCurrentUser();
        if (!currentUser || currentUser.role !== 'admin') return { success: false, message: 'Unauthorized' };

        const loans = JSON.parse(localStorage.getItem('ff_loans'));
        const loan = loans.find(l => l.id === body.id);
        if (loan) {
            loan.status = body.status;
            localStorage.setItem('ff_loans', JSON.stringify(loans));
            return { success: true };
        }
        return { success: false, message: 'Loan request not found.' };
    }

    // Delete Loan Entry
    if (endpoint.startsWith('/api/loans/delete') && method === 'POST') {
        const loans = JSON.parse(localStorage.getItem('ff_loans'));
        const updated = loans.filter(l => l.id !== body.id);
        localStorage.setItem('ff_loans', JSON.stringify(updated));
        return { success: true };
    }

    // Submit Message
    if (endpoint === '/api/messages' && method === 'POST') {
        const messages = JSON.parse(localStorage.getItem('ff_messages'));
        const newMsg = {
            id: Date.now(),
            name: body.name,
            email: body.email,
            subject: body.subject,
            message: body.message,
            date: new Date().toISOString()
        };
        messages.push(newMsg);
        localStorage.setItem('ff_messages', JSON.stringify(messages));
        return { success: true };
    }

    // Get Messages
    if (endpoint === '/api/messages' && method === 'GET') {
        const messages = JSON.parse(localStorage.getItem('ff_messages'));
        return { success: true, messages };
    }

    // Delete Message
    if (endpoint.startsWith('/api/messages/delete') && method === 'POST') {
        const messages = JSON.parse(localStorage.getItem('ff_messages'));
        const updated = messages.filter(m => m.id !== body.id);
        localStorage.setItem('ff_messages', JSON.stringify(updated));
        return { success: true };
    }

    return { success: false, message: 'Endpoint not implemented' };
}

// Front-End Auth API Calls
async function authLogin(credentials) {
    const result = await apiCall('/api/auth/login', 'POST', credentials);
    if (result.success) {
        setCurrentUser(result.user);
    }
    return result;
}

async function authRegister(userData) {
    return await apiCall('/api/auth/register', 'POST', userData);
}

async function submitLoanApplication(loanData) {
    return await apiCall('/api/loans', 'POST', loanData);
}

async function fetchUserLoans() {
    return await apiCall('/api/loans', 'GET');
}

async function fetchAdminLoans() {
    return await apiCall('/api/loans', 'GET');
}

async function updateLoanStatus(id, status) {
    return await apiCall('/api/loans/status', 'PATCH', { id, status });
}

async function deleteLoanApplication(id) {
    return await apiCall('/api/loans/delete', 'POST', { id });
}

async function submitContactMessage(msgData) {
    return await apiCall('/api/messages', 'POST', msgData);
}

async function fetchContactMessages() {
    return await apiCall('/api/messages', 'GET');
}

async function deleteContactMessage(id) {
    return await apiCall('/api/messages/delete', 'POST', { id });
}

// Dynamic Header Navigation
function updateHeaderNav() {
    const user = getCurrentUser();
    const nav = document.querySelector('header nav');
    if (!nav) return;

    // Check if "Login/Dashboard" or "Logout" links exist
    let loginLink = nav.querySelector('a[href="login.html"]');
    let dbLink = nav.querySelector('a[href="dashboard.html"]');
    let adminLink = nav.querySelector('a[href="admin.html"]');
    let logoutLink = nav.querySelector('#logout-nav-item');

    // Remove any existing dynamic items
    if (dbLink) dbLink.remove();
    if (adminLink) adminLink.remove();
    if (loginLink) loginLink.remove();
    if (logoutLink) logoutLink.remove();

    // Clean other login triggers
    const allLinks = Array.from(nav.querySelectorAll('a'));
    allLinks.forEach(link => {
        if (link.textContent.toLowerCase() === 'login' || link.textContent.toLowerCase() === 'dashboard' || link.textContent.toLowerCase() === 'admin panel') {
            link.remove();
        }
    });

    if (user) {
        // Logged in
        const dashLink = document.createElement('a');
        if (user.role === 'admin') {
            dashLink.href = 'admin.html';
            dashLink.textContent = 'Admin Panel';
        } else {
            dashLink.href = 'dashboard.html';
            dashLink.textContent = 'Dashboard';
        }
        
        // Highlight active page
        if (window.location.pathname.endsWith('dashboard.html') || window.location.pathname.endsWith('admin.html')) {
            dashLink.classList.add('active');
        }
        nav.appendChild(dashLink);

        const logOut = document.createElement('a');
        logOut.href = '#';
        logOut.id = 'logout-nav-item';
        logOut.textContent = 'Logout';
        logOut.style.color = '#ff6b6b';
        logOut.addEventListener('click', (e) => {
            e.preventDefault();
            handleLogout();
        });
        nav.appendChild(logOut);
    } else {
        // Guest
        const logLink = document.createElement('a');
        logLink.href = 'login.html';
        logLink.textContent = 'Login';
        if (window.location.pathname.endsWith('login.html')) {
            logLink.classList.add('active');
        }
        nav.appendChild(logLink);
    }
}

// Initialise DB and Header Nav on Load
document.addEventListener('DOMContentLoaded', () => {
    initLocalDb();
    updateHeaderNav();
});


