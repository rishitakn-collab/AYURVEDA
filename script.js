// patients.js - Modular patient management functions

// Generate unique patient ID
function generatePatientId() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `PAT-${timestamp}-${random}`;
}

// Calculate BMI
function calculateBMI(weight, height) {
    if (!weight || !height) return '';
    const heightInMeters = height / 100;
    const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(1);
    return bmi;
}

// Get BMI category
function getBMICategory(bmi) {
    if (!bmi) return '';
    const bmiValue = parseFloat(bmi);
    if (bmiValue < 18.5) return 'Underweight';
    if (bmiValue < 25) return 'Normal';
    if (bmiValue < 30) return 'Overweight';
    return 'Obese';
}

// Save patient to localStorage
function savePatient(patientData) {
    try {
        let patients = getPatients();
        
        // Check if updating existing patient
        const existingIndex = patients.findIndex(p => p.patientId === patientData.patientId);
        
        if (existingIndex !== -1) {
            // Update existing patient
            patients[existingIndex] = {
                ...patients[existingIndex],
                ...patientData,
                lastUpdated: new Date().toISOString()
            };
        } else {
            // Add new patient
            patientData.createdAt = new Date().toISOString();
            patientData.lastUpdated = new Date().toISOString();
            patients.push(patientData);
        }
        
        localStorage.setItem('patients', JSON.stringify(patients));
        return true;
    } catch (error) {
        console.error('Error saving patient:', error);
        return false;
    }
}

// Get all patients from localStorage
function getPatients() {
    try {
        const patients = localStorage.getItem('patients');
        return patients ? JSON.parse(patients) : [];
    } catch (error) {
        console.error('Error loading patients:', error);
        return [];
    }
}

// Get single patient by ID
function getPatientById(patientId) {
    const patients = getPatients();
    return patients.find(p => p.patientId === patientId);
}

// Delete patient
function deletePatient(patientId) {
    try {
        let patients = getPatients();
        patients = patients.filter(p => p.patientId !== patientId);
        localStorage.setItem('patients', JSON.stringify(patients));
        return true;
    } catch (error) {
        console.error('Error deleting patient:', error);
        return false;
    }
}

// Format date for display
function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Validate form data
function validatePatientForm(formData) {
    const errors = [];
    
    if (!formData.fullName.trim()) errors.push('Full Name is required');
    if (!formData.age || formData.age < 1 || formData.age > 150) errors.push('Valid age is required');
    if (!formData.gender) errors.push('Gender is required');
    if (!formData.contactNumber.trim()) errors.push('Contact Number is required');
    if (!formData.prakritiType) errors.push('Prakriti Type is required');
    
    // Validate email format if provided
    if (formData.email && !isValidEmail(formData.email)) {
        errors.push('Valid email format is required');
    }
    
    // Validate phone format
    if (formData.contactNumber && !isValidPhone(formData.contactNumber)) {
        errors.push('Valid phone number format is required');
    }
    
    return errors;
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Phone validation
function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[\d\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
}

// Show notification
function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()" style="background:none;border:none;color:inherit;font-size:18px;cursor:pointer;margin-left:10px;">&times;</button>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        background: ${type === 'success' ? 'linear-gradient(135deg, #4CAF50, #45a049)' : 'linear-gradient(135deg, #ef4444, #dc2626)'};
        animation: slideIn 0.3s ease;
    `;
    
    // Add animation styles if not exist
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}
function toggleHerb(element) {
  const details = element.querySelector('.herb-details');
  if (details) {
    details.style.display = details.style.display === 'block' ? 'none' : 'block';
  }
}

// Optional: Initially hide all herb-details
document.querySelectorAll('.herb-details').forEach(d => d.style.display = 'none');
