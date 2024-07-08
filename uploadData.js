const { initializeApp } = require('firebase/app');
const { getDatabase, set , ref} = require('firebase/database');
const customers = require('../khatabook-next/data/customers.json');
const transactions = require('../khatabook-next/data/transactions.json');

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

const uploadData = async () => {

  // for (const customer of customers) {
  //   await set(ref(db, `customers/${customer.id}`), customer);
  // }

  for (const transaction of transactions) {
    await set(ref(db, `transactions/${transaction.transaction_id}`), transaction);
  }

  console.log('Data uploaded successfully!');
};

uploadData();
