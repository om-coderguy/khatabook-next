import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { ref, get, set, remove } from "firebase/database";
import { db } from "../../firebase";
import styles from "../../styles/CustomerDetails.module.css";

const CustomerDetails = () => {
  const [customer, setCustomer] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const router = useRouter();
  const { id } = router.query;
  const userId = id;

  useEffect(() => {
    const fetchCustomerDetails = async () => {
      const customerRef = ref(db, `customers/${id}`);
      const snapshot = await get(customerRef);
      if (snapshot.exists()) {
        setCustomer(snapshot.val());
      }

      const fetchTransactions = async (id) => {
        try {
          const transactionsRef = ref(db, `transactions`);
          const transactionsSnapshot = await get(transactionsRef);
          let transactionData = Object.entries(transactionsSnapshot.val());

          transactionData = transactionData.filter(
            ([transactionId, transactionData]) => transactionData.user_id === id
          );

          if (transactionsSnapshot.exists()) {
            // Use the snapshot value directly to retain the object structure
            setTransactions(transactionData);
          } else {
            console.log("No data available");
          }
        } catch (error) {
          console.error("Error fetching transactions:", error);
        }
      };

      // Example usage
      fetchTransactions(id).then((transactions) => {});
    };

    if (id) {
      fetchCustomerDetails();
    }
  }, [id]);

  const calculateBalance = () => {
    const creditTotal = transactions
      .filter(
        ([transactionId, transactionData]) =>
          transactionData.transaction_type === "Credit"
      )
      .reduce(
        (acc, [transactionId, transactionData]) =>
          acc + Number(transactionData.amount),
        0
      );

    const debitTotal = transactions
      .filter(
        ([transactionId, transactionData]) =>
          transactionData.transaction_type === "Debit"
      )
      .reduce(
        (acc, [transactionId, transactionData]) =>
          acc + Number(transactionData.amount),
        0
      );

    return debitTotal - creditTotal;
  };

  const handleAddTransaction = (type) => {
    router.push(`/add-transaction?type=${type}&userId=${userId}`);
  };

  const handleEditTransaction = (transactionId, type) => {
    router.push(
      `/add-transaction?id=${transactionId}&userId=${userId}&type=${type}`
    );
  };

  const handleDeleteTransaction = async (transactionId) => {
    try {
      await remove(ref(db, `transactions/${transactionId}`));
      setTransactions(transactions.filter(([id]) => id !== transactionId));
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };

  if (!customer) return <div>Loading...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.details}>
        <h2 style={{ textTransform: "uppercase", fontSize: "22px" }}>
          {customer.id}. {customer.name}
        </h2>
        <div className="customer-details">
          <table className={styles.customerTable}>
            <tbody>
              <tr>
                <td className={styles.instruction}>Alternate Name:</td>
                <td>
                  {customer.alternateName ? (
                    customer.alternateName
                  ) : (
                    <span className={styles.notAvailableText}>N/A</span>
                  )}{" "}
                </td>
              </tr>
              <tr>
                <td className={styles.instruction}>Village:</td>
                <td>
                  {customer.village ? (
                    customer.village
                  ) : (
                    <span className={styles.notAvailableText}>N/A</span>
                  )}
                </td>
              </tr>
              <tr>
                <td className={styles.instruction}>Mobile Number:</td>
                <td>
                  {customer.mobileNumber ? (
                    customer.mobileNumber
                  ) : (
                    <span className={styles.notAvailableText}>N/A</span>
                  )}
                </td>
              </tr>
              <tr>
                <td className={styles.instruction}>Alternate Mobile Number:</td>
                <td>
                  {" "}
                  {customer.alternateMobileNumber ? (
                    customer.alternateMobileNumber
                  ) : (
                    <span className={styles.notAvailableText}>N/A</span>
                  )}
                </td>
              </tr>
              <tr>
                <td className={styles.instruction}>Balance:</td>
                <td>
                  <span
                    style={
                      customer.accountBalance > 0
                        ? { fontSize: "25px", color: "#e63946", fontWeight: "bold" }
                        : {
                            fontSize: "25px",
                            color: "green",
                            fontWeight: "bold",
                          }
                    }
                  >
                    {calculateBalance()} /-
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <h2 className={styles.transactionsHeading}>Transactions</h2>
      <div className={styles.transactionButtons}>
        <button
          onClick={() => handleAddTransaction("Credit")}
          // className="bg-green-500 text-white p-2 rounded mr-2"
          className={styles.creditButton}
        >
          Add Credit Transaction
        </button>
        <button
          onClick={() => handleAddTransaction("Debit")}
          // className="bg-red-500 text-white p-2 rounded"
          className={styles.debitButton}
        >
          Add Debit Transaction
        </button>
      </div>
      <div className="transactions-list mt-4">
        {transactions
          .slice()
          .reverse()
          .map(([transactionId, transactionData], index) => (
            <div
              key={index}
              className={`${styles.transactionData} ${
                transactionData.transaction_type === "Credit"
                  ? styles.credit
                  : styles.debit
              }`}
              onClick={() => setSelectedTransaction(transactionId)}
            >
              <div className="transaction-details">
                <table className={styles.transactionTable}>
                  <tbody>
                    <tr>
                      <td className="instruction">Amount:</td>
                      <td>{transactionData.amount}</td>
                    </tr>
                    <tr>
                      <td className="instruction">Date:</td>
                      <td>{transactionData.date}</td>
                    </tr>
                    <tr>
                      <td className="instruction">Bill Number:</td>
                      <td>{transactionData.bill_number}</td>
                    </tr>
                    <tr>
                      <td className="instruction">Book Number:</td>
                      <td>{transactionData.book_number}</td>
                    </tr>
                    <tr>
                      <td className="instruction">Note:</td>
                      <td>{transactionData.note}</td>
                    </tr>
                    <tr>
                      <td className="instruction">Transaction Type:</td>
                      <td>{transactionData.transaction_type}</td>
                    </tr>
                    <tr>
                      <td className="instruction">Payment Mode:</td>
                      <td>{transactionData.payment_mode}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              {selectedTransaction === transactionId && (
                <div className={styles.transactioncardButton}>
                  <button
                    className={styles.updateButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditTransaction(
                        transactionId,
                        transactionData.transaction_type
                      );
                    }}
                  >
                    Update
                  </button>
                  <button
                    className={styles.deleteButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteTransaction(transactionId);
                    }}
                  >
                    Delete
                  </button>
                  {/* <button
                    className={styles.updateButton}
                    
                  >
                    Edit
                  </button>
                  <button
                    className={styles.deleteButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteTransaction(transactionId);
                    }}
                  >
                    Delete
                  </button> */}
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
};

export default CustomerDetails;
