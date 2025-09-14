import Skeleton from "@/components/Skeleton";
import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
import type { TRole } from "@/types";
import type { ComponentType } from "react";
import { Navigate, useLocation } from "react-router";

export const withAuth = (Component: ComponentType, requiredRole?: TRole) => {
  return function AuthWrapper() {
    const { data, isLoading, isFetching } = useUserInfoQuery(undefined);
    const location = useLocation();

    if (isLoading || isFetching) return <div className="flex min-h-svh flex-col items-center justify-center">
      <Skeleton className="h-8 w-40" />
    </div>;

    if (!data?.data?.email) {
      return <Navigate
        to="/login"
        state={{ from: location.pathname + location.search  }}
        replace
      />
    }

    if (requiredRole && !isLoading && requiredRole !== data?.data?.role) {
      return <Navigate to="/unauthorized" />;
    }

    return <Component />;
  };
};