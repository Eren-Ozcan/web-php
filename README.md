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

The backend now uses **MySQL** for authentication. A sample SQL script is provided in `server/init_db.sql` to create the `mefaaluminyum_wp289` database and an initial admin user.

Update the following environment variables if needed. These values should match the MySQL user that has access to the database (see the next subsection):

```
DB_HOST=localhost
DB_USER=admin
DB_PASS=1234
DB_NAME=mefaaluminyum_wp289
```

For sending contact form emails you also need to define `MAIL_PASS` in a `.env`
file. An `.env.example` template is included with all required variables.

### Create the admin database user

Before running the initialization script you need a MySQL user with privileges on the `mefaaluminyum_wp289` database. As `root`, run:

```sql
CREATE USER 'admin'@'localhost' IDENTIFIED BY '1234';
GRANT ALL PRIVILEGES ON mefaaluminyum_wp289.* TO 'admin'@'localhost';
FLUSH PRIVILEGES;
```

Run the script with phpMyAdmin or the MySQL CLI:

```bash
mysql -u admin -p < server/init_db.sql
```

The script also creates `content`, `translations` and `pricing` tables which
store the website data edited from the admin panel. Any changes made in the
admin panel are written back to these tables and to the JSON files. On first
launch, if the tables are empty, the server seeds them from the files under
`server/data`. Running the script is still recommended to set up the initial
admin user.

## Login API

The server exposes a `/api/login` endpoint for obtaining a JWT. User credentials
are validated against the MySQL `users` table. The included SQL script creates a
default admin user with username `admin` and password `1234`.

Example request:

```bash
curl -X POST http://localhost:5000/api/login \
  -H 'Content-Type: application/json' \
  -d '{"username":"admin","password":"1234"}'
```

## Content & Translations APIs

The admin panel communicates with the following endpoints to load and save
website data:

- `GET /api/content` – returns the current JSON content structure.
- `POST /api/content` – accepts the updated JSON from the admin panel and
  persists it.
- `GET /api/translations` – returns all translation strings.
- `POST /api/translations` – saves updated translations.

Both `POST` endpoints update the MySQL tables and also write to the JSON files
under `server/data` so that the data is available even if the database is not
pre-populated.

## Additional APIs

- `GET /api/pricing` – returns the current pricing configuration.
- `POST /api/pricing` – saves updated pricing data.
- `GET /api/projects` – lists projects; add `?highlight=true` to only return
  featured projects.
- `POST /api/contact` – receives name, email and message from the contact form
  and sends them via Nodemailer as an HTML email. The endpoint also sends a
  personalized thank‑you email back to the user.

## Slider Management

The admin interface includes a section for managing the home page slider. Administrators can add or remove slides and define interactive hotspots for each image. Hotspots support configurable position percentages, labels, two-language tooltips, colors and product routes. All data is stored in the `content.sliders` array and loaded through the `ContentContext` so changes appear immediately on the front page.

