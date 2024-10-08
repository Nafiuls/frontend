import FloatingShapes from "./components/FloatingShapes"
import { Routes, Route, Navigate } from 'react-router-dom'
import SignUpPage from "./pages/SignUpPage"
import LoginPage from "./pages/LoginPage"
import EmailVerification from "./pages/EmailVerification"
import { Toaster } from 'react-hot-toast'
import { useEffect } from "react"
import DashboardPage from "./pages/DashboardPage"
import LoadinSpinner from "./components/LoadinSpinner"
import ForgetPasswordPage from "./pages/ForgetPasswordPage"
import ResetPasswordPage from "./pages/ResetPasswordPage"
import { useAuthStore } from "./store/authStore"

// protected routes that require authentication
const Protected = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore()
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  if (!user.isVerified) {
    return <Navigate to="/verify-email" replace />
  }
  return children
}

// redirect authenticated user to the home page
const Redirect = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore()
  if (isAuthenticated && user.isVerified) {
    return <Navigate to="/" replace />
  }
  return children
}

function App() {
  const { isCheckingAuth, checkAuth } = useAuthStore()
  useEffect(() => {
    checkAuth()
  }, [checkAuth])
  if (isCheckingAuth) return <LoadinSpinner />
  return (
    <div className="w-full overflow-hidden min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 flex items-center justify-center relative">
      <FloatingShapes color="bg-green-500" size="w-64 h-64" top="-5%" left="10%" delay={0} />
      <FloatingShapes color="bg-green-500" size="w-48 h-48" top="70%" left="80%" delay={5} />
      <FloatingShapes color="bg-green-500" size="w-32 h-32" top="40%" left="-10%" delay={2} />
      <Routes>
        <Route path="/" element={<Protected>
          <DashboardPage />
        </Protected>} />
        <Route path="/signup" element={
          <Redirect>
            <SignUpPage />
          </Redirect>
        } />
        <Route path="/login" element={
          <Redirect>
            <LoginPage />
          </Redirect>
        } />
        <Route path="/verify-email" element={<EmailVerification />} />
        <Route path="/forgot-password" element={<ForgetPasswordPage />} />
        <Route
          path="/reset-password/:token" element={
            <Redirect>
              <ResetPasswordPage />
            </Redirect>}
        />
      </Routes>
      <Toaster />
    </div>
  )
}

export default App
