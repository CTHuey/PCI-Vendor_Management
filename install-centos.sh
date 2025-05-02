#!/bin/bash

# PCI Vendor Management System - CentOS Installation Script
echo -e "\033[0;32mPCI Vendor Management System - CentOS Installation\033[0m"

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo -e "\033[0;31mPlease run this script as root\033[0m"
    exit 1
fi

# Install Node.js
if ! command -v node &> /dev/null; then
    echo -e "\033[0;33mInstalling Node.js...\033[0m"
    curl -sL https://rpm.nodesource.com/setup_14.x | bash -
    yum install -y nodejs
    echo -e "\033[0;32mNode.js installed successfully\033[0m"
fi

# Install MongoDB
if ! command -v mongod &> /dev/null; then
    echo -e "\033[0;33mInstalling MongoDB...\033[0m"
    cat > /etc/yum.repos.d/mongodb-org-4.4.repo << EOL
[mongodb-org-4.4]
name=MongoDB Repository
baseurl=https://repo.mongodb.org/yum/redhat/\$releasever/mongodb-org/4.4/x86_64/
gpgcheck=1
enabled=1
gpgkey=https://www.mongodb.org/static/pgp/server-4.4.asc
EOL
    yum install -y mongodb-org
    systemctl start mongod
    systemctl enable mongod
    echo -e "\033[0;32mMongoDB installed successfully\033[0m"
fi

# Create necessary directories
mkdir -p public/uploads

# Install npm dependencies
echo -e "\033[0;33mInstalling npm dependencies...\033[0m"
npm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo -e "\033[0;33mCreating .env file...\033[0m"
    cat > .env << EOL
MONGODB_URI=mongodb://localhost:27017/pci_vendors
PORT=3000
JWT_SECRET=$(uuidgen)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
EOL
    echo -e "\033[0;33mPlease update the .env file with your email credentials\033[0m"
fi

# Start the application
echo -e "\033[0;33mStarting the application...\033[0m"
npm start

echo -e "\033[0;32mInstallation completed successfully!\033[0m"
echo -e "\033[0;32mThe application is now running at http://localhost:3000\033[0m" 