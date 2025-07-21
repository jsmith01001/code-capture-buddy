import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, Users, CheckCircle, XCircle, Eye, Clock, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface SellerRequest {
  id: string;
  user_id: string;
  status: string;
  full_name: string;
  profile_photo_url: string | null;
  verified_email: boolean;
  verified_phone: boolean;
  phone_number: string | null;
  physical_location: string;
  government_id_url: string;
  selfie_url: string | null;
  store_name: string;
  store_description: string;
  business_registration_number: string | null;
  product_categories: string[];
  payment_method: string;
  payment_details: any;
  terms_accepted: boolean;
  rejection_reason: string | null;
  created_at: string;
  profiles?: {
    email: string;
  } | null;
}

const AdminDashboard = () => {
  const [requests, setRequests] = useState<SellerRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<SellerRequest | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    fetchSellerRequests();
  }, []);

  const fetchSellerRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('seller_requests')
        .select(`
          *,
          profiles(email)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests((data as any) || []);
    } catch (error) {
      console.error('Error fetching seller requests:', error);
      toast.error('Failed to load seller requests');
    } finally {
      setLoading(false);
    }
  };

  const approveRequest = async (requestId: string) => {
    setProcessingId(requestId);
    try {
      const { error } = await supabase
        .from('seller_requests')
        .update({
          status: 'approved',
          reviewed_at: new Date().toISOString(),
          rejection_reason: null
        })
        .eq('id', requestId);

      if (error) throw error;
      
      toast.success('Seller request approved successfully');
      fetchSellerRequests();
    } catch (error) {
      console.error('Error approving request:', error);
      toast.error('Failed to approve request');
    } finally {
      setProcessingId(null);
    }
  };

  const rejectRequest = async (requestId: string, reason: string) => {
    if (!reason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }

    setProcessingId(requestId);
    try {
      const { error } = await supabase
        .from('seller_requests')
        .update({
          status: 'rejected',
          reviewed_at: new Date().toISOString(),
          rejection_reason: reason
        })
        .eq('id', requestId);

      if (error) throw error;
      
      toast.success('Seller request rejected');
      setRejectionReason("");
      setSelectedRequest(null);
      fetchSellerRequests();
    } catch (error) {
      console.error('Error rejecting request:', error);
      toast.error('Failed to reject request');
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="gap-2"><Clock className="h-3 w-3" />Pending</Badge>;
      case 'approved':
        return <Badge variant="default" className="gap-2"><CheckCircle className="h-3 w-3" />Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive" className="gap-2"><XCircle className="h-3 w-3" />Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const pendingRequests = requests.filter(r => r.status === 'pending');
  const approvedRequests = requests.filter(r => r.status === 'approved');
  const rejectedRequests = requests.filter(r => r.status === 'rejected');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground">Review and manage seller certification requests</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{requests.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingRequests.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{approvedRequests.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rejected</CardTitle>
              <XCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{rejectedRequests.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Seller Requests */}
        <Card>
          <CardHeader>
            <CardTitle>Seller Certification Requests</CardTitle>
            <CardDescription>Review and process seller applications</CardDescription>
          </CardHeader>
          <CardContent>
            {requests.length === 0 ? (
              <div className="text-center py-8">
                <Shield className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <p className="text-muted-foreground">No seller requests yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {requests.map((request) => (
                  <Card key={request.id} className="border">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                            {request.profile_photo_url ? (
                              <img
                                src={request.profile_photo_url}
                                alt={request.full_name}
                                className="w-12 h-12 rounded-full object-cover"
                              />
                            ) : (
                              <Users className="h-6 w-6 text-muted-foreground" />
                            )}
                          </div>
                          <div>
                            <h3 className="font-semibold">{request.full_name}</h3>
                            <p className="text-sm text-muted-foreground">{request.profiles?.email || 'No email'}</p>
                            <p className="text-sm text-muted-foreground">{request.store_name}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(request.status)}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedRequest(selectedRequest?.id === request.id ? null : request)}
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            {selectedRequest?.id === request.id ? 'Hide' : 'View'}
                          </Button>
                        </div>
                      </div>

                      {selectedRequest?.id === request.id && (
                        <div className="border-t pt-4 space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-semibold mb-2">Personal Information</h4>
                              <div className="space-y-1 text-sm">
                                <p><strong>Phone:</strong> {request.phone_number || 'Not provided'}</p>
                                <p><strong>Location:</strong> {request.physical_location}</p>
                                <p><strong>Verified Email:</strong> {request.verified_email ? 'Yes' : 'No'}</p>
                                <p><strong>Verified Phone:</strong> {request.verified_phone ? 'Yes' : 'No'}</p>
                              </div>
                            </div>
                            <div>
                              <h4 className="font-semibold mb-2">Business Information</h4>
                              <div className="space-y-1 text-sm">
                                <p><strong>Store:</strong> {request.store_name}</p>
                                <p><strong>Description:</strong> {request.store_description}</p>
                                <p><strong>Registration #:</strong> {request.business_registration_number || 'Not provided'}</p>
                                <p><strong>Categories:</strong> {request.product_categories.join(', ')}</p>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h4 className="font-semibold mb-2">Payment Information</h4>
                            <p className="text-sm"><strong>Method:</strong> {request.payment_method}</p>
                            <p className="text-sm"><strong>Details:</strong> {JSON.stringify(request.payment_details)}</p>
                          </div>

                          <div>
                            <h4 className="font-semibold mb-2">Documents</h4>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" asChild>
                                <a href={request.government_id_url} target="_blank" rel="noopener noreferrer">
                                  View ID Document
                                </a>
                              </Button>
                              {request.selfie_url && (
                                <Button size="sm" variant="outline" asChild>
                                  <a href={request.selfie_url} target="_blank" rel="noopener noreferrer">
                                    View Selfie
                                  </a>
                                </Button>
                              )}
                            </div>
                          </div>

                          {request.status === 'pending' && (
                            <div className="flex gap-2 pt-4 border-t">
                              <Button
                                onClick={() => approveRequest(request.id)}
                                disabled={processingId === request.id}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                {processingId === request.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                ) : (
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                )}
                                Approve
                              </Button>
                              <div className="space-y-2">
                                <Textarea
                                  placeholder="Reason for rejection..."
                                  value={rejectionReason}
                                  onChange={(e) => setRejectionReason(e.target.value)}
                                  className="min-h-[80px]"
                                />
                                <Button
                                  variant="destructive"
                                  onClick={() => rejectRequest(request.id, rejectionReason)}
                                  disabled={processingId === request.id || !rejectionReason.trim()}
                                >
                                  {processingId === request.id ? (
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                  ) : (
                                    <XCircle className="h-4 w-4 mr-2" />
                                  )}
                                  Reject
                                </Button>
                              </div>
                            </div>
                          )}

                          {request.status === 'rejected' && request.rejection_reason && (
                            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                              <h4 className="font-semibold text-destructive mb-2">Rejection Reason:</h4>
                              <p className="text-sm">{request.rejection_reason}</p>
                            </div>
                          )}

                          <p className="text-xs text-muted-foreground">
                            Submitted: {new Date(request.created_at).toLocaleString()}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;