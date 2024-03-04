# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
from database import db
from models import Department, Provider, Appointment, AccessRequest, Patient
import json
from datetime import datetime

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///tcrmed.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Enable CORS for all routes
CORS(app)

db.init_app(app)

def initialize_database():
    db.create_all()
    load_departments()
    load_providers()
    load_appointments()
    load_accessrequests()

'''Department'''
# Initial data loading: Department
def load_departments():
    if Department.query.first() is None:
        with open('data/departments.json') as file:
            departments = json.load(file)
            for department in departments:
                row = Department(name=department['name'],
                                 description=department['description'])
                db.session.add(row)
            db.session.commit()

# Add API endpoint to fetch and return the contents of the Department table
@app.route('/api/departments', methods=['GET'])
def get_departments():
    departments = Department.query.all()
    return jsonify([{'id' : department.id,
                     'name' : department.name,
                     'description' : department.description} 
                     for department in departments])


'''Provider'''

# Initial data loading: Provider
def load_providers():
    if Provider.query.first() is None:
        with open('data/providers.json') as file:
            providers = json.load(file)
            for provider in providers:
                row = Provider(first_name=provider['first_name'],
                               last_name=provider['last_name'],
                               degree=provider['degree'],
                               role=provider['role'],
                               department_id=provider['department_id'])
                db.session.add(row)
            db.session.commit()

# Add API endpoint to fetch and return the contents of the Provider table
@app.route('/api/providers', methods=['GET'])
def get_providers():
    providers = Provider.query.all()
    return jsonify([{'id' : provider.id,
                     'first_name' : provider.first_name,
                     'last_name' : provider.last_name,
                     'degree' : provider.degree,
                     'role' : provider.role,
                     'department' : {'id' : provider.department_id,
                                     'name' : provider.department.name}}
                     for provider in providers])


'''Appointment'''

# Initial data loading: Appointment
def load_appointments():
    if Appointment.query.first() is None:
        with open('data/appointments.json') as file:
            appointments = json.load(file)
            for appointment in appointments:
                row = Appointment(provider_id=appointment['provider_id'],
                                   date=datetime.strptime(appointment['date'], '%Y-%m-%d').date(),
                                   start_time=datetime.strptime(appointment['start_time'], '%H:%M').time(),
                                   is_available=appointment['is_available'],
                                   patient_id=appointment['patient_id'] if appointment['patient_id'] else None,
                                   booked_at=appointment['booked_at'] if appointment['booked_at'] else None)
                db.session.add(row)
            db.session.commit()

# Add API endpoint to fetch and return the contents of the Appointment table
@app.route('/api/appointments', methods=['GET'])
def get_appointments():
    appointments = Appointment.query.all()
    return jsonify([{'id' : appointment.id,
                     'provider' : {'id' : appointment.provider_id,
                                   'first_name' : appointment.provider.first_name,
                                   'last_name' : appointment.provider.last_name,
                                   'department' : appointment.provider.department.name},
                     'date' : str(appointment.date),
                     'start_time' : str(appointment.start_time),
                     'is_available' : appointment.is_available,
                     'patient' : {'id' : appointment.patient_id if appointment.patient_id else None,
                                  'first_name' : appointment.patient.first_name if appointment.patient else None,
                                  'last_name' : appointment.patient.last_name if appointment.patient else None,
                                  'email' : appointment.patient.email if appointment.patient else None,
                                  'phone' : appointment.patient.phone if appointment.patient else None},
                     'booked_at' : appointment.booked_at if appointment.booked_at else None}
                     for appointment in appointments])

# Filter available appointments
@app.route('/api/appointments/available', methods=['GET'])
def get_available_appointments():
    available_appointments = Appointment.query.filter_by(is_available=True).all()
    return jsonify([{'id' : appointment.id,
                     'provider' : {'id' : appointment.provider_id,
                                   'first_name' : appointment.provider.first_name,
                                   'last_name' : appointment.provider.last_name,
                                   'department' : appointment.provider.department.name},
                     'date' : str(appointment.date),
                     'start_time' : str(appointment.start_time),
                     'is_available' : appointment.is_available}
                     for appointment in available_appointments])

