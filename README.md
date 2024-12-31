# AspireAlly - A Mentorship Matching Platform

## Deployed URL

The application is deployed and accessible at:
https://aspireally.onrender.com/

## Overview

AspireAlly is a platform that connects mentors and mentees based on shared skills, interests, and professional goals. The application is built using React on the frontend and a backend Node.js with secure authentication mechanisms.

---

## Features

### 1. User Authentication and Profiles

- Secure login and registration using JSON Web Tokens (JWT).
- User profiles include:
  - **Username**: A unique identifier for each user.
  - **Role**: Users can register as either a **mentor** or a **mentee**.
  - **Bio**: A short description of the user.
  - **Skills**: Highlight the skills or areas of expertise.
  - **Interests**: Specify interests to help in mentorship pairing.

### 2. Search and Filtering

- Users can search for mentors or mentees based on:
  - **Skills**: Find users with specific expertise.
  - **Interests**: Match users with similar hobbies or professional goals.
  - **Role**: Filter by mentors or mentees.
- Dynamic search bar and dropdown filters for easy navigation.

### 3. Edit and Update Profiles

- Users can edit their profiles, including:
  - Username
  - Bio
  - Skills
  - Interests
  - Role (Mentor/Mentee)
- Seamless experience with instant feedback on updates.

### 4. User List and Details

- Display a searchable and filterable list of mentors and mentees.
- Click on a user to view detailed profile information, including:
  - Full bio
  - Skills and interests
  - Role

### 5. Connections Management

- **Connection Requests**:
  - Mentors and mentees can send and receive connection requests.
- **View Connections**:
  - View all active mentorship connections.
- Accept or decline connection requests with a simple interface.

### 6. Secure Data Handling

- Authentication ensures only authorized users can access the application.
- Role-based access for mentor and mentee-specific features.
- HTTPS for secure communication (when deployed).

### 7. Profile Deletion

- Users can delete their profiles permanently.
- Confirmation prompts ensure accidental deletions are avoided.

---

## Technologies Used

- **Backend**: Node.js, Express
- **Frontend**: React, CSS
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **Development Tools**: Nodemon, Axios, React Router

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

For any issues or contributions, feel free to open an issue or pull request on the repository.
