function createTable() {
    document.getElementById(
      "searchResultContainer"
    ).innerHTML = `<div class="padding-space" id="result-container">
      <div class="card blur animate__animated animate__zoomInDown">
          <div class="card-body info-section">
              <div id="header" class="prevent-select" style="padding: 10px;">
                  <h3 id="headerText" style="color: black; text-align: center; padding-top: 10px">ผลการค้นหา
                  </h3>
              </div>
              <div id="liveAlertPlaceholder"></div>
          </div>
          <div class="container" style="padding-left: 25px; padding-right: 25px; padding-bottom: 35px;">
              <div id="resultContent"></div>
          </div>
      </div>
  </div>`;
  }

async function queryPyoneerData() {
    const userEmails = document.getElementById("InputQuery").value.split(",").map(email => email.trim());
    const testTypes = ["pre-test", "post-test"];
    const collectionName = "testResult";
    const lessonsCollectionName = "lessons";
    const challengeScoreCollectionName = "challengeScore";
  
    createTable();

  for (const userEmail of userEmails) {
    try {
      const lessonsCollectionRef = firestore.collection(lessonsCollectionName);
      const lessonsSnapshot = await lessonsCollectionRef
        .where("email", "==", userEmail)
        .get();

      const preTestSnapshot = await firestore
        .collection(collectionName)
        .doc(userEmail)
        .collection("pre-test")
        .get();
      const postTestSnapshot = await firestore
        .collection(collectionName)
        .doc(userEmail)
        .collection("post-test")
        .get();

      const challengeScoreDocRef = firestore
        .collection(challengeScoreCollectionName)
        .doc(userEmail);
      const challengeScoreDoc = await challengeScoreDocRef.get();

      displayResults(
        userEmail,
        lessonsSnapshot.docs,
        preTestSnapshot.docs,
        postTestSnapshot.docs,
        challengeScoreDoc.data()
      );
    } catch (error) {
      console.error("Error getting documents:", error);
    }
  }
}

function displayResults(userEmail, lessons, preTests, postTests, challengeScore) {
    let hasData = false;
    let resultHTML = "";
  
    if (lessons.length > 0) {
      hasData = true;
      resultHTML += `
        <div>
          <h5 class="prevent-select" id="headerText" style="color: black; text-align: center; padding-top: 10px">บทเรียน</h5>
          <div style="height: 20px;"></div>
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
      document.getElementById("resultContent").innerHTML += `
        <div class="text-center">
          <h4><strong>${userEmail}</strong></h4>
          <h4><strong>↓</strong></h4>
          ${resultHTML}
          <hr style="border-top: 5px solid #000;">
        </div>
      `;
    }
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
                  <td>${
                    lessonData.timestamp
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
                      <td>บทที่ ${lessonTest}${
                    testType === "post-test"
                      ? ` (ครั้งที่ ${attemptCount})`
                      : ""
                  }</td>
                      <td>${testData.score}</td>
                      <td>${
                        testData.timestamp
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
              <td>${
                challengeScore.timeStamp
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

  if (hrs.toString().length == 1) {
    hrs = "0" + hrs;
  }
  if (mins.toString().length == 1) {
    mins = "0" + mins;
  }
  if (secs.toString().length == 1) {
    secs = "0" + secs;
  }

  return hrs + ":" + mins + ":" + secs + "." + ms;
}
