import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  auth, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged, 
  googleProvider,
  FirebaseUser 
} from '../firebase/index';
import { FirebaseService } from '../firebase/firebaseServices';
import { toast } from 'sonner';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'hospital_staff' | 'doctor' | 'nurse' | 'patient';
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useFirebaseAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useFirebaseAuth must be used within an FirebaseAuthProvider');
  }
  
  const isAuthenticated = !!context.user;
  
  return {
    ...context,
    isAuthenticated
  };
};

interface FirebaseAuthProviderProps {
  children: ReactNode;
}

export const FirebaseAuthProvider: React.FC<FirebaseAuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock user roles mapping
  const getUserRoleFromEmail = (email: string): User['role'] => {
    if (email.includes('admin')) return 'admin';
    if (email.includes('doctor')) return 'doctor';
    if (email.includes('nurse')) return 'nurse';
    if (email.includes('staff')) return 'hospital_staff';
    return 'patient';
  };

  const login = async (email: string, password: string, role: string) => {
    try {
      setIsLoading(true);
      // For demo purposes, we'll create a mock user
      const mockUser: User = {
        id: Date.now().toString(),
        email,
        name: email.split('@')[0],
        role: role as User['role']
      };
      
      setUser(mockUser);
      toast.success('Login successful', {
        description: `Welcome back, ${mockUser.name}!`
      });
    } catch (error) {
      toast.error('Login failed', {
        description: 'Please check your credentials and try again'
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    try {
      setIsLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUserData = result.user;
      
      if (firebaseUserData) {
        const userRole = getUserRoleFromEmail(firebaseUserData.email || '');
        const userData: User = {
          id: firebaseUserData.uid,
          email: firebaseUserData.email || '',
          name: firebaseUserData.displayName || firebaseUserData.email?.split('@')[0] || '',
          role: userRole,
          avatar: firebaseUserData.photoURL || ''
        };
        
        setUser(userData);
        setFirebaseUser(firebaseUserData);
        
        // Save user to Firestore
        await FirebaseService.savePatient({
          ...userData,
          appointments: [],
          medicalRecords: [],
          emergencyContacts: []
        });
        
        toast.success('Google login successful', {
          description: `Welcome, ${userData.name}!`
        });
      }
    } catch (error) {
      toast.error('Google login failed', {
        description: 'Please try again or use email login'
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setFirebaseUser(null);
      toast.success('Logged out successfully', {
        description: 'You have been safely logged out'
      });
    } catch (error) {
      toast.error('Logout failed', {
        description: 'Please try again'
      });
    }
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    
    const rolePermissions = {
      admin: ['canManageAll', 'canManageUsers', 'canManageHospitals', 'canManageAmbulances', 'canViewReports', 'canManageInventory', 'canManageBloodBank', 'canManageOPD', 'canManageBeds', 'canManagePatients', 'canViewAnalytics'],
      hospital_staff: ['canManagePatients', 'canManageBeds', 'canManageInventory', 'canManageBloodBank', 'canManageOPD', 'canManageAmbulances', 'canViewReports'],
      doctor: ['canManagePatients', 'canViewReports', 'canManageOPD'],
      nurse: ['canManagePatients', 'canManageBeds', 'canManageOPD'],
      patient: ['canViewOwnRecords', 'canBookAppointments']
    };
    
    return rolePermissions[user.role]?.includes(permission) || false;
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setFirebaseUser(firebaseUser);
      
      if (firebaseUser) {
        const userRole = getUserRoleFromEmail(firebaseUser.email || '');
        const userData: User = {
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || '',
          role: userRole,
          avatar: firebaseUser.photoURL || ''
        };
        setUser(userData);
      } else {
        setUser(null);
      }
      
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  const value: AuthContextType = {
    user,
    firebaseUser,
    isLoading,
    isAuthenticated: !!user,
    login,
    loginWithGoogle,
    logout,
    hasPermission
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
