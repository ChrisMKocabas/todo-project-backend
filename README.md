# Complete Backend Service with JWT User Authentication and HTTP Cookie Approach for Optimal Security 
This repository is for an API that allows users to register, login, create and manage reviews of products or services. The API is built using Node.js. Backend uses: 
Express for router,
MongoDB as the database, 
JWT for Authentication,
Saves Tokens to HTTP Cookie for extra security,
and uses Joi as form validation middleware.

## Installation
Clone the repository using git clone
Install dependencies by running npm install
Rename .env.example to .env and update the values as required
Start the server by running npm start

## Dependencies
mongoose
express
dotenv
jsonwebtoken
date-fns

## API Endpoints
POST /api/reviews - Create a new review
GET /api/reviews - Get all reviews
GET /api/reviews/:id - Get a specific review by id
PUT /api/reviews/:id - Update a specific review by id
DELETE /api/reviews/:id - Delete a specific review by id

## Middleware
credentials - Checks the origin of the request and adds the appropriate headers for CORS.
errorHandler - Handles any errors that occur during the request.
logger - Logs every request that is made to the API.
verifyJWT - Verifies the JSON Web Token sent in the request headers.
verifyUserPrivilige - Verifies that the user making the request has the necessary privilege to perform the action.

## Models
User - Defines the schema for a user, including their ID, email, password, full name, address, date of birth, refresh token, and any reviews they have created.
Review - Defines the schema for a review, including the ID of the author, the author's name, the review's ID, the title, the content, and the date it was created.
Contributors

Chris Kocabas - chriskocabas@outlook.com

### License
This code is released under the MIT License.