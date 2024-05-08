async function displayUsers() {
  const userslist = document.getElementById("userslist");
  userslist.innerHTML = `<div style="overflow-x:auto;">
                  <table class="">
                  <colgroup>
                    <col style="width: 30%">
                    <col style="width: 30%">
                    <col style="width: 30%">
                    <col style="width: 15%">
                    <col style="width: 10%">
                    <col style="width: 20%">
                  </colgroup>
                  <thead>
                    <tr>
                        <th><b></b></th>
                        <th><b>ชื่อผู้ใช้</b></th>
                        <th><b>อีเมล</b></th>
                        <th><b>รหัสผู้ใช้</b></th>
                        <th colspan="2"></th>
                    </tr>
                  </thead>
                  <tbody id="usersTable">
                  </tbody>
                  </table>
              </div>`;

  const snapshot = await firestore.collection("users").get();
  const adminSnapshot = await firestore.collection("admin").get();
  const adminEmails = adminSnapshot.docs.map((doc) => doc.id);
  snapshot.forEach((doc) => {
    const userEmail = doc.id;
    if (!adminEmails.includes(userEmail)) {
      const userData = doc.data();
      const listItem = document.createElement("tr");
      listItem.innerHTML = `
            <td class="text-center prevent-all">
              <img src="${userData.photoURL}" alt="Profile Image" style="width: 40px; height: 40px; border-radius: 50%;">
            </td>
            <td>${userData.displayName}</td>
            <td>${userEmail}</td>
            <td>${userData.uid}</td>
            <td>
              <div class="d-grid gap-2">
                <button type="button" class="btn btn-primary view-btn" data-email="${userEmail}">
                  ข้อมูล
                </button>
              </div>
            </td>
            <td>
            <div class="d-grid gap-2">
                <button type="button" class="btn btn-danger delete-btn" data-email="${userEmail}">
                  ลบ
                </button>
              </div>
            </td>
          `;
      document.getElementById("usersTable").appendChild(listItem);
    }
  });

  const viewBtns = document.querySelectorAll(".view-btn");
  viewBtns.forEach((btn) => {
    btn.addEventListener("click", async () => {
      const userEmail = btn.dataset.email;
      await displayUserData(userEmail);
    });
  });

  const deleteBtns = document.querySelectorAll(".delete-btn");
  deleteBtns.forEach((btn) => {
    btn.addEventListener("click", async () => {
      const userEmail = btn.dataset.email;
      await deleteUserAccount(userEmail);
      displayUsers();
    });
  });
}

async function displayUserData(userEmail) {
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
    challengeScoreDoc.data()
  );
}

function displayResults(userEmail, lessons, preTests, postTests, challengeScore) {
  let hasData = false;
  let resultHTML = "";

  if (lessons.length > 0) {
    hasData = true;
    resultHTML += `
        <div>
          <h5 class="prevent-select" id="headerText" style="color: black; text-align: center; padding-top: 10px">บทเรียน</h5>
          <div class="text-center" class="resultContainer">
            ${createLessonsTable(lessons)}
          </div>
        </div>
        <div style="height: 40px;"></div>
      `;
  }

  if (preTests.length > 0 || postTests.length > 0) {
    hasData = true;
    resultHTML += `
        <div>
          <h5 class="prevent-select" id="headerText" style="color: black; text-align: center; padding-top: 10px">แบบทดสอบ</h5>
          <div style="height: 20px;"></div>
          <div class="text-center" class="resultContainer">
            ${createTestsTable(preTests, postTests)}
          </div>
        </div>
        <div style="height: 40px;"></div>
      `;
  }

  if (challengeScore) {
    hasData = true;
    resultHTML += `
        <div>
          <h5 class="prevent-select" id="headerText" style="color: black; text-align: center; padding-top: 10px">Challenge</h5>
          <div style="height: 20px;"></div>
          <div class="text-center" class="resultContainer">
            ${createChallengeScoreTable(challengeScore)}
          </div>
        </div>
      `;
  }

  if (hasData) {
    document.getElementById("searchResultContainer").innerHTML = `
    <div style="height: 40px;"></div>
        <div class="card blur animate__animated animate__zoomIn">
            <div class="card-body info-section">
                <div class="text-center">
                  <div style="height: 30px"></div>
                  <h4 class="prevent-select"><strong>${userEmail}</strong></h4>
                  <h4 class="prevent-select"><strong>↓</strong></h4>
                  ${resultHTML}
                </div>
            </div>
        </div>
      `;
  } else {
    document.getElementById("searchResultContainer").innerHTML = `
    <div style="height: 40px;"></div>
        <div class="card blur animate__animated animate__zoomIn">
            <div class="card-body info-section">
                <div class="text-center">
                  <div style="height: 30px"></div>
                  <h4 class="prevent-select"><strong>${userEmail} ไม่ได้ทำสิ่งใดเลย</strong></h4>
                </div>
            </div>
        </div>
      `;
  }
  document.getElementById("searchResultContainer").scrollIntoView();
}

function createLessonsTable(lessons) {
  lessons.sort((a, b) => a.data().lessonRead - b.data().lessonRead);
  let tableHTML = `
      <table class="table table-bordered" style="border-radius: 10px; overflow: hidden;">
        <thead>
          <tr>
            <th>บทที่</th>
            <th>เวลาที่อ่าน</th>
          </tr>
        </thead>
        <tbody>
          ${lessons
      .map((doc) => {
        const lessonData = doc.data();
        return `
                <tr>
                  <td>${lessonData.lessonRead}</td>
                  <td>${lessonData.timestamp
            ? lessonData.timestamp
              .toDate()
              .toLocaleString("th-TH", {
                timeZone: "Asia/Bangkok",
              })
            : "-"
          }</td>
                </tr>
              `;
      })
      .join("")}
        </tbody>
      </table>
    `;
  return tableHTML;
}

