import API from "../api/axios";

export const getAdminProfile = () => API.get("/admin-profile/me");
export const changeAdminPassword = (payload) => API.put("/admin-profile/me/password", payload);
export const updateAdminProfilePhoto = (photo) => {
  const form = new FormData();
  form.append("photo", photo);
  return API.put("/admin-profile/me/photo", form);
};
