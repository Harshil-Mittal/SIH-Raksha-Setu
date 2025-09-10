import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, AlertTriangle, Clock, ArrowLeft, Plus } from 'lucide-react';
import NewTripDialog from './NewTripDialog';

interface TripsViewProps {
  onBack: () => void;
}

const TripsView: React.FC<TripsViewProps> = ({ onBack }) => {
  const [isNewTripDialogOpen, setIsNewTripDialogOpen] = useState(false);
  const currentTrip = {
    id: 1,
    title: 'Delhi Heritage Tour',
    startDate: new Date(),
    endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    status: 'active',
    itinerary: [
      { 
        day: 1, 
        location: 'Red Fort', 
        time: '09:00 AM', 
        status: 'completed',
        warning: null
      },
      { 
        day: 1, 
        location: 'Jama Masjid', 
        time: '11:30 AM', 
        status: 'completed',
        warning: null
      },
      { 
        day: 2, 
        location: 'India Gate', 
        time: '08:00 AM', 
        status: 'upcoming',
        warning: null
      },
      { 
        day: 2, 
        location: 'Connaught Place', 
        time: '02:00 PM', 
        status: 'upcoming',
        warning: 'High tourist activity expected'
      },
      { 
        day: 3, 
        location: 'Lotus Temple', 
        time: '10:00 AM', 
        status: 'upcoming',
        warning: null
      }
    ]
  };

  const upcomingTrips = [
    {
      id: 2,
      title: 'Rajasthan Cultural Tour',
      startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      duration: '7 days',
      status: 'planned'
    },
    {
      id: 3,
      title: 'Kerala Backwaters',
      startDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      duration: '5 days',
      status: 'planned'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'active': return 'bg-blue-500';
      case 'upcoming': return 'bg-gray-400';
      default: return 'bg-gray-400';
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
            <h1 className="text-lg font-semibold">My Trips</h1>
          </div>
          <Button size="sm" className="flex items-center gap-2" onClick={() => setIsNewTripDialogOpen(true)}>
            <Plus className="w-4 h-4" />
            New Trip
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Current Trip */}
        <Card className="border-primary/20">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                {currentTrip.title}
              </CardTitle>
              <Badge className="bg-primary text-primary-foreground">Active</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {currentTrip.startDate.toLocaleDateString()} - {currentTrip.endDate.toLocaleDateString()}
              </div>
            </div>

            {/* Itinerary */}
            <div className="space-y-3">
              <h4 className="font-medium">Itinerary</h4>
              {currentTrip.itinerary.map((item, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className={`w-3 h-3 rounded-full mt-1 ${getStatusColor(item.status)}`}></div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Day {item.day} - {item.location}</p>
                        <p className="text-xs text-muted-foreground">{item.time}</p>
                      </div>
                      {item.warning && (
                        <div className="flex items-center gap-1 text-warning text-xs">
                          <AlertTriangle className="w-3 h-3" />
                          <span>Warning</span>
                        </div>
                      )}
                    </div>
                    {item.warning && (
                      <p className="text-xs text-warning mt-1">{item.warning}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <Button className="w-full mt-4" variant="outline">
              View on Map
            </Button>
          </CardContent>
        </Card>

        {/* Upcoming Trips */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Upcoming Trips</h3>
          {upcomingTrips.map((trip) => (
            <Card key={trip.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{trip.title}</h4>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {trip.startDate.toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {trip.duration}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary">{trip.status}</Badge>
                    <Button size="sm" variant="outline" className="mt-2 block">
                      Edit
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trip Statistics */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Trip Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">5</div>
                <div className="text-xs text-muted-foreground">Total Trips</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">18</div>
                <div className="text-xs text-muted-foreground">Places Visited</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">45</div>
                <div className="text-xs text-muted-foreground">Days Traveled</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* New Trip Dialog */}
      <NewTripDialog 
        open={isNewTripDialogOpen} 
        onOpenChange={setIsNewTripDialogOpen} 
      />
    </div>
  );
};

export default TripsView;