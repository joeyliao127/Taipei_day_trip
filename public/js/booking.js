let bookingToken = localStorage.getItem("token");

async function init() {
  if (bookingToken == null) {
    window.location.href = "/";
  }
  const userData = await decodeToken(bookingToken);
  const { name } = userData["data"];
  const h2 = document.querySelector("#username");
  h2.textContent = name;
  const data = await getOrderInfo();
  console.log(`data = ${data}`);
  if (data == false) {
    disableForm(name);
  } else {
    await createDetailCtn(data);
    deleteOrder();
  }
}

init();

function disableForm(name) {
  const userInfoForm = document.querySelector(".userInfo");
  const cardInfoForm = document.querySelector(".cardInfo");
  const confirm = document.querySelector(".confirm");
  console.log(userInfoForm, cardInfoForm, confirm);
  userInfoForm.setAttribute("style", "display: none");
  cardInfoForm.setAttribute("style", "display: none");
  confirm.setAttribute("style", "display: none");
  const h2 = document.querySelector(".welcomeMsg");
  h2.textContent = `您好，${name}，待預定的行程如下：`;
  const wrapper = document.querySelector(".booking-wrapper");
  const msg = document.createElement("p");
  msg.id = "text";
  msg.textContent = "目前沒有任何待預定的行程";
  wrapper.appendChild(msg);
  const footer = document.querySelector("footer");
  footer.setAttribute("style", "min-height: calc(100vh - 221px)");
}
async function createDetailCtn(data) {
  let { attraction, date, time, price } = data["data"];
  let { id, name, address, image } = attraction;

  //   console.log(
  //     `所有的資訊：date:\n${date}\ntime:${time}\nprice:${price}\nid:${id}\nname:${name}\naddress:${address}\nimage:${image}`
  //   );
  const wrapper = document.querySelector(".booking-wrapper");
  const detailCtn = document.createElement("div");
  detailCtn.classList.add("detail-ctn");
  const attImg = document.createElement("div");
  attImg.classList.add("att-img");
  const img = document.createElement("img");
  img.setAttribute("src", image);
  attImg.appendChild(img);
  const attInfo = document.createElement("div");
  attInfo.classList.add("att-info");
  const attName = document.createElement("h2");
  attName.textContent = `台北一日遊：${name}`;
  const orderDate = document.createElement("p");
  orderDate.textContent = `日期：${date}`;
  const orderTime = document.createElement("p");
  if (time == "morning") {
    orderTime.textContent = `時間：上午`;
  } else {
    orderTime.textContent = `時間：下午`;
  }
  const orderPrice = document.createElement("p");
  orderPrice.textContent = `費用 ${price}`;
  const orderAddress = document.createElement("p");
  orderAddress.textContent = `地點：${address}`;
  const delIcon = document.createElement("img");
  delIcon.id = "del-icon";
  delIcon.setAttribute("src", "/pic/delete.png");
  attInfo.appendChild(attName);
  attInfo.appendChild(orderDate);
  attInfo.appendChild(orderTime);
  attInfo.appendChild(orderPrice);
  attInfo.appendChild(orderAddress);
  attInfo.appendChild(delIcon);
  detailCtn.appendChild(attImg);
  detailCtn.appendChild(attInfo);
  wrapper.appendChild(detailCtn);
  const setPrice = document.querySelector("#price");
  setPrice.textContent = price;
}

async function decodeToken() {
  const response = await fetch("/api/user/auth", {
    method: "GET",
    headers: {
      Authorization: "Bearer " + bookingToken,
    },
  });
  const userData = response.json();
  return userData;
}

async function getOrderInfo() {
  const response = await fetch("/api/booking", {
    method: "GET",
    headers: {
      Authorization: "Bearer " + bookingToken,
    },
  });
  const data = await response.json();
  if (data["data"] == false) {
    return false;
  }
  return data;
}

function deleteOrder() {
  const delBtn = document.querySelector("#del-icon");
  delBtn.addEventListener("click", async () => {
    const response = await fetch("/api/booking", {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    const result = await response.json();
    if ("ok" in result) {
      window.location.href = "/";
    }
  });
}
