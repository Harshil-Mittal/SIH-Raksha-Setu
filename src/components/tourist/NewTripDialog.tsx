import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { 
  CalendarIcon, 
  MapPin, 
  Plus, 
  X,
  Clock,
  Users
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface NewTripDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Destination {
  id: string;
  name: string;
  time: string;
  notes?: string;
}

const NewTripDialog: React.FC<NewTripDialogProps> = ({ open, onOpenChange }) => {
  const [tripData, setTripData] = useState({
    title: '',
    description: '',
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined,
    groupSize: 1
  });
  
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [newDestination, setNewDestination] = useState({ name: '', time: '', notes: '' });

  const handleAddDestination = () => {
    if (!newDestination.name || !newDestination.time) {
      toast.error('Please fill in destination name and time');
      return;
    }

    const destination: Destination = {
      id: Date.now().toString(),
      name: newDestination.name,
      time: newDestination.time,
      notes: newDestination.notes
    };

    setDestinations([...destinations, destination]);
    setNewDestination({ name: '', time: '', notes: '' });
  };

  const handleRemoveDestination = (id: string) => {
    setDestinations(destinations.filter(d => d.id !== id));
  };

  const handleCreateTrip = () => {
    if (!tripData.title || !tripData.startDate || !tripData.endDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (destinations.length === 0) {
      toast.error('Please add at least one destination');
      return;
    }

    // Here you would typically save the trip to your backend
    toast.success('Trip created successfully!');
    onOpenChange(false);
    
    // Reset form
    setTripData({
      title: '',
      description: '',
      startDate: undefined,
      endDate: undefined,
      groupSize: 1
    });
    setDestinations([]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            Create New Trip
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Basic Trip Info */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Trip Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Golden Triangle Tour"
                value={tripData.title}
                onChange={(e) => setTripData(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Brief description of your trip..."
                value={tripData.description}
                onChange={(e) => setTripData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Start Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {tripData.startDate ? format(tripData.startDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={tripData.startDate}
                      onSelect={(date) => setTripData(prev => ({ ...prev, startDate: date }))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>End Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {tripData.endDate ? format(tripData.endDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={tripData.endDate}
                      onSelect={(date) => setTripData(prev => ({ ...prev, endDate: date }))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="groupSize">Group Size</Label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="groupSize"
                    type="number"
                    min="1"
                    max="20"
                    value={tripData.groupSize}
                    onChange={(e) => setTripData(prev => ({ ...prev, groupSize: parseInt(e.target.value) || 1 }))}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Destinations */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Destinations & Itinerary</h3>
            
            {/* Add New Destination */}
            <div className="p-4 border rounded-lg bg-muted/50">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                <div className="space-y-1">
                  <Label className="text-sm">Destination</Label>
                  <Input
                    placeholder="e.g., Red Fort"
                    value={newDestination.name}
                    onChange={(e) => setNewDestination(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-sm">Time</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="09:00 AM"
                      value={newDestination.time}
                      onChange={(e) => setNewDestination(prev => ({ ...prev, time: e.target.value }))}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm">Notes (Optional)</Label>
                  <Input
                    placeholder="Special instructions..."
                    value={newDestination.notes}
                    onChange={(e) => setNewDestination(prev => ({ ...prev, notes: e.target.value }))}
                  />
                </div>
              </div>
              <Button onClick={handleAddDestination} size="sm" className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add Destination
              </Button>
            </div>

            {/* Destinations List */}
            {destinations.length > 0 && (
              <div className="space-y-2">
                <Label>Planned Destinations ({destinations.length})</Label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {destinations.map((destination, index) => (
                    <div key={destination.id} className="flex items-center gap-3 p-3 border rounded-lg">
                      <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-medium">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{destination.name}</div>
                        <div className="text-sm text-muted-foreground flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {destination.time}
                          </span>
                          {destination.notes && (
                            <span>{destination.notes}</span>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveDestination(destination.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Safety Recommendations */}
          <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
            <h4 className="font-medium text-blue-900 mb-2">Safety Recommendations</h4>
            <div className="space-y-1 text-sm text-blue-800">
              <p>• Share your itinerary with emergency contacts</p>
              <p>• Keep your digital ID accessible at all times</p>
              <p>• Follow local safety guidelines and alerts</p>
              <p>• Stay within designated safe zones when possible</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button onClick={handleCreateTrip} className="flex-1">
              Create Trip
            </Button>
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewTripDialog;