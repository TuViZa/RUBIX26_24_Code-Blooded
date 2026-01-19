import { useState, useEffect } from 'react';
import { FirebaseService, Hospital, Ambulance } from '../firebase/firebaseServices';
import { toast } from 'sonner';

export const useFirebaseData = () => {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [ambulances, setAmbulances] = useState<Ambulance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Subscribe to real-time hospital data
    const unsubscribeHospitals = FirebaseService.subscribeToHospitals((hospitalData) => {
      setHospitals(hospitalData);
      setError(null);
    });

    // Subscribe to real-time ambulance data
    const unsubscribeAmbulances = FirebaseService.subscribeToAmbulances((ambulanceData) => {
      setAmbulances(ambulanceData);
      setError(null);
    });

    // Set loading to false after initial data load
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => {
      unsubscribeHospitals();
      unsubscribeAmbulances();
      clearTimeout(timeout);
    };
  }, []);

  const updateHospital = async (id: string, updates: Partial<Hospital>) => {
    try {
      await FirebaseService.updateHospital(id, updates);
      toast.success('Hospital updated', {
        description: 'Hospital information has been updated successfully'
      });
    } catch (error) {
      toast.error('Update failed', {
        description: 'Failed to update hospital information'
      });
      setError('Failed to update hospital');
    }
  };

  const updateAmbulance = async (id: string, updates: Partial<Ambulance>) => {
    try {
      await FirebaseService.updateAmbulance(id, updates);
      toast.success('Ambulance updated', {
        description: 'Ambulance status has been updated'
      });
    } catch (error) {
      toast.error('Update failed', {
        description: 'Failed to update ambulance status'
      });
      setError('Failed to update ambulance');
    }
  };

  const createEmergencyAlert = async (alertData: any) => {
    try {
      await FirebaseService.createEmergencyAlert(alertData);
      toast.success('Emergency alert created', {
        description: 'Emergency services have been notified'
      });
    } catch (error) {
      toast.error('Alert failed', {
        description: 'Failed to create emergency alert'
      });
      setError('Failed to create emergency alert');
    }
  };

  // Initialize sample data if empty
  useEffect(() => {
    if (hospitals.length === 0 && !isLoading) {
      initializeSampleData();
    }
  }, [hospitals.length, isLoading]);

  const initializeSampleData = async () => {
    try {
      // Sample hospitals
      const sampleHospitals = [
        {
          name: "City General Hospital",
          status: "normal" as const,
          beds: { total: 500, available: 127, icu: 45, ventilators: 23 },
          emergency: false,
          location: { x: 30, y: 40 }
        },
        {
          name: "St. Mary's Medical Center",
          status: "high" as const,
          beds: { total: 350, available: 23, icu: 12, ventilators: 8 },
          emergency: true,
          location: { x: 60, y: 30 }
        },
        {
          name: "Memorial Regional",
          status: "critical" as const,
          beds: { total: 400, available: 5, icu: 3, ventilators: 2 },
          emergency: true,
          location: { x: 45, y: 70 }
        }
      ];

      // Sample ambulances
      const sampleAmbulances = [
        {
          status: "active" as const,
          location: { x: 25, y: 35 },
          destination: { x: 60, y: 30 },
          eta: 8
        },
        {
          status: "dispatched" as const,
          location: { x: 50, y: 50 },
          destination: { x: 45, y: 70 },
          eta: 5
        },
        {
          status: "available" as const,
          location: { x: 70, y: 45 }
        }
      ];

      // Save sample data to Firebase
      for (const hospital of sampleHospitals) {
        await FirebaseService.saveHospital(hospital);
      }

      for (const ambulance of sampleAmbulances) {
        await FirebaseService.saveAmbulance(ambulance);
      }

      toast.success('Sample data initialized', {
        description: 'Real-time data has been set up for demonstration'
      });
    } catch (error) {
      console.error('Error initializing sample data:', error);
    }
  };

  return {
    hospitals,
    ambulances,
    isLoading,
    error,
    updateHospital,
    updateAmbulance,
    createEmergencyAlert
  };
};
