# EduTok Quick Start Guide

## 🚀 Quick Commands

### Start the App (Background)
```bash
./app start
# or
./start_app.sh start
```

### Start the App with QR Code
```bash
./app start-ui
# or
./start_app.sh start-ui
```

### Stop the App
```bash
./app stop
# or
./start_app.sh stop
```

### Check Status
```bash
./app status
# or
./start_app.sh status
```

### Restart the App
```bash
./app restart
# or
./start_app.sh restart
```

### Get Help
```bash
./app help
# or
./start_app.sh help
```

## 📱 App URLs

Once started, you can access:

- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **Mobile App**: http://localhost:8081
- **Health Check**: http://localhost:8000/health

## 🔧 Features

- ✅ **Automatic startup** of both backend and mobile app
- ✅ **QR code display** with `start-ui` command
- ✅ **Process tracking** with PID files
- ✅ **Health checks** for backend
- ✅ **Colored output** for easy reading
- ✅ **Port checking** to avoid conflicts
- ✅ **Graceful shutdown** of all processes

## 📋 Prerequisites

Make sure you have:
- Python 3.8+ installed
- Node.js and npm installed
- Expo CLI installed (`npm install -g @expo/cli`)
- All dependencies installed in both `backend/` and `mobile/` directories

## 🛠️ Troubleshooting

### If apps don't start:
1. Check if ports 8000 and 8081 are available
2. Ensure all dependencies are installed
3. Check the `app.log` file for errors

### If you can't stop the apps:
1. Use `./app status` to see running processes
2. Manually kill processes if needed: `kill -9 <PID>`
3. Remove PID files: `rm -f .backend.pid .mobile.pid`

### Manual startup (if script fails):
```bash
# Backend
cd backend && python -m uvicorn app.main:app --host 0.0.0.0 --port 8000

# Mobile (in another terminal)
cd mobile && npx expo start --port 8081
``` 