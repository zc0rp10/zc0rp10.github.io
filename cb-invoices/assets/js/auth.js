//Listen for auth status
auth.onAuthStateChanged(user => {
  if (user) {
    $("logout-btn").style.display = "";
    $("signin-btn").style.display = "none";
    invoiceTable.style.display = "";
    db.collection("invoices")
      .where("createdBy", "==", auth.currentUser.uid)
      .onSnapshot(function() {
        renderInvoices();
      });
  } else {
    $("signin-btn").style.display = "";
    $("logout-btn").style.display = "none";
    invoiceTable.style.display = "none";
  }
});

//Sign Up
const signupForm = document.querySelector("#signup-form");
signupForm.addEventListener("submit", e => {
  e.preventDefault();

  const email = signupForm["signup-email"].value;
  const password = signupForm["signup-password"].value;

  auth
    .createUserWithEmailAndPassword(email, password)
    .then(cred => {
      return db
        .collection("users")
        .doc(cred.user.uid)
        .set({
          currentInvoiceNumber: 1
        });
    })
    .then(() => {
      $("modal-signup").style.display = "none";
      signupForm.reset();
      auth.currentUser.sendEmailVerification();
    });
});

//Sign In
const signinForm = document.querySelector("#signin-form");
signinForm.addEventListener("submit", e => {
  e.preventDefault();

  const email = signinForm["signin-email"].value;
  const password = signinForm["signin-password"].value;

  auth.signInWithEmailAndPassword(email, password).then(cred => {
    $("modal-signup").style.display = "none";
    renderInvoices();
    signinForm.reset();
  });
});

//Sign Out
const logout = document.querySelector("#logout-btn");
logout.addEventListener("click", e => {
  e.preventDefault();
  auth.signOut().then(() => {
    $("modal-signup").style.display = "none";
  });
});
