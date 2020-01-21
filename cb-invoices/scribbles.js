//Listens for the Update Btn Click and starts the invoice update process
$("update-invoice-btn").addEventListener("click", e => {
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

  db.collection("invoices")
    .doc(doc.id)
    .update({
      projectName: $("inputEditProjectName").value,
      invoiceNote: $("inputEditInvoiceNote").value,
      totalSum: Math.round(localTotalSum),
      totalTax: Math.round(localTaxSum),
      totalAmount: Math.round(localTotalSum + localTaxSum),
      invoiceItems: itemArray
    })
    .then(function() {
      console.log("Document successfully written!");
      console.log(doc.id);
    })
    .catch(function(error) {
      console.error("Error writing document: ", error);
    });
  })