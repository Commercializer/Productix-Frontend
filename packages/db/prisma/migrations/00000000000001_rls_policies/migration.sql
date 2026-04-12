-- ═══════════════════════════════════════════════════════════════
-- Productix — Row-Level Security Policies & Auth Trigger
-- Applied AFTER Prisma migration creates the tables.
-- ═══════════════════════════════════════════════════════════════

-- ─────────────────────────────────────────────────────────────
-- 1. HELPER FUNCTIONS (SECURITY DEFINER — runs with owner privs)
-- ─────────────────────────────────────────────────────────────

-- Get current authenticated user's role
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS text
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT role::text FROM public.users WHERE id = auth.uid();
$$;

-- Check if current user is a super admin
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role = 'SUPER_ADMIN'
  );
$$;

-- Get tenant IDs the current user administers
CREATE OR REPLACE FUNCTION public.get_admin_tenant_ids()
RETURNS SETOF uuid
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT tenant_id FROM public.tenant_admins WHERE user_id = auth.uid();
$$;

-- Get company IDs the current user has access to (admin or regular user)
CREATE OR REPLACE FUNCTION public.get_user_company_ids()
RETURNS SETOF uuid
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT company_id FROM public.company_admins WHERE user_id = auth.uid()
  UNION
  SELECT company_id FROM public.company_users WHERE user_id = auth.uid();
$$;

-- Get all company IDs under tenants the current user administers
CREATE OR REPLACE FUNCTION public.get_tenant_admin_company_ids()
RETURNS SETOF uuid
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT c.id FROM public.companies c
  INNER JOIN public.tenant_admins ta ON ta.tenant_id = c.tenant_id
  WHERE ta.user_id = auth.uid();
$$;

-- ─────────────────────────────────────────────────────────────
-- 2. AUTH TRIGGER — Sync auth.users → public.users
-- ─────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, email, role, is_active, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(
      (NEW.raw_user_meta_data->>'role')::public."UserRole",
      'COMPANY_USER'::"UserRole"
    ),
    true,
    NOW(),
    NOW()
  );
  RETURN NEW;
END;
$$;

-- Drop existing trigger if present, then create
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ─────────────────────────────────────────────────────────────
-- 3. ENABLE RLS ON ALL TABLES
-- ─────────────────────────────────────────────────────────────

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenant_admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_social_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brand_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brand_profile_social_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.linked_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qr_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qr_scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback_responses ENABLE ROW LEVEL SECURITY;

-- ─────────────────────────────────────────────────────────────
-- 4. RLS POLICIES — users
-- ─────────────────────────────────────────────────────────────

-- Super admin: full access
CREATE POLICY "users_super_admin_all"
  ON public.users FOR ALL
  USING (public.is_super_admin())
  WITH CHECK (public.is_super_admin());

-- Users can read their own record
CREATE POLICY "users_select_own"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

-- Tenant admins can see users in their companies
CREATE POLICY "users_select_tenant_admin"
  ON public.users FOR SELECT
  USING (
    id IN (
      SELECT ca.user_id FROM public.company_admins ca
      WHERE ca.company_id IN (SELECT public.get_tenant_admin_company_ids())
      UNION
      SELECT cu.user_id FROM public.company_users cu
      WHERE cu.company_id IN (SELECT public.get_tenant_admin_company_ids())
    )
  );

-- Company admins can see users in their company
CREATE POLICY "users_select_company_admin"
  ON public.users FOR SELECT
  USING (
    id IN (
      SELECT ca.user_id FROM public.company_admins ca
      WHERE ca.company_id IN (SELECT public.get_user_company_ids())
      UNION
      SELECT cu.user_id FROM public.company_users cu
      WHERE cu.company_id IN (SELECT public.get_user_company_ids())
    )
  );

-- Users can update their own non-sensitive fields
CREATE POLICY "users_update_own"
  ON public.users FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ─────────────────────────────────────────────────────────────
-- 5. RLS POLICIES — tenants
-- ─────────────────────────────────────────────────────────────

-- Super admin: full access
CREATE POLICY "tenants_super_admin_all"
  ON public.tenants FOR ALL
  USING (public.is_super_admin())
  WITH CHECK (public.is_super_admin());

