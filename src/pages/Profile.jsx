// src/pages/Profile.jsx (සර්ව සම්පූර්ණ කෝඩ්)

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { User, Mail, Award, Package, Edit, Save, X, Upload, Loader2, Key, Trash2, ShoppingBag } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { useToast } from '../hooks/use-toast';
import { Label } from '../components/ui/label';

const BASE_URL = "https://grilmelt-burger.onrender.com";
const API_URL = `${BASE_URL}/api`;

const Profile = () => {
  const { user, setUser } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  // ✅ Order history and count state
  const [userOrders, setUserOrders] = useState([]); 
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (user) setFormData({ name: user.name, email: user.email });
  }, [user]);

  // ✅ Order History Fetch Logic
  useEffect(() => {
    const fetchOrderHistory = async () => {
      if (!user || !user._id || !user.token) return;
      try {
        const res = await fetch(`${API_URL}/orders/user/${user._id}`, {
          headers: { 'Authorization': `Bearer ${user.token}` },
        });
        const data = await res.json();
        if (res.ok && Array.isArray(data)) {
          // Sort orders by date, newest first
          setUserOrders(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        } else {
          setUserOrders([]);
        }
      } catch (error) {
        console.error('Error fetching order history:', error);
        setUserOrders([]);
      }
    };
    if (user && user.token) fetchOrderHistory();
  }, [user]);

  // Preview URL for new image upload
  useEffect(() => {
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else setPreviewUrl(null);
  }, [selectedFile]);

  // --- Profile Update Logic ---
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!user || loading) return;

    setLoading(true);
    const updateFormData = new FormData();
    updateFormData.append('name', formData.name);
    updateFormData.append('email', formData.email);
    if (user.role) updateFormData.append('role', user.role);
    if (selectedFile) updateFormData.append('profilePic', selectedFile);

    try {
      const res = await fetch(`${API_URL}/users/${user._id}`, {
        method: 'PUT',
        // ✅ Authorization token එකතු කළා
        headers: { 'Authorization': `Bearer ${user.token}` }, 
        body: updateFormData,
      });
      const data = await res.json();
      if (res.ok) {
        toast({
          title: '✅ Profile Updated!',
          description: 'Your information has been successfully saved.',
          duration: 2000,
        });
        if (setUser) {
          const updatedUser = data.user;
          // Update Auth Context with new data including profileImage path
          setUser((prev) => ({
            ...prev,
            ...updatedUser,
            profileImage: updatedUser.profileImage || prev.profileImage,
          }));
        }
        setIsEditing(false);
        setSelectedFile(null);
      } else throw new Error(data.message || 'Failed to update profile.');
    } catch (error) {
      console.error('Profile update error:', error);
      toast({
        title: '❌ Update Failed',
        description: error.message,
        variant: 'destructive',
        duration: 2000,
      });
    } finally {
      setLoading(false);
    }
  };

  // ✅ --- Profile Photo Removal Logic ---
  const handleRemovePhoto = async () => {
    if (!user || loading || !user.profileImage) return;
    
    // ✅ Use toast for confirmation (or a custom dialog component)
    toast({ title: "Removing Photo...", description: "Please wait while we remove your profile picture." });
    
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/users/${user._id}/profile-image`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${user.token}` },
      });
      const data = await res.json();
      if (res.ok) {
        toast({
          title: '🗑️ Photo Removed!',
          description: 'Your profile picture has been removed.',
          duration: 2000,
        });
        // Update context and local state
        setUser((prev) => ({ ...prev, profileImage: data.user.profileImage }));
        setSelectedFile(null);
        setPreviewUrl(null);
      } else {
        throw new Error(data.message || 'Failed to remove photo.');
      }
    } catch (error) {
      console.error('Photo removal error:', error);
      toast({ title: '❌ Error', description: error.message, variant: 'destructive', duration: 2000 });
    } finally {
      setLoading(false);
    }
  };


  // --- Password Change Logic (Unchanged) ---
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!user || loading) return;
    if (passwordData.newPassword.length < 6)
      return toast({ title: 'Password too short', description: 'New password must be at least 6 characters.', variant: 'destructive', duration: 2000 });
    if (passwordData.newPassword !== passwordData.confirmNewPassword)
      return toast({ title: 'Mismatch', description: 'New passwords do not match.', variant: 'destructive', duration: 2000 });

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/users/change-password/${user._id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}` // ✅ Token එකතු කළා
        },
        body: JSON.stringify({ currentPassword: passwordData.currentPassword, newPassword: passwordData.newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        toast({ title: '✅ Success', description: 'Password changed successfully.', duration: 2000 });
        setPasswordData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
        setIsChangingPassword(false);
      } else throw new Error(data.message || 'Failed to change password.');
    } catch (error) {
      console.error('Password change error:', error);
      toast({ title: '❌ Error', description: error.message, variant: 'destructive', duration: 2000 });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setFormData({ name: user.name, email: user.email });
    setSelectedFile(null);
  };
  const handleCancelPasswordChange = () => {
    setIsChangingPassword(false);
    setPasswordData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
  };

  if (!user) return <div className="text-center py-20">Please log in to view your profile.</div>;

  // --- UI Helpers ---
  const timestamp = new Date().getTime();
  const displayImage =
    previewUrl
      ? previewUrl
      : user.profileImage
      ? `${BASE_URL}${user.profileImage}?t=${timestamp}` // Added cache busting
      : 'placeholder';

  const ProfileImageUI = () => (
    <div className="flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-primary/20 overflow-hidden">
      {displayImage === 'placeholder' ? (
        <User className="w-10 h-10 sm:w-12 sm:h-12 text-primary" />
      ) : (
        <img src={displayImage} alt="Profile" className="object-cover w-full h-full rounded-full" />
      )}
    </div>
  );

  const stats = [
    { label: 'Loyalty Points', value: user.loyaltyPoints || 0, icon: Award, color: 'text-yellow-400' },
    { label: 'Total Orders', value: userOrders.length, icon: Package, color: 'text-blue-400' }, // ✅ Dynamic count
    { 
      label: 'Member Since',
      // ✅ Month and Year format
      value: user.memberSince
        ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
        : 'N/A',
      icon: User,
      color: 'text-green-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
      <Navbar />

      <div className="container px-4 sm:px-6 md:px-8 py-8 mx-auto">
        <h1 className="mb-8 text-3xl sm:text-4xl font-bold text-center md:text-left">My Profile</h1>

        <div className="grid gap-6 md:gap-8 lg:grid-cols-3">
          {/* Profile Info & Settings */}
          <div className="space-y-6 lg:col-span-2">
            <Card className="p-6 sm:p-8 glass">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
                  <ProfileImageUI />
                  <div>
                    {isEditing ? (
                      <div className="space-y-2">
                        <Input
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Your Name"
                          className="text-xl font-bold"
                        />
                        <Input
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="Your Email"
                          className="text-muted-foreground"
                        />
                      </div>
                    ) : (
                      <>
                        <h2 className="mb-1 text-2xl font-bold">{user.name}</h2>
                        <p className="flex items-center justify-center sm:justify-start gap-2 text-muted-foreground">
                          <Mail className="w-4 h-4" />
                          {user.email}
                        </p>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex justify-center sm:justify-end">
                  <Badge variant="secondary" className="text-sm sm:text-lg">
                    {user.role}
                  </Badge>
                </div>
              </div>

              {/* Responsive Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {stats.map((stat) => (
                  <div key={stat.label} className="p-4 text-center rounded-lg bg-secondary">
                    <stat.icon className={`h-8 w-8 mx-auto mb-2 ${stat.color}`} />
                    <p className="mb-1 text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Account Settings */}
            <Card className="p-6 sm:p-8 glass">
              <h3 className="mb-4 text-lg sm:text-xl font-bold">Account Settings</h3>

              {isEditing && (
                <form
                  onSubmit={handleUpdateProfile}
                  className="space-y-4 mb-6 p-4 rounded-lg border border-primary/20"
                >
                  <h4 className="font-semibold">Update Details & Photo</h4>
                  <div className="space-y-2">
                    <Label htmlFor="profile-pic">Change Profile Picture</Label>
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      <Input
                        id="profile-pic"
                        type="file"
                        accept="image/*"
                        onChange={(e) => setSelectedFile(e.target.files[0])}
                        className="flex-1"
                      />
                    </div>
                    {/* ✅ Remove Photo Button */}
                    {user.profileImage && !previewUrl && (
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={handleRemovePhoto}
                        className="w-full gap-2 mt-2"
                        disabled={loading}
                      ><Trash2 className="w-4 h-4" /> Remove Current Photo</Button>
                    )}
                  </div>

                  <Button type="submit" className="w-full gap-2" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" /> Save Changes
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleCancelEdit}
                    className="w-full gap-2"
                  >
                    <X className="w-4 h-4" /> Cancel
                  </Button>
                </form>
              )}

              {isChangingPassword && (
                <form
                  onSubmit={handlePasswordChange}
                  className="space-y-4 mb-6 p-4 rounded-lg border border-red-500/20"
                >
                  <h4 className="font-semibold flex items-center gap-2 text-red-400">
                    <Key className="w-4 h-4" /> Change Password
                  </h4>
                  <Input
                    type="password"
                    placeholder="Current Password"
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, currentPassword: e.target.value })
                    }
                    required
                  />
                  <Input
                    type="password"
                    placeholder="New Password (min 6 chars)"
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, newPassword: e.target.value })
                    }
                    required
                  />
                  <Input
                    type="password"
                    placeholder="Confirm New Password"
                    value={passwordData.confirmNewPassword}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, confirmNewPassword: e.target.value })
                    }
                    required
                  />

                  <Button
                    type="submit"
                    className="w-full gap-2 bg-red-600 hover:bg-red-700"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Updating...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" /> Update Password
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleCancelPasswordChange}
                    className="w-full gap-2"
                  >
                    <X className="w-4 h-4" /> Cancel
                  </Button>
                </form>
              )}

              {!isEditing && !isChangingPassword && (
                <div className="space-y-4">
                  <Button
                    variant="outline"
                    className="justify-start w-full gap-2"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit className="w-4 h-4" /> Edit Profile
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start w-full gap-2"
                    onClick={() => setIsChangingPassword(true)}
                  >
                    <Key className="w-4 h-4" /> Change Password
                  </Button>
                  <Button variant="outline" className="justify-start w-full">
                    Notification Preferences
                  </Button>
                </div>
              )}
            </Card>
          </div>

          {/* Right Sidebar (Recent Activity) */}
          <div className="lg:col-span-1">
            <Card className="p-6 sm:p-8 glass sticky top-24">
              <h3 className="mb-4 text-lg sm:text-xl font-bold">Recent Activity</h3>
              {/* ✅ Real Recent Activity */}
              {userOrders.length > 0 ? (
                <div className="space-y-3 text-sm">
                  {userOrders.slice(0, 4).map((order) => (
                    <div key={order._id} className="p-3 rounded-lg bg-secondary">
                      <p className="font-semibold flex justify-between">
                        <span>Order #{order._id.slice(-6)}</span>
                        <span className="text-primary">LKR {order.totalAmount.toFixed(2)}</span>
                      </p>
                      <p className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-4">
                  <ShoppingBag className="w-8 h-8 mx-auto mb-2" />
                  <p>No recent orders found.</p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;