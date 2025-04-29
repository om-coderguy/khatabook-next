import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { db } from "../firebase";
import { ref, set, get } from "firebase/database";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Autocomplete,
  Button,
} from "@mui/material";
import styles from "../styles/UpdateTransaction.module.css";

const AddTransactionDialog = ({
  open,
  onClose,
  userId,
  transactionId,
  fetchTransactions,
}) => {
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [billNumber, setBillNumber] = useState("");
  const [bookNumber, setBookNumber] = useState("");
  const [note, setNote] = useState("");
  const [transactionTypes, setTransactionTypes] = useState("");
  const [paymentModes, setPaymentModes] = useState([]);
  const router = useRouter();

  const transactionTypeOptions = ["Debit", "Credit"];
  const paymentModeOptions = ["Cash", "Card", "UPI", "Net Banking"];

  useEffect(() => {
    if (transactionId) {
      const fetchTransaction = async () => {
        const transactionRef = ref(db, `transactions/${transactionId}`);
        const transactionSnapshot = await get(transactionRef);
        if (transactionSnapshot.exists()) {
          const data = transactionSnapshot.val();
          setAmount(data.amount);
          setDate(data.date);
          setBillNumber(data.bill_number);
          setBookNumber(data.book_number);
          setNote(data.note);
          setTransactionTypes(data.transaction_type || "");
          setPaymentModes(
            data.payment_mode ? data.payment_mode.split(",") : []
          );
        }
      };
      fetchTransaction();
    } else {
      setTransactionTypes("");
      setPaymentModes([]);
      setAmount("");
      setDate("");
      setBillNumber("");
      setBookNumber("");
      setNote("");
    }
  }, [transactionId]);

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
      transaction_type: transactionTypes,
      payment_mode: paymentModes.join(","),
    };
    await set(ref(db, `transactions/${transactionId}`), newTransaction);
    fetchTransactions(transactionId);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {transactionId ? "Edit Transaction" : "Add Transaction"}
      </DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit} className={styles.form}>
          <TextField
            label="Amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            fullWidth
            required
            className={styles.input}
            margin="dense"
          />
          <TextField
            label="Date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            fullWidth
            required
            InputLabelProps={{ shrink: true }}
            className={styles.input}
            margin="dense"
          />
          <Autocomplete
            options={transactionTypeOptions}
            value={transactionTypes}
            onChange={(event, newValue) => setTransactionTypes(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Transaction Type"
                fullWidth
                margin="dense"
              />
            )}
            className={styles.input}
          />
          {transactionTypes === "Debit" && (
            <>
              <TextField
                label="Bill Number"
                type="text"
                value={billNumber}
                onChange={(e) => setBillNumber(e.target.value)}
                fullWidth
                className={styles.input}
                margin="dense"
              />
              <TextField
                label="Book Number"
                type="text"
                value={bookNumber}
                onChange={(e) => setBookNumber(e.target.value)}
                fullWidth
                className={styles.input}
                margin="dense"
              />
            </>
          )}
          {transactionTypes === "Credit" && (
            <Autocomplete
              multiple
              options={paymentModeOptions}
              value={paymentModes}
              onChange={(event, newValue) => setPaymentModes(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Payment Mode"
                  fullWidth
                  margin="dense"
                />
              )}
              className={styles.input}
            />
          )}
          <TextField
            label="Note"
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            fullWidth
            className={styles.input}
            margin="dense"
          />
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddTransactionDialog;
