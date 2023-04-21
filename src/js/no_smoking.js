import { Plugins } from '@capacitor/core';
const Http = Plugins.Http;

const TOKEN = 'FRS6P4TO9wyXNgJkzi6WKm91LaXpW0Ob7QZWa5Jic0t';
const URL = 'https://notify-api.line.me/api/notify';

let smokingCount = parseInt(localStorage.getItem('smokingCount') || '0');
let boxCount = Math.floor(smokingCount / 20);
let totalSpent = boxCount * 550;

//月判定
let monthDate = parseInt(localStorage.getItem("monthDate") || new Date().getMonth().toString());
//今月のデータ計算用
let month_conter = parseInt(localStorage.getItem("monthConter") || '0');


const dateElement = document.getElementById('date');
//起動したことがある場合
if (localStorage.getItem('startDate')) {
  //前回起動時の月と違う場合
  if (monthDate !== new Date().getMonth()){
    localStorage.setItem("monthDate", new Date().getMonth());
    localStorage.setItem("lastMonthConter", month_conter);
    
    sendLineNotify(`先月は合計で${month_conter}本吸って、${Math.floor(month_conter /20 * 550)}円使いました(小数点は省略)`);
    
    localStorage.setItem("monthConter", 0);
    localStorage.setItem("monthMoney", 0);

  }
  const startDateObj = new Date(localStorage.getItem('startDate'));
  const currentDateObj = new Date();
  const elapsedDays = Math.floor((currentDateObj - startDateObj) / (1000 * 60 * 60 * 24));
  const formattedStartDate = startDateObj.toLocaleString('ja-JP');
  dateElement.textContent = `${formattedStartDate}に初起動し、現在までに${elapsedDays}日経過しました`;
  updateUI();
} else {
  //初起動の場合
  const currentDateObj = new Date();
  const formattedStartDate = currentDateObj.toLocaleString('ja-JP');
  localStorage.setItem('startDate', formattedStartDate);
  dateElement.textContent = `${formattedStartDate}に初起動しました`;
  localStorage.setItem("monthDate", new Date().getMonth());
  updateUI();
}

function updateLocalStorage() {
  localStorage.setItem('smokingCount', smokingCount);
  localStorage.setItem('boxCount', boxCount);
  localStorage.setItem('totalSpent', totalSpent);

  localStorage.setItem("monthConter", month_conter);
}
function updateUI() {
  document.getElementById('box_count').textContent = `${boxCount}箱目です`;
  document.getElementById('smoking_count').textContent = `${smokingCount}本目の喫煙です`;
  document.getElementById('total_spent').textContent = `合計で${totalSpent}円を使いました`;
}

function sendLineNotify(message) {
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Authorization': `Bearer ${TOKEN}`
  };
  const data = { message };
  const options = {
    method: 'POST',
    url: URL,
    headers: headers,
    data: data,
    request: {
      timeout: 10000
    }
  };
  Http.request(options)
    .then(() => alert("メッセージを送信しました"))
    .catch((err) => console.error(err));
}

document.getElementById('smoking_conter').addEventListener('click', function () {
  smokingCount++;
  month_conter++;
  console.log(month_conter);
  boxCount = Math.floor(smokingCount / 20);
  totalSpent = boxCount * 550;
  updateLocalStorage();
  updateUI();
});

document.getElementById('box_conter').addEventListener('click', function () {
  smokingCount += 20;
  month_conter += 20;
  console.log(month_conter);
  boxCount = Math.floor(smokingCount / 20);
  totalSpent = boxCount * 550;
  updateLocalStorage();
  updateUI();
});

document.getElementById('message_btn').addEventListener('click', function () {
  sendLineNotify('たばこ切れた');
});