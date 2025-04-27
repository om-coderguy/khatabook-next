import { useState, useEffect } from 'react';
import { ref, set, update } from 'firebase/database';
import { db } from '../firebase';
import { useRouter } from 'next/router';
import styles from '../styles/AddCustomer.module.css';

const AddCustomer = () => {
  const router = useRouter();
  const { customerId, customerData, editMode } = router.query; // Retrieve query params

  const [customer, setCustomer] = useState({
    name: '',
    alternateName: '',
    village: '',
    mobileNumber: '',
    alternateMobileNumber: '',
    accountBalance: ''
  });

  // Pre-fill the form when in edit mode
  useEffect(() => {
    if (editMode && customerData) {
      const parsedCustomerData = JSON.parse(customerData); // Parse the stringified customer data
      setCustomer(parsedCustomerData); // Set it in the form fields
    }
  }, [editMode, customerData]);

  const handleChange = (e) => {
    setCustomer({
      ...customer,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editMode) {
      // Update the existing customer in the database
      const customerRef = ref(db, 'customers/' + customerId);
      await update(customerRef, customer);
    } else {
      // Create a new customer
      const newCustomerRef = ref(db, 'customers/' + Date.now());
      await set(newCustomerRef, customer);
    }

    router.push('/customers'); // Redirect to the customers page after submit
  };

  return (
    <div className={styles.container}>
      <h1>{editMode ? 'Edit Customer' : 'Add Customer'}</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          name="name"
          className={styles.capitalText}
          value={customer.name}
          onChange={handleChange}
          placeholder="Name"
          required
        />
        <input
          type="text"
          name="alternateName"
          value={customer.alternateName}
          className={styles.capitalText}
          onChange={handleChange}
          placeholder="Alternate Name"
        />
        <input
          type="text"
          name="village"
          value={customer.village}
          className={styles.capitalText}
          onChange={handleChange}
          placeholder="Village"
          required
        />
        <input
          type="text"
          name="mobileNumber"
          value={customer.mobileNumber}
          onChange={handleChange}
          placeholder="Mobile Number"
          required
        />
        <input
          type="text"
          name="alternateMobileNumber"
          value={customer.alternateMobileNumber}
          onChange={handleChange}
          placeholder="Alternate Mobile Number"
        />
        <input
          type="number"
          name="accountBalance"
          value={customer.accountBalance}
          onChange={handleChange}
          placeholder="Account Balance"
          required
        />
        <button type="submit" className={styles.saveButton}>{editMode ? 'Update' : 'Save'}</button>
      </form>
    </div>
  );
};

export default AddCustomer;
