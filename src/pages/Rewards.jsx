import React, { useState } from 'react';
import { Card } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { Badge } from '../components/ui/badge';
import { Award, Gift, Star, Crown, ChevronRight, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/button'; // Button එකක් එකතු කරන ලදී
import Navbar from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/use-toast'; // Toast එකක් එකතු කරන ලදී

const Rewards = () => {
    const { user } = useAuth();
    const { toast } = useToast();
    
    // User data වෙතින් Points ලබා ගැනීම
    const points = user && user.loyaltyPoints ? user.loyaltyPoints : 0;
    
    // 🎯 ඔබට Reward එක Redeem කිරීමට අවශ්‍ය Points ගණන මෙහි සකසන්න
    const nextRewardPoints = 500;
    const progress = (points / nextRewardPoints) * 100;

    // --- Static Data ---
    const badges = [
        { id: 1, name: 'First Order', icon: '🎉', requirement: 10 },
        { id: 2, name: 'Burger Lover', icon: '🍔', requirement: 50 },
        { id: 3, name: 'Regular Customer', icon: '⭐', requirement: 100 },
        { id: 4, name: 'Gold Member', icon: '👑', requirement: 500 },
        { id: 5, name: 'Legendary', icon: '🏆', requirement: 1000 },
    ];

    const rewards = [
        { points: 100, reward: 'Free Drink', icon: '🥤', code: 'FREE_DRINK100' },
        { points: 250, reward: 'Free Fries', icon: '🍟', code: 'FREE_FRIES250' },
        { points: 500, reward: 'Free Burger', icon: '🍔', code: 'FREE_BURGER500' },
        { points: 1000, reward: 'Free Meal Combo', icon: '🎁', code: 'FREE_MEAL1000' },
    ];

    // --- Action Logic ---
    const handleRedeem = (item) => {
        // 💡 මෙහිදී Backend API call එකක් යා යුතුයි:
        // 1. Check if user still has enough points.
        // 2. Reduce points in the database.
        // 3. Store the redeemed coupon code under the user's profile.
        
        if (points < item.points) {
            toast({
                title: "❌ Insufficient Points",
                description: `You need ${item.points - points} more points to redeem this reward.`,
                variant: "destructive",
                duration: 2000,
            });
            return;
        }

        // Simulate successful redemption and point reduction
        toast({
            title: `✅ Reward Redeemed!`,
            description: `You successfully redeemed a ${item.reward}! Use coupon code: ${item.code}`,
            duration: 8000,
        });

        // 💡 Future: Call setUser in AuthContext to instantly update loyalty points
        // const newPoints = points - item.points;
        // API call to update points...
    };

    // --- UI Helpers ---
    const getMemberSinceDate = () => {
        if (user?.createdAt) {
            return new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
        }
        return 'N/A';
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
            <Navbar />
            
            <div className="container px-4 py-8 mx-auto">
                <h1 className="mb-8 text-4xl font-bold">Loyalty Rewards</h1>

                {/* Points Card */}
                <Card className="p-8 mb-8 glass elegant-shadow">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="mb-2 text-3xl font-bold">Your Loyalty Points</h2>
                            <p className="text-5xl font-bold text-primary">{points}</p>
                            <p className="text-sm text-muted-foreground mt-2">
                                Member Since: {getMemberSinceDate()}
                            </p>
                        </div>
                        <Crown className="w-24 h-24 text-primary" />
                    </div>
                    
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm text-muted-foreground">
                            <span>Progress to next goal ({nextRewardPoints} pts)</span>
                            <span>{points}/{nextRewardPoints} points</span>
                        </div>
                        <Progress value={progress} className="h-3" />
                    </div>
                </Card>

                {/* Available Rewards */}
                <div className="mb-8">
                    <h2 className="mb-4 text-2xl font-bold flex items-center gap-2"><Gift className="w-6 h-6 text-primary" /> Redeem Your Rewards</h2>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                        {rewards.map((item) => {
                            const canRedeem = points >= item.points;
                            return (
                                <Card 
                                    key={item.points} 
                                    className={`glass p-6 text-center transition-all duration-300 ${
                                        canRedeem ? 'gold-glow border-primary/50' : 'opacity-60 grayscale'
                                    }`}
                                >
                                    <div className="mb-3 text-4xl">{item.icon}</div>
                                    <h3 className="mb-2 font-bold">{item.reward}</h3>
                                    <Badge variant={canRedeem ? 'default' : 'secondary'}>
                                        Costs {item.points} points
                                    </Badge>
                                    
                                    <Button
                                        size="sm"
                                        className="mt-4 w-full gap-2"
                                        variant={canRedeem ? 'default' : 'outline'}
                                        onClick={() => canRedeem && handleRedeem(item)}
                                        disabled={!canRedeem}
                                    >
                                        {canRedeem ? 'Redeem Now' : `Need ${item.points - points} more`}
                                        {canRedeem && <ChevronRight className="w-4 h-4" />}
                                    </Button>
                                </Card>
                            );
                        })}
                    </div>
                </div>

                {/* Badges */}
                <div>
                    <h2 className="mb-4 text-2xl font-bold flex items-center gap-2"><Award className="w-6 h-6 text-primary" /> Unlocked Badges</h2>
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
                        {badges.map((badge) => {
                            const isUnlocked = points >= badge.requirement;
                            return (
                                <Card 
                                    key={badge.id} 
                                    className={`glass p-6 text-center ${
                                        isUnlocked ? 'border-green-500/50' : 'opacity-40 grayscale border-border'
                                    }`}
                                >
                                    <div className="mb-3 text-5xl">{badge.icon}</div>
                                    <h3 className="text-sm font-semibold">{badge.name}</h3>
                                    {isUnlocked ? (
                                        <Badge className="mt-2" variant="secondary"><CheckCircle className='w-3 h-3 mr-1'/> Unlocked</Badge>
                                    ) : (
                                        <Badge className="mt-2" variant="outline">Req. {badge.requirement} pts</Badge>
                                    )}
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Rewards;