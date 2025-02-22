# Man Ke Vichar

Man Ke Vichar is a dedicated project for diary writers. It allows users to create, update, and delete journal entries, with the option to upload images. The project also supports user authentication and authorization. Additionally, it includes a payment integration feature for premium users.

## Table of Contents
- [Man Ke Vichar](#man-ke-vichar)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Tech Stack](#tech-stack)
  - [Installation](#installation)
    - [Backend Setup](#backend-setup)
    - [Frontend Setup](#frontend-setup)
  - [Configuration](#configuration)
    - [Backend](#backend)
    - [Frontend](#frontend)
  - [Usage](#usage)
    - [Backend](#backend-1)
    - [Frontend](#frontend-1)
  - [API Endpoints](#api-endpoints)
    - [User Routes](#user-routes)
    - [Journal Routes](#journal-routes)
    - [Payment Routes](#payment-routes)
  - [Deployment](#deployment)
    - [Backend Deployment](#backend-deployment)
    - [Frontend Deployment](#frontend-deployment)
  - [License](#license)

## Features
- User authentication (JWT-based login/register)
- Create, update, delete journal entries
- Upload images using Cloudinary
- Secure user data storage with MongoDB
- Payment integration for premium features

## Tech Stack
- **Frontend:** React.js, Tailwind CSS , JavaScript
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** JSON Web Tokens (JWT)
- **Image Upload:** Cloudinary
- **Deployment:** Vercel (Frontend), Render (Backend)

## Installation
### Backend Setup
1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/mankevichar.git
   cd mankevichar
   ```
2. Navigate to the backend directory:
   ```sh
   cd backend
   ```
3. Install dependencies:
   ```sh
   npm install
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```sh
   cd frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```

## Configuration
### Backend
1. Create a `.env` file in the `backend` directory and add the following:
   ```properties
   PORT=5000
   MONGO_URL=your_mongodb_connection_string
   SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   FRONTEND_URL=http://localhost:3000
   ```

### Frontend
1. Create a `.env` file in the `frontend` directory and add the following:
   ```properties
   REACT_APP_BACKEND_URL=http://localhost:5000
   ```

## Usage
### Backend
1. Start the server:
   ```sh
   npm start
   ```
2. For development mode:
   ```sh
   npm run dev
   ```
3. The backend server will run at `http://localhost:5000`

### Frontend
1. Start the React app:
   ```sh
   npm run dev
   ```
2. The frontend will be available at `http://localhost:3000`

## API Endpoints
### User Routes
- `POST /user/register` - Register a new user
- `POST /user/login` - Login a user
- `GET /user/profile` - Get user profile (requires authentication)

### Journal Routes
- `GET /journal` - Get all public journal entries
- `GET /journal/:id` - Get a journal entry by ID
- `GET /journal/user` - Get journal entries by user ID (requires authentication)
- `POST /journal` - Create a new journal entry (requires authentication)
- `PUT /journal/:id` - Update a journal entry (requires authentication)
- `DELETE /journal/:id` - Delete a journal entry (requires authentication)

### Payment Routes
- `POST /payment/order` - Create a new payment order

## Deployment
### Backend Deployment
1. Deploy on [Render](https://render.com/):
   - Push your code to GitHub.
   - Create a new service on Render and link your repository.
   - Set environment variables in Render.

### Frontend Deployment
1. Deploy on [Vercel](https://vercel.com/):
   - Push your frontend code to GitHub.
   - Import the repository into Vercel.
   - Set the `REACT_APP_API_URL` environment variable in Vercel settings.
   - Set the `REACT_APP_RAZORPAY_KEY` environment variable in Vercel settings for Razorpay.

## License
This project is licensed under the MIT License.

