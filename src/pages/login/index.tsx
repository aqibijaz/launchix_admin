import { SignIn } from "@clerk/clerk-react";

export const LoginPage = () => (
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
      afterSignInUrl="/blog-posts"
      redirectUrl="/blog-posts"
    />
  </div>
);