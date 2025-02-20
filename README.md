# Resume Analysis App

This is a Resume Analysis App that allows users to enrich and search resumes. The app uses the Google Gemini API for enriching resumes and MongoDB for storing applicant data. Sensitive data like names and emails are encrypted before being stored in the database.

## Features

- Enrich resumes using the Google Gemini API
- Store applicant data in MongoDB
- Encrypt sensitive data before storing it
- Search resumes by applicant name
- JWT-based authentication

## Technologies Used

- Node.js
- Express.js
- MongoDB
- Google Gemini API
- JWT (JSON Web Tokens)
- AES-256-CBC encryption

## Prerequisites

- Node.js and npm installed
- MongoDB Atlas account (or local MongoDB instance)
- Google Gemini API key
- Vercel account (for deployment)

## Setup

1. Clone the repository:

```sh
   git clone https://github.com/your-username/your-repository-name.git
   cd your-repository-name
```

2. Install dependencies:
 ```sh
  npm install
```

3. Create a .env file in the root directory and add the following environment variables:
   ```sh
   PORT=3000
   MONGODB_URI="your_mongodb_connection_string"
   JWT_SECRET="your_jwt_secret"
   GEMINI_API_KEY="your_gemini_api_key"
   ENCRYPTION_KEY="your_encryption_key"
   ```
4. Start the server:
   ```sh
   npm start
   ```
## API Documentation: 
- https://documenter.getpostman.com/view/37113471/2sAYdbMsYi
