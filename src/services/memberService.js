import API from "../api/axios";

export const registerMember = (data) => {
  return API.post(
    "/members/register",

    data,

    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
};

export const checkEnrollmentService = () => API.get("/recognition/health", { timeout: 5000 });

export const getMembers = () => {
  return API.get("/members");
};

export const getMember = (id) => {
  return API.get(`/members/${id}`);
};

export const updateMember = (
  id,

  data,
) => {
  return API.put(
    `/members/${id}`,

    data,
  );
};

export const deleteMember = (id) => {
  return API.delete(`/members/${id}`);
};
