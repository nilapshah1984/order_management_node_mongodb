import axios from "axios";

const API_URL = 'http://localhost:8000/api/suppliers'; 
const API_POST_URL = 'http://localhost:8000/api/supplier'; 

export const getSuppliers = (page, limit, sortField = "", sortOrder = "", searchTerm = "") => {
  return axios.get(`${API_URL}?page=${page}&limit=${limit}&sortField=${sortField}&sortOrder=${sortOrder}${searchTerm ? `&search=${searchTerm}` : ""}`);
};

export const createSupplier = (supplierData) => {
  return axios.post(API_POST_URL, supplierData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const updateSupplier = (supplierId, supplierData) => {
  return axios.put(`${API_URL}/${supplierId}`, supplierData);
};

export const deleteSupplier = (supplierId) => {
  return axios.delete(`${API_URL}/${supplierId}`);
};

export const searchSuppliers = (searchTerm) => {
  return axios.get(`${API_URL}?search=${searchTerm}`);
};



