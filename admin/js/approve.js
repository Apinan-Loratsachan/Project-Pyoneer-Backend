async function displayApproveData() {
    const approveList = document.getElementById("approveList");
    approveList.innerHTML = `<div style="overflow-x:auto;">
                  <table class="">
                  <colgroup>
                    <col style="width: 30%">
                    <col style="width: 25%">
                    <col style="width: 25%">
                    <col style="width: 20%">
                  </colgroup>
                  <thead>
                    <tr class="text-center">
                        <th><b>Email</b></th>
                        <th><b>Name</b></th>
                        <th><b>UID</b></th>
                        <th></th>
                    </tr>
                  </thead>
                  <tbody id="approveTable">
                  </tbody>
                  </table>
              </div>`;
  
    const snapshot = await firestore.collection("web-approve").get();
    const adminSnapshot = await firestore.collection("admin").get();
    const adminEmails = adminSnapshot.docs.map((doc) => doc.id);
    const adminUIDs = adminSnapshot.docs.map((doc) => doc.data().UID);
    snapshot.forEach((doc) => {
      const docData = doc.data();
      if (!adminEmails.includes(doc.id) && !adminUIDs.includes(docData.UID)) {
      const listItem = document.createElement("tr");
      listItem.innerHTML = `
        <td>${doc.id}</td>
        <td>${docData.Name}</td>
        <td>${docData.UID}</td>
        <td class="text-center">
          <button type="botton" class="btn ${
            docData.approve ? "btn-danger" : "btn-success"
          } approve-btn" data-id="${doc.id}">
            ${docData.approve ? "ยกเลิกการอนุมัติ" : "อนุมัติ"}
          </button>
        </td>
      `;
      document.getElementById("approveTable").appendChild(listItem);
        }
    });
  
    const approveBtns = document.querySelectorAll(".approve-btn");
    approveBtns.forEach((btn) => {
      btn.addEventListener("click", async () => {
        const docId = btn.dataset.id;
        await toggleApprove(docId);
        displayApproveData();
      });
    });
  }

  async function toggleApprove(docId) {
    const docRef = firestore.collection("web-approve").doc(docId);
    const doc = await docRef.get();
    if (doc.exists) {
      await docRef.update({
        approve: !doc.data().approve,
      });
    }
  }

  document.addEventListener("DOMContentLoaded", displayApproveData);