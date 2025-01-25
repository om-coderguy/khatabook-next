import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { db } from "../firebase";
import { ref, set, get } from "firebase/database";
import { TextField, Autocomplete, Button } from "@mui/material"; // Import MUI components
import styles from "../styles/UpdateTransaction.module.css"; // Import the new CSS file

const AddTransaction = () => {
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [billNumber, setBillNumber] = useState("");
  const [bookNumber, setBookNumber] = useState("");
  const [note, setNote] = useState("");
  const [transactionTypes, setTransactionTypes] = useState(""); // Updated for multiselect
  const [paymentModes, setPaymentModes] = useState([]); // Updated for multiselect
  const [userId, setUserId] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const router = useRouter();

  const transactionTypeOptions = ["Debit", "Credit"]; // Options for transaction type
  const paymentModeOptions = ["Cash", "Card", "UPI", "Net Banking"]; // Options for payment modes

  useEffect(() => {
    const { userId, id } = router.query;
    setUserId(userId);

    if (id) {
      const fetchTransaction = async () => {
        const transactionRef = ref(db, `transactions/${id}`);
        const transactionSnapshot = await get(transactionRef);
        if (transactionSnapshot.exists()) {
          const data = transactionSnapshot.val();
          setAmount(data.amount);
          setDate(data.date);
          setBillNumber(data.bill_number);
          setBookNumber(data.book_number);
          setNote(data.note);
          setTransactionTypes(data.transaction_type?.split(",") || []);
          setPaymentModes(data.payment_mode?.split(",") || []);
          setTransactionId(id);
        }
      };
      fetchTransaction();
    } else {
      const fetchTransactions = async () => {
        const transactionsRef = ref(db, "transactions");
        const transactionsSnapshot = await get(transactionsRef);
        if (transactionsSnapshot.exists()) {
          const transactions = transactionsSnapshot.val();
          const ids = Object.keys(transactions).map((id) =>
            parseInt(id.slice(1))
          );
          const maxId = Math.max(...ids);
          setTransactionId(`T${maxId + 1}`);
        } else {
          setTransactionId("T1");
        }
      };
      fetchTransactions();
    }
  }, [router.query]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newTransaction = {
      transaction_id: transactionId,
      user_id: userId,
      amount,
      date,
      bill_number: billNumber,
      book_number: bookNumber,
      note,
      transaction_type: transactionTypes, // Save as comma-separated string
      payment_mode: paymentModes, // Save as comma-separated string
    };
    await set(ref(db, `transactions/${transactionId}`), newTransaction);
    router.push(`/customer/${userId}`);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>
        {transactionId ? "Edit Transaction" : "Add Transaction"}
      </h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <TextField
            label="Amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            fullWidth
            required
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <TextField
            label="Date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            fullWidth
            required
            InputLabelProps={{ shrink: true }}
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <Autocomplete
            options={transactionTypeOptions}
            value={transactionTypes}
            onChange={(event, newValue) => setTransactionTypes(newValue)}
            renderInput={(params) => (
              <TextField {...params} label="Transaction Type" fullWidth />
            )}
            className={styles.input}
          />
        </div>
        {transactionTypes=="Debit"&& (
          <>
            <div className={styles.formGroup}>
              <TextField
                label="Bill Number"
                type="text"
                value={billNumber}
                onChange={(e) => setBillNumber(e.target.value)}
                fullWidth
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <TextField
                label="Book Number"
                type="text"
                value={bookNumber}
                onChange={(e) => setBookNumber(e.target.value)}
                fullWidth
                className={styles.input}
              />
            </div>
          </>
        )}
        {transactionTypes=="Credit"&& (
          <div className={styles.formGroup}>
            <Autocomplete
              options={paymentModeOptions}
              value={paymentModes}
              onChange={(event, newValue) => setPaymentModes(newValue)}
              renderInput={(params) => (
                <TextField {...params} label="Payment Mode" fullWidth />
              )}
              className={styles.input}
            />
          </div>
        )}
        <div className={styles.formGroup}>
          <TextField
            label="Note"
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            fullWidth
            className={styles.input}
          />
        </div>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          className={styles.submitButton}
        >
          Save
        </Button>
      </form>
    </div>
  );
};

export default AddTransaction;
