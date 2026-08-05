import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import ProtectedRoute from "./components/common/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ReportSighting from "./pages/ReportSighting";
import MyReports from "./pages/MyReports";
import WildlifeInfo from "./pages/WildlifeInfo";
import ConservationEvents from "./pages/ConservationEvents";
import Donate from "./pages/Donate";
import AdminDashboard from "./pages/AdminDashboard";
import AdminReportManagement from "./pages/AdminReportManagement";
import AdminAnimalManagement from "./pages/AdminAnimalManagement";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/wildlife-info" element={<WildlifeInfo />} />
          <Route path="/events" element={<ConservationEvents />} />

          {/* Protected Routes (All Auth Users) */}
          <Route 
            path="/report" 
            element={
              <ProtectedRoute>
                <ReportSighting />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/my-reports" 
            element={
              <ProtectedRoute>
                <MyReports />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/donate" 
            element={
              <ProtectedRoute>
                <Donate />
              </ProtectedRoute>
            } 
          />

          {/* Admin Protected Routes */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/reports" 
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminReportManagement />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/animals" 
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminAnimalManagement />
              </ProtectedRoute>
            } 
          />

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
      
      {/* Toast Notifications */}
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#ffffff',
            color: '#1A1A1A',
            border: '1px solid #E5DFD3',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
            borderRadius: '0.75rem',
          },
          success: {
            iconTheme: {
              primary: '#66BB6A',
              secondary: '#fff',
            },
          },
        }} 
      />
    </div>
  );
}

export default App;
