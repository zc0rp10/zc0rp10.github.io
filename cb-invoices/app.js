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
var statsRef = db.collection("settings").doc("--statistics--");

const increment = firebase.firestore.FieldValue.increment(1);
const decrement = firebase.firestore.FieldValue.increment(-1);

// DOM Elements
const $ = document.getElementById.bind(document);
const addForm = $("add-invoice");
const addBtn = $("add-btn");
const newInvoiceBtn = $("invoice-modal-btn");
const invoiceTable = $("invoice-table");
const newInvoiceModal = $("new-invoice-modal");

//Add Invoice Modal
//Adds item row in modal
function addItemRow() {
  let NoR = document.querySelectorAll(".item-row-group").length + 1;
  let rowHTML = `<div class="item-row-group" id="item-row-${NoR}">
  <div class="item-row-name">
    <label for="inputItemName${NoR}">Item Name</label>
    <input type="text" class="form-control" id="inputItemName${NoR}" />
  </div>
  <div class="item-row-qty">
    <label for="inputItemQty${NoR}">Qty</label>
    <input type="number" class="form-control" id="inputItemQty${NoR}" />
  </div>
  <div class="item-row-price">
    <label for="inputItemPrice${NoR}">Unit Price</label>
    <input
      type="number"
      class="form-control"
      id="inputItemPrice${NoR}"
    />
  </div>
</div>`;
  $("add-invoice-modal").insertAdjacentHTML("beforeend", rowHTML);
}

addBtn.addEventListener("click", e => {
  e.preventDefault();
  let localTotalSum = 0;
  let localTaxSum = 0;
  let itemArray = [];
  function createArray() {
    let NoR = document.querySelectorAll(".item-row-group").length;

    for (var i = 1; i <= NoR; i++) {
      object = {
        itemDescription: $("inputItemName" + i).value,
        itemQty: $("inputItemQty" + i).value,
        itemPrice: $("inputItemPrice" + i).value,
        itemTax:
          $("inputItemQty" + i).value * $("inputItemPrice" + i).value * 0.21,
        itemSum: $("inputItemQty" + i).value * $("inputItemPrice" + i).value
      };
      itemArray.push(object);
      localTotalSum = localTotalSum + object.itemSum;
      localTaxSum = localTaxSum + object.itemTax;
    }
  }
  createArray();

  let date = new Date();
  let currentDate = date.toISOString().slice(0, 10);
  date.setDate(date.getDate() + 30);
  let paymentDate = date.toISOString().slice(0, 10);
  //Gets Current Invoice Number
  db.collection("settings")
    .doc("--statistics--")
    .get()
    .then(function(indoc) {
      localInvoiceNbr = indoc.data().currentInvoiceNumber;
      //Then gets selected company details
      db.collection("clients")
        .doc($("inputCompanySelector").value)
        .get()
        .then(function(doc) {
          //Then writes the new invoice to the database using retrive details from "clients" and the modal
          db.collection("invoices")
            .add({
              invoiceNbr: localInvoiceNbr,
              invoiceDate: currentDate,
              invoicePaymentDate: paymentDate,
              paymentStatus: "Outstanding",
              projectName: $("inputProjectName").value,
              invoiceNote: $("inputInvoiceNote").value,
              companyName: doc.data().companyName,
              companyStreetAddress: doc.data().companyStreetAddress,
              companyPostCode: doc.data().companyPostCode,
              companyCityName: doc.data().companyCityName,
              companyCountryName: doc.data().companyCountryName,
              totalSum: Math.round(localTotalSum),
              totalTax: Math.round(localTaxSum),
              totalAmount: Math.round(localTotalSum + localTaxSum),
              invoiceItems: itemArray
            })
            .then(function(docRef) {
              statsRef.update({ currentInvoiceNumber: increment });
              console.log("Completed" + docRef);
              $("new-invoice-form").reset();
            })
            .catch(function(error) {
              console.error("Error adding document: ", error);
            });
        });
    });
  closeModal("new-invoice-modal");
});

//Open Invoice Modals
newInvoiceBtn.addEventListener("click", () => {
  modalBody = $("add-invoice-modal");
  modalBody.innerHTML = "";
  modalHTML = `<div class="">
  <label for="inputCompanySelector">Client</label>
  <select class="form-control" id="inputCompanySelector" required>
  </select>
</div>
<div class="">
  <label for="inputProjectName">Project Name</label>
  <input type="text" class="form-control" id="inputProjectName" />
</div>
<div class="">
  <label for="inputInvoiceNote">Invoice Note</label>
  <input type="text" class="form-control" id="inputInvoiceNote" />
</div>
<div class="item-row-group" id="item-row-1">
  <div class="item-row-name">
    <label for="inputItemName1">Item Name</label>
    <input type="text" class="form-control" id="inputItemName1" />
  </div>
  <div class="item-row-qty">
    <label for="inputItemQty1">Qty</label>
    <input type="number" class="form-control" id="inputItemQty1" />
  </div>
  <div class="item-row-price">
    <label for="inputItemPrice1">Unit Price</label>
    <input
      type="number"
      class="form-control"
      id="inputItemPrice1"
    />
  </div>
</div>`;
  modalBody.insertAdjacentHTML("beforeend", modalHTML);
  renderClients();
  newInvoiceModal.style.display = "flex";
});

