# Mentorship Matching Project

## Overview
The Mentorship Matching Project connects mentors and mentees based on their preferences, skills, and goals. This platform facilitates meaningful professional connections, creating opportunities for learning and growth.

## Deployed URL
The application is deployed and accessible at:
[Deployed URL](https://your-deployed-url.com)

## Setup Instructions

### Prerequisites
Ensure you have the following installed:
- Node.js (v14 or later)
- PostgreSQL
- A modern web browser

### Steps

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-repo/mentorship-matching.git
   cd mentorship-matching
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Setup Environment Variables**:
   Create a `.env` file in the root directory and add the following:
   ```env
   PORT=3000
   DATABASE_URL=postgresql://<username>:<password>@localhost:5432/mentorship
   JWT_SECRET=your_jwt_secret
   ```

4. **Setup Database**:
   Run the database migrations to create the necessary tables:
   ```bash
   npm run migrate
   ```

5. **Start the Server**:
   ```bash
   npm start
   ```
   The application will run on `http://localhost:3000`.

6. **Run Frontend**:
   Navigate to the frontend directory and start the React development server:
   ```bash
   cd client
   npm install
   npm start
   ```
   The frontend will be available at `http://localhost:3001`.

## Technologies Used
- **Frontend**: React, CSS
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **Authentication**: JSON Web Tokens (JWT)
- **Deployment**: (e.g., Heroku, Vercel, AWS)

## Necessary Configurations
- Ensure the `.env` file is configured with valid credentials and secrets.
- Replace placeholders (`<username>`, `<password>`, and `your_jwt_secret`) with actual values.
- Update the deployed URL and repository URL where applicable.

---
For any issues or contributions, feel free to open an issue or pull request on the repository.
