-- Create seller_requests table for certification flow
CREATE TABLE public.seller_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  
  -- Personal profile data
  full_name TEXT NOT NULL,
  profile_photo_url TEXT,
  verified_email BOOLEAN DEFAULT false,
  verified_phone BOOLEAN DEFAULT false,
  phone_number TEXT,
  physical_location TEXT NOT NULL,
  
  -- Identity verification
  government_id_url TEXT NOT NULL,
  selfie_url TEXT,
  
  -- Business information
  store_name TEXT NOT NULL,
  store_description TEXT NOT NULL,
  business_registration_number TEXT,
  product_categories TEXT[] NOT NULL,
  
  -- Payment details
  payment_method TEXT NOT NULL, -- 'mpesa', 'paypal', 'bank_account'
  payment_details JSONB NOT NULL,
  
  -- Terms acceptance
  terms_accepted BOOLEAN NOT NULL DEFAULT false,
  terms_accepted_at TIMESTAMP WITH TIME ZONE,
  
  -- Admin review
  reviewed_by UUID,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  rejection_reason TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.seller_requests ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own seller requests" 
ON public.seller_requests 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own seller requests" 
ON public.seller_requests 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own pending requests" 
ON public.seller_requests 
FOR UPDATE 
USING (auth.uid() = user_id AND status = 'pending');

-- Admin policies will be added later when admin roles are implemented

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_seller_requests_updated_at
BEFORE UPDATE ON public.seller_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage buckets for file uploads
INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('seller-documents', 'seller-documents', false),
  ('profile-photos', 'profile-photos', true);

-- Create storage policies
CREATE POLICY "Users can upload their own documents" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'seller-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own documents" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'seller-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their own profile photos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'profile-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Profile photos are publicly viewable" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'profile-photos');