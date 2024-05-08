async function queryPyoneerData() {
  const userEmails = document
    .getElementById("InputQuery")
    .value.split(",")
    .map((email) => email.trim());
  const querylist = document.getElementById("querylist");
  querylist.innerHTML = `<div style="overflow-x:auto;">
                <table class="">
                <colgroup>
                  <col style="width: 20%">
                  <col style="width: 23%">
                  <col style="width: 23%">
                  <col style="width: 10%">
                  <col style="width: 10%">
                </colgroup>
                <thead>
                  <tr>
                      <th><b>อีเมล</b></th>
                      <th><b>ชื่อผู้ใช้</b></th>
                      <th><b>รหัสผู้ใช้</b></th>
                      <th></th>
                      <th></th>
                  </tr>
                </thead>
                <tbody id="resultTable">
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

        const isBookmarked = await isEmailBookmarked(userEmail);
        const buttonClass = isBookmarked ? "btn-danger remove-btn" : "btn-primary save-btn";
        const buttonText = isBookmarked ? "ลบ" : "เพิ่ม";

        listItem.innerHTML = `
                <td>${userEmail}</td>
                <td>${displayName}</td>
                <td>${uid}</td>
                <td><button class="btn ${buttonClass}" data-email="${userEmail}">${buttonText}</button></td>
                <td><button class="btn btn-secondary view-btn" data-email="${userEmail}">ข้อมูล</button></td>
                `;
        document.getElementById("resultTable").appendChild(listItem);

        const saveButton = listItem.querySelector(".save-btn");
        if (saveButton) {
          saveButton.addEventListener("click", async () => {
            await addToBookmark(userEmail);
            saveButton.classList.replace("btn-primary", "btn-danger");
            saveButton.classList.replace("save-btn", "remove-btn");
            saveButton.textContent = "ลบ";
          });
        }

        const removeButton = listItem.querySelector(".remove-btn");
        if (removeButton) {
          removeButton.addEventListener("click", async () => {
            await removeFromBookmark(userEmail);
            removeButton.classList.replace("btn-danger", "btn-primary");
            removeButton.classList.replace("remove-btn", "save-btn");
            removeButton.textContent = "เพิ่ม";
          });
        }
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
    button.addEventListener("click", async () => {
      const userEmail = button.dataset.email;
      await addToBookmark(userEmail);
      // displayBookmarks();
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

async function isEmailBookmarked(email) {
  getUserData();
  if (userData.email) {
    const currentUserEmail = userData.email;
    const bookmarkDocRef = firestore.collection("bookmarks").doc(currentUserEmail);
    const bookmarkDoc = await bookmarkDocRef.get();
    if (bookmarkDoc.exists) {
      const bookmarkData = bookmarkDoc.data();
      return bookmarkData.emails.includes(email);
    }
  }
  return false;
}

async function addToBookmark(userEmail) {
  getUserData()
  if (userData.email) {
    const currentUserEmail = userData.email;
    const bookmarkDocRef = firestore.collection("bookmarks").doc(currentUserEmail);
    const bookmarkDoc = await bookmarkDocRef.get();
    const bookmarkData = bookmarkDoc.exists ? bookmarkDoc.data() : { emails: [] };
    const updatedEmails = [...bookmarkData.emails, userEmail];
    await bookmarkDocRef.set({ emails: updatedEmails });
  }
}

async function removeFromBookmark(userEmail) {
  getUserData()
  if (userData.email) {
    const currentUserEmail = userData.email;
    const bookmarkDocRef = firestore.collection("bookmarks").doc(currentUserEmail);
    const bookmarkDoc = await bookmarkDocRef.get();
    if (bookmarkDoc.exists) {
      const bookmarkData = bookmarkDoc.data();
      const updatedEmails = bookmarkData.emails.filter((email) => email !== userEmail);
      await bookmarkDocRef.set({ emails: updatedEmails });
    }
  }
}

async function displayBookmarks() {
  const querylist = document.getElementById("querylist");
  querylist.innerHTML = "";

  getUserData();
  if (userData.email) {
    const currentUserEmail = userData.email;
    const bookmarkDocRef = firestore.collection("bookmarks").doc(currentUserEmail);
    const bookmarkDoc = await bookmarkDocRef.get();
    if (bookmarkDoc.exists) {
      const bookmarkData = bookmarkDoc.data();
      const bookmarkedEmails = bookmarkData.emails;

      if (bookmarkedEmails.length > 0) {
        querylist.innerHTML = `
        <div style="overflow-x:auto;">
          <table class="">
            <colgroup>
                <col style="width: 20%">
                <col style="width: 23%">
                <col style="width: 23%">
                <col style="width: 10%">
                <col style="width: 10%">
            </colgroup>
            <thead>
              <tr>
                    <th><b>อีเมล</b></th>
                    <th><b>ชื่อผู้ใช้</b></th>
                    <th><b>รหัสผู้ใช้</b></th>
                    <th></th>
                    <th></th>
                </tr>
            </thead>
            <tbody id="bookmarkTable">
            </tbody>
          </table>
        </div>`;

        for (const userEmail of bookmarkedEmails) {
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
                      <td><button class="btn btn-danger remove-bookmark-btn" data-email="${userEmail}">ลบ</button></td>
                      <td><button class="btn btn-secondary view-bookmark-btn" data-email="${userEmail}">ข้อมูล</button></td>
                      `;
            document.getElementById("bookmarkTable").appendChild(listItem);

            const removeButton = listItem.querySelector(".remove-bookmark-btn");
            removeButton.addEventListener("click", async () => {
              await removeFromBookmark(userEmail);
              displayBookmarks();
            });

            const viewButton = listItem.querySelector(".view-bookmark-btn");
            viewButton.addEventListener("click", async () => {
              if (!viewButton.classList.contains("viewed")) {
                viewButton.classList.add("viewed");
                let searchResultContainer = document.getElementById(
                  `searchResultContainer-${userEmail}`
                );
                const row = viewButton.closest("tr");

                if (!searchResultContainer) {
                  searchResultContainer = document.createElement("div");
                  searchResultContainer.id = `searchResultContainer-${userEmail}`;
                  row.insertAdjacentElement("afterend", searchResultContainer);
                }

                await displayUserData(userEmail, searchResultContainer);
              }
            });
          }
        }
      } else {
        querylist.innerHTML = '<div class="text-center">ไม่มีรายการที่บันทึกไว้</div>';
      }
    } else {
      querylist.innerHTML = '<div class="text-center">ไม่มีรายการที่บันทึกไว้</div>';
    }
  } else {
    querylist.innerHTML = '<div class="text-center">ไม่มีรายการที่บันทึกไว้</div>';
  }
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

document.addEventListener("DOMContentLoaded", displayBookmarks);