# MERN Note Taking App

This is a simple note-taking application built using the MERN stack (MongoDB, Express.js, React, Node.js). The application allows users to create, edit, and delete notes. Authentication is handled using JWT (JSON Web Token).

## Features

- **User Authentication**: Users can sign up, log in, and log out. Authentication is managed with JWT.
- **Create Notes**: Authenticated users can create new notes.
- **Edit Notes**: Users can edit their existing notes.
- **Delete Notes**: Users can delete their notes.
- **View Notes**: Notes are displayed with a title, content, and tags.

## Technologies Used

- **Frontend**: React.js, CSS (TailwindCSS)
- **Backend**: Node.js, Express.js
- **Database**: MongoDB, Mongoose
- **Authentication**: JWT (JSON Web Token)
- **Other Tools**: Axios, Moment.js, SweetAlert2

## How to run the app on your device

### Prerequisites

Before you begin, ensure you have the following installed on your local machine:

- [Node.js](https://nodejs.org/) (v14 or later)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [MongoDB](https://www.mongodb.com/) (running locally or using MongoDB Atlas)

**1 --  Navigate to the backend folder and install the dependencies by running the code below**
``` 
cd backend
npm i
```

**2 --  Navigate to the frontend/notes-app folder and do the same**
``` 
cd frontend/notes-app
npm i
```

**3 -- In the backend directory, create a '.env' file that contains your own access token secret (could be anything, it's personal)
```
ACCESS_TOKEN_SECRET = yourOwnAccessTokenSecret
```
**4 -- In the backend directory create a 'config.json' file that contains the connection string for the mongoDB database cluster
you can get that by starting your own cluster on the official mongoDB website, it usually looks similar to this:
```
{
    "connectionString": "mongodb+srv://your-username:your-password@cluster0.mongodb.net/your-database-name?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key"
}
```

**5 -- Now you should run two separate terminals on your VS Code, one for the frontend and one for the backend
** For the backend, run the command:
```
npm start
```
** For the frontend, run the command:
```
npm run dev
```

**6 -- The app is now running on 'http://localhost:5173'
