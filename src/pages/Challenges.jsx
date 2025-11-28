import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { Badge } from '../components/ui/badge';
import { Trophy, Target, Calendar, ArrowLeft, Gift, RotateCw, Loader2, Beef, X } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useToast } from '../hooks/use-toast';
import { mockChallenges, mockLeaderboard } from '../data/mockData';
import Navbar from "../components/Navbar"; 
import { useAuth } from "../contexts/AuthContext"; 

// --- Configuration: Must match backend configuration ---
const PRIZES = [
  { name: 'LKR 100 OFF', type: 'win', description: 'A small boost for your next meal!' },
  { name: 'FREE DRINK', type: 'win', description: 'Enjoy a free drink on us!' },
  { name: '5% OFF', type: 'win', description: 'Get 5% off your next order!' },
  { name: 'TRY AGAIN', type: 'lose', description: 'Better luck tomorrow!' },
];

const getTodayDateString = () => {
  return new Date().toISOString().split('T')[0]; // YYYY-MM-DD
};

// --- Daily Instant Reward Game Component ---
const DailyInstantReward = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [canPlay, setCanPlay] = useState(false); 
  const [result, setResult] = useState(null); 
  const [loading, setLoading] = useState(true); 
  
  const API_URL = 'https://grilmelt-burger.onrender.com/api/rewards'; // 💡 Backend API Endpoint

  // 1. Backend වෙතින් දෛනික ක්‍රීඩා තත්ත්වය ලබා ගැනීම (Limit Check)
  useEffect(() => {
      const fetchStatus = async () => {
          if (!user || !user.token) {
              setCanPlay(false);
              setLoading(false);
              return;
          }
          
          try {
              const response = await fetch(`${API_URL}/status`, {
                  headers: { 
                      'Authorization': `Bearer ${user.token}` 
                  }
              });
              
              const data = await response.json();
              
              if (response.ok) {
                  setCanPlay(data.canPlay);
                  
                  if (data.lastResult) {
                      // Backend string එකට අදාළ prize object එක සොයා ගැනීම
                      const lastPrize = PRIZES.find(p => p.name === data.lastResult) || { 
                          name: data.lastResult, 
                          type: data.lastResult === 'TRY AGAIN' ? 'lose' : 'win', 
                          code: 'SAVED',
                          description: 'You already claimed your prize for today.' 
                      };
                      setResult(lastPrize);
                  }
              } else {
                  toast({ title: 'Error', description: data.message || 'Failed to check reward status.', variant: 'destructive', duration: 2000 });
              }
              
          } catch (error) {
              console.error("Failed to fetch daily play status:", error);
              toast({ title: 'Network Error', description: 'Could not connect to rewards server.', variant: 'destructive', duration: 2000 });
          } finally {
              setLoading(false);
          }
      };
      fetchStatus();
  }, [user, toast]);

  // 2. Play Button Click Logic (API call to win)
  const handlePlayClick = async () => {
      if (!user || loading || !canPlay) return;

      setLoading(true);
      
      try {
          const response = await fetch(`${API_URL}/play`, {
              method: 'POST',
              headers: { 
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${user.token}` 
              },
              body: JSON.stringify({})
          });
          const data = await response.json();

          if (response.ok && data.success) {
              const finalResult = data.prize;
              setResult(finalResult);
              setCanPlay(false); // Lock play after successful response

              if (finalResult.type === 'win') {
                  toast({
                      title: `🥳 Instant Win: ${finalResult.name}!`,
                      description: `Your unique code **${finalResult.code}** has been saved to your account!`,
                      duration: 8000,
                  });
              } else {
                  toast({
                      title: '😔 Try Again Tomorrow!',
                      description: finalResult.description,
                      variant: 'secondary',
                      duration: 2000,
                  });
              }
          } else {
              // Handle already played or authorization error
              toast({ title: 'Error', description: data.message || 'Failed to process reward.', variant: 'destructive', duration: 2000 });
              setCanPlay(false); 
          }
      } catch (error) {
          console.error("Error playing daily reward:", error);
          toast({ title: 'Network Error', description: 'Could not connect to server.', variant: 'destructive', duration: 2000 });
      } finally {
          setLoading(false);
      }
  };
  
  // If user is not logged in, show login prompt
  if (!user) {
    return (
        <Card className="p-6 md:p-8 text-center glass elegant-shadow overflow-hidden">
            <h2 className="mb-4 text-3xl font-bold text-primary">Login to Get Daily Reward!</h2>
            <p className="mb-8 text-muted-foreground">Log in to unlock your daily reward and win exclusive discounts.</p>
            <Button onClick={() => navigate('/auth')} size="lg" className="gold-glow">
                Log In / Register
            </Button>
        </Card>
    );
  }

  // --- UI Rendering ---
  const isPlayedToday = result && !canPlay;

  return (
    <Card className="p-6 md:p-8 text-center glass elegant-shadow overflow-hidden">
      <h2 className="mb-4 text-3xl font-bold flex items-center justify-center gap-2">
        <Gift className="w-8 h-8 text-red-500" /> Daily Instant Reward
      </h2>
      <p className="mb-8 text-muted-foreground">Click the button below to instantly reveal your daily reward!</p>
      
      {loading && (
        <Badge variant="secondary" className="mb-6 p-2 text-md flex items-center justify-center gap-2 mx-auto w-fit">
            <Loader2 className='w-4 h-4 animate-spin' /> Loading Status...
        </Badge>
      )}

      {isPlayedToday && (
        <Badge variant="destructive" className="mb-6 p-2 text-md flex items-center justify-center gap-2 mx-auto w-fit">
            <RotateCw className='w-4 h-4' /> Reward Claimed Today. Available tomorrow!
        </Badge>
      )}

      {result && (
        <Card className={`mb-6 p-4 mx-auto w-full max-w-sm ${result.type === 'win' ? 'bg-primary/20 border-primary' : 'bg-gray-700/20 border-gray-500'}`}>
            <h4 className='text-xl font-bold'>
                {result.type === 'win' ? result.name : "Unlucky!"}
            </h4>
            <p className='text-sm mt-1'>{result.description}</p>
            {result.code && <p className='mt-2 font-mono text-primary'>Code: {result.code}</p>}
        </Card>
      )}

      <Button 
        onClick={handlePlayClick} 
        size="lg" 
        className="mt-4 gold-glow" 
        disabled={!canPlay || loading} 
      >
        {loading ? (
            <><Loader2 className='w-5 h-5 animate-spin mr-2' /> Loading/Processing...</>
        ) : isPlayedToday ? (
            'Reward Claimed'
        ) : (
            'Claim Your Instant Reward'
        )}
      </Button>
    </Card>
  );
};

// --- Main Challenges Component ---
const Challenges = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
      <Navbar /> 
      <div className="container px-4 py-8 mx-auto relative">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="absolute top-8 left-4 md:left-8 flex items-center gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <div className="mb-12 text-center pt-10">
          <h1 className="text-4xl font-bold md:text-5xl">
            <span className="text-transparent bg-gradient-to-r from-primary to-accent bg-clip-text">Challenges & Rewards</span>
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">Play games, earn points, and get rewarded!</p>
        </div>

        <div className="mb-12">
          <DailyInstantReward /> 
        </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Challenges */}
            <div className="space-y-4 lg:col-span-2">
              <h2 className="mb-4 text-2xl font-bold">Active Challenges</h2>
              {mockChallenges.map((challenge) => (
                <Card key={challenge.id} className="p-6 glass">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Target className="w-6 h-6 text-primary" />
                        <h3 className="text-xl font-bold">{challenge.name}</h3>
                      </div>
                      <p className="mb-3 text-muted-foreground">{challenge.description}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>Expires: {challenge.expiresAt}</span>
                      </div>
                    </div>
                    <Badge className="bg-primary/20 text-primary">
                      +{challenge.reward} pts
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span className="text-muted-foreground">
                        {challenge.progress}/{challenge.total}
                      </span>
                    </div>
                    <Progress 
                      value={(challenge.progress / challenge.total) * 100} 
                      className="h-2"
                    />
                  </div>
                </Card>
              ))}
            </div>

            {/* Leaderboard */}
            <div className="lg:col-span-1">
              <Card className="sticky p-6 glass top-24">
                <div className="flex items-center gap-2 mb-6">
                  <Trophy className="w-6 h-6 text-primary" />
                  <h2 className="text-2xl font-bold">Leaderboard</h2>
                </div>
                
                <div className="space-y-3">
                  {mockLeaderboard.map((entry) => (
                    <div 
                      key={entry.rank}
                      className={`flex items-center gap-3 p-3 rounded-lg ${
                        entry.rank <= 3 ? 'bg-primary/10 border border-primary/20' : 'bg-secondary'
                      }`}
                    >
                      <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold ${
                        entry.rank === 1 ? 'bg-yellow-500 text-black' :
                        entry.rank === 2 ? 'bg-gray-400 text-black' :
                        entry.rank === 3 ? 'bg-amber-600 text-black' :
                        'bg-muted'
                      }`}>
                        {entry.rank}
                      </div>
                      
                      <div className="flex-1">
                        <p className="font-semibold">{entry.name}</p>
                        <p className="text-sm text-muted-foreground">{entry.points} points</p>
                      </div>
                      
                      <div className="flex gap-1">
                        {entry.badges.map((badge, idx) => (
                          <span key={idx} className="text-lg">{badge}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
    </div>
  );
};

export default Challenges;