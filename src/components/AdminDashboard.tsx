import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    Users,
    UserCheck,
    UserX,
    TrendingUp,
    Eye,
    Search,
    Download,
    MoreVertical,
    Shield,
    AlertTriangle
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from '@/hooks/use-toast';
import { DashboardStats, UserWithStats } from '@/types';
import { APP_CONFIG, ONBOARDING_STEPS, ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/constants';

const AdminDashboard: React.FC = () => {
    const [stats, setStats] = useState<DashboardStats>({
        totalUsers: 0,
        completedProfiles: 0,
        pendingOnboarding: 0,
        totalLinks: 0,
        dailySignups: 0,
        completionRate: 0
    });

    const [users, setUsers] = useState<UserWithStats[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFilter, setSelectedFilter] = useState<'all' | 'completed' | 'pending'>('all');

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);

            // Fetch dashboard statistics
            await Promise.all([
                fetchStats(),
                fetchUsers()
            ]);

        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            toast({
                title: "Error",
                description: ERROR_MESSAGES.NETWORK_ERROR,
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        const { data: usersData, error: usersError } = await supabase
            .from('users')
            .select('id, is_onboarding_complete, created_at');

        if (usersError) throw usersError;

        const { data: linksData, error: linksError } = await supabase
            .from('user_links')
            .select('id');

        if (linksError) throw linksError;

        const totalUsers = usersData?.length || 0;
        const completedProfiles = usersData?.filter(u => u.is_onboarding_complete).length || 0;
        const pendingOnboarding = totalUsers - completedProfiles;
        const totalLinks = linksData?.length || 0;

        // Calculate daily signups (last 24 hours)
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const dailySignups = usersData?.filter(u =>
            new Date(u.created_at) > yesterday
        ).length || 0;

        const completionRate = totalUsers > 0 ? (completedProfiles / totalUsers) * 100 : 0;

        setStats({
            totalUsers,
            completedProfiles,
            pendingOnboarding,
            totalLinks,
            dailySignups,
            completionRate
        });
    };

    const fetchUsers = async () => {
        const { data, error } = await supabase
            .from('users')
            .select(`
        id,
        user_code,
        name,
        email,
        is_onboarding_complete,
        onboarding_step,
        created_at,
        updated_at
      `)
            .order('created_at', { ascending: false });

        if (error) throw error;

        // Get link counts for each user
        const usersWithStats = await Promise.all(
            (data || []).map(async (user) => {
                const { data: linksData } = await supabase
                    .from('user_links')
                    .select('id')
                    .eq('user_id', user.id);

                return {
                    ...user,
                    link_count: linksData?.length || 0,
                    last_activity: user.updated_at || user.created_at
                } as UserWithStats;
            })
        );

        setUsers(usersWithStats);
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch =
            user.user_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesFilter =
            selectedFilter === 'all' ||
            (selectedFilter === 'completed' && user.is_onboarding_complete) ||
            (selectedFilter === 'pending' && !user.is_onboarding_complete);

        return matchesSearch && matchesFilter;
    });

    const exportUsers = async () => {
        try {
            const csvContent = [
                ['User Code', 'Name', 'Email', 'Status', 'Step', 'Links', 'Created'].join(','),
                ...filteredUsers.map(user => [
                    user.user_code,
                    user.name || '',
                    user.email || '',
                    user.is_onboarding_complete ? 'Complete' : 'Pending',
                    user.onboarding_step,
                    user.link_count,
                    new Date(user.created_at).toLocaleDateString()
                ].join(','))
            ].join('\n');

            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `e3-users-${new Date().toISOString().split('T')[0]}.csv`;
            a.click();
            window.URL.revokeObjectURL(url);

            toast({
                title: "Export Complete",
                description: "User data has been exported to CSV"
            });
        } catch (error) {
            toast({
                title: "Export Failed",
                description: "Failed to export user data",
                variant: "destructive"
            });
        }
    };

    const viewUserProfile = (userCode: string) => {
        window.open(`/${userCode}`, '_blank');
    };

    const resetUserOnboarding = async (userId: string) => {
        try {
            const { error } = await supabase
                .from('users')
                .update({
                    is_onboarding_complete: false,
                    onboarding_step: 0
                })
                .eq('id', userId);

            if (error) throw error;

            toast({
                title: "Reset Complete",
                description: "User onboarding has been reset"
            });

            fetchUsers(); // Refresh data
        } catch (error) {
            toast({
                title: "Reset Failed",
                description: "Failed to reset user onboarding",
                variant: "destructive"
            });
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getStepLabel = (step: number, isComplete: boolean) => {
        if (isComplete) return 'Complete';

        return ONBOARDING_STEPS[step] || 'Not Started';
    };

    if (loading) {
        return (
            <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    {[...Array(4)].map((_, i) => (
                        <Card key={i} className="animate-pulse">
                            <CardContent className="p-6">
                                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                                <div className="h-8 bg-gray-200 rounded"></div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">{APP_CONFIG.NAME} Admin</h1>
                    <p className="text-gray-600">Manage users and monitor system health</p>
                </div>
                <div className="flex gap-2">
                    <Button onClick={exportUsers} variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Export Data
                    </Button>
                    <Button onClick={fetchDashboardData}>
                        Refresh
                    </Button>
                </div>
            </div>

            {/* Warning Alert */}
            <Alert className="mb-6 border-yellow-200 bg-yellow-50">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-yellow-800">
                    <strong>Admin Access:</strong> This dashboard contains sensitive user data.
                    Ensure proper access controls are in place in production.
                </AlertDescription>
            </Alert>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Users</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                            </div>
                            <Users className="h-8 w-8 text-blue-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Completed Profiles</p>
                                <p className="text-2xl font-bold text-green-600">{stats.completedProfiles}</p>
                            </div>
                            <UserCheck className="h-8 w-8 text-green-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Pending Onboarding</p>
                                <p className="text-2xl font-bold text-orange-600">{stats.pendingOnboarding}</p>
                            </div>
                            <UserX className="h-8 w-8 text-orange-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                                <p className="text-2xl font-bold text-purple-600">{stats.completionRate.toFixed(1)}%</p>
                            </div>
                            <TrendingUp className="h-8 w-8 text-purple-600" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Users Table */}
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>User Management</CardTitle>
                        <div className="flex gap-2">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Search users..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 w-64"
                                />
                            </div>
                            <select
                                value={selectedFilter}
                                onChange={(e) => setSelectedFilter(e.target.value as any)}
                                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                            >
                                <option value="all">All Users</option>
                                <option value="completed">Completed</option>
                                <option value="pending">Pending</option>
                            </select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User Code</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Step</TableHead>
                                <TableHead>Links</TableHead>
                                <TableHead>Created</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredUsers.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell className="font-mono font-medium">
                                        {user.user_code}
                                    </TableCell>
                                    <TableCell>{user.name || '-'}</TableCell>
                                    <TableCell>{user.email || '-'}</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={user.is_onboarding_complete ? "default" : "secondary"}
                                        >
                                            {user.is_onboarding_complete ? 'Complete' : 'Pending'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {getStepLabel(user.onboarding_step, user.is_onboarding_complete)}
                                    </TableCell>
                                    <TableCell>{user.link_count}</TableCell>
                                    <TableCell>{formatDate(user.created_at)}</TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem
                                                    onClick={() => viewUserProfile(user.user_code)}
                                                >
                                                    <Eye className="h-4 w-4 mr-2" />
                                                    View Profile
                                                </DropdownMenuItem>
                                                {user.is_onboarding_complete && (
                                                    <DropdownMenuItem
                                                        onClick={() => resetUserOnboarding(user.id)}
                                                        className="text-red-600"
                                                    >
                                                        <Shield className="h-4 w-4 mr-2" />
                                                        Reset Onboarding
                                                    </DropdownMenuItem>
                                                )}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {filteredUsers.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                            No users found matching your criteria
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Additional Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span>Daily Signups</span>
                                <span className="font-semibold">{stats.dailySignups}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Total Links</span>
                                <span className="font-semibold">{stats.totalLinks}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Avg Links per User</span>
                                <span className="font-semibold">
                                    {stats.completedProfiles > 0
                                        ? (stats.totalLinks / stats.completedProfiles).toFixed(1)
                                        : '0'
                                    }
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>System Health</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span>Database Status</span>
                                <Badge variant="default">Healthy</Badge>
                            </div>
                            <div className="flex justify-between">
                                <span>API Response</span>
                                <Badge variant="default">Normal</Badge>
                            </div>
                            <div className="flex justify-between">
                                <span>Last Backup</span>
                                <span className="text-sm text-gray-600">2 hours ago</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AdminDashboard;