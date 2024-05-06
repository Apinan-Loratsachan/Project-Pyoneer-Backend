
async function queryPyoneerData222() {
    let queryData = { lesson: null, test: null, challenge: null }, lessonArray = [], testDict = { preTest: null, postTest: null }, pretestArray = [], posttestArray = [], challengeData

    const userEmail = document.getElementById('InputQuery').value;
    const testTypes = ['pre-test', 'post-test'];
    const collectionName = 'testResult';
    const lessonsCollectionName = 'lessons';
    const challengeScoreCollectionName = 'challengeScore';

    try {
        //lesson
        const lessonsCollectionRef = firestore.collection(lessonsCollectionName)
        const lessonsSnapshot = await lessonsCollectionRef.where('email', '==', userEmail).get();

        if (lessonsSnapshot.empty) {
            console.log(`No lessons Read status found for ${userEmail}`);
        } else {
            // console.log('Lessons Read status:');
            lessonsSnapshot.forEach(doc => {
                const data = doc.data();
                // if (data.timestamp) {
                //     const date = data.timestamp.toDate();
                //     console.log(doc.id, '=>', data, 'Timestamp:', date.toLocaleString());
                // } else {
                //     console.log(doc.id, '=>', data);
                // }
                lessonArray.push(data)
            });
            lessonArray.sort((a, b) => a.lessonRead - b.lessonRead);
            // console.log("lessonArray", lessonArray)
        }

        //testResult
        for (const testType of testTypes) {
            const collectionRef = firestore.collection(collectionName).doc(userEmail).collection(testType);
            const snapshot = await collectionRef.get();

            if (snapshot.empty) {
                console.log(`No ${testType} documents found for ${userEmail}`);
            } else {
                // console.log(`${testType} Results:`);
                snapshot.forEach(doc => {
                    const data = doc.data();
                    // if (data.timestamp) {
                    //     const date = data.timestamp.toDate();
                    //     console.log(doc.id, '=>', data, 'Timestamp:', date.toLocaleString());
                    // } else {
                    //     console.log(doc.id, '=>', data);
                    // }

                    if (testType == 'pre-test') {
                        pretestArray.push(data)
                    } else {
                        posttestArray.push(data)
                    }
                });
                testDict.preTest = pretestArray || null
                testDict.postTest = posttestArray || null
            }
        }

        // challengeScore
        const challengeScoreDocRef = firestore.collection(challengeScoreCollectionName).doc(userEmail);
        const challengeScoreDoc = await challengeScoreDocRef.get();

        if (!challengeScoreDoc.exists) {
            console.log(`No challenge score found for ${userEmail}`);
        } else {
            // console.log('Challenge Score:');
            const data = challengeScoreDoc.data();
            // if (data.timeStamp) {
            //     const date = data.timeStamp.toDate();
            //     console.log(challengeScoreDoc.id, '=>', data, 'Timestamp:', date.toLocaleString());
            // } else {
            //     console.log(challengeScoreDoc.id, '=>', data);
            // }
            challengeData = data
        }

        // queryData.push({
        //     key: "lesson",
        //     value: lessonArray
        // });
        queryData.lesson = lessonArray || null
        queryData.test = testDict || null
        queryData.challenge = challengeData || null
        console.log("queryData\n", queryData)
        createTable()
    } catch (error) {
        console.error("Error getting documents:", error);
    }
}

