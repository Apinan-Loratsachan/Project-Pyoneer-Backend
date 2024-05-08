function displayResults(userEmail, displayName, lessons, preTests, postTests, challengeScore) {
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
          <h4 class="prevent-select"><b>ข้อมูลของ ${userEmail}</b></h4>
          <h5 class="prevent-select">${displayName}</h5>
          <div style="height: 30px;"></div>
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