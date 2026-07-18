import API from "../api/axios";

export const requestMemberOtp = (payload) => API.post("/auth/member/request-otp", payload);
export const setMemberPassword = (payload) => API.post("/auth/member/set-password", payload);
export const loginMember = (payload) => API.post("/auth/member/login", payload);
export const requestPasswordReset = (payload) => API.post("/auth/password/request-reset", payload);
export const resetPassword = (payload) => API.post("/auth/password/reset", payload);
export const getMemberDashboard = () => API.get("/member-portal/dashboard");
export const getMemberProfile = () => API.get("/member-portal/me");
export const changeMemberPassword = (payload) => API.put("/member-portal/me/password", payload);
export const updateMemberProfilePhoto = (photo) => {
  const form = new FormData();
  form.append("photo", photo);
  return API.put("/member-portal/me/photo", form);
};
export const getMemberAttendance = () => API.get("/member-portal/attendance");
export const getMemberEvents = () => API.get("/member-portal/events");