function createTable() {
    document.getElementById('searchResultContainer').innerHTML = `<div class="padding-space" id="result-container">
    <div class="card blur animate__animated animate__zoomInDown">
        <div class="card-body info-section">
            <div id="header" class="prevent-select" style="padding: 10px;">
                <h3 id="headerText" style="color: black; text-align: center; padding-top: 10px">ผลการค้นหา
                </h3>
            </div>
            <div id="liveAlertPlaceholder"></div>
        </div>
        <div class="container" style="padding-left: 25px; padding-right: 25px; padding-bottom: 35px;">
            <div class="row justify-content-md-center">
                <div>
                    <h5 class="prevent-select" id="headerText" style="color: black; text-align: center; padding-top: 10px">บทเรียน</h5>
                    <div style="height: 20px;"></div>
                    <div class="text-center" id="lessonContainer" class="resultContainer">ไม่พบประวัติการเรียน</div>
                </div>
                <div style="height: 40px;"></div>
                <div>
                    <h5 class="prevent-select" id="headerText" style="color: black; text-align: center; padding-top: 10px">แบบทดสอบ</h5>
                    <div style="height: 20px;"></div>
                    <div class="text-center" id="testingContainer" class="resultContainer">ไม่พบประวัติการทำแบบทดสอบ</div>
                </div>
                <div style="height: 40px;"></div>
                <div>
                    <h5 class="prevent-select" id="headerText" style="color: black; text-align: center; padding-top: 10px">Challenge</h5>
                    <div style="height: 20px;"></div>
                    <div class="text-center" id="challengeContainer" class="resultContainer">ไม่พบประวัติการทำ Challenge</div>
                </div>
            </div>
        </div>
    </div>
</div>`
}

async function queryPyoneerData() {
    const userEmail = document.getElementById('InputQuery').value;
    const testTypes = ['pre-test', 'post-test'];
    const collectionName = 'testResult';
    const lessonsCollectionName = 'lessons';
    const challengeScoreCollectionName = 'challengeScore';

    try {
        const lessonsCollectionRef = firestore.collection(lessonsCollectionName);
        const lessonsSnapshot = await lessonsCollectionRef.where('email', '==', userEmail).get();

        if (lessonsSnapshot.empty) {
            console.log(`No lesson read status found for ${userEmail}`);
        } else {
            console.log('Lesson Read Status:');
            lessonsSnapshot.forEach(doc => {
                const data = doc.data();
                if (data.timestamp) {
                    const date = data.timestamp.toDate();
                    console.log(doc.id, '=>', data, 'Timestamp:', date.toLocaleString());
                } else {
                    console.log(doc.id, '=>', data);
                }
            });
        }

        const preTestSnapshot = await firestore.collection(collectionName).doc(userEmail).collection('pre-test').get();
        const postTestSnapshot = await firestore.collection(collectionName).doc(userEmail).collection('post-test').get();

        for (const testType of testTypes) {
            const collectionRef = firestore.collection(collectionName).doc(userEmail).collection(testType);
            const snapshot = await collectionRef.get();

            if (snapshot.empty) {
                console.log(`No ${testType} documents found for ${userEmail}`);
            } else {
                console.log(`${testType} Results:`);
                snapshot.forEach(doc => {
                    const data = doc.data();
                    if (data.timestamp) {
                        const date = data.timestamp.toDate();
                        console.log(doc.id, '=>', data, 'Timestamp:', date.toLocaleString());
                    } else {
                        console.log(doc.id, '=>', data);
                    }
                });
            }
        }

        const challengeScoreDocRef = firestore.collection(challengeScoreCollectionName).doc(userEmail);
        const challengeScoreDoc = await challengeScoreDocRef.get();

        if (!challengeScoreDoc.exists) {
            console.log(`No challenge score found for ${userEmail}`);
        } else {
            console.log('Challenge Score:');
            const data = challengeScoreDoc.data();
            if (data.timeStamp) {
                const date = data.timeStamp.toDate();
                console.log(challengeScoreDoc.id, '=>', data, 'Timestamp:', date.toLocaleString());
            } else {
                console.log(challengeScoreDoc.id, '=>', data);
            }
        }
        createTable()
        displayResults(lessonsSnapshot.docs, preTestSnapshot.docs, postTestSnapshot.docs, challengeScoreDoc.data());
    } catch (error) {
        console.error("Error getting documents:", error);
    }
}