# Update appointment when booked
@app.route('/api/appointments/<int:appointment_id>/book', methods=['PUT'])
def book_appointment(appointment_id):
    data = request.json
    appointment = Appointment.query.get(appointment_id)
    if not appointment:
        return jsonify({"error": "Appointment not found"}), 404
    
    try:
        appointment.is_available = False
        appointment.patient_id = data.get('patient_id')
        appointment.booked_at = datetime.utcnow()
        db.session.commit()
        return jsonify({"message": "Appointment booked successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

'''AccessRequest'''


# Initial data loading: AccessRequest
def load_accessrequests():
    if AccessRequest.query.first() is None:
        with open('data/accessrequests.json') as file:
            accessrequests = json.load(file)
            for accessrequest in accessrequests:
                row = AccessRequest(first_name=accessrequest['first_name'],
                                    last_name=accessrequest['last_name'],
                                    dob=datetime.strptime(accessrequest['dob'], '%Y-%m-%d').date(),
                                    gender=accessrequest['gender'],
                                    email=accessrequest['email'],
                                    phone=accessrequest['phone'],
                                    request_type=accessrequest['request_type'],
                                    status=accessrequest['status'],
                                    auth0_id=accessrequest['auth0_id'],
                                    created_at=datetime.strptime(accessrequest['created_at'], '%Y-%m-%d').date(),
                                    solved_at=datetime.strptime(accessrequest['solved_at'], '%Y-%m-%d').date() if accessrequest['solved_at'] else None)
                db.session.add(row)
            db.session.commit()

# Add API endpoint to fetch and return the contents of the AccessRequest table
@app.route('/api/accessrequests', methods=['GET'])
def get_accessrequests():
    accessrequests = AccessRequest.query.all()
    return jsonify([{'id' : accessrequest.id,
                     'first_name' : accessrequest.first_name,
                     'last_name' : accessrequest.last_name,
                     'dob' : str(accessrequest.dob),
                     'gender' : accessrequest.gender,
                     'email' : accessrequest.email,    
                     'phone' : accessrequest.phone,  
                     'request_type' : accessrequest.request_type,                   
                     'status' : accessrequest.status,
                     'auth0_id' : accessrequest.auth0_id,  
                     'created_at' : str(accessrequest.created_at),
                     'solved_at' : str(accessrequest.solved_at) if accessrequest.solved_at else None} 
                     for accessrequest in accessrequests])

# Add API endpoint to handle form submission and insert a new AccessRequest record
@app.route('/api/accessrequests/submit', methods=['POST'])
def submit_accessrequest():
    try:
        data = request.json
        new_request = AccessRequest(
            first_name=data['firstName'],
            last_name=data['lastName'],
            dob=datetime.strptime(data['dob'], '%Y-%m-%d').date(),
            gender=data['gender'],
            email=data['email'],
            phone=data['phone'],
            request_type=data['request'],
            status='Pending',
            auth0_id=data['auth0_id'],
            created_at=datetime.utcnow()
        )
        db.session.add(new_request)
        db.session.commit()
        return jsonify({'message': 'Access request submitted successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400

# Add API endpoint to approve access request and add/deactivate patient record
@app.route('/api/accessrequests/<int:request_id>/approve', methods=['POST'])
def approve_accessrequest(request_id):
    accessrequest = AccessRequest.query.get(request_id)
    if not accessrequest:
        return jsonify({'message': 'Access request not found'}), 404

    # Update request status and solve_at
    accessrequest.status = 'Approved'
    accessrequest.solved_at = datetime.utcnow()
    
    if accessrequest.request_type == 'Activate':
        # Check if the patient already exists
        existing_patient = Patient.query.filter_by(auth0_id=accessrequest.auth0_id).first()

        if existing_patient:
            # If the patient exists but was deactivated, update their information
            existing_patient.first_name = accessrequest.first_name
            existing_patient.last_name = accessrequest.last_name
            existing_patient.dob = accessrequest.dob
            existing_patient.gender = accessrequest.gender
            existing_patient.email = accessrequest.email
            existing_patient.phone = accessrequest.phone
            existing_patient.request_id = accessrequest.id
            existing_patient.updated_at = datetime.utcnow()
            existing_patient.is_active = True # Mark the patient as active again

        else:
            # If the patient does not exist, add them to the database
            new_patient = Patient(
                first_name=accessrequest.first_name,
                last_name=accessrequest.last_name,
                dob=accessrequest.dob,
                gender=accessrequest.gender,
                email=accessrequest.email,
                phone=accessrequest.phone,
                auth0_id=accessrequest.auth0_id,
                request_id=accessrequest.id,
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow(),
                is_active=True
            )
            db.session.add(new_patient)
    
    elif accessrequest.request_type == 'Deactivate':
        # Only update the patient's is_active status, without deleting the record
        patient = Patient.query.filter_by(auth0_id=accessrequest.auth0_id).first()
        if patient:
            patient.is_active = False
            patient.updated_at = datetime.utcnow()
    
    db.session.commit()
    return jsonify({'message': 'Access request processed successfully'}), 200



# Add API endpoint to disapprove access request
@app.route('/api/accessrequests/<int:request_id>/disapprove', methods=['POST'])
def disapprove_accessrequest(request_id):
    accessrequest = AccessRequest.query.get(request_id)
    if not accessrequest:
        return jsonify({'message': 'Access request not found'}), 404

    accessrequest.status = 'Disapproved'
    accessrequest.solved_at = datetime.utcnow()
    db.session.commit()

    return jsonify({'message': 'Access request disapproved'}), 200


'''Patient'''

# Add API endpoint to fetch and return the contents of the Patient table
@app.route('/api/patients', methods=['GET'])
def get_patients():
    patients = Patient.query.all()
    return jsonify([{'id' : patient.id,
                     'first_name' : patient.first_name,
                     'last_name' : patient.last_name,
                     'dob' : str(patient.dob),
                     'gender' : patient.gender,
                     'email' : patient.email,    
                     'phone' : patient.phone,  
                     'auth0_id' : patient.auth0_id,  
                     'request_id' : patient.request_id,  
                     'created_at' : str(patient.created_at),
                     'updated_at' : str(patient.updated_at),
                     'is_active' : patient.is_active} 
                     for patient in patients])

# Add API endpoint to fetch and return a patient identified by their auth0_id
@app.route('/api/patients/<auth0_id>', methods=['GET'])
def get_patient_by_auth0_id(auth0_id):
    patient = Patient.query.filter_by(auth0_id=auth0_id).first()
    if patient:
        return jsonify({
            "id": patient.id,
            "first_name": patient.first_name,
            "last_name": patient.last_name,
            "dob": patient.dob.isoformat(),
            "gender": patient.gender,
            "email": patient.email,
            "phone": patient.phone,
            "auth0_id": patient.auth0_id,
            "request_id": patient.request_id,
            "created_at": patient.created_at.isoformat(),
            "updated_at": patient.updated_at.isoformat(),
            "is_active": patient.is_active
        })
    else:
        return jsonify({"error": "Patient not found"}), 404


''''''

@app.route('/')
def index():
    return "Welcome to the TCR MED Management System"




if __name__ == '__main__':
    with app.app_context():
        initialize_database()  # Initialize database
    app.run(debug=True)





