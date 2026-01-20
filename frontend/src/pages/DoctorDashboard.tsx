import { useEffect, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { mediSyncServices } from '@/lib/firebase-services';
import { 
  Stethoscope, 
  Users, 
  Clock, 
  FileText, 
  Activity,
  CheckCircle,
  AlertCircle,
  Calendar,
  TrendingUp,
  ArrowRight
} from 'lucide-react';
import { toast } from 'sonner';

export const DoctorDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    todayPatients: 0,
    inConsultation: 0,
    completed: 0,
    waiting: 0
  });
  const [recentPatients, setRecentPatients] = useState<any[]>([]);

  useEffect(() => {
    const loadDoctorData = async () => {
      try {
        const tokens = await mediSyncServices.smartOPD.getTokens();
        if (tokens) {
          const tokensArray = typeof tokens === 'object' && !Array.isArray(tokens)
            ? Object.values(tokens)
            : Array.isArray(tokens) ? tokens : [];
          
          const doctorTokens = tokensArray.filter((t: any) => 
            t.doctor?.id === user?.id || t.doctorId === user?.id
          );
          
          setStats({
            todayPatients: doctorTokens.length,
            inConsultation: doctorTokens.filter((t: any) => t.status === 'in-consultation').length,
            completed: doctorTokens.filter((t: any) => t.status === 'completed').length,
            waiting: doctorTokens.filter((t: any) => t.status === 'waiting' || t.status === 'checked-in').length
          });
          
          setRecentPatients(doctorTokens.slice(0, 5));
        }
      } catch (error) {
        console.error('Error loading doctor data:', error);
      }
    };

    loadDoctorData();
  }, [user]);

  return (
    <AppLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Doctor Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.name} • {user?.department || 'General Medicine'}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Today's Patients</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.todayPatients}</div>
              <p className="text-xs text-muted-foreground mt-1">Total consultations</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{stats.completed}</div>
              <p className="text-xs text-muted-foreground mt-1">Finished consultations</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">In Consultation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">{stats.inConsultation}</div>
              <p className="text-xs text-muted-foreground mt-1">Active now</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-yellow-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Waiting</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">{stats.waiting}</div>
              <p className="text-xs text-muted-foreground mt-1">In queue</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                Patient Queue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                View and manage your patient queue
              </p>
              <Link to="/smart-opd">
                <Button className="w-full">
                  View Queue <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-green-600" />
                Start Consultation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Begin consultation with next patient
              </p>
              <Link to="/smart-opd">
                <Button variant="outline" className="w-full">
                  Start Now <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-600" />
                Medical Records
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Access patient medical history
              </p>
              <Button variant="outline" className="w-full">
                View Records <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Patients */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Patients</CardTitle>
          </CardHeader>
          <CardContent>
            {recentPatients.length > 0 ? (
              <div className="space-y-3">
                {recentPatients.map((patient: any) => (
                  <div
                    key={patient.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold">{patient.patientName}</p>
                        <p className="text-sm text-muted-foreground">
                          {patient.department} • Token: {patient.tokenNumber}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge
                        variant={
                          patient.status === 'completed' ? 'default' :
                          patient.status === 'in-consultation' ? 'secondary' :
                          'outline'
                        }
                      >
                        {patient.status}
                      </Badge>
                      <Link to="/smart-opd">
                        <Button size="sm" variant="ghost">
                          View <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">No recent patients</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};
