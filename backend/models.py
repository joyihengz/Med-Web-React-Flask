# models.py
from database import db

class Department(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    description = db.Column(db.String(300))

    def __repr__(self):
        return f'<Department {self.name}>'

# Add other models (Provider, Patient, Visit, AccessRequest, Appointment) here

class Provider(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    degree = db.Column(db.String(50), default='MD')
    role = db.Column(db.String(100))
    department_id = db.Column(db.Integer, db.ForeignKey('department.id'), nullable=False)

    # Relationship - acess department from a Provider
    department = db.relationship('Department', backref=db.backref('providers', lazy=True))

    def __repr__(self):
        return f'<Provider {self.first_name} {self.last_name}>'

class Appointment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    provider_id = db.Column(db.Integer, db.ForeignKey('provider.id'), nullable=False, index=True)
    date = db.Column(db.Date, nullable=False, index=True)
    start_time = db.Column(db.Time, nullable=False)
    is_available = db.Column(db.Boolean, default=True) # True for available, False for booked

    patient_id = db.Column(db.Integer, db.ForeignKey('patient.id'), nullable=True)
    booked_at = db.Column(db.Date, nullable=True)

    # Relationship - access provider from Appointment
    provider = db.relationship('Provider', backref=db.backref('appointments', lazy=True))
    patient = db.relationship('Patient', backref=db.backref('appointments', lazy=True))

    # Composite Index
    __table_args__ = (db.Index('idx_provider_date', 'provider_id', 'date'), )


    def __repr__(self):
        return f'<Appointment {self.provider_id} {self.date} {self.start_time} {"Available" if self.is_available else "Booked"}>'


class AccessRequest(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    dob = db.Column(db.Date, nullable=False)
    gender = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(255), nullable=False)
    phone = db.Column(db.String(50), nullable=False)
    request_type = db.Column(db.String(50), nullable=False) # request type: Activate / Deactivate patient access
    status = db.Column(db.String(50), default='Pending')

    auth0_id = db.Column(db.String, nullable=False)

    created_at = db.Column(db.Date, nullable=False)
    solved_at = db.Column(db.Date)

    def __repr__(self):
        return f'<AccessRequest {self.first_name} {self.last_name}>'    


class Patient(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    dob = db.Column(db.Date, nullable=False)
    gender = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(255), nullable=False)
    phone = db.Column(db.String(50), nullable=False)

    auth0_id = db.Column(db.String, nullable=False)
    request_id = db.Column(db.Integer, nullable=False) # Most recent activation request id

    created_at = db.Column(db.Date, nullable=False)
    updated_at = db.Column(db.Date, nullable=False)

    is_active = db.Column(db.Boolean, default=True) # True for activated, False for deactivated

    # Relationship - acess request from Patient
    # accessrequest = db.relationship('AccessRequest', backref=db.backref('patient', lazy=True))

    def __repr__(self):
        return f'<Patient {self.first_name} {self.last_name}>'