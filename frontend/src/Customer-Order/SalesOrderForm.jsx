import React, { useState, useEffect } from "react";
import "./salesorder.css";
import axios from "axios";

const SalesOrderForm = ({ customern, setCustomer, customerpo, setCustomerpo, date, setDate, status, setStatus, customers }) => {
  return (
    <div>
      <div className="ButtonContainer">
        <div className="labelinputfield">
          <label htmlFor="customern" className="lblCPO">
            Customer: <span className="required-field">*</span>
          </label>
          <select
            name="customern"
            value={customern}
            onChange={(e) => setCustomer(e.target.value)}
            className="customer-salesorder_input"
          >
            <option value="">Select Customer</option>
            {customers.map((customer) => (
              <option key={customer._id} value={customer._id}>
                {customer.name}
              </option>
            ))}
          </select>
        </div>
        <div className="labelinputfield">
          <label htmlFor="date" className="lblCPO">
            Date:<span className="required-field">*</span>
          </label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            className="customer-salesorder_input1"
          />
        </div>
      </div>
      <div className="ButtonContainer">
        <div className="labelinputfield">
          <label htmlFor="customerpo" className="lblCPO">
            Customer PO:<span className="required-field">*</span>
          </label>
          <input
            type="text"
            id="customerpo"
            value={customerpo}
            onChange={(e) => setCustomerpo(e.target.value)}
            className="customer-salesorder_input1"
          />
        </div>
        <div className="labelinputfield">
          <label htmlFor="status" className="lblCPO">
            Status:<span className="required-field">*</span>
          </label>
          <select
            id="status"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="customer-salesorder_input1"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default SalesOrderForm;
