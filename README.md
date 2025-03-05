# MedRec Web App

A medical records web application with audio recording and transcription capabilities.

## Features

- Admin dashboard for system configuration
- Doctor dashboard for patient consultations
- Audio recording and transcription
- Secure authentication system

## Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Fill in your credentials in the `.env` file
   ```
   cp .env.example .env
   ```
4. Start the development server:
   ```
   npm run dev
   ```

## Environment Variables

The application uses environment variables for secure credential storage. These are not committed to the repository for security reasons.

Required environment variables:
- `VITE_ADMIN_USERNAME`: Username for admin access
- `VITE_ADMIN_PASSWORD`: Password for admin access
- `VITE_DOCTOR_USERNAME`: Username for doctor access
- `VITE_DOCTOR_PASSWORD`: Password for doctor access

## Security

- Credentials are stored in environment variables, not in the code
- Passwords are hashed before comparison
- Role-based access control for different dashboards
