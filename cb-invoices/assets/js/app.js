// Increment/Decrement varriables for adding/removing statistics
const increment = firebase.firestore.FieldValue.increment(1);
const decrement = firebase.firestore.FieldValue.increment(-1);

// DOM Elements
const $ = document.getElementById.bind(document);

//Active Modal
//Some functions only triggers when a specific modal is the one being displayed currently
let currentlyActiveModal;

//Open Client Modal
$("clients-modal-btn").addEventListener("click", () => {
  $("new-client-modal").style.display = "flex";
});

//Add Client Modal
$("new-client-form").addEventListener("submit", e => {
  e.preventDefault();
  db.collection("clients")
    .add({
      createdBy: auth.currentUser.uid,
      createdDate: firebase.firestore.Timestamp.fromDate(new Date()),
      companyName: $("inputCompanyName").value,
      companyStreetAddress: $("inputStreetAddress").value,
      companyPostCode: $("inputPostCode").value,
      companyCityName: $("inputCityName").value,
      companyCountryName: $("inputCountryName").value,
      companyContactPerson: $("inputContactPerson").value,
      companyEmailAddress: $("inputEmailAddress").value,
      companyTelephoneNumber: $("inputTelephoneNumber").value
    })
    .then(function(docRef) {
      closeModal("new-client-modal");
      $("new-client-form").reset();
      console.log("Completed" + docRef);
    })
    .catch(function(error) {
      console.error("Error adding document: ", error);
    });
});

//Open Edit Client Modal
function editClient(docId) {
  $("edit-client-modal").style.display = "flex";
  db.collection("clients")
    .doc(docId)
    .get()
    .then(function(doc) {
      if (doc.exists) {
        $("edit-client-btn").dataset.docid = doc.id;
        $("inputEditCompanyName").value = doc.data().companyName;
        $("inputEditStreetAddress").value = doc.data().companyStreetAddress;
        $("inputEditPostCode").value = doc.data().companyPostCode;
        $("inputEditCityName").value = doc.data().companyCityName;
        $("inputEditCountryName").value = doc.data().companyCountryName;
        $("inputEditContactPerson").value = doc.data().companyContactPerson;
        $("inputEditEmailAddress").value = doc.data().companyEmailAddress;
        $("inputEditTelephoneNumber").value = doc.data().companyTelephoneNumber;
        console.log("Document data:", doc.data());
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    })
    .catch(function(error) {
      console.log("Error getting document:", error);
    });
}

//Submit Client Edit on Update Button Click
$("edit-client-btn").addEventListener("click", e => {
  e.preventDefault();
  db.collection("clients")
    .doc(e.target.dataset.docid)
    .set({
      createdBy: auth.currentUser.uid,
      editedDate: firebase.firestore.Timestamp.fromDate(new Date()),
      companyName: $("inputEditCompanyName").value,
      companyStreetAddress: $("inputEditStreetAddress").value,
      companyPostCode: $("inputEditPostCode").value,
      companyCityName: $("inputEditCityName").value,
      companyCountryName: $("inputEditCountryName").value,
      companyContactPerson: $("inputEditContactPerson").value,
      companyEmailAddress: $("inputEditEmailAddress").value,
      companyTelephoneNumber: $("inputEditTelephoneNumber").value
    })
    .then(function() {
      closeModal("edit-client-modal");
      $("edit-client-form").reset();
    })
    .catch(function(error) {
      console.error("Error editing document: ", error);
    });
});

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

//Create new invoice
$("create-invoice-btn").addEventListener("click", e => {
  e.preventDefault();
  let localTotalSum = 0;
  let localTaxSum = 0;
  let itemArray = [];
  function createArray() {
    let NoR = document.querySelectorAll(".item-row-group").length;

    //Possible to replace with .map/.forEach instead of the loop?
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
  db.collection("users")
    .doc(auth.currentUser.uid)
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
              createdBy: auth.currentUser.uid,
              invoiceNbr: localInvoiceNbr,
              invoiceDate: currentDate,
              invoicePaymentDate: paymentDate,
              paymentStatus: "Unpaid",
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
              db.collection("users")
                .doc(auth.currentUser.uid)
                .update({ currentInvoiceNumber: increment });
              console.log("Completed" + docRef);
              $("new-invoice-form").reset();
            })
            .catch(function(error) {
              console.error("Error adding document: ", error);
            });
        });
    });
  renderInvoices();
  closeModal("new-invoice-modal");
});

//Open Invoice Modals
$("invoices-modal-btn").addEventListener("click", e => {
  e.preventDefault();
  $("new-invoice-modal").style.display = "flex";
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
  fillClientList();
  $("new-invoice-modal").style.display = "flex";
});

//Delete Invoice
function showDeleteInvoiceModal(documentId) {
  $("delete-invoice-modal").style.display = "block";
  $("delete-invoice-btn").addEventListener("click", e => {
    e.preventDefault();
    db.collection("invoices")
      .doc(documentId)
      .delete()
      .then(function() {
        $("delete-invoice-modal").style.display = "none";
        console.log("Document successfully deleted!");
      })
      .catch(function(error) {
        console.error("Error removing document: ", error);
      });
  });
}

