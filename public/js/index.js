let mrtCtn = document.querySelector(".mrt-ctn");
let mrtList = [];
let mrtPoint;
let attNextPage = true;
let listenMRT;

async function init() {
  const attractionsResponse = await fetch(
    "http://44.219.72.138:3000/api/attractions?page=0"
  );
  const attracitonJson = await attractionsResponse.json();
  makeAttractions(attracitonJson);

  const mrtResponse = await fetch("http://44.219.72.138:3000/api/mrts");
  const jsonData = await mrtResponse.json();
  mrtList = jsonData["data"];

  for (let mrt of mrtList) {
    let mrtItem = document.createElement("p");
    mrtItem.textContent = mrt;
    mrtCtn.appendChild(mrtItem);
  }
  mrtPoint = moveMRT();

  listenMRT = document.querySelectorAll(".mrt-ctn p");
  listenMRTList();
}
init();

window.addEventListener("resize", () => {
  mrtPoint = moveMRT();
});
function moveMRT() {
  let mrtCtn = document.querySelector(".mrt-ctn");
  const mrts = document.querySelectorAll(".mrt-ctn p");
  const totalWidth = mrtCtn.scrollWidth; //MRT 文字總寬度
  let ctnWidth = mrtCtn.offsetWidth; //MRT CTN顯示總寬度
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
      countWidth = mrtContentWidth + mrts[i].offsetWidth;
      continue;
    }
  }

  return result;
}

function makeAttractions(attraciton, keyword) {
  if (!attraciton.data) {
    const ctn = document.querySelector(".attractions-ctn");
    ctn.setAttribute("style", "padding: 200px;");
    const noResult = document.createElement("div");
    noResult.classList.add("no-result");
    const text = document.createElement("p");
    text.textContent = "查無結果";
    noResult.appendChild(text);
    ctn.appendChild(noResult);
    return 0;
  }
  const attractionsCtn = document.querySelector(".attractions-ctn");
  const attracitonData = attraciton.data;
  attNextPage = attraciton.nextPage;

  for (item of attracitonData) {
    let { id, name, category, mrt, images } = item;
    let aTag = document.createElement("a");
    aTag.setAttribute("href", `/attraction/${id}`);
    let attItem = document.createElement("div");
    attItem.classList.add("attraction-item");

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
    aTag.appendChild(attItem);

    attractionsCtn.appendChild(aTag);
  }
  observeListItem(attNextPage, keyword);
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
  listenMRT.forEach((mrt) => {
    const attraction = mrt.textContent;
    const input = document.querySelector("#search-input");
    mrt.addEventListener("click", async () => {
      input.value = attraction;
      console.log(`${attraction}被點擊`);
      const response = await fetch(
        `http://44.219.72.138:3000/api/attractions?page=0&keyword=${attraction}`
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
  mrtCtn.style.transform = `translateX(-${mrtPoint[pagesPointer]}px)`;
});

leftArrow.addEventListener("click", () => {
  if (pagesPointer == 0) {
    return 0;
  }
  pagesPointer -= 1;
  mrtCtn.style.transform = `translateX(-${mrtPoint[pagesPointer]}px)`;
});

const searchBtn = document.querySelector("#search-btn");

searchBtn.addEventListener("click", async () => {
  const searchInput = document.querySelector("#search-input");
  const keyword = searchInput.value;
  let attResponse = await fetch(
    `http://44.219.72.138:3000/api/attractions?page=0&keyword=${keyword}`
  );
  let searchJson = await attResponse.json();
  removeAttractions();
  makeAttractions(searchJson, keyword);
});

async function lazyLoading(nextPage, keyword = null) {
  if (keyword) {
    const response = await fetch(
      `http://44.219.72.138:3000/api/attractions?page=${nextPage}&keyword=${keyword}`
    );
    const data = await response.json();
    makeAttractions(data);
  } else {
    const response = await fetch(
      `http://44.219.72.138:3000/api/attractions?page=${nextPage}`
    );
    const data = await response.json();
    makeAttractions(data);
  }
}

function observeListItem(nextPage, keyword) {
  const attractionItem = document.querySelectorAll(".attraction-item");
  const observer = new IntersectionObserver((entries) => {
    let observed = entries[0].isIntersecting;
    if (observed) {
      observer.unobserve(entries[0].target);
      if (nextPage) {
        lazyLoading(nextPage, keyword);
      }
    }
  });

  //觀察最後一個attractions-item
  observer.observe(attractionItem[attractionItem.length - 1]);
}
