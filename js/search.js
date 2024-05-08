async function queryPyoneerData() {
  const userEmails = document
    .getElementById("InputQuery")
    .value.split(",")
    .map((email) => email.trim());
  const querylist = document.getElementById("searchResult");
  querylist.innerHTML = `
            <div style="overflow-x:auto;">
                <table>
                <colgroup>
                  <col style="width: 20%">
                  <col style="width: 23%">
                  <col style="width: 23%">
                  <col style="width: 10%">
                  <col style="width: 10%">
                </colgroup>
                <thead clsss="prevent-select">
                  <tr>
                      <th><b>อีเมล</b></th>
                      <th><b>ชื่อผู้ใช้</b></th>
                      <th><b>รหัสผู้ใช้</b></th>
                      <th colspan="2"><b>การดำเนินการ</b></th>
                  </tr>
                </thead>
                <tbody id="resultTable" clsss="text-center">
                </tbody>
                </table>
            </div>
            <div style="height: 40px;"></div>`;

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
                <td clsss="prevent-select"><button id="${uid}" class="btn ${buttonClass}" data-email="${userEmail}" onclick="searchActionBtn('${uid}', '${userEmail}')">${buttonText}</button></td>
                <td clsss="prevent-select"><button class="btn btn-dark view-btn" data-email="${userEmail}" data-displayname="${displayName}">ข้อมูล</button></td>
                `;
        document.getElementById("resultTable").appendChild(listItem);
      } else {
        const listItem = document.createElement("tr");
        listItem.classList.add("list-item");

        const isBookmarked = await isEmailBookmarked(userEmail);
        const buttonClass = isBookmarked ? "btn-danger remove-btn" : "btn-primary save-btn";
        const buttonText = isBookmarked ? "ลบ" : "เพิ่ม";

        listItem.innerHTML = `
                <td colspan="5"><b>ไม่พบข้อมูลสำหรับ ${userEmail}</b></td>
                `;
        document.getElementById("resultTable").appendChild(listItem);
      }
    } catch (error) {
      console.error("Error getting user document:", error);
    }
  }

  const viewButtons = document.querySelectorAll(".view-btn");
  viewButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      const userEmail = button.dataset.email;
      const displayName = button.dataset.displayname;
      let searchResultContainer = document.getElementById(
        `searchResultContainer-${userEmail}`
      );
      const row = button.closest("tr");

      await displayUserData(userEmail, displayName, searchResultContainer);
    });
  });
}

async function searchActionBtn(btnId, userEmail) {
  console.log(btnId)
  targetBtn = document.getElementById(btnId)
  if (targetBtn.classList.contains("save-btn")) {
    targetBtn.classList.replace("btn-primary", "btn-danger");
    targetBtn.classList.replace("save-btn", "remove-btn");
    targetBtn.innerText = 'ลบ'
    await addToBookmark(userEmail);
    displayBookmarks();
  } else {
    targetBtn.classList.replace("btn-danger", "btn-primary");
    targetBtn.classList.replace("remove-btn", "save-btn");
    targetBtn.innerText = 'เพิ่ม'
    await removeFromBookmark(userEmail);
    displayBookmarks();
  }
}

async function updateBookmarkButtonState(userEmail) {
  const button = document.querySelector(`.save-btn[data-email="${userEmail}"], .remove-btn[data-email="${userEmail}"]`);
  if (button) {
    const isBookmarked = await isEmailBookmarked(userEmail);
    const buttonClass = isBookmarked ? "btn-danger remove-btn" : "btn-primary save-btn";
    const buttonText = isBookmarked ? "ลบ" : "เพิ่ม";
    button.className = `btn ${buttonClass}`;
    button.textContent = buttonText;
  }
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
          <table>
            <colgroup>
                <col style="width: 20%">
                <col style="width: 23%">
                <col style="width: 23%">
                <col style="width: 10%">
                <col style="width: 10%">
            </colgroup>
            <thead class="prevent-select">
              <tr>
                <th><b>อีเมล</b></th>
                <th><b>ชื่อผู้ใช้</b></th>
                <th><b>รหัสผู้ใช้</b></th>
                <th colspan="2"><b>การดำเนินการ</b></th>
              </tr>
            </thead>
            <tbody id="bookmarkTable">
            </tbody>
          </table>
        </div>
        <div style="height: 40px;"></div>`;

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
                      <td clsss="prevent-select"><button class="btn btn-danger remove-bookmark-btn" data-email="${userEmail}">ลบ</button></td>
                      <td clsss="prevent-select"><button class="btn btn-dark view-bookmark-btn" data-email="${userEmail}">ข้อมูล</button></td>
                      `;
            document.getElementById("bookmarkTable").appendChild(listItem);

            const removeButton = listItem.querySelector(".remove-bookmark-btn");
            removeButton.addEventListener("click", async () => {
              await removeFromBookmark(userEmail);
              displayBookmarks();
              updateBookmarkButtonState(userEmail);
            });

            const viewButton = listItem.querySelector(".view-bookmark-btn");
            viewButton.addEventListener("click", async () => {
              let searchResultContainer = document.getElementById(
                `searchResultContainer-${userEmail}`
              );
              const row = viewButton.closest("tr");

              await displayUserData(userEmail, displayName, searchResultContainer);
            });
          }
        }
      } else {
        querylist.innerHTML = '<div class="text-center">ไม่มีรายการที่บันทึกไว้</div><div style="height:30px"></div>';
      }
    } else {
      querylist.innerHTML = '<div class="text-center">ไม่มีรายการที่บันทึกไว้</div><div style="height:30px"></div>';
    }
  } else {
    querylist.innerHTML = '<div class="text-center">ไม่มีรายการที่บันทึกไว้</div><div style="height:30px"></div>';
  }
}

async function displayUserData(userEmail, displayName, searchResultContainer) {
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
    displayName,
    lessonsSnapshot.docs,
    preTestSnapshot.docs,
    postTestSnapshot.docs,
    challengeScoreDoc.data(),
    searchResultContainer
  );
}

document.addEventListener("DOMContentLoaded", displayBookmarks);