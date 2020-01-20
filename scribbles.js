// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyBiEa4YLP-7E7lpoWGRK2jF1lX1fCd7PmY",
  authDomain: "cb-invoices.firebaseapp.com",
  databaseURL: "https://cb-invoices.firebaseio.com",
  projectId: "cb-invoices",
  storageBucket: "cb-invoices.appspot.com",
  messagingSenderId: "934037469865",
  appId: "1:934037469865:web:fdb572c2eb5e73e8df47b8",
  measurementId: "G-FEJ51LQCKD"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();
const db = firebase.firestore();

function addRow() {
  rowsParent = document.getElementById("rows-parent");
  let row = `<input type="text" name="" id="" class="itemName" />`;
  rowsParent.insertAdjacentHTML("beforeend", row);
}

function arrayFromRows() {
  const rows = Array.from(document.querySelectorAll(".itemName"));
  rows.forEach(row => console.log(row));
}

function writeToFirestore() {
  let testArray = [
    { itemDescription: "Content Writing", itemQty: 2, itemPrice: 50 },
    { itemDescription: "Content Writing", itemQty: 2, itemPrice: 50 }
  ];
  // Get a new write batch
  var batch = db.batch();

  var invRef = db.collection("invs").doc("invdoc");

  batch.set(invRef, { invoiceItems: ["a", "b"] }, { merge: true });
  testArray.forEach(val);
  // Commit the batch
  batch.commit().then(function() {
    console.log("Completed");
  });
}

let testArray = [
  { itemDescription: "Content Writing", itemQty: 2, itemPrice: 50 },
  { itemDescription: "Content Writing", itemQty: 2, itemPrice: 50 }
];

function printArray() {
  testArray.forEach(val => {
    console.log(
      `<tr><td>${val.itemDescription}</td><td>${val.itemQty}</td><td>${val.itemPrice}</td></tr>`
    );
  });
}

function printArray() {
  testArray.forEach(val => {
    console.log(
      `<tr><td>${val.itemDescription}</td><td>${val.itemQty}</td></tr>`
    );
  });
}

function createArray() {
  let nbrOfRows = document.querySelectorAll(".itemName");

  for (var i = 0; i <= nbrOfRows.length - 1; i++) {
    itemList.push({
      itemDescription: document.getElementById(`itemName${i}`).value
    });
  }
}

function printArray() {
  itemTable = document.getElementById("item-table");
  itemList.forEach(val => {
    rowHTML = `<tr><td>${val.itemDescription}</td></tr>`;
    itemTable.insertAdjacentHTML("beforeend", rowHTML);
  });
}


itemList.forEach(val => {
  rowHTML = `<tr><td>${val.itemDescription}</td></tr>`;
  $("item-table").insertAdjacentHTML("beforeend", rowHTML);
});

batch.set(invRef, { invoiceItems: itemArray }, { merge: true });
batch.set(invRef, { companyName: "Anke's Writing" }, { merge: true });
batch.set(invRef, { paymentStatus: "Paid" }, { merge: true });
batch.set(invRef, { totalAmount: 321 }, { merge: true });



      batch.set(invRef, { invoiceNbr: localInvoiceNbr }, { merge: true });
      batch.set(invRef, { invoiceDate: currentDate }, { merge: true });
      batch.set(invRef, { invoicePaymentDate: paymentDate }, { merge: true });
      batch.set(invRef, { paymentStatus: false }, { merge: true });
      batch.set(invRef, { totalAmount: "test amount" }, { merge: true });
      batch.set(
        invRef,
        { companyName: doc.data().companyName },
        { merge: true }
      );
      batch.set(
        invRef,
        {
          companyStreetAddress: doc.data().companyStreetAddress
        },
        { merge: true }
      );
      batch.set(
        invRef,
        { companyPostCode: doc.data().companyPostCode },
        { merge: true }
      );
      batch.set(
        invRef,
        { companyCityName: doc.data().companyCityName },
        { merge: true }
      );
      batch.set(
        invRef,
        { companyCountryName: doc.data().companyCountryName },
        { merge: true }
      );
      batch.set(invRef, { invoiceItems: itemArray }, { merge: true });
      batch.set(statsRef, { currentInvoiceNumber: increment }, { merge: true });
