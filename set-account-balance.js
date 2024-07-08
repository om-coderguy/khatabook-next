const { initializeApp } = require('firebase/app');
const { getDatabase, get,set , ref} = require('firebase/database');

const firebaseConfig = {
    apiKey:"AIzaSyDlV-YMLuER0GSAYIOpI1Kh_XaRzgoI8DE",
    authDomain:"khatabook-7f5c9.firebaseapp.com",
    databaseURL:"https://khatabook-7f5c9-default-rtdb.asia-southeast1.firebasedatabase.app/",
    projectId:"khatabook-7f5c9",
    storageBucket:"khatabook-7f5c9.appspot.com",
    messagingSenderId:"25297911365",
    appId:"1:25297911365:web:4943c228de28070ce0ad2c",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Function to fetch all customers from Firebase
const fetchCustomers = async () => {
  const customersRef = ref(db, 'customers');
  const customersSnapshot = await get(customersRef);
  return customersSnapshot.exists() ? customersSnapshot.val() : {};
};

// Function to fetch all transactions from Firebase
const fetchTransactions = async () => {
  const transactionsRef = ref(db, 'transactions');
  const transactionsSnapshot = await get(transactionsRef);
  return transactionsSnapshot.exists() ? transactionsSnapshot.val() : {};
};

// Helper function to safely parse amounts
const parseAmount = (amount) => {
  const parsed = parseFloat(amount);
  return isNaN(parsed) || parsed === 0 ? 0 : parsed;
};

// Function to calculate account balance for each customer
const calculateAccountBalance = async () => {
  const customers = await fetchCustomers();
  const transactions = await fetchTransactions();

  for (const customerId in customers) {
    const customerTransactions = Object.values(transactions).filter(
      transaction => transaction.user_id === customerId
    );

    let hasInvalidTransaction = false;

    const debitTotal = customerTransactions
      .filter(transaction => transaction.transaction_type === 'Debit')
      .reduce((acc, transaction) => {
        const amount = parseAmount(transaction.amount);
        if (amount === 0) {
          hasInvalidTransaction = true;
        }
        return acc + amount;
      }, 0);

    const creditTotal = customerTransactions
      .filter(transaction => transaction.transaction_type === 'Credit')
      .reduce((acc, transaction) => {
        const amount = parseAmount(transaction.amount);
        if (amount === 0) {
          hasInvalidTransaction = true;
        }
        return acc + amount;
      }, 0);

    let accountBalance;
    if (hasInvalidTransaction) {
      accountBalance = -1;
    } else {
      accountBalance = debitTotal - creditTotal;
    }

    // Ensure accountBalance is a valid number
    if (isNaN(accountBalance)) {
      console.error(`Invalid account balance for customer ${customerId}`);
      continue;
    }

    // Update customer with the calculated account balance
    const customerRef = ref(db, `customers/${customerId}`);
    await set(customerRef, {
      ...customers[customerId],
      account_balance: accountBalance,
    });

    console.log(`Updated customer ${customerId} with balance ${accountBalance}`);
  }
};

calculateAccountBalance().then(() => {
  console.log('Account balances updated successfully');
}).catch(error => {
  console.error('Error updating account balances:', error);
});

