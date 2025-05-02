let currentUser = null;

// DOM Elements
const loginSection = document.getElementById('loginSection');
const registerSection = document.getElementById('registerSection');
const dashboardSection = document.getElementById('dashboardSection');
const addVendorSection = document.getElementById('addVendorSection');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const vendorForm = document.getElementById('vendorForm');

// Event Listeners
loginForm.addEventListener('submit', handleLogin);
registerForm.addEventListener('submit', handleRegister);
vendorForm.addEventListener('submit', handleAddVendor);

// Check if user is already logged in
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (token) {
        currentUser = JSON.parse(localStorage.getItem('user'));
        showDashboard();
        loadVendors();
    }
});

// Form Handlers
async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        if (response.ok) {
            localStorage.setItem('token', data.token);
            currentUser = { email };
            localStorage.setItem('user', JSON.stringify(currentUser));
            showDashboard();
            loadVendors();
        } else {
            alert(data.error);
        }
    } catch (error) {
        alert('An error occurred during login');
    }
}

async function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;

    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();
        if (response.ok) {
            alert('Registration successful! Please login.');
            showLogin();
        } else {
            alert(data.error);
        }
    } catch (error) {
        alert('An error occurred during registration');
    }
}

async function handleAddVendor(e) {
    e.preventDefault();
    const formData = new FormData();
    
    // Add form fields
    formData.append('service_provider_name', document.getElementById('service_provider_name').value);
    formData.append('pci_requirements', document.getElementById('pci_requirements').value);
    formData.append('services_provided', document.getElementById('services_provided').value);
    formData.append('aoc_expiration_date', document.getElementById('aoc_expiration_date').value);
    formData.append('contact_name', document.getElementById('contact_name').value);
    formData.append('contact_email', document.getElementById('contact_email').value);
    
    // Add files if they exist
    const aocFile = document.getElementById('aoc_document').files[0];
    const rolesFile = document.getElementById('roles_responsibilities').files[0];
    
    if (aocFile) formData.append('aoc_document', aocFile);
    if (rolesFile) formData.append('roles_responsibilities', rolesFile);

    try {
        const response = await fetch('/api/vendors', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: formData
        });

        const data = await response.json();
        if (response.ok) {
            showDashboard();
            loadVendors();
        } else {
            alert(data.error);
        }
    } catch (error) {
        alert('An error occurred while adding the vendor');
    }
}

// UI Functions
function showLogin() {
    loginSection.style.display = 'block';
    registerSection.style.display = 'none';
    dashboardSection.style.display = 'none';
    addVendorSection.style.display = 'none';
}

function showRegister() {
    loginSection.style.display = 'none';
    registerSection.style.display = 'block';
    dashboardSection.style.display = 'none';
    addVendorSection.style.display = 'none';
}

function showDashboard() {
    loginSection.style.display = 'none';
    registerSection.style.display = 'none';
    dashboardSection.style.display = 'block';
    addVendorSection.style.display = 'none';
}

function showAddVendor() {
    loginSection.style.display = 'none';
    registerSection.style.display = 'none';
    dashboardSection.style.display = 'none';
    addVendorSection.style.display = 'block';
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    currentUser = null;
    showLogin();
}

async function loadVendors() {
    try {
        const response = await fetch('/api/vendors', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        const vendors = await response.json();
        const vendorCards = document.getElementById('vendorCards');
        vendorCards.innerHTML = '';

        vendors.forEach(vendor => {
            const card = createVendorCard(vendor);
            vendorCards.appendChild(card);
        });
    } catch (error) {
        alert('An error occurred while loading vendors');
    }
}

function createVendorCard(vendor) {
    const div = document.createElement('div');
    div.className = 'col-md-6 col-lg-4 mb-4';
    
    const expirationDate = new Date(vendor.aoc_expiration_date);
    const today = new Date();
    const daysUntilExpiration = Math.ceil((expirationDate - today) / (1000 * 60 * 60 * 24));
    
    div.innerHTML = `
        <div class="card h-100">
            <div class="card-header">
                <h5 class="card-title mb-0">${vendor.service_provider_name}</h5>
            </div>
            <div class="card-body">
                <p class="card-text"><strong>PCI Requirements:</strong> ${vendor.pci_requirements}</p>
                <p class="card-text"><strong>Services Provided:</strong> ${vendor.services_provided}</p>
                <p class="card-text"><strong>AOC Expiration:</strong> ${expirationDate.toLocaleDateString()}</p>
                ${daysUntilExpiration < 30 ? `<p class="expiration-warning">Expires in ${daysUntilExpiration} days</p>` : ''}
                <p class="card-text"><strong>Contact:</strong> ${vendor.contact_name}</p>
                <p class="card-text"><strong>Email:</strong> ${vendor.contact_email}</p>
                
                ${vendor.aoc_document_path ? `
                    <a href="/uploads/${vendor.aoc_document_path}" class="document-link" target="_blank">
                        View AOC Document
                    </a>
                ` : ''}
                
                ${vendor.roles_responsibilities_path ? `
                    <a href="/uploads/${vendor.roles_responsibilities_path}" class="document-link" target="_blank">
                        View Roles & Responsibilities
                    </a>
                ` : ''}
            </div>
            <div class="card-footer">
                <button class="btn btn-warning" onclick="requestAOC('${vendor._id}')">
                    Request Updated AOC
                </button>
            </div>
        </div>
    `;
    
    return div;
}

async function requestAOC(vendorId) {
    try {
        const response = await fetch(`/api/vendors/${vendorId}/request-aoc`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        const data = await response.json();
        if (response.ok) {
            alert('AOC request sent successfully');
            loadVendors();
        } else {
            alert(data.error);
        }
    } catch (error) {
        alert('An error occurred while sending the AOC request');
    }
}

async function exportData() {
    try {
        const response = await fetch('/api/vendors', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        const vendors = await response.json();
        const csvContent = [
            ['Service Provider Name', 'PCI Requirements', 'Services Provided', 'AOC Expiration Date', 'Contact Name', 'Contact Email'],
            ...vendors.map(vendor => [
                vendor.service_provider_name,
                vendor.pci_requirements,
                vendor.services_provided,
                new Date(vendor.aoc_expiration_date).toLocaleDateString(),
                vendor.contact_name,
                vendor.contact_email
            ])
        ].map(row => row.join(',')).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'vendor_data.csv';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    } catch (error) {
        alert('An error occurred while exporting data');
    }
} 