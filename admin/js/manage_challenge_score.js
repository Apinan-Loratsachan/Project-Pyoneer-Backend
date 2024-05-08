async function displayChallengeScores() {
    const challengeScoreList = document.getElementById("challengeScoreList");
    challengeScoreList.innerHTML = `<div style="overflow-x:auto;">
                  <table class="">
                  <colgroup>
                    <col style="width: 10%">
                    <col style="width: 30%">
                    <col style="width: 20%">
                    <col style="width: 20%">
                    <col style="width: 10%">
                    <col style="width: 10%">
                  </colgroup>
                  <thead>
                    <tr class="text-center">
                        <th colspan="2"><b>ชื่อ</b></th>
                        <th><b>คะแนน</b></th>
                        <th><b>เวลาที่ใช้</b></th>
                        <th><b>วันที่และเวลา</b></th>
                        <th></th>
                    </tr>
                  </thead>
                  <tbody id="challengeScoreTable">
                  </tbody>
                  </table>
              </div>`;
  
    const snapshot = await firestore.collection("challengeScore").get();
    const challengeScores = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  
    challengeScores.sort((a, b) => {
      if (a.score === b.score) {
        return a.timeSpent - b.timeSpent;
      }
      return b.score - a.score;
    });
  
    challengeScores.forEach(async (challengeScore) => {
      const userDoc = await firestore.collection("users").doc(challengeScore.id).get();
      const userData = userDoc.data();
  
      const listItem = document.createElement("tr");
      listItem.innerHTML = `
        <td class="text-center prevent-all">
          <img src="${userData.photoURL}" alt="Profile Image" style="width: 40px; height: 40px; border-radius: 50%;">
        </td>
        <td class="align-middle">${userData.displayName}</td>
        <td class="text-center align-middle">${challengeScore.score}</td>
        <td class="text-center align-middle">${msToTime(challengeScore.timeSpent)}</td>
        <td class="text-center align-middle">${challengeScore.timeStamp
          ? challengeScore.timeStamp
              .toDate()
              .toLocaleString("th-TH", { timeZone: "Asia/Bangkok" })
          : "-"}</td>
          <td class="text-center">
          <button class="btn btn-danger delete-btn" data-id="${challengeScore.id}">
            ลบ
          </button>
        </td>
      `;
      document.getElementById("challengeScoreTable").appendChild(listItem);
    });
  
    document.getElementById("challengeScoreTable").addEventListener("click", async (event) => {
        if (event.target.classList.contains("delete-btn")) {
          event.preventDefault();
          const id = event.target.dataset.id;
          await deleteChallengeScore(id);
          displayChallengeScores();
        }
      });
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
  
  async function deleteChallengeScore(id) {
    if (confirm(`คุณต้องการลบข้อมูล Challenge ของ ${id} หรือไม่?`)) {
      try {
        await firestore.collection("challengeScore").doc(id).delete();
        alert(`ลบข้อมูล Challenge ของ ${id} สำเร็จ`);
      } catch (error) {
        console.error("Error deleting challenge score:", error);
        alert(`เกิดข้อผิดพลาดในการลบข้อมูล Challenge ของ ${id}`);
      }
    }
  }
  
  document.addEventListener("DOMContentLoaded", displayChallengeScores);