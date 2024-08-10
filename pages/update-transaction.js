import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { db } from "../firebase";
import { ref, set, get } from "firebase/database";
import "../styles/Customers.module.css"; // Import the CSS file

const AddTransaction = () => {
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [billNumber, setBillNumber] = useState("");
  const [bookNumber, setBookNumber] = useState("");
  const [note, setNote] = useState("");
  const [transactionType, setTransactionType] = useState("");
  const [paymentMode, setPaymentMode] = useState("");
  const [userId, setUserId] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const router = useRouter();

  useEffect(() => {
    const { userId, type, id } = router.query;
    setUserId(userId);
    setTransactionType(type);

    if (id) {
      // Fetch existing transaction data to pre-fill form for editing
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
          setPaymentMode(data.payment_mode);
          setTransactionId(id);
        }
      };
      fetchTransaction();
    } else {
      // Fetch the highest transaction ID to generate the next ID
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
      transaction_type: transactionType,
      payment_mode: paymentMode,
    };
    await set(ref(db, `transactions/${transactionId}`), newTransaction);
    router.push(`/customer/${userId}`);
  };

  return (
    <div className="form-container">
      <h1 className="form-header">
        {transactionId ? "Edit Transaction" : "Add Transaction"}
      </h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="form-input"
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="form-input"
            required
          />
        </div>
        {transactionType === "Debit" && (
          <>
            <div className="form-group">
              <label className="form-label">Bill Number</label>
              <input
                type="text"
                value={billNumber}
                onChange={(e) => setBillNumber(e.target.value)}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Book Number</label>
              <input
                type="text"
                value={bookNumber}
                onChange={(e) => setBookNumber(e.target.value)}
                className="form-input"
              />
            </div>
          </>
        )}
        <div className="form-group">
          <label className="form-label">Note</label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Payment Mode</label>
          <input
            type="text"
            value={paymentMode}
            onChange={(e) => setPaymentMode(e.target.value)}
            className="form-input"
            required
          />
        </div>
        <button type="submit" className="submit-button">
          Sav
        </button>
      </form>
    </div>
  );
};

export default AddTransaction;
