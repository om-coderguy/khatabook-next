import { useState } from 'react';
import { ref, set } from 'firebase/database';
import { db } from '../firebase';
import { useRouter } from 'next/router';
import styles from '../styles/AddCustomer.module.css';

const AddCustomer = () => {
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    alternateName: '',
    village: '',
    mobileNumber: '',
    alternateMobileNumber: '',
    accountBalance: ''
  });
  const router = useRouter();

  const handleChange = (e) => {
    setNewCustomer({
      ...newCustomer,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newCustomerRef = ref(db, 'customers/' + Date.now());
    await set(newCustomerRef, newCustomer);
    router.push('/customers'); // Redirect to the customers page after adding a new customer
  };

  return (
    <div className={styles.container}>
      <h1>Add Customer</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input type="text" name="name" value={newCustomer.name} onChange={handleChange} placeholder="Name" required />
        <input type="text" name="alternateName" value={newCustomer.alternateName} onChange={handleChange} placeholder="Alternate Name" />
        <input type="text" name="village" value={newCustomer.village} onChange={handleChange} placeholder="Village" required />
        <input type="text" name="mobileNumber" value={newCustomer.mobileNumber} onChange={handleChange} placeholder="Mobile Number" required />
        <input type="text" name="alternateMobileNumber" value={newCustomer.alternateMobileNumber} onChange={handleChange} placeholder="Alternate Mobile Number" />
        <input type="number" name="accountBalance" value={newCustomer.accountBalance} onChange={handleChange} placeholder="Account Balance" required />
        <button type="submit">Add Customer</button>
      </form>
    </div>
  );
};

export default AddCustomer;
