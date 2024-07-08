import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ref, get, set, remove} from 'firebase/database';
import { db } from '../../firebase';
import styles from '../../styles/CustomerDetails.module.css';

const CustomerDetails = () => {
  const [customer, setCustomer] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const router = useRouter();
  const { id } = router.query;
  const userId=id;

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
          let transactionData= Object.entries(transactionsSnapshot.val())
          
           transactionData = transactionData.filter(([transactionId, transactionData]) =>
            transactionData.user_id===id
          );

          if (transactionsSnapshot.exists()) {
            // Use the snapshot value directly to retain the object structure
            setTransactions(transactionData);
          } else {
            console.log('No data available');
          }
        } catch (error) {
          console.error('Error fetching transactions:', error);
        }
      };
      
      // Example usage
      fetchTransactions(id).then(transactions => {
      });
    };

    if (id) {
      fetchCustomerDetails();
    }
  }, [id]);

  const calculateBalance = () => {
    const creditTotal = transactions
      .filter(([transactionId, transactionData]) => transactionData.transaction_type === 'Credit')
      .reduce((acc, [transactionId, transactionData]) => acc + Number(transactionData.amount), 0);
  
    const debitTotal = transactions
      .filter(([transactionId, transactionData]) => transactionData.transaction_type === 'Debit')
      .reduce((acc, [transactionId, transactionData]) => acc + Number(transactionData.amount), 0);
  
    return debitTotal - creditTotal;
  };

  const handleAddTransaction = (type) => {
    router.push(`/add-transaction?type=${type}&userId=${userId}`);
  };

  const handleEditTransaction = (transactionId, type) => {
    router.push(`/add-transaction?id=${transactionId}&userId=${userId}&type=${type}`);
  };

  const handleDeleteTransaction = async (transactionId) => {
    try {
      await remove(ref(db, `transactions/${transactionId}`));
      setTransactions(transactions.filter(([id]) => id !== transactionId));
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };


  if (!customer) return <div>Loading...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.details}>
        <h2 style={{ textTransform: 'uppercase' ,fontSize:'25px'}}> {customer.name}</h2>
        <p><strong>Alternate Name:</strong> {customer.alternateName}</p>
        <p><strong>Village:</strong> {customer.village}</p>
        <p><strong>Mobile Number:</strong> {customer.mobileNumber}</p>
        <p><strong>Alternate Mobile Number:</strong> {customer.alternateMobileNumber}</p>
        <p><strong>Balance:</strong> <span style={{fontSize:'25px'}}>{calculateBalance()}</span></p>
      </div>
      <h2 className={styles.transactionsHeading}>Transactions</h2>
      <button
        onClick={() => handleAddTransaction('Credit')}
        className="bg-green-500 text-white p-2 rounded mr-2"
      >
        Add Credit Transaction
      </button>
      <button
        onClick={() => handleAddTransaction('Debit')}
        className="bg-red-500 text-white p-2 rounded"
      >
        Add Debit Transaction
      </button>
      <div className="transactions-list mt-4">
        {transactions.map(([transactionId, transactionData], index) => (
          <div
            key={index}
            className={`${styles.transactionData} ${transactionData.transaction_type === 'Credit' ? styles.credit : styles.debit}`}
            onClick={() => setSelectedTransaction(transactionId)}
          >
            <p className="mb-1">Amount: {transactionData.amount}</p>
            <p className="mb-1">Date: {transactionData.date}</p>
            <p className="mb-1">Bill Number: {transactionData.bill_number}</p>
            <p className="mb-1">Book Number: {transactionData.book_number}</p>
            <p className="mb-1">Note: {transactionData.note}</p>
            <p className="mb-1">Transaction Type: {transactionData.transaction_type}</p>
            <p className="mb-1">Payment Mode: {transactionData.payment_mode}</p>
            {selectedTransaction === transactionId && (
              <div className="tooltip bg-gray-800 text-white p-2 rounded mt-2">
                <button
                  className="bg-blue-500 text-white p-2 rounded mr-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditTransaction(transactionId,transactionData.transaction_type);
                  }}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white p-2 rounded"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteTransaction(transactionId);
                  }}
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

export default CustomerDetails


