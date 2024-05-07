async function queryPyoneerData() {
  const userEmails = document
    .getElementById("InputQuery")
    .value.split(",")
    .map((email) => email.trim());
  const querylist = document.getElementById("querylist");
  querylist.innerHTML = `<div>
                <table>
                <colgroup>
                    <col style="width: 20%">
                    <col style="width: 23%">
                    <col style="width: 23%">
                    <col style="width: 10%">
                    <col style="width: 10%">
                </colgroup>
                <tbody id="resultTable">
                    <tr>
                        <th><b>Email</b></th>
                        <th><b>Display Name</b></th>
                        <th><b>UID</b></th>
                        <th></th>
                        <th></th>
                    </tr>
                </tbody>
                </table>
            </div>`;

  for (const userEmail of userEmails) {
    try {
      const userDocRef = firestore.collection("users").doc(userEmail);
      const userDoc = await userDocRef.get();

      if (userDoc.exists) {
        const userData = userDoc.data();
        const displayName = userData.displayName;
        const uid = userData.uid;

        const listItem = document.createElement("tr");
        listItem.classList.add("list-item");
        listItem.innerHTML = `
                <td>${userEmail}</td>
                <td>${displayName}</td>
                <td>${uid}</td>
                <td><button class="btn btn-primary save-btn" data-email="${userEmail}">เพิ่ม</button></td>
                <td><button class="btn btn-secondary view-btn" data-email="${userEmail}">ดูข้อมูล</button></td>
                `;
        document.getElementById("resultTable").appendChild(listItem);
      } else {
        const listItem = document.createElement("div");
        listItem.classList.add("list-item");
        listItem.textContent = `ไม่พบข้อมูลสำหรับ ${userEmail}`;
        querylist.appendChild(listItem);
      }
    } catch (error) {
      console.error("Error getting user document:", error);
    }
  }

  const saveButtons = document.querySelectorAll(".save-btn");
  saveButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const userEmail = button.dataset.email;
      // สำหรับบันทึกอีเมลล์เข้ารายการที่บันทึก
    });
  });

  const viewButtons = document.querySelectorAll(".view-btn");
  viewButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      if (!button.classList.contains("viewed")) {
        button.classList.add("viewed");
        const userEmail = button.dataset.email;
        let searchResultContainer = document.getElementById(
          `searchResultContainer-${userEmail}`
        );
        const row = button.closest("tr");

        if (!searchResultContainer) {
          // ถ้ายังไม่มี searchResultContainer ให้สร้างใหม่
          searchResultContainer = document.createElement("div");
          searchResultContainer.id = `searchResultContainer-${userEmail}`;
          row.insertAdjacentElement("afterend", searchResultContainer);
        }

        await displayUserData(userEmail, searchResultContainer);
      }
    });
  });
}

async function displayUserData(userEmail, searchResultContainer) {
  const lessonsCollectionRef = firestore.collection("lessons");
  const lessonsSnapshot = await lessonsCollectionRef
    .where("email", "==", userEmail)
    .get();

  const preTestSnapshot = await firestore
    .collection("testResult")
    .doc(userEmail)
    .collection("pre-test")
    .get();
  const postTestSnapshot = await firestore
    .collection("testResult")
    .doc(userEmail)
    .collection("post-test")
    .get();

  const challengeScoreDocRef = firestore
    .collection("challengeScore")
    .doc(userEmail);
  const challengeScoreDoc = await challengeScoreDocRef.get();

  displayResults(
    userEmail,
    lessonsSnapshot.docs,
    preTestSnapshot.docs,
    postTestSnapshot.docs,
    challengeScoreDoc.data(),
    searchResultContainer
  );
}
