// import axios from 'axios';

// const API_URL = 'http://localhost:8000/api/customers';
// const API_URl = 'http://localhost:8000/api/customer'; 
// const API_URl_VERIFY = 'http://localhost:8000/api/customers/check-existing';

// export const getCustomers = (page, limit, sortField = "", sortOrder = "", searchTerm = "") => {
//   return axios.get(`${API_URL}?page=${page}&limit=${limit}&sortField=${sortField}&sortOrder=${sortOrder}${searchTerm ? `&search=${searchTerm}` : ""}`);
// };

// export const createCustomer = (customerData) => {
//   return axios.post(API_URl, customerData, {
//     headers: { "Content-Type": "multipart/form-data" },
//   });
// };



// export const updateCustomer = (customerId, customerData) => {
//   return axios.put(`${API_URL}/${customerId}`, customerData);
// };

// export const deleteCustomer = (customerId) => {
//   return axios.delete(`${API_URL}/${customerId}`);
// };

// export const searchCustomers = (searchTerm) => {
//   return axios.get(`${API_URL}?search=${searchTerm}`);
// };


// export const checkExistingRecords = (email, phone, gstn) => {
//   return axios.get(`${API_URl_VERIFY}?email=${email}&phone=${phone}`);
// };



import axios from 'axios';

const API_URL_GET = 'http://localhost:8000/api/customers';
const API_URL = 'http://localhost:8000/api/customer'; 
const API_URl_VERIFY = 'http://localhost:8000/api/customers/verify';

export const getCustomers = (page, limit, sortField = "", sortOrder = "", searchTerm = "") => {
  return axios.get(`${API_URL_GET}?page=${page}&limit=${limit}&sortField=${sortField}&sortOrder=${sortOrder}${searchTerm ? `&search=${searchTerm}` : ""}`);
};

export const postCustomer = (customerData) => {
  return axios.post(API_URL, customerData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const putCustomer = (customerId, customerData) => {
  return axios.put(`${API_URL}/${customerId}`, customerData);
};

export const deleteCustomer = (customerId) => {
  return axios.delete(`${API_URL_GET}/${customerId}`);
};

export const searchCustomers = (searchTerm) => {
  return axios.get(`${API_URL_GET}?search=${searchTerm}`);
};


//new Code
export const checkExistingRecords = async (email, phone, gstn) => {
  const response = await axios.get(`${API_URl_VERIFY}?email=${email}&phone=${phone}&gstn=${gstn}`);
  return {
    email: response.data.email ? true : false,
    phone: response.data.phone ? true : false,
    gstn: response.data.gstn ? true : false,
  };
};