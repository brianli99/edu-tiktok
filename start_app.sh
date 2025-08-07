#!/bin/bash

# EduTok App Startup Script
# Usage: ./start_app.sh [start|stop|status|restart]

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# App configuration
BACKEND_PORT=8000
MOBILE_PORT=8081
BACKEND_PID_FILE=".backend.pid"
MOBILE_PID_FILE=".mobile.pid"
LOG_FILE="app.log"

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}  EduTok App Management Script${NC}"
    echo -e "${BLUE}================================${NC}"
}

# Function to check if a port is in use
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        return 0
    else
        return 1
    fi
}

# Function to get PID from file
get_pid() {
    local pid_file=$1
    if [ -f "$pid_file" ]; then
        cat "$pid_file"
    else
        echo ""
    fi
}

# Function to check if process is running
is_process_running() {
    local pid=$1
    if [ -n "$pid" ] && ps -p "$pid" > /dev/null 2>&1; then
        return 0
    else
        return 1
    fi
}

# Function to start backend
start_backend() {
    print_status "Starting backend server..."
    
    if check_port $BACKEND_PORT; then
        print_warning "Backend is already running on port $BACKEND_PORT"
        return 1
    fi
    
    cd backend
    python -m uvicorn app.main:app --host 0.0.0.0 --port $BACKEND_PORT > "../$LOG_FILE" 2>&1 &
    BACKEND_PID=$!
    echo $BACKEND_PID > "../$BACKEND_PID_FILE"
    cd ..
    
    # Wait a moment for the server to start
    sleep 3
    
    if check_port $BACKEND_PORT; then
        print_status "Backend started successfully (PID: $BACKEND_PID)"
        return 0
    else
        print_error "Failed to start backend"
        return 1
    fi
}

# Function to start mobile app
start_mobile() {
    print_status "Starting mobile app..."
    
    if check_port $MOBILE_PORT; then
        print_warning "Mobile app is already running on port $MOBILE_PORT"
        return 1
    fi
    
    cd mobile
    npx expo start --port $MOBILE_PORT > "../$LOG_FILE" 2>&1 &
    MOBILE_PID=$!
    echo $MOBILE_PID > "../$MOBILE_PID_FILE"
    cd ..
    
    # Wait a moment for the server to start
    sleep 5
    
    if check_port $MOBILE_PORT; then
        print_status "Mobile app started successfully (PID: $MOBILE_PID)"
        return 0
    else
        print_error "Failed to start mobile app"
        return 1
    fi
}

# Function to stop backend
stop_backend() {
    local pid=$(get_pid $BACKEND_PID_FILE)
    
    if [ -n "$pid" ] && is_process_running $pid; then
        print_status "Stopping backend (PID: $pid)..."
        kill $pid
        rm -f $BACKEND_PID_FILE
        print_status "Backend stopped"
    else
        print_warning "Backend is not running"
    fi
}

# Function to stop mobile app
stop_mobile() {
    local pid=$(get_pid $MOBILE_PID_FILE)
    
    if [ -n "$pid" ] && is_process_running $pid; then
        print_status "Stopping mobile app (PID: $pid)..."
        kill $pid
        rm -f $MOBILE_PID_FILE
        print_status "Mobile app stopped"
    else
        print_warning "Mobile app is not running"
    fi
}

# Function to show status
show_status() {
    echo -e "${BLUE}App Status:${NC}"
    echo ""
    
    # Check backend
    local backend_pid=$(get_pid $BACKEND_PID_FILE)
    if [ -n "$backend_pid" ] && is_process_running $backend_pid; then
        echo -e "${GREEN}✓ Backend: Running (PID: $backend_pid)${NC}"
    elif check_port $BACKEND_PORT; then
        echo -e "${YELLOW}⚠ Backend: Port $BACKEND_PORT in use (PID not tracked)${NC}"
    else
        echo -e "${RED}✗ Backend: Not running${NC}"
    fi
    
    # Check mobile app
    local mobile_pid=$(get_pid $MOBILE_PID_FILE)
    if [ -n "$mobile_pid" ] && is_process_running $mobile_pid; then
        echo -e "${GREEN}✓ Mobile App: Running (PID: $mobile_pid)${NC}"
    elif check_port $MOBILE_PORT; then
        echo -e "${YELLOW}⚠ Mobile App: Port $MOBILE_PORT in use (PID not tracked)${NC}"
    else
        echo -e "${RED}✗ Mobile App: Not running${NC}"
    fi
    
    echo ""
    echo -e "${BLUE}URLs:${NC}"
    echo "Backend API: http://localhost:$BACKEND_PORT"
    echo "Mobile App: http://localhost:$MOBILE_PORT"
    echo "API Docs: http://localhost:$BACKEND_PORT/docs"
}

# Function to start both apps
start_apps() {
    print_header
    print_status "Starting EduTok application..."
    echo ""
    
    # Start backend
    if start_backend; then
        print_status "Backend health check..."
        sleep 2
        if curl -s http://localhost:$BACKEND_PORT/health > /dev/null 2>&1; then
            print_status "Backend is healthy"
        else
            print_warning "Backend health check failed"
        fi
    fi
    
    echo ""
    
    # Start mobile app
    if start_mobile; then
        print_status "Mobile app is ready"
        print_status "Scan QR code with Expo Go app or visit http://localhost:$MOBILE_PORT"
    fi
    
    echo ""
    show_status
}

# Function to stop both apps
stop_apps() {
    print_header
    print_status "Stopping EduTok application..."
    echo ""
    
    stop_backend
    stop_mobile
    
    echo ""
    print_status "All apps stopped"
}

# Function to restart apps
restart_apps() {
    print_header
    print_status "Restarting EduTok application..."
    echo ""
    
    stop_apps
    sleep 2
    start_apps
}

# Function to show help
show_help() {
    print_header
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  start     Start both backend and mobile app"
    echo "  stop      Stop both backend and mobile app"
    echo "  restart   Restart both apps"
    echo "  status    Show current status of apps"
    echo "  help      Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 start    # Start the application"
    echo "  $0 stop     # Stop the application"
    echo "  $0 status   # Check app status"
    echo ""
}

# Main script logic
case "${1:-help}" in
    start)
        start_apps
        ;;
    stop)
        stop_apps
        ;;
    restart)
        restart_apps
        ;;
    status)
        print_header
        show_status
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        print_error "Unknown command: $1"
        echo ""
        show_help
        exit 1
        ;;
esac 