import type { ReactNode } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Toaster } from "react-hot-toast";

import {
  QueryClientProvider,
} from "@tanstack/react-query";

import {
  ReactQueryDevtools,
} from "@tanstack/react-query-devtools";

import { queryClient } from "../lib/queryClient";

import { ThemeProvider } from "../context/ThemeContext";
import { AuthProvider } from "../context/AuthContext";
import ErrorFallback from "../components/shared/ErrorFallback";

interface Props {
  children: ReactNode;
}

export default function AppProviders({
  children,
}: Props) {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>

        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#2f2f2f",
              color: "#ececec",
              borderRadius: "12px",
            },
          }}
        />

        {import.meta.env.DEV && (
          <ReactQueryDevtools initialIsOpen={false} />
        )}
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
