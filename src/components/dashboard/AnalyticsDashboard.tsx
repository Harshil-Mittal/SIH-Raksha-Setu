import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  AlertTriangle, 
  MapPin, 
  Clock,
  Download,
  Filter,
  Calendar,
  ArrowLeft
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface AnalyticsDashboardProps {
  onBack: () => void;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ onBack }) => {
  const { t } = useTranslation();
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState('alerts');

  // Mock data
  const alertTrends = [
    { date: '2024-01-01', critical: 2, moderate: 5, low: 8 },
    { date: '2024-01-02', critical: 1, moderate: 7, low: 12 },
    { date: '2024-01-03', critical: 3, moderate: 4, low: 9 },
    { date: '2024-01-04', critical: 0, moderate: 6, low: 11 },
    { date: '2024-01-05', critical: 2, moderate: 8, low: 15 },
    { date: '2024-01-06', critical: 1, moderate: 5, low: 7 },
    { date: '2024-01-07', critical: 2, moderate: 9, low: 13 },
  ];

  const touristFlow = [
    { hour: '00:00', count: 12 },
    { hour: '03:00', count: 8 },
    { hour: '06:00', count: 25 },
    { hour: '09:00', count: 45 },
    { hour: '12:00', count: 78 },
    { hour: '15:00', count: 92 },
    { hour: '18:00', count: 65 },
    { hour: '21:00', count: 34 },
  ];

  const incidentTypes = [
    { name: 'Lost Tourist', value: 35, color: '#8884d8' },
    { name: 'Medical Emergency', value: 20, color: '#82ca9d' },
    { name: 'Theft Report', value: 15, color: '#ffc658' },
    { name: 'Traffic Incident', value: 18, color: '#ff7300' },
    { name: 'Other', value: 12, color: '#00ff88' },
  ];

  const responseTime = [
    { zone: 'Zone A', avgTime: 3.2, incidents: 15 },
    { zone: 'Zone B', avgTime: 4.1, incidents: 23 },
    { zone: 'Zone C', avgTime: 2.8, incidents: 18 },
    { zone: 'Zone D', avgTime: 5.2, incidents: 12 },
    { zone: 'Zone E', avgTime: 3.9, incidents: 20 },
  ];

  const heatmapData = [
    { zone: 'Central Market', incidents: 25, risk: 'high' },
    { zone: 'Tourist District', incidents: 18, risk: 'medium' },
    { zone: 'Heritage Site', incidents: 12, risk: 'low' },
    { zone: 'Transport Hub', incidents: 22, risk: 'high' },
    { zone: 'Shopping Area', incidents: 15, risk: 'medium' },
    { zone: 'Business District', incidents: 8, risk: 'low' },
  ];

  const stats = [
    {
      title: 'Total Alerts Today',
      value: '47',
      change: '+12%',
      trend: 'up',
      icon: AlertTriangle,
      color: 'text-orange-600'
    },
    {
      title: 'Active Tourists',
      value: '1,234',
      change: '+5%',
      trend: 'up',
      icon: Users,
      color: 'text-blue-600'
    },
    {
      title: 'Avg Response Time',
      value: '3.8 min',
      change: '-8%',
      trend: 'down',
      icon: Clock,
      color: 'text-green-600'
    },
    {
      title: 'Risk Zones',
      value: '12',
      change: '0%',
      trend: 'neutral',
      icon: MapPin,
      color: 'text-purple-600'
    },
  ];

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
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
            <h1 className="text-2xl font-bold">{t('analytics.title')}</h1>
          </div>
          <div className="flex items-center gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <Calendar className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">Last 24h</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              {t('analytics.export')}
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <div className="flex items-center gap-1 mt-1">
                      {stat.trend === 'up' && <TrendingUp className="w-4 h-4 text-green-600" />}
                      {stat.trend === 'down' && <TrendingDown className="w-4 h-4 text-red-600" />}
                      <span className={`text-sm ${
                        stat.trend === 'up' ? 'text-green-600' : 
                        stat.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {stat.change}
                      </span>
                    </div>
                  </div>
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
            <TabsTrigger value="tourists">Tourists</TabsTrigger>
            <TabsTrigger value="heatmap">{t('analytics.heatmap')}</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Daily Alert Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={alertTrends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" tickFormatter={(date) => new Date(date).toLocaleDateString()} />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="critical" stackId="1" stroke="#ef4444" fill="#ef4444" />
                      <Area type="monotone" dataKey="moderate" stackId="1" stroke="#f59e0b" fill="#f59e0b" />
                      <Area type="monotone" dataKey="low" stackId="1" stroke="#10b981" fill="#10b981" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Incident Types Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={incidentTypes}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {incidentTypes.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Tourist Flow Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={touristFlow}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('analytics.daily')} Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={alertTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tickFormatter={(date) => new Date(date).toLocaleDateString()} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="critical" fill="#ef4444" name="Critical" />
                    <Bar dataKey="moderate" fill="#f59e0b" name="Moderate" />
                    <Bar dataKey="low" fill="#10b981" name="Low" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tourists" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Hourly Tourist Count</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={touristFlow}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="hour" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Response Time by Zone</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={responseTime}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="zone" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="avgTime" fill="#8b5cf6" name="Avg Response Time (min)" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="heatmap" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Risk {t('analytics.heatmap')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {heatmapData.map((zone, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">{zone.zone}</span>
                        </div>
                        <Badge className={getRiskColor(zone.risk)}>
                          {zone.risk} risk
                        </Badge>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-bold">{zone.incidents}</span>
                        <p className="text-sm text-muted-foreground">{t('analytics.incidents')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Geographic Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-96 bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-950 dark:to-green-950 rounded-lg flex items-center justify-center relative overflow-hidden">
                  <div className="text-center">
                    <MapPin className="w-16 h-16 mx-auto text-primary mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Interactive Heatmap</h3>
                    <p className="text-muted-foreground">Geographic visualization of incident density</p>
                  </div>
                  
                  {/* Mock heatmap points */}
                  <div className="absolute top-12 left-16 w-8 h-8 bg-red-500/60 rounded-full blur-sm"></div>
                  <div className="absolute bottom-20 right-20 w-12 h-12 bg-red-600/80 rounded-full blur-sm"></div>
                  <div className="absolute top-24 right-32 w-6 h-6 bg-yellow-500/60 rounded-full blur-sm"></div>
                  <div className="absolute bottom-32 left-24 w-4 h-4 bg-green-500/60 rounded-full blur-sm"></div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;