import { 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  collection, 
  query, 
  where, 
  orderBy, 
  limit,
  Timestamp,
  DocumentReference,
  CollectionReference 
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { toast } from 'sonner';

// Types
export interface EmergencyRequest {
  id: string;
  patientId: string;
  hospitalId: string;
  type: 'cardiac' | 'trauma' | 'respiratory' | 'neurological' | 'general';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  location: { x: number; y: number };
  contactInfo: {
    name: string;
    phone: string;
    relationship: string;
  };
  status: 'pending' | 'acknowledged' | 'dispatched' | 'resolved';
  assignedAmbulanceId?: string;
  assignedDoctorId?: string;
  createdAt: Timestamp;
  updatedAt?: Timestamp;
  resolvedAt?: Timestamp;
}

export interface CreateEmergencyRequestData {
  patientId: string;
  hospitalId: string;
  type: 'cardiac' | 'trauma' | 'respiratory' | 'neurological' | 'general';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  location: { x: number; y: number };
  contactInfo: {
    name: string;
    phone: string;
    relationship: string;
  };
}

export interface UpdateEmergencyRequestData {
  status?: 'pending' | 'acknowledged' | 'dispatched' | 'resolved';
  assignedAmbulanceId?: string;
  assignedDoctorId?: string;
  resolvedAt?: Timestamp;
  updatedAt?: Timestamp;
}

class EmergencyService {
  private db = collection(getAuth().app, 'emergencyRequests');

  // Create emergency request
  async createEmergencyRequest(requestData: CreateEmergencyRequestData): Promise<EmergencyRequest> {
    try {
      const auth = getAuth();
      if (!auth.currentUser) {
        throw new Error('User not authenticated');
      }

      const emergencyRef = doc(this.db, requestData.patientId);
      const emergencyDoc = await getDoc(emergencyRef);
      
      if (emergencyDoc.exists()) {
        // Update existing request
        const updateData: UpdateEmergencyRequestData = {
          ...requestData,
          createdAt: new Timestamp()
        };
        
        await updateDoc(emergencyRef, updateData);
        toast.success('Emergency request updated', {
          description: 'Emergency request has been updated successfully'
        });
        
        return emergencyDoc.data() as EmergencyRequest;
      } else {
        // Create new request
        const newEmergencyRequest: EmergencyRequest = {
          id: this.generateId(),
          patientId: requestData.patientId,
          hospitalId: requestData.hospitalId,
          type: requestData.type,
          severity: requestData.severity,
          description: requestData.description,
          location: requestData.location,
          contactInfo: requestData.contactInfo,
          status: 'pending',
          createdAt: new Timestamp()
        };
        
        await setDoc(emergencyRef, newEmergencyRequest);
        toast.success('Emergency request created', {
          description: 'New emergency request has been created successfully'
        });
        
        return newEmergencyRequest;
      }
    } catch (error) {
      console.error('Error creating/updating emergency request:', error);
      toast.error('Emergency request operation failed', {
        description: error.message
      });
      throw error;
    }
  }

  // Get emergency request by ID
  async getEmergencyRequestById(requestId: string): Promise<EmergencyRequest | null> {
    try {
      const emergencyRef = doc(this.db, requestId);
      const emergencyDoc = await getDoc(emergencyRef);
      
      if (emergencyDoc.exists()) {
        return emergencyDoc.data() as EmergencyRequest;
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching emergency request:', error);
      toast.error('Failed to fetch emergency request');
      return null;
    }
  }

  // Get emergency requests by patient
  async getEmergencyRequestsByPatient(patientId: string): Promise<EmergencyRequest[]> {
    try {
      const q = query(this.db, where('patientId', '==', patientId));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => doc.data() as EmergencyRequest);
    } catch (error) {
      console.error('Error fetching emergency requests:', error);
      toast.error('Failed to fetch emergency requests');
      return [];
    }
  }

  // Get emergency requests by hospital
  async getEmergencyRequestsByHospital(hospitalId: string): Promise<EmergencyRequest[]> {
    try {
      const q = query(this.db, where('hospitalId', '==', hospitalId));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => doc.data() as EmergencyRequest);
    } catch (error) {
      console.error('Error fetching emergency requests:', error);
      toast.error('Failed to fetch emergency requests');
      return [];
    }
  }

  // Get emergency requests by status
  async getEmergencyRequestsByStatus(status: string): Promise<EmergencyRequest[]> {
    try {
      const q = query(this.db, where('status', '==', status));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => doc.data() as EmergencyRequest);
    } catch (error) {
      console.error('Error fetching emergency requests:', error);
      toast.error('Failed to fetch emergency requests');
      return [];
    }
  }

  // Get emergency requests by severity
  async getEmergencyRequestsBySeverity(severity: string): Promise<EmergencyRequest[]> {
    try {
      const q = query(this.db, where('severity', '==', severity));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => doc.data() as EmergencyRequest);
    } catch (error) {
      console.error('Error fetching emergency requests:', error);
      toast.error('Failed to fetch emergency requests');
      return [];
    }
  }

  // Update emergency request status
  async updateEmergencyRequestStatus(requestId: string, status: EmergencyRequest['status']): Promise<void> {
    try {
      const emergencyRef = doc(this.db, requestId);
      await updateDoc(emergencyRef, {
        status,
        updatedAt: new Timestamp()
      });
      
      toast.success('Emergency request status updated', {
        description: `Emergency request status changed to ${status}`
      });
    } catch (error) {
      console.error('Error updating emergency request status:', error);
      toast.error('Failed to update emergency request status');
      throw error;
    }
  }

  // Assign ambulance to emergency request
  async assignAmbulanceToEmergency(requestId: string, ambulanceId: string): Promise<void> {
    try {
      const emergencyRef = doc(this.db, requestId);
      await updateDoc(emergencyRef, {
        assignedAmbulanceId: ambulanceId,
        updatedAt: new Timestamp()
      });
      
      toast.success('Ambulance assigned', {
        description: `Ambulance ${ambulanceId} has been assigned to emergency request`
      });
    } catch (error) {
      console.error('Error assigning ambulance:', error);
      toast.error('Failed to assign ambulance');
      throw error;
    }
  }

  // Assign doctor to emergency request
  async assignDoctorToEmergency(requestId: string, doctorId: string): Promise<void> {
    try {
      const emergencyRef = doc(this.db, requestId);
      await updateDoc(emergencyRef, {
        assignedDoctorId: doctorId,
        updatedAt: new Timestamp()
      });
      
      toast.success('Doctor assigned', {
        description: `Doctor ${doctorId} has been assigned to emergency request`
      });
    } catch (error) {
      console.error('Error assigning doctor:', error);
      toast.error('Failed to assign doctor');
      throw error;
    }
  }

  // Resolve emergency request
  async resolveEmergencyRequest(requestId: string, resolution?: string): Promise<void> {
    try {
      const emergencyRef = doc(this.db, requestId);
      await updateDoc(emergencyRef, {
        status: 'resolved',
        resolvedAt: new Timestamp(),
        updatedAt: new Timestamp()
      });
      
      toast.success('Emergency request resolved', {
        description: resolution ? `Emergency request resolved: ${resolution}` : 'Emergency request has been resolved'
      });
    } catch (error) {
      console.error('Error resolving emergency request:', error);
      toast.error('Failed to resolve emergency request');
      throw error;
    }
  }

  // Get pending emergency requests
  async getPendingEmergencyRequests(): Promise<EmergencyRequest[]> {
    try {
      const q = query(
        this.db, 
        where('status', '==', 'pending'),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => doc.data() as EmergencyRequest);
    } catch (error) {
      console.error('Error fetching pending emergency requests:', error);
      toast.error('Failed to fetch pending emergency requests');
      return [];
    }
  }

  // Get critical emergency requests
  async getCriticalEmergencyRequests(): Promise<EmergencyRequest[]> {
    try {
      const q = query(
        this.db, 
        where('severity', '==', 'critical'),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => doc.data() as EmergencyRequest);
    } catch (error) {
      console.error('Error fetching critical emergency requests:', error);
      toast.error('Failed to fetch critical emergency requests');
      return [];
    }
  }

  // Get emergency statistics
  async getEmergencyStatistics(): Promise<{
    total: number;
    pending: number;
    acknowledged: number;
    dispatched: number;
    resolved: number;
  }> {
    try {
      const [totalSnapshot, pendingSnapshot, acknowledgedSnapshot, dispatchedSnapshot, resolvedSnapshot] = await Promise.all([
        getDocs(query(this.db, where('createdAt', '>=', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))),
        getDocs(query(this.db, where('status', '==', 'pending'))),
        getDocs(query(this.db, where('status', '==', 'acknowledged'))),
        getDocs(query(this.db, where('status', '==', 'dispatched'))),
        getDocs(query(this.db, where('status', '==', 'resolved')))
      ]);

      return {
        total: totalSnapshot.docs.length,
        pending: pendingSnapshot.docs.length,
        acknowledged: acknowledgedSnapshot.docs.length,
        dispatched: dispatchedSnapshot.docs.length,
        resolved: resolvedSnapshot.docs.length
      };
    } catch (error) {
      console.error('Error fetching emergency statistics:', error);
      toast.error('Failed to fetch emergency statistics');
      return {
        total: 0,
        pending: 0,
        acknowledged: 0,
        dispatched: 0,
        resolved: 0
      };
    }
  }

  // Helper method to generate unique ID
  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }
}

export default EmergencyService;