function createTestsTable(preTests, postTests) {
  let tableHTML = "";
  const testTypes = ["pre-test", "post-test"];
  testTypes.forEach((testType) => {
    const tests = testType === "pre-test" ? preTests : postTests;
    if (tests.length > 0) {
      tests.sort((a, b) => a.data().lessonTest - b.data().lessonTest);
      tableHTML += `
          <table class="table table-bordered" style="border-radius: 10px; overflow: hidden;">
            <thead>
              <tr>
                <th>${testType === "pre-test" ? "Pre-test" : "Post-test"}</th>
                <th>คะแนน</th>
                <th>เวลาที่ทำแบบทดสอบ</th>
              </tr>
            </thead>
            <tbody>
              ${tests
          .map((doc) => {
            const testData = doc.data();
            const lessonTest = testData.lessonTest;
            const attemptCount = testData.attemptCount || "";
            return `
                    <tr>
                      <td>บทที่ ${lessonTest}${testType === "post-test"
                ? ` (ครั้งที่ ${attemptCount})`
                : ""
              }</td>
                      <td>${testData.score}</td>
                      <td>${testData.timestamp
                ? testData.timestamp
                  .toDate()
                  .toLocaleString("th-TH", {
                    timeZone: "Asia/Bangkok",
                  })
                : "-"
              }</td>
                    </tr>
                  `;
          })
          .join("")}
            </tbody>
          </table>
        `;
    }
  });
  return tableHTML;
}

function createChallengeScoreTable(challengeScore) {
  let tableHTML = "";
  if (challengeScore) {
    tableHTML = `
        <table class="table table-bordered" style="border-radius: 10px; overflow: hidden;">
          <thead>
            <tr>
              <th>คะแนน Challenge</th>
              <th>เวลาที่ใช้ทำ Challenge</th>
              <th>วันที่และเวลา</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>${challengeScore.score}</td>
              <td>${msToTime(challengeScore.timeSpent)}</td>
              <td>${challengeScore.timeStamp
        ? challengeScore.timeStamp
          .toDate()
          .toLocaleString("th-TH", { timeZone: "Asia/Bangkok" })
        : "-"
      }</td>
            </tr>
          </tbody>
        </table>
      `;
  }
  return tableHTML;
}

function msToTime(s) {
  var ms = s % 1000;
  s = (s - ms) / 1000;
  var secs = s % 60;
  s = (s - secs) / 60;
  var mins = s % 60;
  var hrs = (s - mins) / 60;

  hrs = hrs.toString().padStart(2, "0");
  mins = mins.toString().padStart(2, "0");
  secs = secs.toString().padStart(2, "0");

  return hrs + ":" + mins + ":" + secs + "." + ms;
}

async function deleteUserAccount(email) {
  if (confirm(`คุณต้องการลบบัญชี ${email} หรือไม่?`)) {
    try {
      const adminSnapshot = await firestore.collection("admin").get();
      const adminEmails = adminSnapshot.docs.map((doc) => doc.id);
      if (adminEmails.includes(email)) {
        alert(`ไม่สามารถลบบัญชี ${email} ได้ เนื่องจากเป็นบัญชีผู้ดูแลระบบ`);
        return;
      }

      await firestore.collection("users").doc(email).delete();

      await firestore.collection("lessons").where("email", "==", email).get()
        .then((snapshot) => {
          snapshot.forEach((doc) => doc.ref.delete());
        });

      await firestore.collection("testResult").doc(email).delete();
      await firestore.collection("testResult").doc(email).collection("pre-test").get()
        .then((snapshot) => {
          snapshot.forEach((doc) => doc.ref.delete());
        });
      await firestore.collection("testResult").doc(email).collection("post-test").get()
        .then((snapshot) => {
          snapshot.forEach((doc) => doc.ref.delete());
        });

      await firestore.collection("userChoices").doc(email).delete();
      await firestore.collection("userChoices").doc(email).collection("pre-test").get()
        .then((snapshot) => {
          snapshot.forEach((doc) => doc.ref.delete());
        });
      await firestore.collection("userChoices").doc(email).collection("post-test").get()
        .then((snapshot) => {
          snapshot.forEach((doc) => doc.ref.delete());
        });

      await firestore.collection("challengeScore").doc(email).delete();
      await firestore.collection("bookmarks").doc(email).delete();
      await firestore.collection("web-approve").doc(email).delete();

      const bookmarksSnapshot = await firestore.collection("bookmarks").get();
      bookmarksSnapshot.forEach(async (doc) => {
        const bookmarkData = doc.data();
        if (bookmarkData.emails.includes(email)) {
          const updatedEmails = bookmarkData.emails.filter((e) => e !== email);
          await doc.ref.update({ emails: updatedEmails });
        }
      });

      alert(`ลบบัญชี ${email} สำเร็จ`);
    } catch (error) {
      console.error("Error deleting user account:", error);
      alert(`เกิดข้อผิดพลาดในการลบบัญชี ${email}`);
    }
  }
}

document.addEventListener("DOMContentLoaded", displayUsers);