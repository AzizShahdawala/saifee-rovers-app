import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/dashboard/Dashboard";
import Members from "./pages/members/Members";
import AddMember from "./pages/AddMember";
import Events from "./pages/events/Events";
import CreateEvent from "./pages/CreateEvent";
import Attendance from "./pages/Attendance";
import Reports from "./pages/reports/Reports";

import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./layouts/DashboardLayout";
import MemberLayout from "./layouts/MemberLayout";
import MemberDashboard from "./pages/member/MemberDashboard";
import MemberAttendance from "./pages/member/MemberAttendance";
import MemberEvents from "./pages/member/MemberEvents";
import MemberProfile from "./pages/member/MemberProfile";
import AdminProfile from "./pages/AdminProfile";
import PatrolScoreboard from "./pages/scoreboard/PatrolScoreboard";
import Birthdays from "./pages/birthdays/Birthdays";
import Gallery from "./pages/gallery/Gallery";
import Anniversaries from "./pages/anniversaries/Anniversaries";
import LandingPage from "./pages/LandingPage";
import Receipts from "./pages/receipts/Receipts";
import Enquiries from "./pages/enquiries/Enquiries";
import Waras from "./pages/waras/Waras";
import Marketplace from "./pages/marketplace/Marketplace";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />

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
        <Route path="/patrol-scoreboard" element={<PatrolScoreboard />} />
        <Route path="/birthdays" element={<Birthdays />} />
        <Route path="/waras" element={<Waras />} />
        <Route path="/anniversaries" element={<Anniversaries />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/profile" element={<AdminProfile />} />
        <Route path="/receipts" element={<Receipts />} />
        <Route path="/enquiries" element={<Enquiries />} />
        <Route path="/marketplace" element={<Marketplace />} />
      </Route>

      <Route element={<ProtectedRoute role="member"><MemberLayout /></ProtectedRoute>}>
        <Route path="/member" element={<MemberDashboard />} />
        <Route path="/member/attendance" element={<MemberAttendance />} />
        <Route path="/member/events" element={<MemberEvents />} />
        <Route path="/member/gallery" element={<Gallery />} />
        <Route path="/member/patrol-dashboard" element={<PatrolScoreboard readOnly />} />
        <Route path="/member/birthdays" element={<Birthdays />} />
        <Route path="/member/waras" element={<Waras />} />
        <Route path="/member/anniversaries" element={<Anniversaries />} />
        <Route path="/member/profile" element={<MemberProfile />} />
        <Route path="/member/receipts" element={<Receipts />} />
        <Route path="/member/marketplace" element={<Marketplace />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
