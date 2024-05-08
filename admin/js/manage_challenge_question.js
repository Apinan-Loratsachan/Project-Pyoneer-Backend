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

let questionModal = null;

function showQuestionModal(questionId) {
  if (!questionModal) {
    questionModal = document.createElement("div");
    questionModal.classList.add("modal", "fade");
    questionModal.innerHTML = `
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title"></h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form>
              <div class="mb-3">
                <label for="question" class="form-label">คำถาม</label>
                <input type="text" class="form-control" id="question" required>
              </div>
              <div class="mb-3">
                <label for="choice1" class="form-label">ตัวเลือก 1</label>
                <input type="text" class="form-control" id="choice1" required>
              </div>
              <div class="mb-3">
                <label for="choice2" class="form-label">ตัวเลือก 2</label>
                <input type="text" class="form-control" id="choice2" required>
              </div>
              <div class="mb-3">
                <label for="choice3" class="form-label">ตัวเลือก 3</label>
                <input type="text" class="form-control" id="choice3" required>
              </div>
              <div class="mb-3">
                <label for="choice4" class="form-label">ตัวเลือก 4</label>
                <input type="text" class="form-control" id="choice4" required>
              </div>
              <div class="mb-3">
                <label for="correctChoice" class="form-label">คำตอบที่ถูกต้อง</label>
                <select class="form-select" id="correctChoice" required>
                  <option value="">เลือกคำตอบที่ถูกต้อง</option>
                  <option value="1">ตัวเลือก 1</option>
                  <option value="2">ตัวเลือก 2</option>
                  <option value="3">ตัวเลือก 3</option>
                  <option value="4">ตัวเลือก 4</option>
                </select>
              </div>
              <div class="mb-3">
                <label for="imageUrl" class="form-label">URL รูปภาพ (ถ้ามี)</label>
                <input type="text" class="form-control" id="imageUrl">
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">ยกเลิก</button>
            <button type="button" class="btn btn-primary" id="saveQuestionBtn"></button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(questionModal);

    questionModal = new bootstrap.Modal(questionModal);

    document.getElementById("saveQuestionBtn").addEventListener("click", () => {
      const questionData = {
        question: document.getElementById("question").value,
        choice: [
          document.getElementById("choice1").value,
          document.getElementById("choice2").value,
          document.getElementById("choice3").value,
          document.getElementById("choice4").value,
        ],
        correctChoice: document.getElementById(`choice${document.getElementById("correctChoice").value}`).value,
        imageUrl: document.getElementById("imageUrl").value,
      };

      if (questionModal.questionId) {
        firestore.collection("challengeQuestion").doc(questionModal.questionId).update(questionData)
          .then(() => {
            questionModal.hide();
            displayChallengeQuestions();
          });
      } else {
        firestore.collection("challengeQuestion").add(questionData)
          .then(() => {
            questionModal.hide();
            displayChallengeQuestions();
          });
      }
    });
  }

  if (questionId) {
    firestore.collection("challengeQuestion").doc(questionId).get()
      .then((doc) => {
        const questionData = doc.data();
        document.getElementById("question").value = questionData.question;
        document.getElementById("choice1").value = questionData.choice[0];
        document.getElementById("choice2").value = questionData.choice[1];
        document.getElementById("choice3").value = questionData.choice[2];
        document.getElementById("choice4").value = questionData.choice[3];
        document.getElementById("correctChoice").value = questionData.choice.indexOf(questionData.correctChoice) + 1;
        document.getElementById("imageUrl").value = questionData.imageUrl || "";

        document.querySelector(".modal-title").textContent = "แก้ไขข้อสอบ";
        document.getElementById("saveQuestionBtn").textContent = "บันทึกการแก้ไข";
      });
    questionModal.questionId = questionId;
  } else {
    document.getElementById("question").value = "";
    document.getElementById("choice1").value = "";
    document.getElementById("choice2").value = "";
    document.getElementById("choice3").value = "";
    document.getElementById("choice4").value = "";
    document.getElementById("correctChoice").value = "";
    document.getElementById("imageUrl").value = "";

    document.querySelector(".modal-title").textContent = "เพิ่มข้อสอบใหม่";
    document.getElementById("saveQuestionBtn").textContent = "เพิ่มข้อสอบ";
    questionModal.questionId = null;
  }

  questionModal.show();
}

async function deleteQuestion(questionId) {
  if (confirm("คุณต้องการลบข้อสอบนี้หรือไม่?")) {
    await firestore.collection("challengeQuestion").doc(questionId).delete();
    displayChallengeQuestions();
  }
}