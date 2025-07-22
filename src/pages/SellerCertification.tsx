import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Loader2, Upload, FileCheck, User, Building, CreditCard, Shield, CheckCircle, XCircle, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface PaymentDetails {
  mpesa_number?: string;
  paypal_email?: string;
  bank_name?: string;
  account_number?: string;
}

const SellerCertification = () => {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [existingRequest, setExistingRequest] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    full_name: '',
    phone_number: '',
    physical_location: '',
    store_name: '',
    store_description: '',
    business_registration_number: '',
    product_categories: [] as string[],
    payment_method: '',
    payment_details: {} as PaymentDetails,
    terms_accepted: false
  });

  const [files, setFiles] = useState({
    profile_photo: null as File | null,
    government_id: null as File | null,
    selfie: null as File | null
  });

  useEffect(() => {
    console.log('SellerCertification useEffect - user:', user, 'authLoading:', authLoading);
    if (user && !authLoading) {
      fetchExistingRequest();
      fetchCategories();
    } else if (!authLoading && !user) {
      // Not authenticated and auth is done loading
      setLoading(false);
    }
  }, [user, authLoading]);

  const fetchExistingRequest = async () => {
    console.log('Fetching existing request for user:', user?.id);
    try {
      const { data, error } = await supabase
        .from('seller_requests')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setExistingRequest(data);
        setFormData({
          full_name: data.full_name,
          phone_number: data.phone_number || '',
          physical_location: data.physical_location,
          store_name: data.store_name,
          store_description: data.store_description,
          business_registration_number: data.business_registration_number || '',
          product_categories: data.product_categories,
          payment_method: data.payment_method,
          payment_details: (data.payment_details as PaymentDetails) || {},
          terms_accepted: data.terms_accepted
        });
      }
    } catch (error) {
      console.error('Error fetching seller request:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    console.log('Fetching categories...');
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const uploadFile = async (file: File, folder: string): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${user?.id}/${Date.now()}.${fileExt}`;
    const bucketName = folder === 'profile' ? 'profile-photos' : 'seller-documents';
    
    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from(bucketName)
      .getPublicUrl(fileName);

    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (!formData.terms_accepted) {
        toast.error('Please accept the terms and conditions');
        return;
      }

      if (!files.government_id && !existingRequest) {
        toast.error('Please upload your government ID');
        return;
      }

      setUploading(true);
      
      let profile_photo_url = existingRequest?.profile_photo_url;
      let government_id_url = existingRequest?.government_id_url;
      let selfie_url = existingRequest?.selfie_url;

      if (files.profile_photo) {
        profile_photo_url = await uploadFile(files.profile_photo, 'profile');
      }
      
      if (files.government_id) {
        government_id_url = await uploadFile(files.government_id, 'documents');
      }
      
      if (files.selfie) {
        selfie_url = await uploadFile(files.selfie, 'documents');
      }

      setUploading(false);

      const requestData = {
        user_id: user?.id,
        full_name: formData.full_name,
        profile_photo_url,
        phone_number: formData.phone_number,
        physical_location: formData.physical_location,
        government_id_url: government_id_url!,
        selfie_url,
        store_name: formData.store_name,
        store_description: formData.store_description,
        business_registration_number: formData.business_registration_number,
        product_categories: formData.product_categories,
        payment_method: formData.payment_method,
        payment_details: formData.payment_details as any,
        terms_accepted: formData.terms_accepted,
        terms_accepted_at: new Date().toISOString(),
        status: 'pending'
      };

      let error;
      if (existingRequest) {
        const result = await supabase
          .from('seller_requests')
          .update(requestData)
          .eq('id', existingRequest.id);
        error = result.error;
      } else {
        const result = await supabase
          .from('seller_requests')
          .insert([requestData]);
        error = result.error;
      }

      if (error) throw error;

      toast.success('Seller certification request submitted successfully!');
      fetchExistingRequest();
    } catch (error) {
      console.error('Error submitting request:', error);
      toast.error('Failed to submit request');
    } finally {
      setSubmitting(false);
      setUploading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="gap-2"><Clock className="h-3 w-3" />Pending Review</Badge>;
      case 'approved':
        return <Badge variant="default" className="gap-2"><CheckCircle className="h-3 w-3" />Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive" className="gap-2"><XCircle className="h-3 w-3" />Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground">Seller Certification</h1>
          <p className="text-muted-foreground">Complete your application to become a certified seller</p>
        </div>

        {existingRequest && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Application Status
                {getStatusBadge(existingRequest.status)}
              </CardTitle>
              <CardDescription>
                Submitted on {new Date(existingRequest.created_at).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            {existingRequest.status === 'rejected' && existingRequest.rejection_reason && (
              <CardContent>
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                  <h4 className="font-semibold text-destructive mb-2">Rejection Reason:</h4>
                  <p className="text-sm">{existingRequest.rejection_reason}</p>
                </div>
              </CardContent>
            )}
          </Card>
        )}

        {(!existingRequest || existingRequest.status === 'rejected') && (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Personal Information
                </CardTitle>
                <CardDescription>Complete your personal profile</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="full_name">Full Name *</Label>
                  <Input
                    id="full_name"
                    value={formData.full_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="phone_number">Phone Number</Label>
                  <Input
                    id="phone_number"
                    value={formData.phone_number}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone_number: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="physical_location">Physical Location *</Label>
                  <Input
                    id="physical_location"
                    value={formData.physical_location}
                    onChange={(e) => setFormData(prev => ({ ...prev, physical_location: e.target.value }))}
                    placeholder="City, Country"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="profile_photo">Profile Photo</Label>
                  <Input
                    id="profile_photo"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFiles(prev => ({ ...prev, profile_photo: e.target.files?.[0] || null }))}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Identity Verification */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Identity Verification
                </CardTitle>
                <CardDescription>Upload documents for identity verification</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="government_id">Government-issued ID *</Label>
                  <Input
                    id="government_id"
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={(e) => setFiles(prev => ({ ...prev, government_id: e.target.files?.[0] || null }))}
                    required={!existingRequest}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Upload a clear photo of your passport, driver's license, or national ID
                  </p>
                </div>

                <div>
                  <Label htmlFor="selfie">Selfie (Optional)</Label>
                  <Input
                    id="selfie"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFiles(prev => ({ ...prev, selfie: e.target.files?.[0] || null }))}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Take a selfie holding your ID for face match verification
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Business Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Business Information
                </CardTitle>
                <CardDescription>Tell us about your business</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="store_name">Store Name *</Label>
                  <Input
                    id="store_name"
                    value={formData.store_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, store_name: e.target.value }))}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="store_description">Store Description *</Label>
                  <Textarea
                    id="store_description"
                    value={formData.store_description}
                    onChange={(e) => setFormData(prev => ({ ...prev, store_description: e.target.value }))}
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="business_registration_number">Business Registration Number (Optional)</Label>
                  <Input
                    id="business_registration_number"
                    value={formData.business_registration_number}
                    onChange={(e) => setFormData(prev => ({ ...prev, business_registration_number: e.target.value }))}
                  />
                </div>

                <div>
                  <Label>Product Categories *</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                    {categories.map((category) => (
                      <div key={category.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={category.id}
                          checked={formData.product_categories.includes(category.name)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setFormData(prev => ({
                                ...prev,
                                product_categories: [...prev.product_categories, category.name]
                              }));
                            } else {
                              setFormData(prev => ({
                                ...prev,
                                product_categories: prev.product_categories.filter(c => c !== category.name)
                              }));
                            }
                          }}
                        />
                        <Label htmlFor={category.id} className="text-sm">
                          {category.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Information
                </CardTitle>
                <CardDescription>How would you like to receive payments?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="payment_method">Payment Method *</Label>
                  <Select
                    value={formData.payment_method}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, payment_method: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mpesa">MPESA</SelectItem>
                      <SelectItem value="paypal">PayPal</SelectItem>
                      <SelectItem value="bank_account">Bank Account</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.payment_method === 'mpesa' && (
                  <div>
                    <Label htmlFor="mpesa_number">MPESA Number</Label>
                    <Input
                      id="mpesa_number"
                      placeholder="254xxxxxxxxx"
                      value={formData.payment_details?.mpesa_number || ''}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        payment_details: { mpesa_number: e.target.value }
                      }))}
                    />
                  </div>
                )}

                {formData.payment_method === 'paypal' && (
                  <div>
                    <Label htmlFor="paypal_email">PayPal Email</Label>
                    <Input
                      id="paypal_email"
                      type="email"
                      value={formData.payment_details?.paypal_email || ''}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        payment_details: { paypal_email: e.target.value }
                      }))}
                    />
                  </div>
                )}

                {formData.payment_method === 'bank_account' && (
                  <div className="space-y-2">
                    <div>
                      <Label htmlFor="bank_name">Bank Name</Label>
                      <Input
                        id="bank_name"
                        value={formData.payment_details?.bank_name || ''}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          payment_details: { 
                            ...prev.payment_details, 
                            bank_name: e.target.value 
                          }
                        }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="account_number">Account Number</Label>
                      <Input
                        id="account_number"
                        value={formData.payment_details?.account_number || ''}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          payment_details: { 
                            ...prev.payment_details, 
                            account_number: e.target.value 
                          }
                        }))}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Terms and Conditions */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="terms"
                    checked={formData.terms_accepted}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, terms_accepted: !!checked }))}
                  />
                  <Label htmlFor="terms" className="text-sm leading-relaxed">
                    I accept the platform's seller terms and conditions, and I understand that my application will be reviewed by the platform team. I confirm that all information provided is accurate and complete.
                  </Label>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-center">
              <Button 
                type="submit" 
                disabled={submitting || uploading} 
                className="w-full md:w-auto px-8"
              >
                {(submitting || uploading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {uploading ? 'Uploading Files...' : existingRequest ? 'Update Application' : 'Submit Application'}
              </Button>
            </div>
          </form>
        )}

        {existingRequest && existingRequest.status === 'approved' && (
          <Card>
            <CardContent className="text-center py-8">
              <CheckCircle className="h-16 w-16 mx-auto mb-4 text-primary" />
              <h2 className="text-2xl font-bold mb-2">Congratulations!</h2>
              <p className="text-muted-foreground mb-4">
                Your seller certification has been approved. You can now start selling on the platform.
              </p>
              <Button onClick={() => navigate('/seller-dashboard')}>
                Go to Seller Dashboard
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SellerCertification;