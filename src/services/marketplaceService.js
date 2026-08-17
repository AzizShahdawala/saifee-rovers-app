import API from "../api/axios";
export const getMarketplaceListings = (params = {}) => API.get("/marketplace", { params });
export const createMarketplaceListing = (formData) => API.post("/marketplace", formData, { headers: { "Content-Type": "multipart/form-data" }, timeout: 120000 });
export const addMarketplaceComment = (id, text) => API.post(`/marketplace/${id}/comments`, { text });
export const removeMarketplaceComment = (id, commentId) => API.delete(`/marketplace/${id}/comments/${commentId}`);
export const updateMarketplaceStatus = (id, status, buyerId) => API.patch(`/marketplace/${id}/status`, { status, buyerId });
