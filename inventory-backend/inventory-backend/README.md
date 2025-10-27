Inventory Backend (Node + Express)
=================================
Files included:
- app.js
- db.js
- routes/ (employees, devices, transmittals, downloads)
- package.json
- .env (example)
- schema.sql (MySQL schema you can import)

Quick start:
1. Ensure MySQL (XAMPP) is running and import schema.sql into a database named `asset_inventory`.
2. Edit `.env` if your MySQL credentials differ.
3. Run:
   npm install
   npm run start
4. Server runs on http://localhost:4000

API base: http://localhost:4000/api
