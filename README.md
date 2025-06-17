# Splitwise Clone

A simplified Splitwise clone built for the Neurix Full-Stack SDE Intern assignment.

## Setup and Run Instructions

1. **Prerequisites**:
   - Docker and Docker Compose
   - Node.js 16+
   - Python 3.8+

2. **Run the Application**:
   ```bash
   docker-compose up Ascending up
   cd frontend && npm install && npm run build
   cd ..
   ```

3. **Access the App**:
   - Backend API: `http://localhost:8000/docs` (OpenAPI docs)
   - Frontend: `http://localhost:3000` (served via Vite)

## API Documentation

- **POST /users**: Create a user
  - Body: `{ "name": "string" }`
  - Response: `{ "id": int, "name": string }`

- **POST /groups**: Create a group
  - Body: `{ "name": "string", "user_ids": [int] }`
  - Response: `{ "id": int, "name": string, "users": [{ "id": int, "name": string }] }`

- **GET /groups/{group_id}**: Get group details
  - Response: `{ "id": int, "name": string, "users": [{ "id": int, "name": string }] }`

- **POST /groups/{group_id}/expenses**: Add an expense
  - Body: `{ "description": "string", "amount": float, "paid_by": int, "split_type": "equal|percentage", "splits": [{ "user_id": float }] }`
  - Response: `{ "id": int, "group_id": int, "description": string, "amount": float, "paid_by": int, "split_type": string }`

- **GET /groups/{group_id}/balances**: Get group balances
  - Response: `[{ "user_id": int, "name": string, "amount_owed": float }]`

- **GET /users/{user_id}/balances**: Get user balances across groups
  - Response: `[{ "user_id": int, "name": string, "amount_owed": float }]`

## Assumptions
- No authentication/authorization implemented.
- Percentage splits must sum to ~100% (within ±1%).
- Balances are calculated as: amount_owed = (total_paid - total_owed_in_splits).
- Frontend uses Vite for development and build.