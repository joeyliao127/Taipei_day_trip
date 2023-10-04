let currentURL = window.location.href;
let orderNumber = currentURL.split("=")[1];
const ttoken = window.localStorage.getItem("token");
if (!ttoken) {
  window.location.href = "/";
}
async function init() {
  const response = await fetch(`/api/order/${orderNumber}`, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + ttoken,
    },
  });
  const orderData = await response.json();
  createElement(orderData);
}

init();

function createElement(orderData) {
  const main = document.querySelector("main");
  main.innerHTML = `<div class="order-ctn flex">
  <h2>感謝您訂購此行程</h2>
  <div class="flex">
    <p>訂單編號：${orderData.data.number}</p>
  </div>
  <div class="flex">
    <p>聯絡人姓名：<span>${orderData.data.contact.name}</span></p>
    <p>聯絡人信箱：<span>${orderData.data.contact.email}</span></p>
    <p>聯絡人手機號碼：<span>${orderData.data.contact.phone}</span></p>
  </div>
  <div class="flex">
    <p>旅遊景點：<span>${orderData.data.trip.attraction.name}</span></p>
    <p>日期：<span>${orderData.data.trip.date}</span></p>
    <p>時間：<span>${orderData.data.trip.time}</span></p>
  </div>
  <div class="orderStatus flex">
    <p>費用：${orderData.data.price}</p>
    <p>訂單狀態：<span id="payment">已付款</span></p>
  </div>
  <a href="/">返回首頁</a>
</div>`;
}
