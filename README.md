# lingoboost_backend

![Node.js](https://img.shields.io/badge/Node.js-18.x-green)
![Express](https://img.shields.io/badge/Express-4.x-lightgrey)
![MongoDB](https://img.shields.io/badge/MongoDB-6.x-green)

This is the backend server for a language learning application. It provides RESTful APIs for user authentication, game management (quizzes, flashcards, bingo, word guessing), and administrative functions.

## Features
User authentication (registration, login, JWT)

Admin dashboard with user management

Multiple language learning games:

Quizzes

Flashcards

Bingo

Word guessing

Drag and drop exercises

User activity logging

Multi-language support

## Technologies
Node.js

Express.js

MongoDB (with Mongoose)

JWT for authentication

Bcrypt for password hashing

CORS for cross-origin requests

Dotenv for environment variables

## Installation


## Installation

### 1. Clone the repository
```bash
git clone https://github.com/zwezdica/lingoboost_backend.git
cd lingoboost_backend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Create a .env file in the root directory with:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

### 4. Start the server
```bash
npm start
```

## API Endpoints

### Authentication
POST /api/auth/register - Register a new user    
POST /api/auth/login - Login user    

### Users
GET /api/users - Get all users (admin only)    
GET /api/users/info - Get current user info    
PUT /api/users/:id - Update user (admin only)    
DELETE /api/users/:id - Delete user (admin only)    

### Admin
GET /api/admin/users - Get all users with pagination    
GET /api/admin/logs - Get login logs    
DELETE /api/admin/logs/:id - Delete login log (admin only)    

## Games

### Quizzes

GET /api/quizzes/:language - Get quizzes by language    
POST /api/quizzes - Create quiz (admin only)    
PUT /api/quizzes/:id - Update quiz (admin only)    
DELETE /api/quizzes/:id - Delete quiz (admin only)    

### Flashcards

GET /api/flashcards/:lang - Get flashcards by language    
POST /api/flashcards - Add flashcard (admin only)       
PUT /api/flashcards/:id - Update flashcard (admin only)     
DELETE /api/flashcards/:id - Delete flashcard (admin only)      

### Bingo

GET /api/bingo/words - Get bingo words (with level parameter)     
POST /api/bingo/check - Check translation     
POST /api/bingo/words - Add word (admin only)    
DELETE /api/bingo/words/:wordId - Delete word (admin only)     

### Guess Words

GET /api/guessWords/start - Start game     
GET /api/guessWords/guess/:letter - Guess letter     
POST /api/guessWords/words - Add word (admin only)     
PUT /api/guessWords/words/:wordId - Update word (admin only)     
DELETE /api/guessWords/words/:wordId - Delete word (admin only)      

### Drag & Drop

GET /api/dragdrops/:lang - Get words by language      
POST /api/dragdrops - Add word (admin only)      
PUT /api/dragdrops/:id - Update word (admin only)      
DELETE /api/dragdrops/:id - Delete word (admin only)      

## Models
### User:
username     
email     
password (hashed)     
role (user/admin)     
language preference     

### LoginLog
userId     
username      
timestamp     

### Game Models
Quiz     
Flashcard     
BingoWord     
GuessWord      
DragDropWord     

Each game model contains word data with translations for different languages.

## Security
JWT authentication for protected routes       
Role-based access control (admin/user)      
Password hashing with bcrypt      
Input validation      
Secure headers with CORS configuration      


