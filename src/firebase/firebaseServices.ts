// Firebase services with real-time functionality
import { 
  auth, 
  database, 
  storage, 
  firestore,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  ref,
  set,
  get,
  push,
  update,
  remove,
  onValue,
  off,
  storageRef,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  googleProvider
} from './index';

// Types for our data structures
export interface Hospital {
  id: string;
  name: string;
  status: "normal" | "high" | "critical";
  beds: {
    total: number;
    available: number;
    icu: number;
    ventilators: number;
  };
  emergency: boolean;
  location: { x: number; y: number };
  lastUpdated: number;
}

export interface Ambulance {
  id: string;
  status: "active" | "dispatched" | "available";
  location: { x: number; y: number };
  destination?: { x: number; y: number };
  eta?: number;
  lastUpdated: number;
}

export interface Patient {
  id: string;
  name: string;
  email: string;
  role: string;
  appointments: any[];
  medicalRecords: any[];
  emergencyContacts: any[];
  createdAt: number;
}

// Real-time Database Services
export class FirebaseService {
  // Authentication
  static async signInWithGoogle() {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return result.user;
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  }

  static async signOut() {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  }

  static onAuthChange(callback: (user: any) => void) {
    return onAuthStateChanged(auth, callback);
  }

  // Hospital Services
  static async saveHospital(hospital: Omit<Hospital, 'id' | 'lastUpdated'>) {
    const hospitalsRef = ref(database, 'hospitals');
    const newHospitalRef = push(hospitalsRef);
    const hospitalData = {
      ...hospital,
      id: newHospitalRef.key,
      lastUpdated: Date.now()
    };
    await set(newHospitalRef, hospitalData);
    return hospitalData;
  }

  static async updateHospital(id: string, updates: Partial<Hospital>) {
    const hospitalRef = ref(database, `hospitals/${id}`);
    await update(hospitalRef, {
      ...updates,
      lastUpdated: Date.now()
    });
  }

  static subscribeToHospitals(callback: (hospitals: Hospital[]) => void) {
    const hospitalsRef = ref(database, 'hospitals');
    return onValue(hospitalsRef, (snapshot) => {
      const data = snapshot.val();
      const hospitals = data ? Object.values(data) as Hospital[] : [];
      callback(hospitals);
    });
  }

  static unsubscribeFromHospitals() {
    const hospitalsRef = ref(database, 'hospitals');
    off(hospitalsRef);
  }

  // Ambulance Services
  static async saveAmbulance(ambulance: Omit<Ambulance, 'id' | 'lastUpdated'>) {
    const ambulancesRef = ref(database, 'ambulances');
    const newAmbulanceRef = push(ambulancesRef);
    const ambulanceData = {
      ...ambulance,
      id: newAmbulanceRef.key,
      lastUpdated: Date.now()
    };
    await set(newAmbulanceRef, ambulanceData);
    return ambulanceData;
  }

  static async updateAmbulance(id: string, updates: Partial<Ambulance>) {
    const ambulanceRef = ref(database, `ambulances/${id}`);
    await update(ambulanceRef, {
      ...updates,
      lastUpdated: Date.now()
    });
  }

  static subscribeToAmbulances(callback: (ambulances: Ambulance[]) => void) {
    const ambulancesRef = ref(database, 'ambulances');
    return onValue(ambulancesRef, (snapshot) => {
      const data = snapshot.val();
      const ambulances = data ? Object.values(data) as Ambulance[] : [];
      callback(ambulances);
    });
  }

  static unsubscribeFromAmbulances() {
    const ambulancesRef = ref(database, 'ambulances');
    off(ambulancesRef);
  }

  // Patient Services (Firestore)
  static async savePatient(patient: Omit<Patient, 'id' | 'createdAt'>) {
    const patientsCollection = collection(firestore, 'patients');
    const patientData = {
      ...patient,
      createdAt: Date.now()
    };
    const docRef = doc(patientsCollection);
    await setDoc(docRef, patientData);
    return { ...patientData, id: docRef.id };
  }

  static async updatePatient(id: string, updates: Partial<Patient>) {
    const patientRef = doc(firestore, 'patients', id);
    await updateDoc(patientRef, updates);
  }

  static subscribeToPatient(id: string, callback: (patient: Patient | null) => void) {
    const patientRef = doc(firestore, 'patients', id);
    return onSnapshot(patientRef, (doc) => {
      callback(doc.exists() ? doc.data() as Patient : null);
    });
  }

  // File Upload Services
  static async uploadFile(file: File, path: string) {
    const fileRef = storageRef(storage, path);
    await uploadBytes(fileRef, file);
    const downloadURL = await getDownloadURL(fileRef);
    return downloadURL;
  }

  static async deleteFile(path: string) {
    const fileRef = storageRef(storage, path);
    await deleteObject(fileRef);
  }

  // Emergency Alert Services
  static async createEmergencyAlert(alert: any) {
    const alertsRef = ref(database, 'emergencyAlerts');
    const newAlertRef = push(alertsRef);
    const alertData = {
      ...alert,
      id: newAlertRef.key,
      timestamp: Date.now(),
      status: 'active'
    };
    await set(newAlertRef, alertData);
    return alertData;
  }

  static subscribeToEmergencyAlerts(callback: (alerts: any[]) => void) {
    const alertsRef = ref(database, 'emergencyAlerts');
    return onValue(alertsRef, (snapshot) => {
      const data = snapshot.val();
      const alerts = data ? Object.values(data) : [];
      callback(alerts);
    });
  }
}

export default FirebaseService;
