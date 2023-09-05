async function init() {
  const response = await fetch("http://44.219.72.138:3000/api/mrts");
  const mrts = response.json();
  console.log(mrts);
}
init();

const mrts = document.querySelectorAll(".mrt-ctn p");
const rightArrow = document.querySelector("#right-arrow");
const leftArrow = document.querySelector("#left-arrow");
const mrtCtn = document.querySelector(".mrt-ctn");
const totalWidth = mrtCtn.scrollWidth;
let ctnWidth = mrtCtn.offsetWidth;
let pointer = 0;
let firstP = 0;

rightArrow.addEventListener("click", () => {
  let countWidth = 0;
  let temp = 0;
  let flag = 0;
  //   console.log(`觀察firtP的數值：${firstP}`);
  //   console.log(`執行幾次${mrts.length - firstP}, mrt長度：${mrts.length}`);
  if (pointer == totalWidth) {
    return 0;
  }
  for (let i = firstP; i < mrts.length; i += 1) {
    //計算p標籤總寬度，如果不到ctn寬度就繼續加。
    if (countWidth < ctnWidth) {
      //   console.log(
      //     `取出第${i}個景點：${mrts[i]} \n長度為：${mrts[i].offsetWidth}`
      //   );
      temp = mrts[i].offsetWidth;
      countWidth += temp;
      //   console.log(`countWidth累加器：${countWidth}`);
    } else {
      //   console.log(
      //     `countWidth超過，扣掉上一次的temp = ${temp}, 結果：${countWidth - temp}`
      //   );
      pointer += countWidth - temp;
      flag -= 1;
      break;
    }
    flag += 1;
  }
  console.log(`firstP加上i, flag = ${flag}`);
  firstP += flag;
  mrtCtn.style.transform = `translateX(-${pointer}px)`;
  //   console.log(`firstP = ${firstP}`);
  //   console.log(`Pointer = ${pointer}`);
  //   console.log(`ctnWidth = ${ctnWidth}`);
  //   console.log(`totalWidth = ${totalWidth}`);
  //   console.log("=========================================");
});

leftArrow.addEventListener("click", () => {
  let countWidth = 0;
  let temp = 0;
  let flag = 0;
  if (pointer == 0) {
    return 0;
  }
  for (let i = firstP; i < mrts.length; i += 1) {
    //計算p標籤總寬度，如果不到ctn寬度就繼續加。
    if (countWidth < ctnWidth) {
      //   console.log(
      //     `取出第${i}個景點：${mrts[i]} \n長度為：${mrts[i].offsetWidth}`
      //   );
      temp = mrts[i].offsetWidth;
      countWidth += temp;
      //   console.log(`countWidth累加器：${countWidth}`);
    } else {
      //   console.log(
      //     `countWidth超過，扣掉上一次的temp = ${temp}, 結果：${countWidth - temp}`
      //   );
      pointer += countWidth - temp;
      flag -= 1;
      break;
    }
    flag += 1;
  }
  console.log(`firstP加上i, flag = ${flag}`);
  firstP += flag;
  mrtCtn.style.transform = `translateX(-${pointer}px)`;
});
// rightArrow.addEventListener("click", () => {
//     let countWidth = 0;
//     let temp = 0;
//     let flag = 0;
//   //   console.log(`觀察firtP的數值：${firstP}`);
//   //   console.log(`執行幾次${mrts.length - firstP}, mrt長度：${mrts.length}`);
//     for (let i = firstP; i < mrts.length; i += 1) {
//       //計算p標籤總寬度，如果不到ctn寬度就繼續加。
//       if (countWidth < ctnWidth) {
//       //   console.log(
//       //     `取出第${i}個景點：${mrts[i]} \n長度為：${mrts[i].offsetWidth}`
//       //   );
//         temp = mrts[i].offsetWidth;
//         countWidth += temp;
//       //   console.log(`countWidth累加器：${countWidth}`);
//       } else {
//       //   console.log(
//       //     `countWidth超過，扣掉上一次的temp = ${temp}, 結果：${countWidth - temp}`
//       //   );
//         pointer += countWidth - temp;
//         flag -= 1;
//         break;
//       }
//       flag += 1;
//     }
//     console.log(`firstP加上i, flag = ${flag}`);
//     firstP += flag;
//     mrtCtn.style.transform = `translateX(-${pointer}px)`;
//   //   console.log(`firstP = ${firstP}`);
//   //   console.log(`Pointer = ${pointer}`);
//     //   console.log(`ctnWidth = ${ctnWidth}`);
//     //   console.log(`totalWidth = ${totalWidth}`);
//   //   console.log("=========================================");
//   });
