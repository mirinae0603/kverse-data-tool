import './App.css'
import ProtectedRoute from './features/auth/components/ProtectedRoute';
import PublicRoute from './features/auth/components/PublicRoute';
import { AuthProvider } from './features/auth/context/AuthContext';
import LoginPage from './features/auth/pages/LoginPage';
import ProcessUpload from './features/dashboard/components/ProcessUpload';
import UploadFiles from './features/dashboard/components/UploadFIles';
import ViewUploads from './features/dashboard/components/ViewUploads';
import Dashboard from './features/dashboard/Dashboard'
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {

  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route element={<PublicRoute />}>
              <Route path="/" element={<LoginPage />}></Route>
            </Route>
            <Route element={<ProtectedRoute />}>
              <Route element={<Dashboard />}>
                <Route path="/dashboard" element={<UploadFiles />} />
                <Route path="/uploads" element={<ViewUploads />}></Route>
                <Route path="/uploads/:uploadId" element={<ProcessUpload />}></Route>
              </Route>
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </>
  )
}

export default App
