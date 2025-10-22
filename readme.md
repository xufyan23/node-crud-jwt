# Node File Upload & Download API

This module demonstrates how to:

- Upload a file using Multer middleware
- Validate file size using custom middleware
- Returns 404 if the file does not exist
- Download files with progress bar logging.
- Log real-time read progress using stream events

### How it works

When `/upload` is called:

1. Multer saves the file in `/uploads` folder
2. `validateFileSize` checks if it's 100 MB exactly
3. If valid, we can later call `/download` to stream it

During `/download`:

- The file is read in small chunks using a stream
- Each `data` event updates the read progress
- Progress (%) is logged in real-time in the console
- The stream pipes the data to the client
