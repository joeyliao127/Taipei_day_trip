const appID = "137036";
const appKey =
  "app_FDhBRhL40L6cDawWxmrDn0G53tow0cv0YRRQ17ECETBPXdxMZwkQWZPpK4P2";

TPDirect.setupSDK(appID, appKey, "sandbox");

TPDirect.card.setup({
  fields: {
    number: {
      element: ".card-number",
      placeholder: "**** **** **** ****",
      height: "18px",
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
    beginIndex: 6,
    endIndex: 11,
  },
});

// const iframe = document.querySelectorAll("iframe");
// iframe.forEach((item) => {
//   item.style.height = "18px";
//   item.style.padding = "10px";
//   item.style.border = "1px solid #e8e8e8";
//   item.style.borderRadius = "5px";
// });
// console.log(iframe);
// listen for TapPay Field
TPDirect.card.onUpdate(function (update) {
  /* Disable / enable submit button depend on update.canGetPrime  */
  /* ============================================================ */

  // update.canGetPrime === true
  //     --> you can call TPDirect.card.getPrime()
  // const submitButton = document.querySelector('button[type="submit"]')
  //   if (update.canGetPrime) {
  //     // submitButton.removeAttribute('disabled')
  //     $('button[type="submit"]').removeAttr("disabled");
  //   } else {
  //     // submitButton.setAttribute('disabled', true)
  //     $('button[type="submit"]').attr("disabled", true);
  //   }

  /* Change card type display when card type change */
  /* ============================================== */

  // cardTypes = ['visa', 'mastercard', ...]
  //   var newType = update.cardType === "unknown" ? "" : update.cardType;
  //   $("#cardtype").text(newType);

  /* Change form-group style when tappay field status change */
  /* ======================================================= */

  // number 欄位是錯誤的
  if (update.status.number === 2) {
    setNumberFormGroupToError(".card-number-group");
  } else if (update.status.number === 0) {
    setNumberFormGroupToSuccess(".card-number-group");
  } else {
    setNumberFormGroupToNormal(".card-number-group");
  }

  if (update.status.expiry === 2) {
    setNumberFormGroupToError(".expiration-date-group");
  } else if (update.status.expiry === 0) {
    setNumberFormGroupToSuccess(".expiration-date-group");
  } else {
    setNumberFormGroupToNormal(".expiration-date-group");
  }

  if (update.status.ccv === 2) {
    setNumberFormGroupToError(".ccv-group");
  } else if (update.status.ccv === 0) {
    setNumberFormGroupToSuccess(".ccv-group");
  } else {
    setNumberFormGroupToNormal(".ccv-group");
  }
});

const submitBtn = document.querySelector("#submit-btn");

submitBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const tappayStatus = TPDirect.card.getTappayFieldsStatus();
  console.log(tappayStatus);

  if (tappayStatus.canGetPrime === false) {
    alert("can not get prime");
    return;
  }
  TPDirect.card.getPrime(function (result) {
    if (result.status !== 0) {
      alert("get prime error " + result.msg);
      return;
    }
    alert("get prime 成功，prime: " + result.card.prime);
  });
});

// $("form").on("submit", function (event) {
//   event.preventDefault();

//   // fix keyboard issue in iOS device
//   forceBlurIos();

//   const tappayStatus = TPDirect.card.getTappayFieldsStatus();
//   console.log(tappayStatus);

//   // Check TPDirect.card.getTappayFieldsStatus().canGetPrime before TPDirect.card.getPrime
//   if (tappayStatus.canGetPrime === false) {
//     alert("can not get prime");
//     return;
//   }

//   // Get prime
//   TPDirect.card.getPrime(function (result) {
//     if (result.status !== 0) {
//       alert("get prime error " + result.msg);
//       return;
//     }
//     alert("get prime 成功，prime: " + result.card.prime);
//     var command = `
//             Use following command to send to server \n\n
//             curl -X POST https://sandbox.tappaysdk.com/tpc/payment/pay-by-prime \\
//             -H 'content-type: application/json' \\
//             -H 'x-api-key: partner_6ID1DoDlaPrfHw6HBZsULfTYtDmWs0q0ZZGKMBpp4YICWBxgK97eK3RM' \\
//             -d '{
//                 "partner_key": "partner_6ID1DoDlaPrfHw6HBZsULfTYtDmWs0q0ZZGKMBpp4YICWBxgK97eK3RM",
//                 "prime": "${result.card.prime}",
//                 "amount": "1",
//                 "merchant_id": "GlobalTesting_CTBC",
//                 "details": "Some item",
//                 "cardholder": {
//                     "phone_number": "+886923456789",
//                     "name": "王小明",
//                     "email": "LittleMing@Wang.com",
//                     "zip_code": "100",
//                     "address": "台北市天龍區芝麻街1號1樓",
//                     "national_id": "A123456789"
//                 }
//             }'`.replace(/                /g, "");
//     document.querySelector("#curl").innerHTML = command;
//   });
// });

function setNumberFormGroupToError(selector) {
  selector.classList.add("has-error");
  selector.classList.add("has-success");
}

function setNumberFormGroupToSuccess(selector) {
  selector.classList.add("has-error");
  selector.classList.add("has-success");
}

function setNumberFormGroupToNormal(selector) {
  selector.classList.add("has-error");
  selector.classList.add("has-success");
}
