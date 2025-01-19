import { useState, useEffect } from "react";
import { ref, get, remove } from "firebase/database";
import { db } from "../firebase";
import { useRouter } from "next/router";
import styles from "../styles/Customers.module.css";
import dummyData from "../public/dummyData.json"; // Import the dummy data
import { DataGrid } from "@mui/x-data-grid";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [filteredCustomerCount, setFilteredCustomerCount] = useState(0);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);
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

  const handleUpdate = (customerId, customerData) => {
    router.push({
      pathname: "/add-customer",
      query: {
        customerId,
        customerData: JSON.stringify(customerData),
        editMode: true,
      },
    });
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

  const openConfirmDialog = (customerId) => {
    setCustomerToDelete(customerId);
    setShowConfirmDialog(true);
  };

  const closeConfirmDialog = () => {
    setShowConfirmDialog(false);
    setCustomerToDelete(null);
  };

  const handleDeleteConfirmed = () => {
    handleDelete(customerToDelete);
    closeConfirmDialog();
  };

  // Sample data (replace with your dynamic data)
  const rows = filteredCustomers.map(([id, data]) => ({
    id,
    name: data.name,
    alternateName: data.alternateName,
    village: data.village,
    mobileNumber: data.mobileNumber,
    alternateMobileNumber: data.alternateMobileNumber,
    accountBalance: data.accountBalance,
  }));

  const columns = [
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      renderCell: (params) => (
        <span style={{ textTransform: "capitalize" }}>{params.value}</span>
      ),
    },
    {
      field: "alternateName",
      headerName: "Alternate Name",
      flex: 1,
      renderCell: (params) => (
        <span style={{ textTransform: "capitalize" }}>{params.value}</span>
      ),
    },
    {
      field: "village",
      headerName: "Village",
      flex: 1,
      renderCell: (params) => (
        <span style={{ textTransform: "capitalize" }}>{params.value}</span>
      ),
    },
    { field: "mobileNumber", headerName: "Mobile Number", flex: 1 },
    { field: "alternateMobileNumber", headerName: "Alt Mobile N", flex: 1 },
    {
      field: "accountBalance",
      headerName: "Account Balance",
      flex: 1,
      renderCell: (params) => (
        <span style={{ textTransform: "capitalize" }}>{params.value}</span>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <div className={styles.actions}>
          <button
            className={styles.detailsButton}
            onClick={() => router.push(`/customer/${params.row.id}`)}
          >
            <FaEye style={{ fontSize: "20px", color: "#555" }} />
          </button>
          <button
            className={styles.updateButton}
            onClick={() => handleUpdate(params.row.id, params.row)}
          >
            <FaEdit style={{ fontSize: "20px", color: "#555" }} />
          </button>
          <button
            className={styles.deleteButton}
            onClick={() => openConfirmDialog(params.row.id)}
          >
            <FaTrash style={{ fontSize: "20px", color: "#555" }} />
          </button>
        </div>
      ),
    },
  ];

  // const filteredCustomers = customers.filter(([id, data]) =>
  //   data.name.toLowerCase().includes(searchQuery.toLowerCase())
  // );

  // const totalCustomers = customers.length;
  // const filteredCustomerCount = filteredCustomers.length;

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>SHREE RENUKA TRADERS</h1>
      <div className={styles.header}>
        <h2
          style={{
            fontSize: "20px",
            marginBottom: "20px",
            color: "rgba(7, 6, 6, 0.789)",
          }}
        >
          Customers
        </h2>
        <button
          onClick={() => router.push("/add-customer")}
          className={styles.addButton}
          style={{ backgroundColor: "#5F67FA" }}
        >
          Add Customer
        </button>
      </div>
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
          </span>
        </span>
      </div>
      <div style={{ height: "calc(100vh - 250px)", width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: { paginationModel: { pageSize: 30, page: 0 } },
          }}
          pageSizeOptions={[30, 50, 100]}
          checkboxSelection
          sx={{ border: 0 }}
        />
      </div>
      {showConfirmDialog && (
        <div className={styles.dialogOverlay}>
          <div className={styles.dialogBox}>
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to delete this customer?</p>
            <div className={styles.dialogButtons}>
              <button
                className={`${styles.dialogButton} ${styles.cancel}`}
                onClick={closeConfirmDialog}
              >
                Cancel
              </button>
              <button
                className={`${styles.dialogButton} ${styles.confirm}`}
                onClick={handleDeleteConfirmed}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;
