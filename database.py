import sqlite3
import hashlib
import os
from datetime import datetime

def get_db_connection():
    conn = sqlite3.connect('database.db')
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    
    # Create users table
    conn.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            email TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            last_login TIMESTAMP
        )
    ''')
    
    # Create projects table for future enhancements
    conn.execute('''
        CREATE TABLE IF NOT EXISTS projects (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            name TEXT NOT NULL,
            description TEXT,
            technologies TEXT,
            status TEXT DEFAULT 'planning',
            github_url TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')
    
    # Create game_scores table for snake game
    conn.execute('''
        CREATE TABLE IF NOT EXISTS game_scores (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            game_name TEXT NOT NULL,
            score INTEGER NOT NULL,
            played_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')
    
    conn.commit()
    conn.close()
    
    print("Database initialized successfully!")

def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

def create_user(username, password, email):
    conn = get_db_connection()
    hashed_password = hash_password(password)
    
    try:
        conn.execute(
            'INSERT INTO users (username, password, email) VALUES (?, ?, ?)',
            (username, hashed_password, email)
        )
        conn.commit()
        print(f"User '{username}' created successfully!")
        return True
    except sqlite3.IntegrityError:
        return False
    finally:
        conn.close()

def get_user_by_username(username):
    conn = get_db_connection()
    user = conn.execute(
        'SELECT * FROM users WHERE username = ?', (username,)
    ).fetchone()
    conn.close()
    return user

def get_user_by_id(user_id):
    conn = get_db_connection()
    user = conn.execute(
        'SELECT * FROM users WHERE id = ?', (user_id,)
    ).fetchone()
    conn.close()
    return user

def verify_user(username, password):
    user = get_user_by_username(username)
    if user and user['password'] == hash_password(password):
        # Update last login time
        conn = get_db_connection()
        conn.execute(
            'UPDATE users SET last_login = ? WHERE id = ?',
            (datetime.now(), user['id'])
        )
        conn.commit()
        conn.close()
        return user
    return None

def update_last_login(user_id):
    conn = get_db_connection()
    conn.execute(
        'UPDATE users SET last_login = ? WHERE id = ?',
        (datetime.now(), user_id)
    )
    conn.commit()
    conn.close()

def add_project(user_id, name, description, technologies, status='planning', github_url=None):
    conn = get_db_connection()
    try:
        conn.execute(
            '''INSERT INTO projects 
               (user_id, name, description, technologies, status, github_url) 
               VALUES (?, ?, ?, ?, ?, ?)''',
            (user_id, name, description, technologies, status, github_url)
        )
        conn.commit()
        return True
    except Exception as e:
        print(f"Error adding project: {e}")
        return False
    finally:
        conn.close()

def get_user_projects(user_id):
    conn = get_db_connection()
    projects = conn.execute(
        'SELECT * FROM projects WHERE user_id = ? ORDER BY created_at DESC',
        (user_id,)
    ).fetchall()
    conn.close()
    return projects

def save_game_score(user_id, game_name, score):
    conn = get_db_connection()
    try:
        conn.execute(
            'INSERT INTO game_scores (user_id, game_name, score) VALUES (?, ?, ?)',
            (user_id, game_name, score)
        )
        conn.commit()
        return True
    except Exception as e:
        print(f"Error saving game score: {e}")
        return False
    finally:
        conn.close()

def get_high_scores(game_name, limit=10):
    conn = get_db_connection()
    scores = conn.execute(
        '''SELECT u.username, gs.score, gs.played_at 
           FROM game_scores gs 
           JOIN users u ON gs.user_id = u.id 
           WHERE gs.game_name = ? 
           ORDER BY gs.score DESC 
           LIMIT ?''',
        (game_name, limit)
    ).fetchall()
    conn.close()
    return scores