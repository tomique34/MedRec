# Audio Recorder with Webhook Integration

A modern web application that allows users to record audio from their microphone and send it to a specified webhook URL.

## Features

- Record audio from the user's microphone
- Preview recorded audio before submission
- Send recorded audio to a configurable webhook URL
- Support for Basic Authentication
- Clean, modern UI with status indicators
- Error handling for common issues

## Requirements

- Modern web browser with microphone access
- Node.js and npm installed

## Installation

1. Clone this repository
2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open the application in your browser (usually at http://localhost:5173)

## Usage

1. Enter your webhook URL in the input field
2. Select authentication type if required:
   - None: No authentication (default)
   - Basic Auth: Provide username and password for HTTP Basic Authentication
3. Click the microphone button to start recording
4. Click the square button to stop recording
5. Use the play button to preview your recording
6. Click the send button to upload the recording to the webhook

## Technical Details

- Built with React and TypeScript
- Uses the browser's MediaRecorder API for audio recording
- Sends audio as a WAV file in a FormData object
- Uses a POST request to the specified webhook URL
- Supports HTTP Basic Authentication

## Permissions

This application requires microphone access. When you first attempt to record, your browser will prompt you to allow access to your microphone. You must grant this permission for the application to work.

## Webhook Requirements

The webhook endpoint should be configured to accept:
- HTTP POST requests
- multipart/form-data content type
- A form field named 'audio' containing the WAV file

### Authentication

If your webhook requires authentication:

1. **Basic Authentication**: Select "Basic Auth" and enter your username and password. The application will encode these credentials and include them in the Authorization header.

### Troubleshooting Webhook Issues

If you encounter errors when submitting recordings:

1. **404 Not Found**: Verify that your webhook URL is correct and the endpoint exists
2. **401 Unauthorized**: Check that your authentication credentials are correct
3. **403 Forbidden**: The webhook may require different authentication or you may not have permission
4. **CORS Errors**: The webhook server must include appropriate CORS headers:
   ```
   Access-Control-Allow-Origin: *  (or your specific domain)
   Access-Control-Allow-Methods: POST, OPTIONS
   Access-Control-Allow-Headers: Content-Type, Authorization
   ```
5. **413 Payload Too Large**: Some servers limit the size of uploads. Try recording a shorter audio clip.
6. **Network Errors**: Check your internet connection and ensure the webhook server is running.

## Building for Production

To build the application for production:

```bash
npm run build
```

The built files will be in the `dist` directory and can be deployed to any static hosting service.