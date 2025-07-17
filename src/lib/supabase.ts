// Mock Supabase client for frontend-only demo
const createMockQuery = () => ({
  eq: (column: string, value: any) => createMockQuery(),
  single: () => ({ data: null, error: null }),
  maybeSingle: () => ({ data: null, error: null }),
  order: (column: string, options?: any) => createMockQuery(),
  upsert: (data: any) => ({ data: [], error: null }),
  data: [],
  error: null
})

export const supabase = {
  auth: {
    signUp: async (credentials: any) => ({ error: null }),
    signInWithPassword: async (credentials: any) => ({ error: null }),
    signOut: async () => ({ error: null }),
    getSession: async () => ({ data: { session: null } }),
    onAuthStateChange: (callback: any) => ({ data: { subscription: { unsubscribe: () => {} } } })
  },
  from: (table: string) => ({
    select: (columns?: string) => createMockQuery(),
    insert: (data: any) => createMockQuery(),
    update: (data: any) => createMockQuery(),
    delete: () => createMockQuery(),
    upsert: (data: any) => createMockQuery()
  })
}