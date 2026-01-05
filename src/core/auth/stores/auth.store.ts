import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { IAdmin } from "@admin/interfaces/admin.interface";
import type { TAuthType } from "@auth/interfaces/auth.type";
import { AccountService } from "@account/services/profile.service";

interface AuthState {
  admin?: IAdmin;
  loadingAdmin: boolean;
  type?: TAuthType;
  clearAdmin: () => void;
  refreshAdmin: () => Promise<void>;
  setAdmin: (admin?: IAdmin) => void;
  setLoadingAdmin: (loading: boolean) => void;
  setType: (type?: TAuthType) => void;
}

export const useAuthStore = create(
  persist<AuthState>(
    (set, get) => ({
      admin: undefined,
      loadingAdmin: false,
      type: undefined,

      clearAdmin: () => set({ admin: undefined, type: undefined }),
      setAdmin: (admin) => set({ admin }),
      setLoadingAdmin: (loading) => set({ loadingAdmin: loading }),
      setType: (type) => set({ type }),
      refreshAdmin: async () => {
        const currentAdmin = get().admin;
        if (!currentAdmin) return;

        try {
          set({ loadingAdmin: true });
          const response = await AccountService.get();

          if (response?.statusCode === 200 && response.data) {
            set({ admin: response.data, loadingAdmin: false });
          }
        } catch (error) {
          console.error("Error refrescando admin:", error);
          set({ loadingAdmin: false });
        }
      },
    }),
    {
      name: "admin",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
