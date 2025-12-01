from flask import Flask, render_template, request, redirect, url_for, session, flash, send_file
import sqlite3
import os
from database import init_db, create_user, get_user_by_username, verify_user

app = Flask(__name__)
app.secret_key = 'kali_portfolio_secret_key_2024'  # Change this in production

# Initialize database
init_db()

@app.route('/')
def index():
    if 'user_id' in session:
        return redirect(url_for('dashboard'))
    return redirect(url_for('login'))

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        
        user = verify_user(username, password)
        if user:
            session['user_id'] = user[0]
            session['username'] = user[1]
            flash(f'Welcome back, {username}!', 'success')
            return redirect(url_for('dashboard'))
        else:
            flash('Invalid credentials. Please try again or register.', 'error')
    
    return render_template('login.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        email = request.form['email']
        
        if len(username) < 3:
            flash('Username must be at least 3 characters long.', 'error')
        elif len(password) < 6:
            flash('Password must be at least 6 characters long.', 'error')
        elif get_user_by_username(username):
            flash('Username already exists. Please choose another.', 'error')
        else:
            create_user(username, password, email)
            flash('Registration successful! Please login.', 'success')
            return redirect(url_for('login'))
    
    return render_template('register.html')

@app.route('/dashboard')
def dashboard():
    if 'user_id' not in session:
        return redirect(url_for('login'))
    
    # Sample projects data
    projects = [
        {
            'id': 1,
            'name': 'Network Scanner',
            'description': 'Python-based network scanning tool using Scapy for host discovery and port scanning',
            'tech': ['Python', 'Scapy', 'Socket Programming'],
            'status': 'Completed',
            'github_url': 'https://github.com/example/network-scanner'
        },
        {
            'id': 2,
            'name': 'Web Vulnerability Scanner',
            'description': 'Automated web application security scanner detecting XSS, SQLi, and CSRF vulnerabilities',
            'tech': ['Python', 'Flask', 'SQLite', 'Requests'],
            'status': 'In Progress',
            'github_url': 'https://github.com/example/web-vuln-scanner'
        },
        {
            'id': 3,
            'name': 'Password Manager',
            'description': 'Secure local password management system with AES-256 encryption',
            'tech': ['Python', 'Cryptography', 'SQLite', 'Tkinter'],
            'status': 'Completed',
            'github_url': 'https://github.com/example/password-manager'
        },
        {
            'id': 4,
            'name': 'Terminal Snake Game',
            'description': 'Classic Snake game implemented in JavaScript with terminal-style graphics and keyboard controls',
            'tech': ['JavaScript', 'HTML5 Canvas', 'Game Development'],
            'status': 'Completed',
            'github_url': 'https://github.com/example/terminal-snake'
        },
        {
            'id': 5,
            'name': 'Packet Analyzer',
            'description': 'Network packet analysis tool with real-time traffic monitoring capabilities',
            'tech': ['Python', 'Scapy', 'PyQt5', 'Matplotlib'],
            'status': 'Planning',
            'github_url': '#'
        },
        {
            'id': 6,
            'name': 'Kali Linux Portfolio',
            'description': 'Full-stack web application mimicking Kali Linux interface for project showcasing',
            'tech': ['Python', 'Flask', 'SQLite', 'JavaScript', 'CSS3'],
            'status': 'Completed',
            'github_url': 'https://github.com/example/kali-portfolio'
        }
    ]
    
    return render_template('dashboard.html', 
                         username=session['username'],
                         projects=projects)

@app.route('/download-resume')
def download_resume():
    # Ensure user is logged in
    if 'user_id' not in session:
        return redirect(url_for('login'))
    
    # Path to your resume file
    resume_path = os.path.join(app.root_path, 'static', 'assets', 'resume.pdf')
    
    # Create assets directory if it doesn't exist
    os.makedirs(os.path.dirname(resume_path), exist_ok=True)
    
    # Create a sample resume file if it doesn't exist
    if not os.path.exists(resume_path):
        # In a real application, you would have an actual PDF file
        # For demo purposes, we'll create a simple text file and rename it
        sample_resume = os.path.join(app.root_path, 'static', 'assets', 'sample_resume.txt')
        with open(sample_resume, 'w') as f:
            f.write("Kali Linux Portfolio - Resume\n")
            f.write("=============================\n\n")
            f.write("Name: Ratnakar\n")
            f.write("Email: whoratnakar@gmail.com\n")
            f.write("Website: https://kali-portfolio.example.com\n\n")
            f.write("SKILLS:\n")
            f.write("- Network Security\n- Web Application Security\n")
            f.write("- Python Development\n- JavaScript Development\n")
            f.write("- Penetration Testing\n- Vulnerability Assessment\n\n")
            f.write("PROJECTS:\n")
            f.write("- Network Scanner Tool\n- Web Vulnerability Scanner\n")
            f.write("- Password Manager\n- Terminal Snake Game\n")
        
        # In production, you would replace this with an actual PDF file
        # For now, we'll just send the text file
        return send_file(sample_resume, as_attachment=True, download_name='resume.txt')
    
    return send_file(resume_path, as_attachment=True)

@app.route('/project/<int:project_id>')
def project_detail(project_id):
    if 'user_id' not in session:
        return redirect(url_for('login'))
    
    # In a real application, you would fetch project details from database
    projects = {
        1: {
            'name': 'Network Scanner',
            'description': 'Advanced network scanning tool...',
            'full_description': 'This project implements a comprehensive network scanning tool capable of host discovery, port scanning, and service detection using Python and Scapy library.',
            'features': ['Host discovery using ARP and ICMP', 'TCP/UDP port scanning', 'Service version detection', 'Export results to multiple formats'],
            'tech_stack': ['Python 3.8+', 'Scapy', 'Argparse', 'JSON/CSV export']
        },
        # Add other projects...
    }
    
    project = projects.get(project_id)
    if not project:
        flash('Project not found.', 'error')
        return redirect(url_for('dashboard'))
    
    return render_template('project_detail.html', project=project)

@app.route('/profile')
def profile():
    if 'user_id' not in session:
        return redirect(url_for('login'))
    
    # Get user profile from database
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    cursor.execute('SELECT username, email, created_at FROM users WHERE id = ?', (session['user_id'],))
    user = cursor.fetchone()
    conn.close()
    
    if user:
        return render_template('profile.html', 
                             username=user[0], 
                             email=user[1], 
                             joined_date=user[2])
    
    flash('User profile not found.', 'error')
    return redirect(url_for('dashboard'))

@app.route('/logout')
def logout():
    session.clear()
    flash('You have been logged out successfully.', 'success')
    return redirect(url_for('login'))

# API endpoints for future enhancements
@app.route('/api/projects')
def api_projects():
    if 'user_id' not in session:
        return {'error': 'Unauthorized'}, 401
    
    # This would typically return JSON data for AJAX requests
    projects = [
        {'id': 1, 'name': 'Network Scanner', 'status': 'completed'},
        {'id': 2, 'name': 'Web Vuln Scanner', 'status': 'in-progress'},
        # ... more projects
    ]
    return {'projects': projects}

@app.route('/api/game-score', methods=['POST'])
def api_game_score():
    if 'user_id' not in session:
        return {'error': 'Unauthorized'}, 401
    
    # In a real application, you would store game scores in database
    data = request.get_json()
    score = data.get('score', 0)
    
    # For now, just return success
    return {'status': 'success', 'score': score}

# Error handlers
@app.errorhandler(404)
def not_found_error(error):
    return render_template('404.html'), 404

@app.errorhandler(500)
def internal_error(error):
    return render_template('500.html'), 500

if __name__ == '__main__':
    # Create necessary directories
    os.makedirs('static/assets', exist_ok=True)
    
    print("Starting Kali Linux Portfolio Application...")
    print("Access the application at: http://localhost:5000")
    print("Default users: Register a new account to get started")
    print("Press Ctrl+C to stop the server")
    
    app.run(debug=True, host='0.0.0.0', port=5000)