function displayResults(lessons, preTests, postTests, challengeScore) {

    let lessonDataCheck
    if (lessons.length > 0) {
        lessons.sort((a, b) => a.data().lessonRead - b.data().lessonRead);
        const lessonsTable = document.createElement('table');
        lessonsTable.classList.add('table', 'table-bordered');
        lessonsTable.style.borderRadius = '10px';
        lessonsTable.style.overflow = 'hidden';
        lessonsTable.innerHTML = `
        <thead>
            <tr>
                <th>บทที่</th>
                <th>เวลาที่อ่าน</th>
            </tr>
        </thead>
        <tbody>
            ${lessons.map(doc => {
            const lessonData = doc.data();
            lessonDataCheck = doc.data();
            return `
                    <tr>
                        <td>${lessonData.lessonRead}</td>
                        <td>${lessonData.timestamp ? lessonData.timestamp.toDate().toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' }) : '-'}</td>
                    </tr>
                `;
        }).join('')}
        </tbody>
    `;

        document.getElementById('lessonContainer').innerHTML = '';
        document.getElementById('lessonContainer').appendChild(lessonsTable);
    } else {
        document.getElementById('lessonContainer').innerHTML = 'ไม่พบประวัติการเรียน';
    }

    const testTypes = ['pre-test', 'post-test'];
    document.getElementById('testingContainer').innerHTML = '';
    testTypes.forEach(testType => {
        const tests = testType === 'pre-test' ? preTests : postTests;
        if (tests.length > 0) {
        tests.sort((a, b) => a.data().lessonTest - b.data().lessonTest);
        const testTable = document.createElement('table');
        testTable.classList.add('table', 'table-bordered');
        testTable.style.borderRadius = '10px';
        testTable.style.overflow = 'hidden';
        testTable.innerHTML = `
            <thead>
                <tr>
                    <th>${testType === 'pre-test' ? 'Pre-test' : 'Post-test'}</th>
                    <th>คะแนน</th>
                    <th>เวลาที่ทำแบบทดสอบ</th>
                </tr>
            </thead>
            <tbody>
                ${tests.map(doc => {
            const testData = doc.data();
            const lessonTest = testData.lessonTest;
            const attemptCount = testData.attemptCount || '';
            return `
                        <tr>
                            <td>บทที่ ${lessonTest}${testType === 'post-test' ? ` (ครั้งที่ ${attemptCount})` : ''}</td>
                            <td>${testData.score}</td>
                            <td>${testData.timestamp ? testData.timestamp.toDate().toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' }) : '-'}</td>
                        </tr>
                    `;
        }).join('')}
            </tbody>
        `;
        document.getElementById('testingContainer').appendChild(testTable);
    } else {
        document.getElementById('testingContainer').innerHTML += `<div>ไม่พบประวัติการทำแบบทดสอบ ${testType === 'pre-test' ? 'ก่อนเรียน' : 'หลังเรียน'}</div>`;
    }
    });

    if (challengeScore) {
    const challengeScoreData = challengeScore;
    const challengeScoreTable = document.createElement('table');
    challengeScoreTable.classList.add('table', 'table-bordered');
    challengeScoreTable.style.borderRadius = '10px';
    challengeScoreTable.style.overflow = 'hidden';
    challengeScoreTable.innerHTML = `
        <thead>
            <tr>
                <th>คะแนน Challenge</th>
                <th>เวลาที่ใช้ทำ Challenge</th>
                <th>วันที่และเวลา</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>${challengeScoreData.score}</td>
                <td>${msToTime(challengeScoreData.timeSpent)}</td>
                <td>${challengeScoreData.timeStamp ? challengeScoreData.timeStamp.toDate().toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' }) : '-'}</td>
            </tr>
        </tbody>
    `;
    document.getElementById('challengeContainer').innerHTML = '';
    document.getElementById('challengeContainer').appendChild(challengeScoreTable);
    }else{
        document.getElementById('challengeContainer').innerHTML = 'ไม่พบประวัติการทำ Challenge';
    }
}

function msToTime(s) {
    var ms = s % 1000;
    s = (s - ms) / 1000;
    var secs = s % 60;
    s = (s - secs) / 60;
    var mins = s % 60;
    var hrs = (s - mins) / 60;

    if (hrs.toString().length == 1) {
        hrs = "0" + hrs
    }
    if (mins.toString().length == 1) {
        mins = "0" + mins
    }
    if (secs.toString().length == 1) {
        secs = "0" + secs
    }
  
    return hrs + ':' + mins + ':' + secs + '.' + ms;
  }