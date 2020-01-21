// Increment/Decrement varriables for adding/removing statistics
const increment = firebase.firestore.FieldValue.increment(1);
const decrement = firebase.firestore.FieldValue.increment(-1);

// DOM Elements
const $ = document.getElementById.bind(document);

//Active Modal
//Some functions only triggers when a specific modal is the one being displayed currently
let currentlyActiveModal;

//Open Add Client Modal
$("clients-modal-btn").addEventListener("click", () => {
  $("new-client-modal").style.display = "flex";
});

//Add Client Modal Submit
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

//Edit Client Modal Submit
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

//Add Invoice Modal Functions below
//Adds item row in modal
function addItemRow(edit) {
  if (!edit) {
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
  } else {
    let NoR = document.querySelectorAll(".edit-item-row-group").length + 1;
    let rowHTML = `<div class="edit-item-row-group" id="edit-item-row-${NoR}">
  <div class="edit-item-row-name">
    <label for="inputEditItemName${NoR}">Item Name</label>
    <input type="text" class="form-control" id="inputEditItemName${NoR}" />
  </div>
  <div class="edit-item-row-qty">
    <label for="inputEditItemQty${NoR}">Qty</label>
    <input type="number" class="form-control" id="inputEditItemQty${NoR}" />
  </div>
  <div class="edit-item-row-price">
    <label for="inputEditItemPrice${NoR}">Unit Price</label>
    <input
      type="number"
      class="form-control"
      id="inputEditItemPrice${NoR}"
    />
  </div>
</div>`;
    $("update-invoice-modal").insertAdjacentHTML("beforeend", rowHTML);
  }
}

