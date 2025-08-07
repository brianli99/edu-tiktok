#!/bin/bash

# Simple alias for the EduTok app management script
# Usage: ./app [start|stop|status|restart]

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Call the main startup script
"$SCRIPT_DIR/start_app.sh" "$@" 