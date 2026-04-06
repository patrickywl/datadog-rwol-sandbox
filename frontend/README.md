# Datadog RWOL Sandbox

## 📖 Overview
This project is a sample front-end web application designed to help you test and explore Datadog RUM features.

## ⚡ How to Run Locally
Please follow the steps below to start this application.

### 1. Configure Datadog RUM Credentials
Create a RUM application in Datadog and take note of your `applicationId` and `clientToken`.

Open the `.env` file in the root directory and update it with your credentials:
- Replace `<YOUR_RUM_APPLICATION_ID>` with your own `applicationId`.
- Replace `<YOUR_RUM_CLIENT_TOKEN>` with your own `clientToken`.

### 2. Install Dependencies
Run the following command to install the necessary node modules.

```bash
npm install
```

### 3. Start the Development Server
Start the local server to run the application.
```bash
npm run dev
```