const xlsx = require('xlsx');
const fs = require('fs');
const moment = require('moment'); 

// Load the Excel file
const workbook = xlsx.readFile('./data/transactions.xlsx');

// Assuming the transactions data is in the first sheet
const sheetName = workbook.SheetNames[1];
const worksheet = workbook.Sheets[sheetName];

// Define the keys you expect in the JSON
const expectedKeys = [
 "transaction_id",
  "amount",
  "bill_number",
  "book_number",
  "date",
  "note",
  "transaction_type",
  "user_id",
  "payment_mode"
];

// Convert the sheet to JSON format
let transactions = xlsx.utils.sheet_to_json(worksheet, { raw: false });

// Process each transaction
transactions = transactions.map(transaction => {
  let processedTransaction = {};

  expectedKeys.forEach(key => {
    if (key === "date" && transaction[key]) {
      // Convert date using moment.js
      const parsedDate = moment(transaction[key], "MM/DD/YYYY");
      processedTransaction[key] = parsedDate.isValid() ? parsedDate.format("YYYY-MM-DD") : "";
    } else {
      // Fill missing keys with empty string and retain existing values
      processedTransaction[key] = transaction[key] || "";
    }
  });

  return processedTransaction;
});

// Save the JSON data to a file
fs.writeFileSync('./data/transactions.json', JSON.stringify(transactions, null, 2));

console.log('Excel file has been converted to JSON and saved successfully!');
