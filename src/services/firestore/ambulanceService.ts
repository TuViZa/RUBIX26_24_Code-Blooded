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
export interface Ambulance {
  id: string;
  hospitalId: string;
  vehicleNumber: string;
  driverName: string;
  driverContact: string;
  status: 'available' | 'dispatched' | 'onRoute' | 'atLocation' | 'atHospital' | 'maintenance';
  location: { x: number; y: number };
  destination?: { x: number; y: number };
  patientId?: string;
  emergencyRequestId?: string;
  equipment: string[];
  fuelLevel: number;
  lastMaintenance?: Timestamp;
  createdAt: Timestamp;
  updatedAt?: Timestamp;
}

export interface CreateAmbulanceData {
  hospitalId: string;
  vehicleNumber: string;
  driverName: string;
  driverContact: string;
  status: 'available' | 'dispatched' | 'onRoute' | 'atLocation' | 'atHospital' | 'maintenance';
  location?: { x: number; y: number };
  equipment?: string[];
  fuelLevel?: number;
}

export interface UpdateAmbulanceData {
  status?: 'available' | 'dispatched' | 'onRoute' | 'atLocation' | 'atHospital' | 'maintenance';
  location?: { x: number; y: number };
  destination?: { x: number; y: number };
  fuelLevel?: number;
  lastMaintenance?: Timestamp;
  updatedAt?: Timestamp;
}

class AmbulanceService {
  private db = collection(getAuth().app, 'ambulances');

  // Create ambulance
  async createAmbulance(ambulanceData: CreateAmbulanceData): Promise<Ambulance> {
    try {
      const auth = getAuth();
      if (!auth.currentUser) {
        throw new Error('User not authenticated');
      }

      const ambulanceRef = doc(this.db, ambulanceData.vehicleNumber);
      const ambulanceDoc = await getDoc(ambulanceRef);
      
      if (ambulanceDoc.exists()) {
        // Update existing ambulance
        const updateData: UpdateAmbulanceData = {
          ...ambulanceData,
          updatedAt: new Timestamp()
        };
        
        await updateDoc(ambulanceRef, updateData);
        toast.success('Ambulance updated', {
          description: 'Ambulance information has been updated successfully'
        });
        
        return ambulanceDoc.data() as Ambulance;
      } else {
        // Create new ambulance
        const newAmbulance: Ambulance = {
          id: ambulanceData.vehicleNumber,
          hospitalId: ambulanceData.hospitalId,
          vehicleNumber: ambulanceData.vehicleNumber,
          driverName: ambulanceData.driverName,
          driverContact: ambulanceData.driverContact,
          status: ambulanceData.status || 'available',
          location: ambulanceData.location || { x: 0, y: 0 },
          equipment: ambulanceData.equipment || [],
          fuelLevel: ambulanceData.fuelLevel || 100,
          createdAt: new Timestamp()
        };
        
        await setDoc(ambulanceRef, newAmbulance);
        toast.success('Ambulance created', {
          description: 'New ambulance has been added successfully'
        });
        
        return newAmbulance;
      }
    } catch (error) {
      console.error('Error creating/updating ambulance:', error);
      toast.error('Ambulance operation failed', {
        description: error.message
      });
      throw error;
    }
  }

  // Get ambulance by ID
  async getAmbulanceById(ambulanceId: string): Promise<Ambulance | null> {
    try {
      const ambulanceRef = doc(this.db, ambulanceId);
      const ambulanceDoc = await getDoc(ambulanceRef);
      
      if (ambulanceDoc.exists()) {
        return ambulanceDoc.data() as Ambulance;
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching ambulance:', error);
      toast.error('Failed to fetch ambulance');
      return null;
    }
  }

  // Get ambulances by hospital
  async getAmbulancesByHospital(hospitalId: string): Promise<Ambulance[]> {
    try {
      const q = query(this.db, where('hospitalId', '==', hospitalId));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => doc.data() as Ambulance);
    } catch (error) {
      console.error('Error fetching ambulances:', error);
      toast.error('Failed to fetch ambulances');
      return [];
    }
  }

