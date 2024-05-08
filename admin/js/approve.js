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
                      <th><b>อีเมล</b></th>
                      <th><b>ชื่อผู้ใช้</b></th>
                      <th><b>รหัสผู้ใช้</b></th>
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

  const approveData = snapshot.docs
    .filter((doc) => !adminEmails.includes(doc.id) && !adminUIDs.includes(doc.data().UID))
    .map((doc) => ({ id: doc.id, ...doc.data() }));

  approveData.sort((a, b) => {
    if (a.approve && !b.approve) return 1;
    if (!a.approve && b.approve) return -1;
    return 0;
  });

  approveData.forEach((data) => {
    const listItem = document.createElement("tr");
    listItem.innerHTML = `
      <td>${data.id}</td>
      <td>${data.Name}</td>
      <td>${data.UID}</td>
      <td class="text-center">
      <div class="d-grid gap-2">
          <button type="button" class="btn ${
            data.approve ? "btn-danger" : "btn-success"
          } approve-btn" data-id="${data.id}">
            ${data.approve ? "ยกเลิกการอนุมัติ" : "อนุมัติ"}
          </button>
        </div>
      </td>
    `;
    document.getElementById("approveTable").appendChild(listItem);
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