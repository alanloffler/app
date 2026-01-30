import { useLocation } from "react-router";

export function useActiveRoute() {
  const location = useLocation();

  const isActive = (url: string, state?: Record<string, string>): boolean => {
    if (url === "#") {
      return false;
    }

    if (location.pathname !== url) {
      return false;
    }

    if (state) {
      const locationState = location.state as Record<string, string> | null;
      if (!locationState) {
        return false;
      }
      return Object.entries(state).every(([key, value]) => locationState[key] === value);
    }

    return true;
  };

  const isParentActive = (subItems?: Array<{ url: string }>): boolean => {
    if (!subItems || subItems.length === 0) {
      return false;
    }

    return subItems.some((subItem) => location.pathname === subItem.url);
  };

  return {
    isActive,
    isParentActive,
  };
}
