import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/dashboard/Dashboard";
import Members from "./pages/members/Members";
import AddMember from "./pages/AddMember";
import Events from "./pages/events/Events";
import CreateEvent from "./pages/CreateEvent";
import Attendance from "./pages/Attendance";
import Reports from "./pages/reports/Reports";
import UtilityPage from "./pages/UtilityPage";

import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./layouts/DashboardLayout";
import MemberLayout from "./layouts/MemberLayout";
import MemberDashboard from "./pages/member/MemberDashboard";
import MemberAttendance from "./pages/member/MemberAttendance";
import MemberEvents from "./pages/member/MemberEvents";
import MemberProfile from "./pages/member/MemberProfile";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route
        element={
          <ProtectedRoute role="admin">
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/members" element={<Members />} />
        <Route path="/members/add" element={<AddMember />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/create" element={<CreateEvent />} />
        <Route path="/events/:id/edit" element={<CreateEvent />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/profile" element={<UtilityPage />} />
        <Route path="/notifications" element={<UtilityPage />} />
      </Route>

      <Route element={<ProtectedRoute role="member"><MemberLayout /></ProtectedRoute>}>
        <Route path="/member" element={<MemberDashboard />} />
        <Route path="/member/attendance" element={<MemberAttendance />} />
        <Route path="/member/events" element={<MemberEvents />} />
        <Route path="/member/profile" element={<MemberProfile />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
