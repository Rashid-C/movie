Prerequisites
Node.js (v18 or newer recommended)
npm (comes with Node.js)
MongoDB (local or remote instance)

1. Install Dependencies
2. Configure Environment Variables
   Edit the .env.local file with your MongoDB URI, JWT secret, and OMDb API key. Example:

3. Start MongoDB
   Make sure your MongoDB server is running locally or accessible remotely.

4. Run the Application
   Development Mode
   This will start both the backend API routes and the frontend Next.js app at http://localhost:3000.

Production Build 5. Access the App
Open http://localhost:3000 in your browser.

Note:

The backend API is served via Next.js API routes (see app/api).
The frontend is the Next.js React app (see app).
No separate backend server is required; everything runs via Next.js.