//Delete Client
function showDeleteClientModal(documentId) {
  $("delete-client-modal").style.display = "block";
  $("delete-client-btn").addEventListener("click", e => {
    e.preventDefault();
    db.collection("clients")
      .doc(documentId)
      .delete()
      .then(function() {
        $("delete-client-modal").style.display = "none";
      })
      .catch(function(error) {
        console.error("Error removing document: ", error);
      });
  });
}

//Edit Invoice
function editInvoice() {
  alert("Not yet implemented");
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

function renderInvoiceItems(documentId) {
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
}

//Close Modals
function closeModal(modal) {
  $(modal).style.display = "none";
}

//Render Dashboard
$("dashboard-render-btn").addEventListener("click", () => {
  currentlyActiveModal = "dashboardModal";
  $("dashboard-modal-btn").style.display = "inline-block";
  $("invoices-modal-btn").style.display = "none";
  $("clients-modal-btn").style.display = "none";
  renderDashboard();
});

function renderDashboard() {
  $("dashboard-modal-btn").style.display = "inline-block";
  $("content-responsive").innerHTML = `
  <h2>Dashboard</h2>
  `;
}

//Render Invoice Table
$("invoice-render-btn").addEventListener("click", () => {
  currentlyActiveModal = "invoiceModal";
  $("dashboard-modal-btn").style.display = "none";
  $("invoices-modal-btn").style.display = "inline-block";
  $("clients-modal-btn").style.display = "none";
  renderInvoices();
});

function renderInvoices() {
  $("content-responsive").innerHTML = `
  <table class="table">
    <thead>
      <tr>
        <th>Inv #</th>
        <th>Date</th>
        <th>Company</th>
        <th>Amount</th>
        <th>Status</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody id="invoice-table"></tbody>
  </table>`;

  db.collection("invoices")
    .where("createdBy", "==", auth.currentUser.uid)
    .get()
    .then(querySnapshot => {
      querySnapshot.forEach(doc => {
        let invoiceItem = `<tr>
        <td>${doc.data().invoiceNbr}</td>
        <td>${doc.data().invoiceDate}</td>
        <td>${doc.data().companyName}</td>
        <td>€ ${doc.data().totalAmount}</td>
        <td>${doc.data().paymentStatus}</td>
        <td><button id="d${
          doc.id
        }" class="delete-btn grow" onclick="showDeleteInvoiceModal('${
          doc.id
        }')"></button><button id="p${
          doc.id
        }" class="print-btn grow" onclick="printInvoice('${doc.id}')"></button>
        <button id="p${doc.id}" class="edit-btn grow" onclick="editInvoice('${
          doc.id
        }')"></button></td>
        </tr>`;
        $("invoice-table").insertAdjacentHTML("beforeend", invoiceItem);
      });
    });
}

//Render Client Table
$("client-render-btn").addEventListener("click", () => {
  currentlyActiveModal = "clientsModal";
  $("dashboard-modal-btn").style.display = "none";
  $("invoices-modal-btn").style.display = "none";
  $("clients-modal-btn").style.display = "inline-block";
  renderClients();
});

function renderClients() {
  $("content-responsive").innerHTML = `
  <table class="table">
    <thead>
      <tr>
      <th>Actions</th>
      <th>Company Name</th>
      <th class="table-last-child">Outstanding</th>
      </tr>
    </thead>
    <tbody id="client-table"></tbody>
  </table>`;

  db.collection("clients")
    .where("createdBy", "==", auth.currentUser.uid)
    .get()
    .then(querySnapshot => {
      querySnapshot.forEach(doc => {
        let invoiceItem = `<tr>
        <td>
        <button id="d${
          doc.id
        }" class="delete-btn grow" onclick="showDeleteClientModal('${
          doc.id
        }')"></button>
        <button id="p${doc.id}" class="edit-btn grow" onclick="editClient('${
          doc.id
        }')"></button></td>
        
        <td>${doc.data().companyName}</td>
        
        <td class="table-last-child">€120</td>
        </tr>`;
        $("client-table").insertAdjacentHTML("beforeend", invoiceItem);
      });
    });
}

//Fill Clients Options for create invoice modal
function fillClientList() {
  $("inputCompanySelector");
  const clientList = $("inputCompanySelector");
  clientList.innerHTML = "";
  db.collection("clients")
    .where("createdBy", "==", auth.currentUser.uid)
    .get()
    .then(querySnapshot => {
      querySnapshot.forEach(doc => {
        let clientItem = `<option value="${doc.id}">${
          doc.data().companyName
        }</option>`;
        clientList.insertAdjacentHTML("beforeend", clientItem);
      });
    });
}

//Print Invoice Modal
function printInvoice(documentId) {
  renderInvoiceItems(documentId);
  renderInvoice(documentId);
}

// Listen for updates to database (i.e new invoice created, deleted etc.) and triggers a rerender of the table
