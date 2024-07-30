import { useState, useEffect } from "react";
import { ref, get, update, remove } from "firebase/database";
import { db } from "../firebase";
import { useRouter } from "next/router";
import styles from "../styles/Customers.module.css";
import dummyData from "../public/dummyData.json"; // Import the dummy data

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [filteredCustomerCount, setFilteredCustomerCount] = useState(0);
  const [selectedCustomer, setselectedCustomer] = useState(null);
  const router = useRouter();

  const fetchCustomers = async () => {
    const customersRef = ref(db, "customers/");
    const snapshot = await get(customersRef);
    if (snapshot.exists()) {
      const customersData = Object.entries(snapshot.val());
      setCustomers(customersData);
      setFilteredCustomers(customersData);
      setTotalCustomers(customersData.length);
      setFilteredCustomerCount(customersData.length);
    }
  };

  useEffect(() => {
    fetchCustomers();
    // Uncomment the following line to add dummy data only once
    // addDummyData();
  }, []);

  const handleDelete = async (customerId) => {
    const customerRef = ref(db, "customers/" + customerId);
    await remove(customerRef);
    fetchCustomers();
  };

  const handleUpdate = async (customerId, updatedData) => {
    const customerRef = ref(db, "customers/" + customerId);
    await update(customerRef, updatedData);
    fetchCustomers();
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = customers.filter(([customerId, customerData]) =>
      Object.values(customerData).some((value) =>
        value.toString().toLowerCase().includes(query)
      )
    );
    setFilteredCustomers(filtered);
    setFilteredCustomerCount(filtered.length);
  };

  const addDummyData = async () => {
    for (const customer of dummyData) {
      const newCustomerRef = ref(
        db,
        "customers/" + Date.now() + Math.random().toString(36).substr(2, 9)
      );
      await set(newCustomerRef, customer);
    }

    fetchCustomers();
  };

  const handleCustomerClick = (customerId) => {
    router.push(`/customer/${customerId}`);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>SHREE RENUKA TRADERS</h1>
      <h2
        style={{
          fontSize: "20px",
          marginBottom: "20px",
          color: "rgba(7, 6, 6, 0.789)",
        }}
      >
        Customers
      </h2>
      <input
        type="text"
        value={searchQuery}
        onChange={handleSearch}
        placeholder="Search..."
        className={styles.search}
      />
      <div className={styles.count}>
        <span style={{ marginRight: "30px" }}>
          Total Customers:{" "}
          <span style={{ color: "#c1121f", fontWeight: "bold" }}>
            {totalCustomers}
          </span>
        </span>
        <span>
          Filtered Customers:{" "}
          <span style={{ color: "#c1121f", fontWeight: "bold" }}>
            {filteredCustomerCount}
          </span>{" "}
        </span>
      </div>
      <button
        onClick={() => router.push("/add-customer")}
        className={styles.addButton}
      >
        Add Customer
      </button>
      <div
        className={styles.customerList}
      >
        {filteredCustomers.map(([customerId, customerData]) => (
          <div
            key={customerId}
            className={styles.customerCard}
            onClick={() => handleCustomerClick(customerId)}
          >
            <p style={{ fontSize: "20px", textTransform: "upperCase" }}>
              {" "}
              {customerData.name}
            </p>
            <p>
              <strong>Alternate Name:</strong> {customerData.alternateName}
            </p>
            <p>
              <strong>Village:</strong> {customerData.village}
            </p>
            <p>
              <strong>Mobile Number:</strong> {customerData.mobileNumber}
            </p>
            <p>
              <strong>Alternate Mobile Number:</strong>{" "}
              {customerData.alternateMobileNumber}
            </p>
            <p>
              <strong>Account Balance:</strong> {customerData.accountBalance}
            </p>
            {selectedCustomer === customerId && (
              <div>
                <button
                  className={styles.updateButton}
                  onClick={() =>
                    handleUpdate(customerId, {
                      ...customerData,
                      name: customerData.name + " Updated",
                    })
                  }
                >
                  Update
                </button>
                <button
                  className={styles.deleteButton}
                  onClick={() => handleDelete(customerId)}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Customers;
