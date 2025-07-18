import "./App.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Component imports
import Home from "./components/common/Home";
import Login from "./components/common/Login";
import SignUp from "./components/common/SignUp";
import HomePage from "./components/user/HomePage";
import Complaint from "./components/user/Complaint";
import Status from "./components/user/Status";
import AdminHome from "./components/admin/AdminHome";
import AgentHome from "./components/agent/AgentHome";
import UserInfo from "./components/admin/UserInfo";
import AgentInfo from "./components/admin/AgentInfo";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const isLoggedIn = !!localStorage.getItem("user");
  return isLoggedIn ? children : <Navigate to="/Login" replace />;
};

// Admin Route Component
const AdminRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.userType === "Admin";
  return isAdmin ? children : <Navigate to="/Login" replace />;
};

// Agent Route Component
const AgentRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const isAgent = user?.userType === "Agent";
  return isAgent ? children : <Navigate to="/Login" replace />;
};

// User Route Component
const UserRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const isUser = user?.userType === "Ordinary";
  return isUser ? children : <Navigate to="/Login" replace />;
};

function App() {
  return (
    <div className="App">
      <Router>
        <ToastContainer 
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <Routes>
          {/* Public Routes */}
          <Route exact path="/" element={<Home />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/SignUp" element={<SignUp />} />

          {/* Protected Admin Routes */}
          <Route path="/AdminHome" element={
            <ProtectedRoute>
              <AdminRoute>
                <AdminHome />
              </AdminRoute>
            </ProtectedRoute>
          } />
          <Route path="/UserInfo" element={
            <ProtectedRoute>
              <AdminRoute>
                <UserInfo />
              </AdminRoute>
            </ProtectedRoute>
          } />
          <Route path="/AgentInfo" element={
            <ProtectedRoute>
              <AdminRoute>
                <AgentInfo />
              </AdminRoute>
            </ProtectedRoute>
          } />

          {/* Protected Agent Routes */}
          <Route path="/AgentHome" element={
            <ProtectedRoute>
              <AgentRoute>
                <AgentHome />
              </AgentRoute>
            </ProtectedRoute>
          } />

          {/* Protected User Routes */}
          <Route path="/HomePage" element={
            <ProtectedRoute>
              <UserRoute>
                <HomePage />
              </UserRoute>
            </ProtectedRoute>
          } />
          <Route path="/Complaint" element={
            <ProtectedRoute>
              <UserRoute>
                <Complaint />
              </UserRoute>
            </ProtectedRoute>
          } />
          <Route path="/Status" element={
            <ProtectedRoute>
              <UserRoute>
                <Status />
              </UserRoute>
            </ProtectedRoute>
          } />

          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;