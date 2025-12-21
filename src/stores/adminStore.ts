import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';

<<<<<<< HEAD
type AppRole = 'admin' | 'moderator' | 'user';
=======
type AppRole = 'admin' | 'moderator' | 'store_manager' | 'user';
>>>>>>> dfcf12d2b1fa1c8d28b54c9344caef07b69c8066

interface AdminStore {
  isAdmin: boolean;
  isModerator: boolean;
<<<<<<< HEAD
=======
  isStoreManager: boolean;
>>>>>>> dfcf12d2b1fa1c8d28b54c9344caef07b69c8066
  userRole: AppRole | null;
  isLoading: boolean;
  
  checkRole: () => Promise<void>;
  hasRole: (role: AppRole) => boolean;
<<<<<<< HEAD
=======
  canAccessAdmin: () => boolean;
>>>>>>> dfcf12d2b1fa1c8d28b54c9344caef07b69c8066
}

export const useAdminStore = create<AdminStore>((set, get) => ({
  isAdmin: false,
  isModerator: false,
<<<<<<< HEAD
=======
  isStoreManager: false,
>>>>>>> dfcf12d2b1fa1c8d28b54c9344caef07b69c8066
  userRole: null,
  isLoading: true,

  checkRole: async () => {
    set({ isLoading: true });
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
<<<<<<< HEAD
        set({ isAdmin: false, isModerator: false, userRole: null, isLoading: false });
=======
        set({ isAdmin: false, isModerator: false, isStoreManager: false, userRole: null, isLoading: false });
>>>>>>> dfcf12d2b1fa1c8d28b54c9344caef07b69c8066
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

<<<<<<< HEAD
      const isAdmin = !!adminRole;
      const isModerator = !!modRole;
      
      let userRole: AppRole = 'user';
      if (isAdmin) userRole = 'admin';
=======
      // Check for store_manager role
      const { data: storeManagerRole } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'store_manager')
        .maybeSingle();

      const isAdmin = !!adminRole;
      const isModerator = !!modRole;
      const isStoreManager = !!storeManagerRole;
      
      let userRole: AppRole = 'user';
      if (isAdmin) userRole = 'admin';
      else if (isStoreManager) userRole = 'store_manager';
>>>>>>> dfcf12d2b1fa1c8d28b54c9344caef07b69c8066
      else if (isModerator) userRole = 'moderator';

      set({ 
        isAdmin, 
<<<<<<< HEAD
        isModerator, 
=======
        isModerator,
        isStoreManager,
>>>>>>> dfcf12d2b1fa1c8d28b54c9344caef07b69c8066
        userRole,
        isLoading: false 
      });
    } catch (error) {
      console.error('Error checking role:', error);
<<<<<<< HEAD
      set({ isAdmin: false, isModerator: false, userRole: null, isLoading: false });
=======
      set({ isAdmin: false, isModerator: false, isStoreManager: false, userRole: null, isLoading: false });
>>>>>>> dfcf12d2b1fa1c8d28b54c9344caef07b69c8066
    }
  },

  hasRole: (role) => {
<<<<<<< HEAD
    const { isAdmin, isModerator } = get();
    if (role === 'admin') return isAdmin;
    if (role === 'moderator') return isAdmin || isModerator;
    return true; // 'user' role
  },
=======
    const { isAdmin, isModerator, isStoreManager } = get();
    if (role === 'admin') return isAdmin;
    if (role === 'store_manager') return isAdmin || isStoreManager;
    if (role === 'moderator') return isAdmin || isStoreManager || isModerator;
    return true; // 'user' role
  },

  canAccessAdmin: () => {
    const { isAdmin, isModerator, isStoreManager } = get();
    return isAdmin || isModerator || isStoreManager;
  },
>>>>>>> dfcf12d2b1fa1c8d28b54c9344caef07b69c8066
}));
