import axios from "axios";

const API_URL = 'http://localhost:8000/api/items'; 
const API_POST_URL = 'http://localhost:8000/api/item'; 

const API_SUPP_URL = 'http://localhost:8000/api/suppliers';


export const getItems = (page, limit, sortField = "", sortOrder = "", searchTerm = "") => {
  return axios.get(`${API_URL}?page=${page}&limit=${limit}&sortField=${sortField}&sortOrder=${sortOrder}${searchTerm ? `&search=${searchTerm}` : ""}`);
};


export const createItem = (itemData) => {
  return axios.post(API_POST_URL, itemData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};


export const updateItem = (itemId, itemData) => {
  return axios.put(`${API_URL}/${itemId}`, itemData);
};


export const deleteItem = (itemId) => {
  return axios.delete(`${API_URL}/${itemId}`);
};


export const searchItems = (searchTerm) => {
  return axios.get(`${API_URL}?search=${searchTerm}`);
};


export const getSuppliers = async (page = 1, limit = 10, searchTerm = "") => {
    try {
      const response = await axios.get(`${API_SUPP_URL}?page=${page}&limit=${limit}${searchTerm ? `&search=${searchTerm}` : ""}`);
      return response.data; 
    } catch (error) {
      console.error("Error fetching suppliers:", error);
      throw error; 
    }
  };
