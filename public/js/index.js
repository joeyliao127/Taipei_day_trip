let mrtCtn = document.querySelector(".mrt-ctn");
let mrtList = [];
let mrtPoint;
let attNextPage = true;
let listenMRT;
async function init() {
  const mrtResponse = await fetch("http://44.219.72.138:3000/api/mrts");
  const jsonData = await mrtResponse.json();
  mrtList = jsonData["data"];

  for (let mrt of mrtList) {
    let mrtItem = document.createElement("p");
    mrtItem.textContent = mrt;
    mrtCtn.appendChild(mrtItem);
  }
  mrtPoint = moveMRT();

  const attractionsResponse = await fetch(
    "http://44.219.72.138:3000/api/attractions?page=0"
  );
  const attracitonJson = await attractionsResponse.json();
  makeAttractions(attracitonJson);
  listenMRT = document.querySelectorAll(".mrt-ctn p");
  listenMRTList();
}
init();

window.addEventListener("resize", () => {
  mrtPoint = moveMRT();
  setTimeout(1000);
});
function moveMRT() {
  let mrtCtn = document.querySelector(".mrt-ctn");
  const mrts = document.querySelectorAll(".mrt-ctn p");
  const totalWidth = mrtCtn.scrollWidth;
  let ctnWidth = mrtCtn.offsetWidth;
  let pointer = 0;
  let countWidth = 0;
  let mrtContentWidth = 0;
  let result = [0];
  for (let i = 0; i < mrts.length; i += 1) {
    if (countWidth < ctnWidth) {
      mrtContentWidth = mrts[i].offsetWidth;
      countWidth += mrtContentWidth;
    } else {
      pointer += countWidth - mrtContentWidth;
      result.push(pointer);
      countWidth = mrtContentWidth;
      continue;
    }
  }
  console.log(`total width = ${totalWidth}`);
  console.log(`result = ${result}`);
  return result;
}

function makeAttractions(attraciton) {
  if (!attraciton.data) {
    console.log(`查無結果`);
    const main = document.querySelector("main");
    const noResult = document.createElement("div");
    noResult.classList.add("no-result");
    const text = document.createElement("p");
    text.textContent = "查無結果";
    noResult.appendChild(text);
    main.appendChild(noResult);
    return 0;
  }
  const attractionsCtn = document.querySelector(".attractions-ctn");
  const attracitonData = attraciton.data;
  attNextPage = attraciton.nextPage;

  for (item of attracitonData) {
    let { name, category, mrt, images } = item;
    let attItem = document.createElement("div");
    attItem.classList.add("attractions-item");

    let attPic = document.createElement("div");
    attPic.classList.add("item-pic");
    attPic.setAttribute("aspect-ratio", "2.7 / 2");
    let attImg = document.createElement("img");
    attImg.setAttribute("src", images[0]);
    attImg.setAttribute("alt", `${name}`);
    attImg.setAttribute("width", `100%`);
    attImg.setAttribute("height", `100%`);
    let attName = document.createElement("p");
    attName.textContent = name;
    attPic.appendChild(attImg);
    attPic.appendChild(attName);

    let itemDetails = document.createElement("div");
    itemDetails.classList.add("item-details");
    let attMRT = document.createElement("p");
    attMRT.textContent = mrt;
    let attCategory = document.createElement("p");
    attCategory.textContent = category;
    itemDetails.appendChild(attMRT);
    itemDetails.appendChild(attCategory);
    attItem.appendChild(attPic);
    attItem.appendChild(itemDetails);

    attractionsCtn.appendChild(attItem);
  }
}

function removeAttractions() {
  const oldattractionsCtn = document.querySelector(".attractions-ctn");
  oldattractionsCtn.remove();
  const main = document.querySelector("main");
  const attractionsCtn = document.createElement("div");
  attractionsCtn.classList.add("attractions-ctn");
  main.appendChild(attractionsCtn);
}

function listenMRTList() {
  console.log(`開始監聽MRT List...`);
  listenMRT.forEach((mrt) => {
    const attraction = mrt.textContent;
    const input = document.querySelector("#search-input");
    input.textContent = attraction;
    mrt.addEventListener("click", async () => {
      console.log(`${mrt.textContent}被點擊`);
      const response = await fetch(
        `http://44.219.72.138:3000/api/attraction/${attraction}`
      );
      const data = await response.json();
      removeAttractions();
      makeAttractions(data);
    });
  });
}

const rightArrow = document.querySelector("#right-arrow");
const leftArrow = document.querySelector("#left-arrow");
let pagesPointer = 0;
rightArrow.addEventListener("click", () => {
  if (pagesPointer == mrtPoint.length - 1) {
    return 0;
  }
  pagesPointer += 1;
  console.log(`前進座標為：${mrtPoint[pagesPointer]}`);
  mrtCtn.style.transform = `translateX(-${mrtPoint[pagesPointer]}px)`;
});

leftArrow.addEventListener("click", () => {
  if (pagesPointer == 0) {
    return 0;
  }
  pagesPointer -= 1;
  console.log(`退回座標為：${mrtPoint[pagesPointer]}`);
  mrtCtn.style.transform = `translateX(-${mrtPoint[pagesPointer]}px)`;
});

const searchBtn = document.querySelector("#search-btn");
const searchInput = document.querySelector("#search-input");
searchBtn.addEventListener("click", async () => {
  let attResponse = await fetch(
    `http://44.219.72.138:3000/api/attractions?page=0&keyword=${searchInput.value}`
  );
  let searchJson = await attResponse.json();
  removeAttractions();
  makeAttractions(searchJson);
});
