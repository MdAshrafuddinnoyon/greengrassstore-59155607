import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';

type AppRole = 'admin' | 'moderator' | 'user';

interface AdminStore {
  isAdmin: boolean;
  isModerator: boolean;
  userRole: AppRole | null;
  isLoading: boolean;
  
  checkRole: () => Promise<void>;
  hasRole: (role: AppRole) => boolean;
}

export const useAdminStore = create<AdminStore>((set, get) => ({
  isAdmin: false,
  isModerator: false,
  userRole: null,
  isLoading: true,

  checkRole: async () => {
    set({ isLoading: true });
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        set({ isAdmin: false, isModerator: false, userRole: null, isLoading: false });
        return;
      }

      // Check for admin role
      const { data: adminRole } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .maybeSingle();

      // Check for moderator role
      const { data: modRole } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'moderator')
        .maybeSingle();

      const isAdmin = !!adminRole;
      const isModerator = !!modRole;
      
      let userRole: AppRole = 'user';
      if (isAdmin) userRole = 'admin';
      else if (isModerator) userRole = 'moderator';

      set({ 
        isAdmin, 
        isModerator, 
        userRole,
        isLoading: false 
      });
    } catch (error) {
      console.error('Error checking role:', error);
      set({ isAdmin: false, isModerator: false, userRole: null, isLoading: false });
    }
  },

  hasRole: (role) => {
    const { isAdmin, isModerator } = get();
    if (role === 'admin') return isAdmin;
    if (role === 'moderator') return isAdmin || isModerator;
    return true; // 'user' role
  },
}));
