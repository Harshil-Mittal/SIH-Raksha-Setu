import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  FileText, 
  Plus, 
  Eye, 
  Edit, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  User,
  Calendar,
  MapPin,
  Download,
  Search,
  Filter,
  ArrowLeft
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface FIR {
  id: string;
  firNumber: string;
  title: string;
  description: string;
  incidentType: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'closed';
  reportedBy: string;
  reportedDate: string;
  incidentDate: string;
  location: string;
  involvedPersons: string[];
  evidenceFiles: string[];
  assignedOfficer?: string;
  lastUpdated: string;
  remarks?: string;
}

interface EFIRManagementProps {
  onBack: () => void;
}

const EFIRManagement: React.FC<EFIRManagementProps> = ({ onBack }) => {
  const { t } = useTranslation();
  const [selectedFIR, setSelectedFIR] = useState<FIR | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');

  // Mock data
  const firs: FIR[] = [
    {
      id: '1',
      firNumber: 'FIR-2024-001',
      title: 'Lost Tourist Report',
      description: 'Tourist reported missing from central market area. Last seen around 2 PM near the main entrance.',
      incidentType: 'Missing Person',
      severity: 'high',
      status: 'pending',
      reportedBy: 'Tourist Guide - Rajesh Kumar',
      reportedDate: '2024-01-15T14:30:00Z',
      incidentDate: '2024-01-15T14:00:00Z',
      location: 'Central Market, Main Entrance',
      involvedPersons: ['John Smith (Tourist)', 'Sarah Johnson (Companion)'],
      evidenceFiles: ['photo1.jpg', 'witness_statement.pdf'],
      assignedOfficer: 'Inspector Sharma',
      lastUpdated: '2024-01-15T15:00:00Z',
      remarks: 'Search operation initiated'
    },
    {
      id: '2',
      firNumber: 'FIR-2024-002',
      title: 'Theft at Hotel',
      description: 'Tourist reported theft of personal belongings from hotel room. Items include passport, wallet, and camera.',
      incidentType: 'Theft',
      severity: 'medium',
      status: 'approved',
      reportedBy: 'Hotel Manager - Priya Patel',
      reportedDate: '2024-01-14T10:15:00Z',
      incidentDate: '2024-01-14T08:00:00Z',
      location: 'Grand Palace Hotel, Room 302',
      involvedPersons: ['Michael Brown (Tourist)', 'Hotel Staff'],
      evidenceFiles: ['room_photos.zip', 'cctv_footage.mp4'],
      assignedOfficer: 'Sub-Inspector Singh',
      lastUpdated: '2024-01-14T16:30:00Z',
      remarks: 'Investigation in progress'
    },
    {
      id: '3',
      firNumber: 'FIR-2024-003',
      title: 'Traffic Accident Involving Tourist',
      description: 'Minor traffic accident involving tourist vehicle. No major injuries reported.',
      incidentType: 'Traffic Accident',
      severity: 'low',
      status: 'closed',
      reportedBy: 'Traffic Police - Constable Verma',
      reportedDate: '2024-01-13T16:45:00Z',
      incidentDate: '2024-01-13T16:30:00Z',
      location: 'Highway 45, Near Tourist Complex',
      involvedPersons: ['David Wilson (Tourist)', 'Local Driver'],
      evidenceFiles: ['accident_report.pdf', 'vehicle_photos.jpg'],
      assignedOfficer: 'Traffic Inspector Kumar',
      lastUpdated: '2024-01-13T18:00:00Z',
      remarks: 'Case closed - minor damages settled'
    }
  ];

  const filteredFIRs = firs.filter(fir => {
    const matchesSearch = fir.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         fir.firNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || fir.status === statusFilter;
    const matchesSeverity = severityFilter === 'all' || fir.severity === severityFilter;
    return matchesSearch && matchesStatus && matchesSeverity;
  });

  const getStatusColor = (status: FIR['status']) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'approved': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'closed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getSeverityColor = (severity: FIR['severity']) => {
    switch (severity) {
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'high': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'critical': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusIcon = (status: FIR['status']) => {
    switch (status) {
      case 'draft': return <Edit className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <AlertTriangle className="w-4 h-4" />;
      case 'closed': return <CheckCircle className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-2xl font-bold">{t('efir.title')}</h1>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                {t('efir.create')}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New E-FIR</DialogTitle>
              </DialogHeader>
              <div className="grid gap-6 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">FIR Title</Label>
                    <Input id="title" placeholder="Enter FIR title" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="incidentType">Incident Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select incident type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="theft">Theft</SelectItem>
                        <SelectItem value="missing">Missing Person</SelectItem>
                        <SelectItem value="accident">Traffic Accident</SelectItem>
                        <SelectItem value="assault">Assault</SelectItem>
                        <SelectItem value="fraud">Fraud</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="severity">Severity</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select severity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Incident Location</Label>
                    <Input id="location" placeholder="Enter incident location" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Incident Description</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Detailed description of the incident..." 
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="incidentDate">Incident Date & Time</Label>
                    <Input id="incidentDate" type="datetime-local" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reportedBy">Reported By</Label>
                    <Input id="reportedBy" placeholder="Name and designation" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="involvedPersons">Involved Persons</Label>
                  <Textarea 
                    id="involvedPersons" 
                    placeholder="List all persons involved (one per line)" 
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="evidence">Evidence Files</Label>
                  <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center">
                    <div className="text-muted-foreground">
                      <FileText className="w-8 h-8 mx-auto mb-2" />
                      <p>Drag and drop files here or click to browse</p>
                      <p className="text-xs">Supports: PDF, JPG, PNG, MP4 (Max 10MB each)</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    {t('common.cancel')}
                  </Button>
                  <Button variant="outline">
                    Save as {t('efir.draft')}
                  </Button>
                  <Button onClick={() => setIsCreateDialogOpen(false)}>
                    {t('common.submit')}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="p-6">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search FIRs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="draft">{t('efir.draft')}</SelectItem>
              <SelectItem value="pending">{t('efir.pending')}</SelectItem>
              <SelectItem value="approved">{t('efir.approved')}</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
          <Select value={severityFilter} onValueChange={setSeverityFilter}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Severity</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* FIR List */}
        <div className="space-y-4">
          {filteredFIRs.map((fir) => (
            <Card key={fir.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge className={getStatusColor(fir.status)}>
                        {getStatusIcon(fir.status)}
                        <span className="ml-1 capitalize">{fir.status}</span>
                      </Badge>
                      <Badge className={getSeverityColor(fir.severity)}>
                        {fir.severity}
                      </Badge>
                      <span className="text-sm font-mono text-muted-foreground">{fir.firNumber}</span>
                    </div>
                    
                    <h3 className="text-lg font-semibold mb-2">{fir.title}</h3>
                    <p className="text-muted-foreground mb-4 line-clamp-2">{fir.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span>{fir.reportedBy}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span>{new Date(fir.incidentDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span>{fir.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-muted-foreground" />
                        <span>{fir.evidenceFiles.length} files</span>
                      </div>
                    </div>
                    
                    {fir.assignedOfficer && (
                      <div className="mt-2 text-sm">
                        <span className="text-muted-foreground">Assigned to: </span>
                        <span className="font-medium">{fir.assignedOfficer}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <Button variant="outline" size="sm" onClick={() => setSelectedFIR(fir)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4" />
                    </Button>
                    {fir.status === 'pending' && (
                      <Button size="sm">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        {t('efir.approve')}
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredFIRs.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No FIRs Found</h3>
              <p className="text-muted-foreground">No FIRs match your current search criteria.</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* FIR Details Dialog */}
      {selectedFIR && (
        <Dialog open={!!selectedFIR} onOpenChange={() => setSelectedFIR(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                {selectedFIR.firNumber} - {selectedFIR.title}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <Badge className={getStatusColor(selectedFIR.status)}>
                  {getStatusIcon(selectedFIR.status)}
                  <span className="ml-1 capitalize">{selectedFIR.status}</span>
                </Badge>
                <Badge className={getSeverityColor(selectedFIR.severity)}>
                  {selectedFIR.severity}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Incident Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Type:</span>
                        <span>{selectedFIR.incidentType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Date:</span>
                        <span>{new Date(selectedFIR.incidentDate).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Location:</span>
                        <span>{selectedFIR.location}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Reporting Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Reported By:</span>
                        <span>{selectedFIR.reportedBy}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Reported Date:</span>
                        <span>{new Date(selectedFIR.reportedDate).toLocaleString()}</span>
                      </div>
                      {selectedFIR.assignedOfficer && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Assigned Officer:</span>
                          <span>{selectedFIR.assignedOfficer}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Involved Persons</h4>
                    <ul className="text-sm space-y-1">
                      {selectedFIR.involvedPersons.map((person, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <User className="w-3 h-3 text-muted-foreground" />
                          {person}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Evidence Files</h4>
                    <div className="space-y-2">
                      {selectedFIR.evidenceFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">{file}</span>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Download className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Description</h4>
                <p className="text-sm text-muted-foreground bg-muted p-4 rounded-lg">
                  {selectedFIR.description}
                </p>
              </div>
              
              {selectedFIR.remarks && (
                <div>
                  <h4 className="font-semibold mb-2">Remarks</h4>
                  <p className="text-sm text-muted-foreground bg-muted p-4 rounded-lg">
                    {selectedFIR.remarks}
                  </p>
                </div>
              )}
              
              <div className="flex justify-between items-center pt-4 border-t">
                <span className="text-sm text-muted-foreground">
                  Last updated: {new Date(selectedFIR.lastUpdated).toLocaleString()}
                </span>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setSelectedFIR(null)}>
                    {t('common.close')}
                  </Button>
                  <Button variant="outline">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </Button>
                  {selectedFIR.status === 'pending' && (
                    <Button>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      {t('efir.approve')}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default EFIRManagement;