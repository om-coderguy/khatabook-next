import { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
} from "@mui/material";
import { ref, set, update } from "firebase/database";
import { db } from "../firebase";
import styles from "../styles/Customers.module.css";

const CustomerDialog = ({
  open,
  onClose,
  customerData,
  editMode,
  fetchCustomers,
}) => {
  const [customer, setCustomer] = useState({
    name: "",
    alternateName: "",
    village: "",
    mobileNumber: "",
    alternateMobileNumber: "",
    accountBalance: "",
  });

  useEffect(() => {
    console.log("customerData:", customerData);

    if (editMode && customerData) {
      setCustomer(customerData);
    } else {
      setCustomer({
        name: "",
        alternateName: "",
        village: "",
        mobileNumber: "",
        alternateMobileNumber: "",
        accountBalance: "",
      });
    }
  }, [customerData, editMode]);

  const handleChange = (e) => {
    setCustomer({ ...customer, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        const customerRef = ref(db, "customers/" + customer.id);
        await update(customerRef, customer);
      } else {
        const newCustomerRef = ref(db, "customers/" + Date.now());
        await set(newCustomerRef, customer);
      }
      fetchCustomers();
      onClose();
    } catch (error) {
      console.error("Error saving customer:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{editMode ? "Edit Customer" : "Add Customer"}</DialogTitle>
      <DialogContent>
        <form className={styles.form} onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="dense"
            name="name"
            value={customer.name}
            onChange={handleChange}
            label="Name"
            required
          />
          <TextField
            fullWidth
            margin="dense"
            name="alternateName"
            value={customer.alternateName}
            onChange={handleChange}
            label="Alternate Name"
          />
          <TextField
            fullWidth
            margin="dense"
            name="village"
            value={customer.village}
            onChange={handleChange}
            label="Village"
            required
          />
          <TextField
            fullWidth
            margin="dense"
            name="mobileNumber"
            value={customer.mobileNumber}
            onChange={handleChange}
            label="Mobile Number"
            required
          />
          <TextField
            fullWidth
            margin="dense"
            name="alternateMobileNumber"
            value={customer.alternateMobileNumber}
            onChange={handleChange}
            label="Alternate Mobile Number"
          />
          <TextField
            fullWidth
            margin="dense"
            name="accountBalance"
            value={customer.accountBalance}
            onChange={handleChange}
            label="Account Balance"
            type="number"
            required
          />
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          {editMode ? "Update Customer" : "Add Customer"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CustomerDialog;
