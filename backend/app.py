from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import datetime
import os
from twilio.rest import Client

# Twilio credentials
TWILIO_ACCOUNT_SID = os.environ.get('TWILIO_ACCOUNT_SID', '')
TWILIO_AUTH_TOKEN = os.environ.get('TWILIO_AUTH_TOKEN', '')
TWILIO_PHONE = os.environ.get('TWILIO_PHONE', '+12316608326')

def send_sms(to_phone, message):
    try:
        client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
        client.messages.create(
            body=message,
            from_=TWILIO_PHONE,
            to=to_phone
        )
        print(f"SMS sent to {to_phone}")
    except Exception as e:
        print(f"SMS error: {e}")

app = Flask(__name__)
CORS(app)

def get_ist_time():
    utc_now = datetime.datetime.utcnow()
    ist_offset = datetime.timedelta(hours=5, minutes=30)
    ist_now = utc_now + ist_offset
    return ist_now.strftime("%Y-%m-%d %H:%M:%S")

def categorize_grievance(description):
    description_lower = description.lower()
    urgent_words = ["urgent", "emergency", "immediate", "blocked", "tomorrow", "today", "critical", "serious", "help"]
    moderate_words = ["problem", "issue", "error", "wrong", "delay", "missing", "incorrect"]
    for word in urgent_words:
        if word in description_lower:
            return "Urgent"
    for word in moderate_words:
        if word in description_lower:
            return "Moderate"
    return "Normal"

def init_db():
    conn = sqlite3.connect('grievances.db')
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS grievances (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_name TEXT NOT NULL,
        roll_number TEXT NOT NULL,
        department TEXT NOT NULL,
        grievance_type TEXT NOT NULL,
        description TEXT NOT NULL,
        status TEXT DEFAULT 'Pending',
        priority TEXT DEFAULT 'Normal',
        date_submitted TEXT NOT NULL
    )''')
    c.execute('''CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    roll_number TEXT NOT NULL UNIQUE,
    department TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    phone TEXT DEFAULT ""
)''')
    try:
    c.execute('ALTER TABLE students ADD COLUMN phone TEXT DEFAULT ""')
    except:
    pass
    c.execute('''CREATE TABLE IF NOT EXISTS admins (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
    )''')
    try:
        c.execute("INSERT INTO admins (username, password) VALUES (?, ?)", ("admin", "admin123"))
    except:
        pass
    conn.commit()
    conn.close()

@app.route('/api/grievances', methods=['GET'])
def get_grievances():
    conn = sqlite3.connect('grievances.db')
    c = conn.cursor()
    c.execute('SELECT * FROM grievances')
    rows = c.fetchall()
    conn.close()
    grievances = []
    for row in rows:
        grievances.append({
            'id': row[0], 'student_name': row[1],
            'roll_number': row[2], 'department': row[3],
            'grievance_type': row[4], 'description': row[5],
            'status': row[6], 'priority': row[7],
            'date_submitted': row[8]
        })
    return jsonify(grievances)

@app.route('/api/grievances', methods=['POST'])
def submit_grievance():
    data = request.json
    priority = categorize_grievance(data['description'])
    conn = sqlite3.connect('grievances.db')
    c = conn.cursor()
    c.execute('''INSERT INTO grievances
        (student_name, roll_number, department, grievance_type, description, priority, date_submitted)
        VALUES (?, ?, ?, ?, ?, ?, ?)''',
        (data['student_name'], data['roll_number'], data['department'],
         data['grievance_type'], data['description'], priority, get_ist_time()))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Grievance submitted!', 'priority': priority})

@app.route('/api/grievances/<int:id>/resolve', methods=['PUT'])
def resolve_grievance(id):
    conn = sqlite3.connect('grievances.db')
    c = conn.cursor()
    c.execute('UPDATE grievances SET status = ? WHERE id = ?', ('resolved', id))
    conn.commit()
    
    # Get student details to send SMS
    c.execute('''SELECT g.student_name, g.grievance_type, s.phone 
             FROM grievances g 
             LEFT JOIN students s ON g.student_name = s.name 
             WHERE g.id = ?''', (id,))
    grievance = c.fetchone()
    conn.close()
    
    # Send SMS notification
    if grievance:
        student_name = grievance[0]
        grievance_type = grievance[1]
        # Add student phone number here
        send_sms(grievance[2] if grievance[2] else '+919486715385',
            f'Dear {student_name}, your grievance about "{grievance_type}" has been resolved by admin. - Smart Grievance Portal')
    
    return jsonify({'message': 'Grievance resolved!'})
@app.route('/api/student/register', methods=['POST'])
def student_register():
    data = request.json
    try:
        conn = sqlite3.connect('grievances.db')
        c = conn.cursor()
        c.execute('INSERT INTO students (name, roll_number, department, email, password, phone) VALUES (?, ?, ?, ?, ?, ?)',
    (data['name'], data['roll_number'], data['department'], data['email'], data['password'], data.get('phone', '')))
        conn.close()
        return jsonify({'success': True, 'message': 'Registration successful!'})
    except:
        return jsonify({'success': False, 'message': 'Email or Roll Number already exists!'})

@app.route('/api/student/login', methods=['POST'])
def student_login():
    data = request.json
    conn = sqlite3.connect('grievances.db')
    c = conn.cursor()
    c.execute('SELECT * FROM students WHERE email = ? AND password = ?',
        (data['email'], data['password']))
    student = c.fetchone()
    conn.close()
    if student:
        return jsonify({
            'success': True,
            'student': {
                'name': student[1],
                'roll_number': student[2],
                'department': student[3],
                'email': student[4]
            }
        })
    return jsonify({'success': False, 'message': 'Invalid email or password!'})

@app.route('/api/admin/login', methods=['POST'])
def admin_login():
    data = request.json
    conn = sqlite3.connect('grievances.db')
    c = conn.cursor()
    c.execute('SELECT * FROM admins WHERE username = ? AND password = ?',
        (data['username'], data['password']))
    admin = c.fetchone()
    conn.close()
    if admin:
        return jsonify({'success': True, 'message': 'Admin login successful!'})
    return jsonify({'success': False, 'message': 'Invalid username or password!'})

if __name__ == '__main__':
    init_db()
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=False, host='0.0.0.0', port=port)