-- Tenant admins can read their own tenant
CREATE POLICY "tenants_select_own_admin"
  ON public.tenants FOR SELECT
  USING (id IN (SELECT public.get_admin_tenant_ids()));

-- Tenant admins can update their own tenant
CREATE POLICY "tenants_update_own_admin"
  ON public.tenants FOR UPDATE
  USING (id IN (SELECT public.get_admin_tenant_ids()))
  WITH CHECK (id IN (SELECT public.get_admin_tenant_ids()));

-- ─────────────────────────────────────────────────────────────
-- 6. RLS POLICIES — tenant_admins
-- ─────────────────────────────────────────────────────────────

CREATE POLICY "tenant_admins_super_admin_all"
  ON public.tenant_admins FOR ALL
  USING (public.is_super_admin())
  WITH CHECK (public.is_super_admin());

CREATE POLICY "tenant_admins_select_own"
  ON public.tenant_admins FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "tenant_admins_select_same_tenant"
  ON public.tenant_admins FOR SELECT
  USING (tenant_id IN (SELECT public.get_admin_tenant_ids()));

-- ─────────────────────────────────────────────────────────────
-- 7. RLS POLICIES — companies
-- ─────────────────────────────────────────────────────────────

-- Super admin: full access
CREATE POLICY "companies_super_admin_all"
  ON public.companies FOR ALL
  USING (public.is_super_admin())
  WITH CHECK (public.is_super_admin());

-- Tenant admins: full access to companies under their tenant
CREATE POLICY "companies_tenant_admin_all"
  ON public.companies FOR ALL
  USING (tenant_id IN (SELECT public.get_admin_tenant_ids()))
  WITH CHECK (tenant_id IN (SELECT public.get_admin_tenant_ids()));

-- Company members: read their own company
CREATE POLICY "companies_select_member"
  ON public.companies FOR SELECT
  USING (id IN (SELECT public.get_user_company_ids()));

-- ─────────────────────────────────────────────────────────────
-- 8. RLS POLICIES — company_admins
-- ─────────────────────────────────────────────────────────────

CREATE POLICY "company_admins_super_admin_all"
  ON public.company_admins FOR ALL
  USING (public.is_super_admin())
  WITH CHECK (public.is_super_admin());

CREATE POLICY "company_admins_tenant_admin_all"
  ON public.company_admins FOR ALL
  USING (
    company_id IN (SELECT public.get_tenant_admin_company_ids())
  )
  WITH CHECK (
    company_id IN (SELECT public.get_tenant_admin_company_ids())
  );

CREATE POLICY "company_admins_select_own"
  ON public.company_admins FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "company_admins_select_same_company"
  ON public.company_admins FOR SELECT
  USING (company_id IN (SELECT public.get_user_company_ids()));

-- ─────────────────────────────────────────────────────────────
-- 9. RLS POLICIES — company_users
-- ─────────────────────────────────────────────────────────────

CREATE POLICY "company_users_super_admin_all"
  ON public.company_users FOR ALL
  USING (public.is_super_admin())
  WITH CHECK (public.is_super_admin());

CREATE POLICY "company_users_tenant_admin_all"
  ON public.company_users FOR ALL
  USING (
    company_id IN (SELECT public.get_tenant_admin_company_ids())
  )
  WITH CHECK (
    company_id IN (SELECT public.get_tenant_admin_company_ids())
  );

