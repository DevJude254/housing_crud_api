# 📘 Student Housing CRUD API

A RESTful Node.js + Express CRUD API connected to a MySQL database for managing student housing. This system provides comprehensive endpoints for managing students and properties in a university housing management system.

## 🏗️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **Environment**: Node.js with dotenv for configuration
- **Development**: Nodemon for auto-reload

## 📁 Project Structure

```
housing-crud-api/
├── university_housing.sql    # Database schema & seed data
├── package.json             # NPM dependencies & scripts
├── package-lock.json        # Auto-generated dependency lock
├── .env                     # Environment variables (DB credentials, port)
├── .gitignore              # Git ignore rules
├── README.md               # This file
├── server.js               # Main server entry point
├── db.js                   # MySQL connection pool configuration
│
└── routes/                 # API route handlers
    ├── students.js         # CRUD routes for Students
    └── properties.js       # CRUD routes for Properties
```

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v14 or higher)
- [MySQL](https://www.mysql.com/) (v8.0 or higher)
- [npm](https://www.npmjs.com/) (comes with Node.js)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd housing-crud-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up the database**
   
   Create the database and import the schema:
   ```bash
   # Login to MySQL
   mysql -u root -p
   
   # Create database (if not exists)
   CREATE DATABASE IF NOT EXISTS university_housing;
   
   # Exit MySQL and import schema
   exit
   mysql -u root -p university_housing < university_housing.sql
   ```

4. **Configure environment variables**
   
   Create a `.env` file in the project root:
   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=university_housing
   PORT=3000
   ```

5. **Start the server**
   ```bash
   # Production mode
   npm start
   
   # Development mode (with auto-reload)
   npm run dev
   ```

6. **Verify installation**
   
   Server should be running at: **http://localhost:3000**
   
   Test the API:
   ```bash
   curl http://localhost:3000/students
   ```

## 📋 API Documentation

### Base URL
```
http://localhost:3000
```

### Students Endpoints

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|---------------|
| `POST` | `/students` | Create a new student | None |
| `GET` | `/students` | Retrieve all students | None |
| `GET` | `/students/:id` | Get student by ID | None |
| `PUT` | `/students/:id` | Update student information | None |
| `DELETE` | `/students/:id` | Delete a student | None |

#### Student Object Schema
```json
{
  "student_number": "string (required, unique)",
  "first_name": "string (required)",
  "last_name": "string (required)",
  "email": "string (required, valid email)",
  "phone": "string (optional)"
}
```

#### Examples

**Create a new student:**
```bash
curl -X POST http://localhost:3000/students \
  -H "Content-Type: application/json" \
  -d '{
    "student_number": "U2025-001",
    "first_name": "Derrick",
    "last_name": "Juma",
    "email": "derrick@example.com",
    "phone": "+254700000000"
  }'
```

**Get all students:**
```bash
curl http://localhost:3000/students
```

**Update a student:**
```bash
curl -X PUT http://localhost:3000/students/1 \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Updated Name",
    "email": "newemail@example.com"
  }'
```

### Properties Endpoints

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|---------------|
| `POST` | `/properties` | Create a new property | None |
| `GET` | `/properties` | Retrieve all properties | None |
| `GET` | `/properties/:id` | Get property by ID | None |
| `PUT` | `/properties/:id` | Update property information | None |
| `DELETE` | `/properties/:id` | Delete a property | None |

#### Property Object Schema
```json
{
  "landlord_id": "number (required)",
  "title": "string (required)",
  "address": "string (required)",
  "city": "string (required)",
  "description": "string (optional)"
}
```

#### Examples

**Create a new property:**
```bash
curl -X POST http://localhost:3000/properties \
  -H "Content-Type: application/json" \
  -d '{
    "landlord_id": 1,
    "title": "Central House",
    "address": "1 University Rd",
    "city": "Meru",
    "description": "Close to campus, fully furnished"
  }'
```

**Get all properties:**
```bash
curl http://localhost:3000/properties
```

## 🛠️ Development

### Available Scripts

```bash
# Start production server
npm start

# Start development server with auto-reload
npm run dev

# Run tests (if available)
npm test

# Check for linting issues
npm run lint
```

### Database Management

The `university_housing.sql` file contains:
- Database schema definitions
- Sample data for testing
- Required indexes and constraints

To reset the database:
```bash
mysql -u root -p university_housing < university_housing.sql
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `DB_HOST` | MySQL host address | `localhost` | Yes |
| `DB_PORT` | MySQL port | `3306` | Yes |
| `DB_USER` | MySQL username | `root` | Yes |
| `DB_PASSWORD` | MySQL password | - | Yes |
| `DB_NAME` | Database name | `university_housing` | Yes |
| `PORT` | Server port | `3000` | No |

## 📝 Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation completed successfully"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error description",
  "message": "User-friendly error message"
}
```

## 🚨 Error Handling

The API handles the following error scenarios:
- Invalid input data (400 Bad Request)
- Resource not found (404 Not Found)
- Database connection errors (500 Internal Server Error)
- Duplicate entries (409 Conflict)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request


## 📞 Support

If you have any questions or need help with setup, please:
- Open an issue on GitHub
- Contact the derekjude254@gmail.com
- Check the troubleshooting section below

## 🐛 Troubleshooting

### Common Issues

**Database Connection Failed:**
- Verify MySQL is running
- Check credentials in `.env` file
- Ensure database exists

**Port Already in Use:**
- Change the `PORT` in `.env` file
- Kill the process using the port: `lsof -ti:3000 | xargs kill -9`

**Module Not Found:**
- Run `npm install` to install dependencies
- Delete `node_modules` and `package-lock.json`, then run `npm install`

---

Made with ❤️ for university housing management
