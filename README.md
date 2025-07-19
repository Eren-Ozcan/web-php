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

