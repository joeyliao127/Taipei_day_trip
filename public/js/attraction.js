const currentURL = window.location.href;
const url_split = currentURL.split("/");
const id = url_split[url_split.length - 1];
const fetchURL = `http://44.219.72.138:3000/api/attraction/${id}`;

const picItem = document.querySelector(".attractionImg img");
const attractionName = document.querySelector("h2");
const mrtName = document.querySelector("#mrt");
const catName = document.querySelector("#cat");
const introText = document.querySelector(".introText p");
const addressText = document.querySelector(".address p:last-child");
const trafficText = document.querySelector(".traffic p:last-child");

async function init() {
  const response = await fetch(fetchURL);
  const data = await response.json();
  let { name, category, address, mrt, transport, images, description } =
    data.data;
  picItem.setAttribute("src", images[0]);
  attractionName.textContent = name;
  mrtName.textContent = mrt;
  catName.textContent = category;
  introText.textContent = description;
  addressText.textContent = address;
  trafficText.textContent = transport;
  const quantity = images.length;
  createPoint(quantity);
  listenArrowClick(images, picItem);
  clickBooking();
}

init();

const radioMorning = document.querySelector("#morning");
const radioAfternoon = document.querySelector("#afternoon");
let price = document.querySelector("#price");
radioMorning.addEventListener("change", () => {
  price.textContent = "2000";
});
radioAfternoon.addEventListener("change", () => {
  price.textContent = "2500";
});

function listenArrowClick(images, picItem) {
  const arrowLeft = document.querySelector("#arrow-left");
  const arrowRight = document.querySelector("#arrow-right");
  const point = document.querySelectorAll(".point-item");
  let flag = 0;
  point[flag].classList.toggle("point-item-selected");
  //   point[0].classList.toggle(".point-item-selected");
  arrowRight.addEventListener("click", () => {
    if (flag != images.length - 1) {
      point[flag].classList.toggle("point-item-selected");
      flag += 1;
      point[flag].classList.toggle("point-item-selected");
      picItem.setAttribute("src", images[flag]);
    } else {
      point[flag].classList.toggle("point-item-selected");
      flag = 0;
      point[flag].classList.toggle("point-item-selected");
      picItem.setAttribute("src", images[flag]);
    }
  });
  arrowLeft.addEventListener("click", () => {
    if (flag) {
      point[flag].classList.toggle("point-item-selected");
      flag -= 1;
      point[flag].classList.toggle("point-item-selected");
      picItem.setAttribute("src", images[flag]);
    } else {
      point[flag].classList.toggle("point-item-selected");
      flag = images.length - 1;
      point[flag].classList.toggle("point-item-selected");
      picItem.setAttribute("src", images[flag]);
    }
  });
}

function createPoint(quantity) {
  const pointCtn = document.querySelector(".point-ctn");
  for (let i = 0; i < quantity; i++) {
    const point = document.createElement("div");
    point.classList.add("point-item");
    pointCtn.appendChild(point);
  }
}

function clickBooking() {
  const token = localStorage.getItem("token");
  const bookingBtn = document.querySelector("#order-form button");
  bookingBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    if (token == null) {
      const signinArea = document.querySelector(".signin-area");
      signinArea.classList.toggle("none");
    }
    const dateElement = document.querySelector("#date");
    const date = dateElement.value;
    if (!date) {
      const alert = document.querySelector(".date-ctn span");
      console.log("alert", alert);
      alert.setAttribute("style", "color: red");
      alert.textContent = "(請填寫日期)";
      return 0;
    }
    const url = window.location.href;
    const temp = url.split("/");
    const attractionId = parseInt(temp[temp.length - 1]);
    const morning = document.querySelector("#morning");
    const afternoon = document.querySelector("#afternoon");
    let time;
    if (morning.checked) {
      time = "morning";
    } else if (afternoon.checked) {
      time = "afternoon";
    }
    const priceElement = document.querySelector("#price");
    const price = priceElement.textContent;
    // console.log(
    //   `提交的資訊為：\natt-id:${attractionId}\ndate:${date}\ntime:${time}\nprice:${price}}`
    // );
    const response = await fetch("/api/booking", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        attractionId: attractionId,
        date: date,
        time: time,
        price: price,
      }),
    });
    const data = await response.json();
    if ("ok" in data) {
      window.location.href = "/booking";
    }
  });
}