CREATE POLICY "company_users_select_own"
  ON public.company_users FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "company_users_manage_company_admin"
  ON public.company_users FOR ALL
  USING (
    company_id IN (
      SELECT company_id FROM public.company_admins WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    company_id IN (
      SELECT company_id FROM public.company_admins WHERE user_id = auth.uid()
    )
  );

-- ─────────────────────────────────────────────────────────────
-- 10. RLS POLICIES — company_social_accounts
-- ─────────────────────────────────────────────────────────────

CREATE POLICY "company_socials_super_admin_all"
  ON public.company_social_accounts FOR ALL
  USING (public.is_super_admin())
  WITH CHECK (public.is_super_admin());

CREATE POLICY "company_socials_tenant_admin_all"
  ON public.company_social_accounts FOR ALL
  USING (company_id IN (SELECT public.get_tenant_admin_company_ids()))
  WITH CHECK (company_id IN (SELECT public.get_tenant_admin_company_ids()));

CREATE POLICY "company_socials_company_admin_all"
  ON public.company_social_accounts FOR ALL
  USING (
    company_id IN (
      SELECT company_id FROM public.company_admins WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    company_id IN (
      SELECT company_id FROM public.company_admins WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "company_socials_select_member"
  ON public.company_social_accounts FOR SELECT
  USING (company_id IN (SELECT public.get_user_company_ids()));

-- ─────────────────────────────────────────────────────────────
-- 11. RLS POLICIES — brand_profiles
-- ─────────────────────────────────────────────────────────────

CREATE POLICY "brand_profiles_super_admin_all"
  ON public.brand_profiles FOR ALL
  USING (public.is_super_admin())
  WITH CHECK (public.is_super_admin());

CREATE POLICY "brand_profiles_tenant_admin_all"
  ON public.brand_profiles FOR ALL
  USING (company_id IN (SELECT public.get_tenant_admin_company_ids()))
  WITH CHECK (company_id IN (SELECT public.get_tenant_admin_company_ids()));

CREATE POLICY "brand_profiles_company_admin_all"
  ON public.brand_profiles FOR ALL
  USING (
    company_id IN (
      SELECT company_id FROM public.company_admins WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    company_id IN (
      SELECT company_id FROM public.company_admins WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "brand_profiles_select_member"
  ON public.brand_profiles FOR SELECT
  USING (company_id IN (SELECT public.get_user_company_ids()));

-- ─────────────────────────────────────────────────────────────
-- 12. RLS POLICIES — brand_profile_social_accounts
-- ─────────────────────────────────────────────────────────────

CREATE POLICY "brand_socials_super_admin_all"
  ON public.brand_profile_social_accounts FOR ALL
  USING (public.is_super_admin())
  WITH CHECK (public.is_super_admin());

CREATE POLICY "brand_socials_company_member_select"
  ON public.brand_profile_social_accounts FOR SELECT
  USING (
    brand_profile_id IN (
      SELECT bp.id FROM public.brand_profiles bp
      WHERE bp.company_id IN (SELECT public.get_user_company_ids())
    )
  );

CREATE POLICY "brand_socials_company_admin_all"
  ON public.brand_profile_social_accounts FOR ALL
  USING (
    brand_profile_id IN (
      SELECT bp.id FROM public.brand_profiles bp
      WHERE bp.company_id IN (
        SELECT company_id FROM public.company_admins WHERE user_id = auth.uid()
      )
    )
  )
  WITH CHECK (
    brand_profile_id IN (
      SELECT bp.id FROM public.brand_profiles bp
      WHERE bp.company_id IN (
        SELECT company_id FROM public.company_admins WHERE user_id = auth.uid()
      )
    )
  );

-- ─────────────────────────────────────────────────────────────
-- 13. RLS POLICIES — products
-- ─────────────────────────────────────────────────────────────

CREATE POLICY "products_super_admin_all"
  ON public.products FOR ALL
  USING (public.is_super_admin())
  WITH CHECK (public.is_super_admin());

CREATE POLICY "products_tenant_admin_all"
  ON public.products FOR ALL
  USING (company_id IN (SELECT public.get_tenant_admin_company_ids()))
  WITH CHECK (company_id IN (SELECT public.get_tenant_admin_company_ids()));

CREATE POLICY "products_company_admin_all"
  ON public.products FOR ALL
  USING (
    company_id IN (
      SELECT company_id FROM public.company_admins WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    company_id IN (
      SELECT company_id FROM public.company_admins WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "products_select_member"
  ON public.products FOR SELECT
  USING (company_id IN (SELECT public.get_user_company_ids()));

-- ─────────────────────────────────────────────────────────────
-- 14. RLS POLICIES — product_profiles
-- ─────────────────────────────────────────────────────────────

CREATE POLICY "product_profiles_super_admin_all"
  ON public.product_profiles FOR ALL
  USING (public.is_super_admin())
  WITH CHECK (public.is_super_admin());

CREATE POLICY "product_profiles_company_member_select"
  ON public.product_profiles FOR SELECT
  USING (
    product_id IN (
      SELECT p.id FROM public.products p
      WHERE p.company_id IN (SELECT public.get_user_company_ids())
    )
  );

CREATE POLICY "product_profiles_company_admin_all"
  ON public.product_profiles FOR ALL
  USING (
    product_id IN (
      SELECT p.id FROM public.products p
      WHERE p.company_id IN (
        SELECT company_id FROM public.company_admins WHERE user_id = auth.uid()
      )
    )
  )
  WITH CHECK (
    product_id IN (
      SELECT p.id FROM public.products p
      WHERE p.company_id IN (
        SELECT company_id FROM public.company_admins WHERE user_id = auth.uid()
      )
    )
  );

-- Public access for product profiles by slug (for public product pages)
CREATE POLICY "product_profiles_public_select_by_slug"
  ON public.product_profiles FOR SELECT
  USING (
    product_id IN (
      SELECT p.id FROM public.products p WHERE p.is_active = true
    )
  );

-- ─────────────────────────────────────────────────────────────
-- 15. RLS POLICIES — linked_products
-- ─────────────────────────────────────────────────────────────

CREATE POLICY "linked_products_super_admin_all"
  ON public.linked_products FOR ALL
  USING (public.is_super_admin())
  WITH CHECK (public.is_super_admin());

CREATE POLICY "linked_products_select_member"
  ON public.linked_products FOR SELECT
  USING (
    product_id IN (
      SELECT p.id FROM public.products p
      WHERE p.company_id IN (SELECT public.get_user_company_ids())
    )
  );

CREATE POLICY "linked_products_company_admin_all"
  ON public.linked_products FOR ALL
  USING (
    product_id IN (
      SELECT p.id FROM public.products p
      WHERE p.company_id IN (
        SELECT company_id FROM public.company_admins WHERE user_id = auth.uid()
      )
    )
  )
  WITH CHECK (
    product_id IN (
      SELECT p.id FROM public.products p
      WHERE p.company_id IN (
        SELECT company_id FROM public.company_admins WHERE user_id = auth.uid()
      )
    )
  );

-- ─────────────────────────────────────────────────────────────
-- 16. RLS POLICIES — qr_codes
-- ─────────────────────────────────────────────────────────────

CREATE POLICY "qr_codes_super_admin_all"
  ON public.qr_codes FOR ALL
  USING (public.is_super_admin())
  WITH CHECK (public.is_super_admin());

CREATE POLICY "qr_codes_tenant_admin_all"
  ON public.qr_codes FOR ALL
  USING (
    product_id IN (
      SELECT p.id FROM public.products p
      WHERE p.company_id IN (SELECT public.get_tenant_admin_company_ids())
    )
  )
  WITH CHECK (
    product_id IN (
      SELECT p.id FROM public.products p
      WHERE p.company_id IN (SELECT public.get_tenant_admin_company_ids())
    )
  );

CREATE POLICY "qr_codes_company_admin_all"
  ON public.qr_codes FOR ALL
  USING (
    product_id IN (
      SELECT p.id FROM public.products p
      WHERE p.company_id IN (
        SELECT company_id FROM public.company_admins WHERE user_id = auth.uid()
      )
    )
  )
  WITH CHECK (
    product_id IN (
      SELECT p.id FROM public.products p
      WHERE p.company_id IN (
        SELECT company_id FROM public.company_admins WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "qr_codes_select_member"
  ON public.qr_codes FOR SELECT
  USING (
    product_id IN (
      SELECT p.id FROM public.products p
      WHERE p.company_id IN (SELECT public.get_user_company_ids())
    )
  );

-- ─────────────────────────────────────────────────────────────
-- 17. RLS POLICIES — qr_scans
-- ─────────────────────────────────────────────────────────────

-- Allow anonymous inserts (public QR scans)
CREATE POLICY "qr_scans_insert_anon"
  ON public.qr_scans FOR INSERT
  WITH CHECK (true);

CREATE POLICY "qr_scans_super_admin_select"
  ON public.qr_scans FOR SELECT
  USING (public.is_super_admin());

CREATE POLICY "qr_scans_tenant_admin_select"
  ON public.qr_scans FOR SELECT
  USING (
    product_id IN (
      SELECT p.id FROM public.products p
      WHERE p.company_id IN (SELECT public.get_tenant_admin_company_ids())
    )
  );

CREATE POLICY "qr_scans_company_member_select"
  ON public.qr_scans FOR SELECT
  USING (
    product_id IN (
      SELECT p.id FROM public.products p
      WHERE p.company_id IN (SELECT public.get_user_company_ids())
    )
  );

-- ─────────────────────────────────────────────────────────────
-- 18. RLS POLICIES — feedback_inquiries
-- ─────────────────────────────────────────────────────────────

-- Allow anonymous inserts (public feedback form)
CREATE POLICY "feedback_insert_public"
  ON public.feedback_inquiries FOR INSERT
  WITH CHECK (true);

CREATE POLICY "feedback_super_admin_all"
  ON public.feedback_inquiries FOR ALL
  USING (public.is_super_admin())
  WITH CHECK (public.is_super_admin());

CREATE POLICY "feedback_tenant_admin_all"
  ON public.feedback_inquiries FOR ALL
  USING (company_id IN (SELECT public.get_tenant_admin_company_ids()))
  WITH CHECK (company_id IN (SELECT public.get_tenant_admin_company_ids()));

CREATE POLICY "feedback_select_company_member"
  ON public.feedback_inquiries FOR SELECT
  USING (company_id IN (SELECT public.get_user_company_ids()));

CREATE POLICY "feedback_update_company_admin"
  ON public.feedback_inquiries FOR UPDATE
  USING (
    company_id IN (
      SELECT company_id FROM public.company_admins WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    company_id IN (
      SELECT company_id FROM public.company_admins WHERE user_id = auth.uid()
    )
  );

-- ─────────────────────────────────────────────────────────────
-- 19. RLS POLICIES — feedback_responses
-- ─────────────────────────────────────────────────────────────

CREATE POLICY "feedback_responses_super_admin_all"
  ON public.feedback_responses FOR ALL
  USING (public.is_super_admin())
  WITH CHECK (public.is_super_admin());

CREATE POLICY "feedback_responses_select_company"
  ON public.feedback_responses FOR SELECT
  USING (
    feedback_inquiry_id IN (
      SELECT fi.id FROM public.feedback_inquiries fi
      WHERE fi.company_id IN (SELECT public.get_user_company_ids())
    )
  );

CREATE POLICY "feedback_responses_insert_company_member"
  ON public.feedback_responses FOR INSERT
  WITH CHECK (
    feedback_inquiry_id IN (
      SELECT fi.id FROM public.feedback_inquiries fi
      WHERE fi.company_id IN (SELECT public.get_user_company_ids())
    )
  );

CREATE POLICY "feedback_responses_tenant_admin_all"
  ON public.feedback_responses FOR ALL
  USING (
    feedback_inquiry_id IN (
      SELECT fi.id FROM public.feedback_inquiries fi
      WHERE fi.company_id IN (SELECT public.get_tenant_admin_company_ids())
    )
  )
  WITH CHECK (
    feedback_inquiry_id IN (
      SELECT fi.id FROM public.feedback_inquiries fi
      WHERE fi.company_id IN (SELECT public.get_tenant_admin_company_ids())
    )
  );

-- ─────────────────────────────────────────────────────────────
-- 20. GRANT PERMISSIONS FOR ANON ROLE (public operations)
-- ─────────────────────────────────────────────────────────────

-- Anonymous users can scan QR codes
GRANT INSERT ON public.qr_scans TO anon;

-- Anonymous users can submit feedback
GRANT INSERT ON public.feedback_inquiries TO anon;

-- Anonymous users can view active product profiles (public product pages)
GRANT SELECT ON public.product_profiles TO anon;
GRANT SELECT ON public.products TO anon;

-- Authenticated users get full DML on tables they have RLS access to
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;
