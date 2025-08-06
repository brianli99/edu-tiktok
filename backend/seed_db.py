#!/usr/bin/env python3
"""
Database seeding script for EduTok backend
"""

import sys
import os

# Add the app directory to the Python path
sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

from app.database import get_db
from app.utils.seed_data import seed_database


def main():
    """Main function to seed the database"""
    print("Starting database seeding...")
    
    # Get database session
    db = next(get_db())
    
    try:
        # Seed the database
        seed_database(db)
        print("Database seeding completed successfully!")
    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    main() 