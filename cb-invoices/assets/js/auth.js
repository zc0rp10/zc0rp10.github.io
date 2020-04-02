//Listen for auth status
auth.onAuthStateChanged(user => {
  if (user) {
    db.collection("invoices")
      .where("createdBy", "==", auth.currentUser.uid)
      .onSnapshot(function() {
        if (currentlyActiveModal === "invoiceModal") {
          renderInvoices();
        }
      });

    db.collection("clients")
      .where("createdBy", "==", auth.currentUser.uid)
      .onSnapshot(function() {
        if (currentlyActiveModal === "clientsModal") {
          renderClients();
        }
      });

    renderDashboard();
  } else {
    $("content-responsive").innerHTML = "";
    $("modal-signup").style.display = "block";
    document.querySelectorAll(".modal-action-btn").forEach(btn => {
      btn.style.display = "none";
      currentlyActiveModal = null;
    });
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
