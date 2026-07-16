import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import Spinner from "../ui/Spinner";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({
  children,
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper">
        <Spinner size="lg" className="text-accent" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
