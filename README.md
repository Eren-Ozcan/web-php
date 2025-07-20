# Glass Company Web Application

This repository contains a React client and an Express server used for a glass company showcase website.

## Prerequisites

- [Node.js](https://nodejs.org/) (version 18 or later) and npm should be installed on your system.

## Installing Dependencies

Dependencies are managed separately for the client and the server. Install them by running:

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

## Running the Server

From the `server` directory you can start the API in development mode with nodemon:

```bash
cd server
npm run dev
```

The server will listen on `http://localhost:5000` by default. To run the server without nodemon, use `npm start`.

## Running the Client

Start the React development server from the `client` directory:

```bash
cd client
npm run dev
```

Vite will start the client on `http://localhost:5173` (or the next available port). The client expects the API to be running at `http://localhost:5000`.

## Testing

No automated tests are currently defined. The `npm test` command in both the client and server simply prints a message so the command does not fail by default.

## Database Setup

The backend now uses **MySQL** for authentication. A sample SQL script is provided in `server/init_db.sql` to create the `mefaalum_wp289` database and an initial admin user.

Update the following environment variables if needed. These values should match the MySQL user that has access to the database (see the next subsection):

```
DB_HOST=localhost
DB_USER=admin
DB_PASS=merhaba123
DB_NAME=mefaalum_wp289
```

### Create the admin database user

Before running the initialization script you need a MySQL user with privileges on the `mefaalum_wp289` database. As `root`, run:

```sql
CREATE USER 'admin'@'localhost' IDENTIFIED BY 'merhaba123';
GRANT ALL PRIVILEGES ON mefaalum_wp289.* TO 'admin'@'localhost';
FLUSH PRIVILEGES;
```

Run the script with phpMyAdmin or the MySQL CLI:

```bash
mysql -u admin -p < server/init_db.sql
```

## Login API

The server exposes a `/api/login` endpoint for obtaining a JWT. User credentials
are validated against the MySQL `users` table. The included SQL script creates a
default admin user with username `admin` and password `merhaba123`.

Example request:

```bash
curl -X POST http://localhost:5000/api/login \
  -H 'Content-Type: application/json' \
  -d '{"username":"admin","password":"merhaba123"}'
```
