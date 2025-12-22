import { Navigate } from "react-router-dom"
import { useAuth } from "../App"

export default function ProtectedRoute({ children }) {
  const { user } = useAuth()

  // ❌ Not logged in → redirect to signup
  if (!user) {
    return <Navigate to="/signup" replace />
  }

  // ✅ Logged in → allow access
  return children
}
