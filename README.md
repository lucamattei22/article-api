# To Do REST API

A robust To Do API featuring authentication and user management functionalities.

This API uses:

- Express
- MongoDB
- Zod

## API Endpoints

- `GET /api/vehicles`: Retrieve all vehicles.
- `GET /api/vehicles/:id`: Fetch a specific vehicle by its unique ID.
- `POST /api/vehicles`: Create a new vehicle.
- `PUT /api/vehicles/:id`: Modify a specific vehicle by its ID.
- `PATCH /api/vehicles/:id`: Modify a specific vehicle by its ID.
- `DELETE /api/vehicles/:id`: Delete a specific vehicle by its ID.

## Authentication

This API implements JWT (JSON Web Tokens) for authentication. To access protected routes, you must include the JWT token in the `Authorization` header of your requests. You can obtain the token by sending a `POST` request to the `/api/sessions` endpoint with valid credentials.

## User Management

- `POST /api/users`: Register a new user.
- `POST /api/sessions`: Log in with existing user credentials and create a session.
- `GET /api/auth`: Retrieve the user profile (authentication required).
- `GET /api/sessions`: Retrieve the user session.
- `DELETE /api/sessions`: Log out and terminate the session.
- `DELETE /api/users`: Delete the current user.

## Usage

### Running the API

1. Clone this repository.
2. Navigate to the project directory in your terminal.
3. Install dependencies using `npm install`.
4. Set up environment variables as needed (e.g., MongoDB URI, JWT secret).
5. Start the server by running `npm start`.

Default url is `http://localhost:3000`
