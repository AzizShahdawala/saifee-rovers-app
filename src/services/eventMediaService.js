import API from "../api/axios";

export const getEventMedia = (eventId) => API.get(`/event-media/${eventId}`);
export const uploadEventMedia = (eventId, files, onUploadProgress) => {
  const form = new FormData();
  for (const file of files) form.append("media", file);
  return API.post(`/event-media/${eventId}`, form, { timeout: 0, onUploadProgress });
};
