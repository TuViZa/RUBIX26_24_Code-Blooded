import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Clock, 
  User, 
  FileText, 
  Phone, 
  Video, 
  AlertTriangle,
  Activity,
  Heart,
  Stethoscope,
  Users,
  MapPin
} from 'lucide-react';
import { useFirebaseAuth } from '@/contexts/FirebaseAuthContext';
import UserService from "@/services/firestore/userService";
import { toast } from 'sonner';
import { useState } from 'react';
``

export const PatientPortal = () => {
  const { user } = useFirebaseAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleBookAppointment = () => {
    setIsLoading(true);
    toast.loading('Opening appointment scheduler...');
    
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Appointment scheduler opened', {
        description: 'You can now book your appointment with available doctors',
        action: {
          label: 'View Doctors',
          onClick: () => console.log('Navigate to doctors list')
        }
      });
    }, 1500);
  };

  const handleViewRecords = () => {
    setIsLoading(true);
    toast.loading('Loading medical records...');
    
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Medical records loaded', {
        description: 'Your complete medical history is now available',
        action: {
          label: 'View Details',
          onClick: () => console.log('Navigate to detailed records')
        }
      });
    }, 1200);
  };

  const handleViewSummary = () => {
    setIsLoading(true);
    toast.loading('Generating health summary...');
    
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Health summary ready', {
        description: 'Your latest health metrics and trends are available',
        action: {
          label: 'View Summary',
          onClick: () => console.log('Navigate to health summary')
        }
      });
    }, 1000);
  };

  const handleEmergency = () => {
    toast.error('Emergency Services Activated', {
      description: 'Connecting you to nearest emergency services...',
      duration: 10000,
      action: {
        label: 'Call 911',
        onClick: () => {
          window.open('tel:911');
          toast.success('Dialing 911...', { description: 'Emergency services have been contacted' });
        }
      }
    });

    // Simulate emergency response
    setTimeout(() => {
      toast.info('Emergency response dispatched', {
        description: 'Nearest ambulance is being dispatched to your location',
        action: {
          label: 'Track Ambulance',
          onClick: () => console.log('Navigate to ambulance tracking')
        }
      });
    }, 2000);
  };

  const handleAppointmentClick = (doctor: string, time: string) => {
    toast.info(`Appointment with ${doctor}`, {
      description: `Scheduled for ${time}`,
      action: {
        label: 'Reschedule',
        onClick: () => console.log('Reschedule appointment')
      }
    });
  };

  const handleContactHospital = () => {
    toast.success('Connecting to hospital...', {
      description: 'Your call is being connected to the hospital operator',
      action: {
        label: 'Video Call',
        onClick: () => console.log('Start video call')
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600">Manage your health information and appointments</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-2">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle className="text-lg">Book Appointment</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Schedule a visit with your healthcare provider
              </CardDescription>
              <Button 
                className="w-full mt-3" 
                size="sm"
                onClick={handleBookAppointment}
                disabled={isLoading}
              >
                {isLoading ? 'Loading...' : 'Book Now'}
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-2">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle className="text-lg">Medical Records</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                View your medical history and test results
              </CardDescription>
              <Button 
                variant="outline" 
                className="w-full mt-3" 
                size="sm"
                onClick={handleViewRecords}
                disabled={isLoading}
              >
                {isLoading ? 'Loading...' : 'View Records'}
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-2">
                <Heart className="w-6 h-6 text-purple-600" />
              </div>
              <CardTitle className="text-lg">Health Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Track your vital signs and health metrics
              </CardDescription>
              <Button 
                variant="outline" 
                className="w-full mt-3" 
                size="sm"
                onClick={handleViewSummary}
                disabled={isLoading}
              >
                {isLoading ? 'Loading...' : 'View Summary'}
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-2">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <CardTitle className="text-lg">Emergency</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Quick access to emergency services
              </CardDescription>
              <Button 
                variant="destructive" 
                className="w-full mt-3" 
                size="sm"
                onClick={handleEmergency}
              >
                Emergency
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upcoming Appointments */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Upcoming Appointments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div 
                  className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
                  onClick={() => handleAppointmentClick('Dr. Sarah Johnson', 'Tomorrow, 10:30 AM')}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">Dr. Sarah Johnson</p>
                      <p className="text-sm text-gray-600">General Checkup</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">Tomorrow</p>
                    <p className="text-sm text-gray-600">10:30 AM</p>
                  </div>
                </div>

                <div 
                  className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
                  onClick={() => handleAppointmentClick('Dr. Michael Chen', 'Dec 28, 2:00 PM')}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">Dr. Michael Chen</p>
                      <p className="text-sm text-gray-600">Cardiology Consultation</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">Dec 28</p>
                    <p className="text-sm text-gray-600">2:00 PM</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Health Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5" />
                Health Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Blood Pressure</span>
                  <Badge variant="secondary">120/80</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Heart Rate</span>
                  <Badge variant="secondary">72 bpm</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Temperature</span>
                  <Badge variant="secondary">98.6°F</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Last Checkup</span>
                  <Badge variant="outline">2 weeks ago</Badge>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full mt-4"
                  onClick={() => toast.info('Health monitoring active', {
                    description: 'Your vital signs are being monitored continuously'
                  })}
                >
                  View Detailed Metrics
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <FileText className="w-5 h-5 text-gray-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Lab results uploaded</p>
                  <p className="text-xs text-gray-500">Blood test results from Dec 15</p>
                </div>
                <span className="text-xs text-gray-500">2 days ago</span>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Calendar className="w-5 h-5 text-gray-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Appointment completed</p>
                  <p className="text-xs text-gray-500">Visit with Dr. Johnson</p>
                </div>
                <span className="text-xs text-gray-500">1 week ago</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Contact */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="w-5 h-5" />
              Emergency Contacts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={handleContactHospital}
              >
                <Phone className="w-4 h-4" />
                Call Hospital
              </Button>
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={() => toast.info('Emergency services location', {
                  description: 'Nearest emergency room: City General Hospital - 2.3 miles',
                  action: {
                    label: 'Get Directions',
                    onClick: () => {
                      window.open('https://maps.google.com/?q=City+General+Hospital');
                      toast.success('Opening maps...', { description: 'Getting directions to hospital' });
                    }
                  }
                })}
              >
                <MapPin className="w-4 h-4" />
                Get Directions
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
