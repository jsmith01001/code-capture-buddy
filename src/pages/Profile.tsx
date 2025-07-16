import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Loader2, Crown, ShoppingBag, Package } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Profile {
  id: string;
  full_name: string;
  phone: string;
  address: string;
  bio: string;
  avatar_url: string;
  total_purchases: number;
  total_sales: number;
  last_active: string;
}

interface Subscription {
  id: string;
  plan_type: string;
  status: string;
  starts_at: string;
  ends_at: string | null;
}

interface UserRole {
  role: string;
}

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [userRole, setUserRole] = useState<string>('buyer');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [subscribing, setSubscribing] = useState(false);

  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    address: '',
    bio: '',
    avatar_url: ''
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchSubscription();
      fetchUserRole();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setProfile(data);
        setFormData({
          full_name: data.full_name || '',
          phone: data.phone || '',
          address: data.address || '',
          bio: data.bio || '',
          avatar_url: data.avatar_url || ''
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    }
  };

  const fetchSubscription = async () => {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user?.id)
        .eq('status', 'active')
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setSubscription(data);
    } catch (error) {
      console.error('Error fetching subscription:', error);
    }
  };

  const fetchUserRole = async () => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setUserRole(data.role);
      }
    } catch (error) {
      console.error('Error fetching user role:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          user_id: user?.id,
          ...formData,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast.success('Profile updated successfully');
      fetchProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleSubscribeToSeller = async () => {
    setSubscribing(true);
    try {
      // First, add seller role
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({
          user_id: user?.id,
          role: 'seller'
        });

      if (roleError && roleError.code !== '23505') { // Ignore duplicate key error
        throw roleError;
      }

      // Then create subscription
      const { error: subscriptionError } = await supabase
        .from('subscriptions')
        .insert({
          user_id: user?.id,
          plan_type: 'seller_basic',
          status: 'active',
          starts_at: new Date().toISOString()
        });

      if (subscriptionError) throw subscriptionError;

      toast.success('Successfully subscribed to seller plan!');
      fetchSubscription();
      fetchUserRole();
    } catch (error) {
      console.error('Error subscribing to seller plan:', error);
      toast.error('Failed to subscribe to seller plan');
    } finally {
      setSubscribing(false);
    }
  };

  const isActiveSeller = userRole === 'seller' && subscription?.status === 'active';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">My Profile</h1>
          <p className="text-muted-foreground">Manage your account and seller settings</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={formData.avatar_url} />
                  <AvatarFallback>
                    {formData.full_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                Profile Information
              </CardTitle>
              <CardDescription>Update your personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input
                    id="full_name"
                    value={formData.full_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="Enter your address"
                />
              </div>

              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="Tell us about yourself"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="avatar_url">Profile Picture URL</Label>
                <Input
                  id="avatar_url"
                  value={formData.avatar_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, avatar_url: e.target.value }))}
                  placeholder="Enter image URL"
                />
              </div>

              <Button onClick={handleSaveProfile} disabled={saving} className="w-full">
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Profile
              </Button>
            </CardContent>
          </Card>

          {/* Account Status & Seller Subscription */}
          <div className="space-y-6">
            {/* Account Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5" />
                  Account Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Account Type:</span>
                  <Badge variant={isActiveSeller ? "default" : "secondary"}>
                    {isActiveSeller ? "Seller" : "Buyer"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Total Purchases:</span>
                  <span className="font-semibold">{profile?.total_purchases || 0}</span>
                </div>
                {isActiveSeller && (
                  <div className="flex items-center justify-between">
                    <span>Total Sales:</span>
                    <span className="font-semibold">{profile?.total_sales || 0}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Seller Subscription */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="h-5 w-5" />
                  Seller Plan
                </CardTitle>
                <CardDescription>
                  Upgrade to start selling products
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!isActiveSeller ? (
                  <div className="text-center space-y-4">
                    <div className="text-muted-foreground">
                      <Package className="h-12 w-12 mx-auto mb-2 text-muted-foreground/50" />
                      <p>Subscribe to our seller plan to start listing and selling products on Sokovuma.</p>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">Seller Plan Features:</div>
                      <ul className="text-sm space-y-1 text-left">
                        <li>• List unlimited products</li>
                        <li>• Manage inventory</li>
                        <li>• Track sales analytics</li>
                        <li>• Customer support</li>
                      </ul>
                    </div>
                    <Button 
                      onClick={handleSubscribeToSeller} 
                      disabled={subscribing}
                      className="w-full"
                    >
                      {subscribing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Subscribe to Seller Plan
                    </Button>
                  </div>
                ) : (
                  <div className="text-center space-y-4">
                    <div className="text-sm space-y-2">
                      <div className="flex items-center justify-between">
                        <span>Plan:</span>
                        <Badge variant="default">{subscription?.plan_type}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Status:</span>
                        <Badge variant="default">{subscription?.status}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Started:</span>
                        <span className="text-sm">
                          {subscription?.starts_at ? new Date(subscription.starts_at).toLocaleDateString() : 'N/A'}
                        </span>
                      </div>
                    </div>
                    <Badge variant="outline" className="w-full justify-center py-2">
                      ✓ Active Seller Account
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;