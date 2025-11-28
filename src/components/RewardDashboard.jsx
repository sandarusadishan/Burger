// src/components/RewardDashboard.jsx

import React, { useState } from 'react';
import { Card } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Users, DollarSign, RotateCw, Settings, Gift } from 'lucide-react';
import { Button } from './ui/button';

// Mock data (replace with API calls in a real application)
const MOCK_REWARD_STATS = {
    totalPlaysToday: 550,
    uniqueWinners: 400,
    totalValueGiven: 15000 
};

const MOCK_AUDIT_DATA = [
    { id: 1, user: 'Kamal Perera', prize: 'LKR 100 OFF', date: '2025-11-09', type: 'win' },
    { id: 2, user: 'Admin User', prize: 'TRY AGAIN', date: '2025-11-09', type: 'lose' },
    { id: 3, user: 'Sanduni D', prize: 'FREE DRINK', date: '2025-11-08', type: 'win' },
];

const RewardDashboard = () => {
    const [auditData, setAuditData] = useState(MOCK_AUDIT_DATA);
    const [stats, setStats] = useState(MOCK_REWARD_STATS);
    const [loading, setLoading] = useState(false);

    // 💡 Future Improvement: Add API fetch functions here
    // useEffect(() => { ... fetch('/api/admin/rewards/audit') ... }, []);

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold flex items-center gap-2">
                <Gift className="w-8 h-8 text-primary" /> Loyalty & Reward Management
            </h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <Card className="p-4 flex items-center justify-between bg-green-500/10 border-green-500 glass">
                    <div>
                        <p className="text-3xl font-bold">{stats.totalPlaysToday}</p>
                        <p className="text-sm text-muted-foreground">Plays Today</p>
                    </div>
                    <RotateCw className="w-8 h-8 text-green-500" />
                </Card>
                <Card className="p-4 flex items-center justify-between bg-primary/10 border-primary glass">
                    <div>
                        <p className="text-3xl font-bold">{stats.uniqueWinners}</p>
                        <p className="text-sm text-muted-foreground">Unique Winners</p>
                    </div>
                    <Users className="w-8 h-8 text-primary" />
                </Card>
                <Card className="p-4 flex items-center justify-between bg-yellow-500/10 border-yellow-500 glass">
                    <div>
                        <p className="text-2xl font-bold">LKR {stats.totalValueGiven}</p>
                        <p className="text-sm text-muted-foreground">Total Value Given (Mock)</p>
                    </div>
                    <DollarSign className="w-8 h-8 text-yellow-500" />
                </Card>
            </div>

            {/* Audit Table */}
            <Card className="glass">
                <h2 className="p-4 text-xl font-semibold border-b border-border/50 flex justify-between items-center">
                    Daily Reward Audit Log
                    <Button size="sm" variant="outline" disabled>
                        <Settings className="w-4 h-4 mr-2" /> Manage Coupons
                    </Button>
                </h2>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[150px]">Date</TableHead>
                                <TableHead>User (Mock)</TableHead>
                                <TableHead>Prize Won</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {auditData.map((log) => (
                                <TableRow key={log.id}>
                                    <TableCell className="font-medium">
                                        {new Date(log.date).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>{log.user}</TableCell>
                                    <TableCell className="font-semibold">{log.prize}</TableCell>
                                    <TableCell>
                                        <Badge variant={log.type === 'win' ? 'default' : 'secondary'} className={`${log.type === 'win' ? 'bg-green-500 hover:bg-green-600' : ''}`}>
                                            {log.type === 'win' ? 'Won' : 'Lost'}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </Card>
        </div>
    );
};

export default RewardDashboard;