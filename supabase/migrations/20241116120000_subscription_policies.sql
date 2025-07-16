-- Step 3: Create functions and policies for subscription-based seller model
-- Create function to check if user has active seller subscription
CREATE OR REPLACE FUNCTION public.has_active_seller_subscription(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.subscriptions 
    WHERE user_id = _user_id 
    AND status = 'active' 
    AND (ends_at IS NULL OR ends_at > now())
  )
$$;

-- Create function to check if user is seller (has role AND active subscription)
CREATE OR REPLACE FUNCTION public.is_seller(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE SECURITY DEFINER
AS $$
  SELECT (
    public.has_role(_user_id, 'seller') AND 
    public.has_active_seller_subscription(_user_id)
  )
$$;

-- Update user creation trigger to assign buyer role by default
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'full_name');
  
  -- Assign buyer role by default
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'buyer');
  
  RETURN NEW;
END;
$$;

-- Create policies for subscriptions
CREATE POLICY "Users can view own subscriptions" 
ON public.subscriptions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create own subscriptions" 
ON public.subscriptions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all subscriptions" 
ON public.subscriptions 
FOR ALL 
USING (public.has_role(auth.uid(), 'admin'));

-- Update products policies for seller model
DROP POLICY IF EXISTS "Admins can manage products" ON public.products;
DROP POLICY IF EXISTS "Admins can view all products" ON public.products;

CREATE POLICY "Sellers can create products" 
ON public.products 
FOR INSERT 
WITH CHECK (public.is_seller(auth.uid()) AND auth.uid() = seller_id);

CREATE POLICY "Sellers can update own products" 
ON public.products 
FOR UPDATE 
USING (public.is_seller(auth.uid()) AND auth.uid() = seller_id);

CREATE POLICY "Sellers can view own products" 
ON public.products 
FOR SELECT 
USING (auth.uid() = seller_id);

CREATE POLICY "Admins can manage all products" 
ON public.products 
FOR ALL 
USING (public.has_role(auth.uid(), 'admin'));