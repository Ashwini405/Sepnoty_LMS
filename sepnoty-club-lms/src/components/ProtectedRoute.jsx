// import { Navigate } from "react-router-dom"
// import { useAuth } from "../App"

// export default function ProtectedRoute({ children }) {
//   const { user } = useAuth()

//   // ❌ Not logged in → redirect to signup
//   if (!user) {
//     return <Navigate to="/signup" replace />
//   }

//   // ✅ Logged in → allow access
//   return children
// }
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();

      if (data.session) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }

      setLoading(false);
    };

    checkSession();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return children;
};

export default ProtectedRoute;
