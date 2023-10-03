const submitBtn = document.querySelector("#submit-btn");
submitBtn.disabled = true;

function setPayment(name, id, email, data) {
  const appID = "137036";
  const appKey =
    "app_FDhBRhL40L6cDawWxmrDn0G53tow0cv0YRRQ17ECETBPXdxMZwkQWZPpK4P2";

  TPDirect.setupSDK(appID, appKey, "sandbox");
  TPDirect.card.setup({
    fields: {
      number: {
        element: ".card-number",
        placeholder: "**** **** **** ****",
      },
      expirationDate: {
        element: ".card-exp",
        placeholder: "MM / YY",
      },
      ccv: {
        element: ".card-ccv",
        placeholder: "CVV",
      },
    },
    styles: {
      input: {
        color: "gray",
        height: "16px",
      },
      "input.ccv": {
        // 'font-size': '16px'
      },
      ":focus": {
        color: "black",
      },
      ".valid": {
        color: "green",
      },
      ".invalid": {
        color: "red",
      },
      "@media screen and (max-width: 400px)": {
        input: {
          color: "orange",
        },
      },
    },
    isMaskCreditCardNumber: true,
    maskCreditCardNumberRange: {
      beginIndex: 0,
      endIndex: 11,
    },
  });

  submitBtn.addEventListener("click", (e) => {
    e.preventDefault();
    TPDirect.card.getPrime(async function (result) {
      if (result.status !== 0) {
        alert("get prime error " + result.msg);
        return;
      }
      console.log("get prime 成功，prime: " + result.card.prime);

      const contact = getUserInputValue();
      let { attraction, date, time, price } = data["data"];
      const obj = {
        prime: result.card.prime,
        order: {
          price,
          trip: {
            attraction,
          },
          date,
          time,
        },
        contact,
      };

      console.log(`obj = ${obj}`);
      console.log(obj);
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: obj,
      });
    });
  });
}

let inputStatus = {
  name: true,
  email: true,
  phone: false,
};
let isCardAllValue = false;
let isUserAllValue = false;

function listenInputEvent() {
  const name = document.querySelector("#name");
  const email = document.querySelector("#email");
  const phone = document.querySelector("#phoneNumber");
  name.addEventListener("input", () => {
    checkCardInput();
    const value = name.value;
    if (value) {
      name.style.color = "green";
      name.style.border = "1px solid green";
      inputStatus.name = true;
    } else {
      name.style.border = "1px solid red";
      inputStatus.name = false;
    }
    checkUserInput();
  });
  email.addEventListener("input", () => {
    checkCardInput();
    const value = email.value;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (emailRegex.test(value)) {
      email.style.color = "green";
      email.style.border = "1px solid green";
      inputStatus.email = true;
    } else {
      email.style.color = "red";
      email.style.border = "1px solid red";
      inputStatus.email = false;
    }
    checkUserInput();
  });
  phone.addEventListener("input", () => {
    checkCardInput();
    const value = phone.value;
    const phoneNumberRegex = /^09\d{8}$/;
    if (phoneNumberRegex.test(value)) {
      phone.style.color = "green";
      phone.style.border = "1px solid green";
      inputStatus.phone = true;
      console.log(`phone value已合法`);
    } else {
      phone.style.color = "red";
      phone.style.border = "1px solid red";
      inputStatus.phone = false;
      console.log(`phone value不合法`);
    }
    checkUserInput();
  });
}

function checkCardInput() {
  console.log(`check card 使用者輸入的3個input boolean:`);
  console.log(inputStatus);
  TPDirect.card.onUpdate(function (update) {
    checkUserInput();
    if (update.canGetPrime) {
      console.log(`isCarAllvalue轉為true`);
      isCardAllValue = true;
    } else {
      console.log(`isCardAllValue轉為false`);
      isCardAllValue = false;
    }
    if (update.canGetPrime && isUserAllValue) {
      enabledBtn();
    } else {
      disabledBtn();
    }
    console.log(
      `在checkCardInput，當前狀態： \nisUserValue = ${isUserAllValue}\nisCardValue = ${isCardAllValue}`
    );
  });
}

function checkUserInput() {
  console.log(`check user使用者輸入的3個input boolean:`);
  console.log(inputStatus);
  if (inputStatus.name && inputStatus.email && inputStatus.phone) {
    isUserAllValue = true;
  } else {
    isUserAllValue = false;
  }
  console.log(
    `在checkUserInput，當前狀態： \nisUerAllValue = ${isUserAllValue}\nisCardValue = ${isCardAllValue}`
  );
  if (isUserAllValue && isCardAllValue) {
    enabledBtn();
  } else {
    disabledBtn();
  }
}

function enabledBtn() {
  submitBtn.disabled = false;
  submitBtn.classList.remove("submit-btn-disabled");
  submitBtn.classList.add("submit-btn-enabled");
}

function disabledBtn() {
  submitBtn.disabled = true;
  submitBtn.classList.remove("submit-btn-enabled");
  submitBtn.classList.add("submit-btn-disabled");
}

function getUserInputValue() {
  const name = document.querySelector("#name").value;
  const email = document.querySelector("#email").value;
  const phone = document.querySelector("#phoneNumber").value;
  const contact = {
    name,
    email,
    phone,
  };
  return contact;
}

// if (inputStatus.email && inputStatus.name && inputStatus.phone) {
//   console.log(`所有input皆為true`);
//   checkUserInput = true;
// } else {
//   console.log(
//     `有某個input為false： name = ${inputStatus.name}, email = ${inputStatus.email}, phone = ${inputStatus.phone}`
//   );
// }
// console.log(`執行card檢查`);
