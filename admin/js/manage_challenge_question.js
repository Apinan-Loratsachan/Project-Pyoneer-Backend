document.addEventListener("DOMContentLoaded", displayChallengeQuestions);

async function displayChallengeQuestions() {
  const challengeQuestionList = document.getElementById("challengeQuestionList");
  challengeQuestionList.innerHTML = `
    <div style="overflow-x:auto;">
      <table class="table">
        <thead>
          <tr>
            <th><b>รหัสข้อสอบ</b></th>
            <th><b>คำถาม</b></th>
            <th><b>ตัวเลือก</b></th>
            <th><b>คำตอบ</b></th>
            <th></th>
          </tr>
        </thead>
        <tbody id="challengeQuestionsTable"></tbody>
      </table>
    </div>
    <div class="d-grid gap-2">
      <button type="button" class="btn btn-primary" id="addQuestionBtn">เพิ่มข้อสอบใหม่</button>
    </div>
  `;

  const snapshot = await firestore.collection("challengeQuestion").orderBy("__name__").get();
  snapshot.forEach((doc) => {
    const questionData = doc.data();
    const listItem = document.createElement("tr");
    listItem.innerHTML = `
      <td>${doc.id}</td>
      <td>${questionData.question}</td>
      <td>${questionData.choice.join("<br>")}</td>
      <td>${questionData.correctChoice}</td>
      <td>
        <div class="d-grid gap-2">
          <button type="button" class="btn btn-secondary edit-btn" data-id="${doc.id}">แก้ไข</button>
          <button type="button" class="btn btn-danger delete-btn" data-id="${doc.id}">ลบ</button>
        </div>
      </td>
    `;
    document.getElementById("challengeQuestionsTable").appendChild(listItem);
  });

  document.getElementById("addQuestionBtn").addEventListener("click", () => {
    showQuestionModal(null);
  });

  const editBtns = document.querySelectorAll(".edit-btn");
  editBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const questionId = btn.dataset.id;
      showQuestionModal(questionId);
    });
  });

  const deleteBtns = document.querySelectorAll(".delete-btn");
  deleteBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const questionId = btn.dataset.id;
      deleteQuestion(questionId);
    });
  });
}

function showQuestionModal(questionId) {
  // TODO: Implement showing modal for adding/editing question
}

async function deleteQuestion(questionId) {
  if (confirm("คุณต้องการลบข้อสอบนี้หรือไม่?")) {
    await firestore.collection("challengeQuestion").doc(questionId).delete();
    displayChallengeQuestions();
  }
}