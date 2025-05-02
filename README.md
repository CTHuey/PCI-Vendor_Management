# PCI Vendor Management System

A comprehensive system for managing PCI (Payment Card Industry) vendors, their documentation, and compliance requirements.

## Features

- User authentication and authorization
- Vendor management and tracking
- Document management for AOC (Attestation of Compliance) and Roles & Responsibilities
- Automated email notifications for document expiration
- Export functionality for vendor data
- Responsive web interface

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- NPM (v6 or higher)
- Git

## Installation Instructions

### Windows Server

1. Download and install Node.js from [nodejs.org](https://nodejs.org/)
2. Download and install MongoDB from [mongodb.com](https://www.mongodb.com/try/download/community)
3. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/pci-vendor-management.git
   cd pci-vendor-management
   ```
4. Install dependencies:
   ```bash
   npm install
   ```
5. Create a `.env` file in the root directory with the following variables:
   ```
   MONGODB_URI=mongodb://localhost:27017/pci_vendors
   PORT=3000
   JWT_SECRET=your_jwt_secret
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_email_password
   ```
6. Start the application:
   ```bash
   npm start
   ```

### CentOS

1. Install Node.js:
   ```bash
   curl -sL https://rpm.nodesource.com/setup_14.x | sudo bash -
   sudo yum install -y nodejs
   ```

2. Install MongoDB:
   ```bash
   sudo vi /etc/yum.repos.d/mongodb-org-4.4.repo
   ```
   Add the following content:
   ```
   [mongodb-org-4.4]
   name=MongoDB Repository
   baseurl=https://repo.mongodb.org/yum/redhat/$releasever/mongodb-org/4.4/x86_64/
   gpgcheck=1
   enabled=1
   gpgkey=https://www.mongodb.org/static/pgp/server-4.4.asc
   ```
   Then run:
   ```bash
   sudo yum install -y mongodb-org
   sudo systemctl start mongod
   sudo systemctl enable mongod
   ```

3. Clone and install the application:
   ```bash
   git clone https://github.com/yourusername/pci-vendor-management.git
   cd pci-vendor-management
   npm install
   ```

4. Create and configure the `.env` file as described in the Windows Server section.

5. Start the application:
   ```bash
   npm start
   ```

## Configuration

### Environment Variables

- `MONGODB_URI`: MongoDB connection string
- `PORT`: Port number for the application (default: 3000)
- `JWT_SECRET`: Secret key for JWT token generation
- `EMAIL_USER`: Email address for sending notifications
- `EMAIL_PASS`: Email password for sending notifications

### Security Considerations

1. Always use HTTPS in production
2. Keep JWT_SECRET secure and complex
3. Regularly update dependencies
4. Implement proper access controls
5. Monitor MongoDB access logs

## Usage

1. Access the application at `http://localhost:3000`
2. Register a new user account
3. Log in with your credentials
4. Add vendors and their documentation
5. Set up email notifications for document expiration

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue in the GitHub repository or contact the maintainers.

## Acknowledgments

- Express.js
- MongoDB
- Bootstrap
- Node.js 