//Delete Invoice
function deleteInvoice(documentId) {
  db.collection("invoices")
    .doc(documentId)
    .delete()
    .then(function() {
      console.log("Document successfully deleted!");
    })
    .catch(function(error) {
      console.error("Error removing document: ", error);
    });
}

//Render Invoice Modal
function renderInvoice(documentId) {
  let docRef = db.collection("invoices").doc(documentId);
  docRef
    .get()
    .then(function(doc) {
      if (doc.exists) {
        $("invoice-company-name").innerText = doc.data().companyName;
        $("invoice-street-address").innerText = doc.data().companyStreetAddress;
        $("invoice-post-code").innerText = doc.data().companyPostCode;
        $("invoice-city-name").innerText = doc.data().companyCityName;
        $("invoice-country-name").innerText = doc.data().companyCountryName;
        $("invoice-project-name").innerText = doc.data().projectName;
        $("invoice-number").innerText = doc.data().invoiceNbr;
        $("invoice-date").innerText = "Verzonden op " + doc.data().invoiceDate;
        $("invoice-payment-date").innerText = doc.data().invoicePaymentDate;
        $("invoice-note").innerText = "Nota: " + doc.data().invoiceNote;
        $("invoice-total-sum").innerText = "€" + doc.data().totalSum;
        $("invoice-tax-sum").innerText = "€" + doc.data().totalTax;
        $("invoice-total-amount").innerText = "€" + doc.data().totalAmount;
        window.print();
      } else {
        // doc.data() will be undefined in this case
        console.log("No such invoice!");
      }
    })
    .catch(function(error) {
      console.log("Error getting invoice:", error);
    });
}

//Render Items for Invoice Modal Table
function testFunction() {
  db.collection("invoices")
    .doc("MVjoCmk8Iz2qbJ8PV087")
    .get()
    .then(function(doc) {
      doc.data().invoiceItems.forEach(val => {
        console.log(val);
      });
    });
}

renderInvoiceItems = function(documentId) {
  const invoiceItemTable = $("invoice-items-table");
  invoiceItemTable.innerHTML = "";
  db.collection("invoices")
    .doc(documentId)
    .get()
    .then(function(doc) {
      doc.data().invoiceItems.forEach(val => {
        let invoiceItem = `<tr>
      <td>${val.itemDescription}</td>
      <td>${val.itemQty}</td>
      <td>€${val.itemPrice}</td>
      <td class="table-last-child">€${val.itemSum}</td>
      </tr>`;
        invoiceItemTable.insertAdjacentHTML("beforeend", invoiceItem);
      });
    });
};

//Open Modals
newInvoiceBtn.addEventListener("click", () => {
  newInvoiceModal.style.display = "flex";
});

//Close Modals
function closeModal(modal) {
  $(modal).style.display = "none";
}

//Render Invoice Table
renderInvoices = function() {
  invoiceTable.innerHTML = "";
  db.collection("invoices")
    .get()
    .then(querySnapshot => {
      querySnapshot.forEach(doc => {
        let invoiceItem = `<tr>
        <td><span class="custom-checkbox">
        <input type="checkbox" id="selectAll" />
        <label for="selectAll"></label>
      </span></td>
        <td>${doc.data().invoiceNbr}</td>
        <td>${doc.data().invoiceDate}</td>
        <td>${doc.data().companyName}</td>
        <td>€ ${doc.data().totalAmount}</td>
        <td>${doc.data().paymentStatus}</td>
        <td><button id="d${
          doc.id
        }" class="delete-btn grow" onclick="deleteInvoice('${
          doc.id
        }')"></button><button id="p${
          doc.id
        }" class="print-btn grow" onclick="printInvoice('${
          doc.id
        }')"></button></td>
        </tr>`;
        invoiceTable.insertAdjacentHTML("beforeend", invoiceItem);
      });
    });
};
inputCompanySelector;

//Render Client Options
renderClients = function() {
  $("inputCompanySelector");
  const clientList = $("inputCompanySelector");
  clientList.innerHTML = "";
  db.collection("clients")
    .get()
    .then(querySnapshot => {
      querySnapshot.forEach(doc => {
        let clientItem = `<option value="${doc.id}">${
          doc.data().companyName
        }</option>`;
        clientList.insertAdjacentHTML("beforeend", clientItem);
      });
    });
};

//Print Invoice Modal
function printInvoice(documentId) {
  renderInvoiceItems(documentId);
  renderInvoice(documentId);
}

// Listen for updates to database (i.e new invoice created, deleted etc.) and triggers a rerender of the table
db.collection("invoices").onSnapshot(function() {
  renderInvoices();
});

db.collection("clients").onSnapshot(function() {
  renderClients();
});
