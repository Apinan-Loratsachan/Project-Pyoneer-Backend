async function queryPyoneerData() {
    const userEmails = document.getElementById("InputQuery").value.split(",").map(email => email.trim());
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
            </div>`

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

                const collapseRow = document.createElement("tr");
                collapseRow.classList.add("collapse-row");
                collapseRow.style.display = "none";
                collapseRow.innerHTML = `
                <td colspan="5">
                    <div id="searchResultContainer-${userEmail}"></div>
                </td>
                `;
                document.getElementById("resultTable").appendChild(collapseRow);
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
    saveButtons.forEach(button => {
        button.addEventListener("click", () => {
            const userEmail = button.dataset.email;
            // สำหรับบันทึกอีเมลล์เข้ารายการที่บันทึก
        });
    });

    const viewButtons = document.querySelectorAll(".view-btn");
    viewButtons.forEach(button => {
        button.addEventListener("click", async () => {
            const userEmail = button.dataset.email;
            const collapseRow = button.closest(".list-item").nextElementSibling;
            const searchResultContainer = collapseRow.querySelector(`#searchResultContainer-${userEmail}`);

            if (collapseRow.style.display === "table-row") {
                collapseRow.style.display = "none";
            } else {
                collapseRow.style.display = "table-row";
                await displayUserData(userEmail, searchResultContainer);
            }
        });
    });
}

async function displayUserData(userEmail, searchResultContainer) {
    const lessonsCollectionRef = firestore.collection("lessons");
    const lessonsSnapshot = await lessonsCollectionRef.where("email", "==", userEmail).get();
    
    const preTestSnapshot = await firestore.collection("testResult").doc(userEmail).collection("pre-test").get();
    const postTestSnapshot = await firestore.collection("testResult").doc(userEmail).collection("post-test").get();
    
    const challengeScoreDocRef = firestore.collection("challengeScore").doc(userEmail);
    const challengeScoreDoc = await challengeScoreDocRef.get();
    
    searchResultContainer.innerHTML = ""; // Clear previous results
    displayResults(userEmail, lessonsSnapshot.docs, preTestSnapshot.docs, postTestSnapshot.docs, challengeScoreDoc.data(), searchResultContainer);
}

function displayResults(userEmail, lessons, preTests, postTests, challengeScore, searchResultContainer) {
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
      searchResultContainer.innerHTML = resultHTML;
    } else {
      searchResultContainer.innerHTML = "ไม่พบข้อมูล";
    }
}