  // Get ambulances by status
  async getAmbulancesByStatus(status: string): Promise<Ambulance[]> {
    try {
      const q = query(this.db, where('status', '==', status));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => doc.data() as Ambulance);
    } catch (error) {
      console.error('Error fetching ambulances:', error);
      toast.error('Failed to fetch ambulances');
      return [];
    }
  }

  // Update ambulance status
  async updateAmbulanceStatus(ambulanceId: string, status: Ambulance['status']): Promise<void> {
    try {
      const ambulanceRef = doc(this.db, ambulanceId);
      await updateDoc(ambulanceRef, {
        status,
        updatedAt: new Timestamp()
      });
      
      toast.success('Ambulance status updated', {
        description: `Ambulance status changed to ${status}`
      });
    } catch (error) {
      console.error('Error updating ambulance status:', error);
      toast.error('Failed to update ambulance status');
      throw error;
    }
  }

  // Update ambulance location
  async updateAmbulanceLocation(ambulanceId: string, location: { x: number; y: number }): Promise<void> {
    try {
      const ambulanceRef = doc(this.db, ambulanceId);
      await updateDoc(ambulanceRef, {
        location,
        updatedAt: new Timestamp()
      });
      
      toast.success('Ambulance location updated', {
        description: 'Ambulance location has been updated successfully'
      });
    } catch (error) {
      console.error('Error updating ambulance location:', error);
      toast.error('Failed to update ambulance location');
      throw error;
    }
  }

  // Dispatch ambulance to location
  async dispatchAmbulance(ambulanceId: string, destination: { x: number; y: number }): Promise<void> {
    try {
      const ambulanceRef = doc(this.db, ambulanceId);
      await updateDoc(ambulanceRef, {
        status: 'onRoute',
        destination,
        updatedAt: new Timestamp()
      });
      
      toast.success('Ambulance dispatched', {
        description: `Ambulance has been dispatched to destination: ${destination.x}, ${destination.y}`
      });
    } catch (error) {
      console.error('Error dispatching ambulance:', error);
      toast.error('Failed to dispatch ambulance');
      throw error;
    }
  }

  // Mark ambulance as arrived at location
  async markAmbulanceArrived(ambulanceId: string): Promise<void> {
    try {
      const ambulanceRef = doc(this.db, ambulanceId);
      await updateDoc(ambulanceRef, {
        status: 'atLocation',
        updatedAt: new Timestamp()
      });
      
      toast.success('Ambulance arrived', {
        description: 'Ambulance has been marked as arrived at destination'
      });
    } catch (error) {
      console.error('Error marking ambulance arrived:', error);
      toast.error('Failed to mark ambulance arrived');
      throw error;
    }
  }

  // Mark ambulance as at hospital
  async markAmbulanceAtHospital(ambulanceId: string): Promise<void> {
    try {
      const ambulanceRef = doc(this.db, ambulanceId);
      await updateDoc(ambulanceRef, {
        status: 'atHospital',
        updatedAt: new Timestamp()
      });
      
      toast.success('Ambulance at hospital', {
        description: 'Ambulance has been marked as at hospital'
      });
    } catch (error) {
      console.error('Error marking ambulance at hospital:', error);
      toast.error('Failed to mark ambulance at hospital');
      throw error;
    }
  }

  // Get available ambulances
  async getAvailableAmbulances(): Promise<Ambulance[]> {
    try {
      const q = query(this.db, where('status', '==', 'available'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => doc.data() as Ambulance);
    } catch (error) {
      console.error('Error fetching available ambulances:', error);
      toast.error('Failed to fetch available ambulances');
      return [];
    }
  }

  // Update ambulance fuel level
  async updateAmbulanceFuelLevel(ambulanceId: string, fuelLevel: number): Promise<void> {
    try {
      const ambulanceRef = doc(this.db, ambulanceId);
      await updateDoc(ambulanceRef, {
        fuelLevel,
        updatedAt: new Timestamp()
      });
      
      toast.success('Ambulance fuel level updated', {
        description: `Ambulance fuel level updated to ${fuelLevel}%`
      });
    } catch (error) {
      console.error('Error updating ambulance fuel level:', error);
      toast.error('Failed to update ambulance fuel level');
      throw error;
    }
  }

  // Get ambulance statistics
  async getAmbulanceStatistics(): Promise<{
    total: number;
    available: number;
    dispatched: number;
    onRoute: number;
    atLocation: number;
    atHospital: number;
    maintenance: number;
  }> {
    try {
      const [totalSnapshot, availableSnapshot, dispatchedSnapshot, onRouteSnapshot, atLocationSnapshot, atHospitalSnapshot, maintenanceSnapshot] = await Promise.all([
        getDocs(query(this.db)),
        getDocs(query(this.db, where('status', '==', 'available'))),
        getDocs(query(this.db, where('status', '==', 'dispatched'))),
        getDocs(query(this.db, where('status', '==', 'onRoute'))),
        getDocs(query(this.db, where('status', '==', 'atLocation'))),
        getDocs(query(this.db, where('status', '==', 'atHospital'))),
        getDocs(query(this.db, where('status', '==', 'maintenance'))
      ]);

      return {
        total: totalSnapshot.docs.length,
        available: availableSnapshot.docs.length,
        dispatched: dispatchedSnapshot.docs.length,
        onRoute: onRouteSnapshot.docs.length,
        atLocation: atLocationSnapshot.docs.length,
        atHospital: atHospitalSnapshot.docs.length,
        maintenance: maintenanceSnapshot.docs.length
      };
    } catch (error) {
      console.error('Error fetching ambulance statistics:', error);
      toast.error('Failed to fetch ambulance statistics');
      return {
        total: 0,
        available: 0,
        dispatched: 0,
        onRoute: 0,
        atLocation: 0,
        atHospital: 0,
        maintenance: 0
      };
    }
  }
}

export default AmbulanceService;