//Open Add Invoice Modal
$("invoices-modal-btn").addEventListener("click", () => {
  modalBody = $("add-invoice-modal");
  modalBody.innerHTML = "";
  modalHTML = `
  <div class="">
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

//Add Invoice Modal Submit
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
              paymentStatus: "unpaid",
              projectName: $("inputProjectName").value,
              invoiceNote: $("inputInvoiceNote").value,
              companyUniqueId: doc.id,
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

//Open Edit Invoice Modal
function editInvoice(uniqueInvoiceDocumentId) {
  //Gets the existing invoice that should be edited
  db.collection("invoices")
    .doc(uniqueInvoiceDocumentId)
    .get()
    .then(function(invoiceObject) {
      if (invoiceObject.exists) {
        console.log("Invoice Requested: " + invoiceObject.id);
        //Then Renders the skeleteon for the modal and displays it
        $("edit-invoice-modal").style.display = "flex";
        modalBody = $("update-invoice-modal");
        modalBody.innerHTML = "";
        modalHTML = `
        <div class="">
          <label for="inputEditCompanySelector">Client</label>
          <select class="form-control" id="inputEditCompanySelector" required>
          </select>
        </div>
        <div class="">
          <label for="inputEditProjectName">Project Name</label>
          <input type="text" class="form-control" id="inputEditProjectName" />
        </div>
        <div class="">
          <label for="inputEditInvoiceNote">Invoice Note</label>
          <input type="text" class="form-control" id="inputEditInvoiceNote" />
        </div>`;
        modalBody.insertAdjacentHTML("beforeend", modalHTML);

        //Had a problem where evenlistners would stack on the update confirm button
        //Lead to mutiple invoices being overwritten when making changes a secon, third etc. time.
        //Always creating the button on modal open removed that issue
        //TODO: Really no reason to create body and footer sepperatly, can be combined, create whole modal on open.
        //Alt TODO: Just create the button on open instead of whole footer.
        modalFooter = $("update-invoice-footer");
        modalFooter.innerHTML = "";
        modalFooterHTML = `
        <button id="update-invoice-btn" type="submit" class="btn btn-add">Update Invoice</button>
        <button id="add-item-btn" type="button" class="btn btn-edit" onclick="addItemRow('edit')">Add Item</button>
        <button id="cancel-btn" type="button" class="btn btn-default" onclick="closeModal('edit-invoice-modal')">Cancel</button>
        `;
        modalFooter.insertAdjacentHTML("beforeend", modalFooterHTML);

        //Fills the client list with options, fillCLientList() runs over all the clients looking for an id that maches the creator id in this invoice
        const originalClient = invoiceObject.data().companyUniqueId;
        fillClientList("Edit", originalClient);
        console.log(originalClient);

        $("inputEditProjectName").value = invoiceObject.data().projectName;
        $("inputEditInvoiceNote").value = invoiceObject.data().invoiceNote;
        //Goes over each invoice item in the array and adds a row with detils
        let NoR = 1;
        invoiceObject.data().invoiceItems.map(item => {
          let invoiceItem = `<div class="edit-item-row-group" id="edit-item-row-${NoR}">
          <div class="edit-item-row-name">
            <label for="inputEditItemName${NoR}">Item Name</label>
            <input type="text" class="form-control" id="inputEditItemName${NoR}" value="${
            item.itemDescription
          }" />
          </div>
          <div class="edit-item-row-qty">
            <label for="inputEditItemQty${NoR}">Qty</label>
            <input type="number" class="form-control" id="inputEditItemQty${NoR}" value="${
            item.itemQty
          }"/>
          </div>
          <div class="edit-item-row-price">
            <label for="inputEditItemPrice${NoR}">Unit Price</label>
            <input
              type="number"
              class="form-control"
              id="inputEditItemPrice${NoR++}"
              value="${item.itemPrice}"
            />
          </div>
        </div>`;
          modalBody.insertAdjacentHTML("beforeend", invoiceItem);
        });

        //Listening for confirmation to update
        //Listens for the Update Btn Click and starts the invoice update process
        function submitEditedInvoice(e) {
          e.preventDefault();
          let localTotalSum = 0;
          let localTaxSum = 0;
          let itemArray = [];
          let i = 1;
          document.querySelectorAll(".edit-item-row-group").forEach(item => {
            object = {
              itemDescription: $("inputEditItemName" + i).value,
              itemQty: $("inputEditItemQty" + i).value,
              itemPrice: $("inputEditItemPrice" + i).value,
              itemTax:
                $("inputEditItemQty" + i).value *
                $("inputEditItemPrice" + i).value *
                0.21,
              itemSum:
                $("inputEditItemQty" + i).value *
                $("inputEditItemPrice" + i++).value
            };
            itemArray.push(object);
            localTotalSum = localTotalSum + object.itemSum;
            localTaxSum = localTaxSum + object.itemTax;
          });

          const newCLient = $("inputEditCompanySelector").value;
          if (originalClient === newCLient) {
            //Runs if they keep the same client, saves a call to DB to get client info
            return db
              .collection("invoices")
              .doc(invoiceObject.id)
              .update({
                projectName: $("inputEditProjectName").value,
                invoiceNote: $("inputEditInvoiceNote").value,
                totalSum: Math.round(localTotalSum),
                totalTax: Math.round(localTaxSum),
                totalAmount: Math.round(localTotalSum + localTaxSum),
                invoiceItems: itemArray
              })
              .then(function() {
                console.log("Invoice Update: " + invoiceObject.id);
                $("edit-invoice-modal").style.display = "none";
              })
              .catch(function(error) {
                console.error("Error writing document: ", error);
              });
          } else {
            //Runs if there is a new client selected
            db.collection("clients")
              .doc(newCLient)
              .get()
              .then(function(newClientDoc) {
                return db
                  .collection("invoices")
                  .doc(invoiceObject.id)
                  .update({
                    projectName: $("inputEditProjectName").value,
                    invoiceNote: $("inputEditInvoiceNote").value,

                    companyUniqueId: newClientDoc.id,
                    companyName: newClientDoc.data().companyName,
                    companyStreetAddress: newClientDoc.data()
                      .companyStreetAddress,
                    companyPostCode: newClientDoc.data().companyPostCode,
                    companyCityName: newClientDoc.data().companyCityName,
                    companyCountryName: newClientDoc.data().companyCountryName,

                    totalSum: Math.round(localTotalSum),
                    totalTax: Math.round(localTaxSum),
                    totalAmount: Math.round(localTotalSum + localTaxSum),
                    invoiceItems: itemArray
                  })
                  .then(function() {
                    console.log("Invoice Update: " + invoiceObject.id);
                    $("edit-invoice-modal").style.display = "none";
                  })
                  .catch(function(error) {
                    console.error("Error writing document: ", error);
                  });
              })
              .catch(function(error) {
                console.log("Error getting document:", error);
              });
          }

          return db
            .collection("invoices")
            .doc(invoiceObject.id)
            .update({
              projectName: $("inputEditProjectName").value,
              invoiceNote: $("inputEditInvoiceNote").value,

              // companyUniqueId: doc.id,
              // companyName: doc.data().companyName,
              // companyStreetAddress: doc.data().companyStreetAddress,
              // companyPostCode: doc.data().companyPostCode,
              // companyCityName: doc.data().companyCityName,
              // companyCountryName: doc.data().companyCountryName,

              totalSum: Math.round(localTotalSum),
              totalTax: Math.round(localTaxSum),
              totalAmount: Math.round(localTotalSum + localTaxSum),
              invoiceItems: itemArray
            })
            .then(function() {
              console.log("Invoice Update: " + invoiceObject.id);
              $("edit-invoice-modal").style.display = "none";
            })
            .catch(function(error) {
              console.error("Error writing document: ", error);
            });
        }
        $("update-invoice-btn").addEventListener("click", submitEditedInvoice);
      } else {
        console.log("No such invoice!");
      }
    })
    .catch(function(error) {
      console.log("Error getting invoice:", error);
    });
}

//Open Delete Invoice Modal + Listen for Submit
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

//Open Delete Client Modal + Listen for Submit
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

//Render Invoice Print Modal
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

//Render Items for Print Invoice Modal Table
function renderInvoiceItems(documentId) {
  const invoiceItemTable = $("invoice-items-table");
  invoiceItemTable.innerHTML = "";
  db.collection("invoices")
    .doc(documentId)
    .get()
    .then(function(doc) {
      doc.data().invoiceItems.map(val => {
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

//Close function for all Modals
function closeModal(modal) {
  $(modal).style.display = "none";
}

//Event listner for Render Dashboard function below, if it's triggered from taskbar button rather then iniated by login from auth.js
$("dashboard-render-btn").addEventListener("click", () => {
  renderDashboard();
});

//Render Dashboard View
function renderDashboard() {
  //Reaches out to DB and fetches data on amounts invoiced and payed
  db.collection("invoices")
    .where("createdBy", "==", auth.currentUser.uid)
    .get()
    .then(function(querySnapshot) {
      let totalInvoiced = 0;
      let totalOutstanding = 0;
      querySnapshot.forEach(function(doc) {
        //Calculates the total sum for all invoices in the DB for this account
        totalInvoiced = totalInvoiced + doc.data().totalSum;
        //Calculates the total oustanding sum for all invoices in the DB for this account
        if (doc.data().paymentStatus === "unpaid") {
          totalOutstanding = totalOutstanding + doc.data().totalSum;
        }
      });

      //Renders the HTML for the Dashboard
      currentlyActiveModal = "dashboardModal";
      $("dashboard-modal-btn").style.display = "inline-block";
      $("invoices-modal-btn").style.display = "none";
      $("clients-modal-btn").style.display = "none";
      $("dashboard-modal-btn").style.display = "inline-block";
      $("content-responsive").innerHTML = `
      <h2>Dashboard</h2>
      <p>Total Invoiced: <span id="total-invoice-amount">€ ${totalInvoiced}</span></p>
      <p>Total Outstanding: <span id="total-invoice-amount">€ ${totalOutstanding}</span></p>
      `;
    });
}

//Event listner for Render Invoice function below.
$("invoice-render-btn").addEventListener("click", () => {
  currentlyActiveModal = "invoiceModal";
  $("dashboard-modal-btn").style.display = "none";
  $("invoices-modal-btn").style.display = "inline-block";
  $("clients-modal-btn").style.display = "none";
  renderInvoices();
});

//Renders the Invoice Table View
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
        //Renders the table
        let invoiceItem = `<tr id="${doc.id}">
        <td>${doc.data().invoiceNbr}</td>
        <td>${doc.data().invoiceDate}</td>
        <td>${doc.data().companyName}</td>
        <td>€ ${doc.data().totalAmount}</td>
        <td onclick="togglePaymentStatus('${doc.id}', '${
          doc.data().paymentStatus
        }')">${doc.data().paymentStatus}</td>
        <td><button  class="delete-btn grow" onclick="showDeleteInvoiceModal('${
          doc.id
        }')"></button><button  class="print-btn grow" onclick="printInvoice('${
          doc.id
        }')"></button>
        <button  class="edit-btn grow" onclick="editInvoice('${
          doc.id
        }')"></button></td>
        </tr>`;
        $("invoice-table").insertAdjacentHTML("beforeend", invoiceItem);
      });
      //Toggels Payment Status
    });
}

function togglePaymentStatus(id, status) {
  let invoiceRef = db.collection("invoices").doc(id);
  if (status === "unpaid") {
    return invoiceRef.update({
      paymentStatus: "paid"
    });
  } else {
    return invoiceRef.update({
      paymentStatus: "unpaid"
    });
  }
}

//Event listner for Render Invoice function below.
$("client-render-btn").addEventListener("click", () => {
  currentlyActiveModal = "clientsModal";
  $("dashboard-modal-btn").style.display = "none";
  $("invoices-modal-btn").style.display = "none";
  $("clients-modal-btn").style.display = "inline-block";
  renderClients();
});

//Renders the Client Table View
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
        <button class="edit-btn grow" onclick="editClient('${doc.id}')"></button>
        <td><button class="delete-btn grow" onclick="showDeleteClientModal('${doc.id}')"></button></td>
        <td>${doc.data().companyName}</td>
        <td class="table-last-child">€120</td>
        </tr>`;
        $("client-table").insertAdjacentHTML("beforeend", invoiceItem);
      });
    });
}

//Fills the drop down with Client Options for create and edit invoice modal
function fillClientList(x = "", originalClientId = "") {
  const clientList = $(`input${x}CompanySelector`);
  clientList.innerHTML = "";
  db.collection("clients")
    .where("createdBy", "==", auth.currentUser.uid)
    .get()
    .then(querySnapshot => {
      querySnapshot.forEach(doc => {
        if (originalClientId == doc.id) {
          let clientItem = `<option selected value="${doc.id}">${
            doc.data().companyName
          }</option>`;
          clientList.insertAdjacentHTML("beforeend", clientItem);
        } else {
          let clientItem = `<option value="${doc.id}">${
            doc.data().companyName
          }</option>`;
          clientList.insertAdjacentHTML("beforeend", clientItem);
        }
      });
    });
}

//Print Invoice Modal
function printInvoice(documentId) {
  renderInvoiceItems(documentId);
  renderInvoice(documentId);
}

// Listen for updates to database (i.e new invoice created, deleted etc.) and triggers a rerender of the table
