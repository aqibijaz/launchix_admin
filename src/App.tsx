/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { BrowserRouter, Outlet, Route, Routes, Navigate } from "react-router-dom";
import { Refine, Authenticated } from "@refinedev/core";
import routerProvider, {
  DocumentTitleHandler,
  NavigateToResource,
  UnsavedChangesNotifier,
} from "@refinedev/react-router";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import { useNotificationProvider } from "./components/refine-ui/notification/use-notification-provider";
import { ThemeProvider } from "./components/refine-ui/theme/theme-provider";
import { Toaster } from "./components/refine-ui/notification/toaster";
import { ErrorComponent } from "./components/refine-ui/layout/error-component";
import { Layout } from "./components/refine-ui/layout/layout";
import { SignIn, SignUp, useAuth, useUser } from "@clerk/clerk-react";

import { authProvider } from "./providers/authProvider";
import { UserList } from "./pages/users/list";
import { UserShow } from "./pages/users/show";
import { BrandList } from "./pages/brands/list";
import { BrandShow } from "./pages/brands/show";
import { dataProviders } from "./providers/dataProviderManager";
import { HiOutlineUsers } from "react-icons/hi2";


const SignInPage = () => (
  <div style={{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#f5f5f5"
  }}>
    <SignIn
      routing="path"
      path="/sign-in"
      signUpUrl="/sign-up"
    />
  </div>
);
const SignUpPage = () => (
  <div style={{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#f5f5f5"
  }}>
    <SignUp
      path="/sign-up"
      routing="path"
      signInUrl="/sign-in"
    />
  </div>
);



const LoadingPage = () => (
  <div style={{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh"
  }}>
    <div>Loading...</div>
  </div>
);

// Unauthorized Access Page
const UnauthorizedPage = () => (
  <div style={{
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#f5f5f5",
    padding: "20px"
  }}>
    <div style={{
      maxWidth: "500px",
      textAlign: "center",
      backgroundColor: "white",
      padding: "40px",
      borderRadius: "8px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
    }}>
      <h1 style={{ fontSize: "24px", marginBottom: "16px", color: "#dc2626" }}>
        Access Denied
      </h1>
      <p style={{ fontSize: "16px", color: "#666", marginBottom: "24px" }}>
        You do not have permission to access this dashboard. Only Admin and Sales Support roles are allowed.
      </p>
      <button
        onClick={() => {
          const { Clerk } = window as any;
          if (Clerk) {
            Clerk.signOut();
            window.location.href = "/sign-in";
          }
        }}
        style={{
          padding: "10px 20px",
          backgroundColor: "#3b82f6",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontSize: "14px"
        }}
      >
        Sign Out
      </button>
    </div>
  </div>
);

// Check if user has required role
const hasRequiredRole = (user: any): boolean => {
  if (!user) return false;

  const role = user.publicMetadata?.role as string;
  const allowedRoles = ["admin", "sales", "support"];

  return Boolean(role) && allowedRoles.includes(role.toLowerCase());
};

// Protected route wrapper with role check
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();

  if (!isLoaded) {
    return <LoadingPage />;
  }

  if (!isSignedIn) {
    return <Navigate to="/sign-in" replace />;
  }

  // Check if user has required role
  if (!hasRequiredRole(user)) {
    return <UnauthorizedPage />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <ThemeProvider>
          <Refine
            authProvider={authProvider}
            dataProvider={dataProviders}
            routerProvider={routerProvider}
            notificationProvider={useNotificationProvider()}
            resources={[
              {
                name: "users",
                list: "/users",
                show: "/users/show/:id",
                meta: {
                  label: "Users",
                  icon: <HiOutlineUsers size={18} />
                },
              },
              // {
              //   name: "brands",
              //   list: "/brands",
              //   show: "/brands/show/:id",
              //   meta: { dataProviderName: "brands" },
              // },
            ]}
            options={{
              syncWithLocation: true,
              warnWhenUnsavedChanges: true,
              // projectId: "6HWHwF-ZSeiBF-m3fcx2",
            }}
          >
            <Routes>
              {/* Public route - only sign in */}
              <Route path="/sign-in/*" element={<SignInPage />} />
              <Route path="/sign-up/*" element={<SignUpPage />} />
              <Route path="/unauthorized" element={<UnauthorizedPage />} />

              {/* Protected routes with role check */}
              <Route
                element={
                  <ProtectedRoute>
                    <Authenticated fallback={<Navigate to="/sign-in" replace />} key={""}>
                      <Layout>
                        <Outlet />
                      </Layout>
                    </Authenticated>
                  </ProtectedRoute>
                }
              >
                <Route index element={<NavigateToResource resource="blog_posts" />} />

                <Route index element={<Navigate to="/users" />} />

                {/* Users */}
                <Route path="/users">
                  <Route index element={<UserList />} />
                  <Route path="show/:id" element={<UserShow />} />
                </Route>

                {/* Brands */}
                <Route path="/brands">
                  <Route index element={<BrandList />} />
                  <Route path="show/:id" element={<BrandShow />} />
                </Route>
              </Route>

              <Route path="*" element={<ErrorComponent />} />
            </Routes>

            <Toaster />
            <RefineKbar />
            <UnsavedChangesNotifier />
            <DocumentTitleHandler />
          </Refine>
        </ThemeProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;