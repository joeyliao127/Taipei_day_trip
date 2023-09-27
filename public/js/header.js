const h1 = document.querySelector("h1");
h1.addEventListener("click", () => {
  window.location.href = "/";
});

const signUpForm = document.querySelector(".signup-form");
const toSignup = document.querySelector("#toSignup");
const signInForm = document.querySelector(".sigin-form");
const toSignin = document.querySelector("#toSignin");
const signinBtn = document.querySelector(".sigin-form button");
const signupBtn = document.querySelector(".signup-form button");
const signinMsg = document.querySelector(".signin-msg");
const signupMsg = document.querySelector(".signup-msg");
const token = localStorage.getItem("token");
async function init() {
  await checkUserStatus();
  listenOrderBtn();
}

init();

async function checkUserStatus() {
  // console.log("checkUserStatus的token:", token);
  let userData;
  if (token) {
    userData = await getUserData(token);
    // console.log("透過token fetch到api後，取得的使用者資訊：", userData);
  } else {
    userData = null;
  }
  // console.log("userData = ", userData);
  if (userData) {
    clickSignout();
  } else {
    showSigninForm();
  }
  switchSignup();
  switchSignin();
  clickSigin();
  clickSignup();
  clickClose();
}

async function getUserData(token) {
  const response = await fetch("http://127.0.0.1:3000/api/user/auth", {
    method: "GET",
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  const data = await response.json();
  const userData = data["data"];
  // console.log("Fetch完成decode後的token:", userData);
  return userData;
}

function clickSignout() {
  const navItem = document.querySelector(".nav-item:last-child");
  const navMsg = navItem.querySelector("p");
  navMsg.textContent = "登出系統";
  navItem.addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  });
}

function showSigninForm() {
  const navItem = document.querySelector(".nav-item:last-child");
  const navMsg = navItem.querySelector("p");
  const signinArea = document.querySelector(".signin-area");
  navMsg.textContent = "登入/註冊";
  navItem.addEventListener("click", () => {
    signinArea.classList.toggle("none");
  });
  clickClose(signinArea);
}

function switchSignup() {
  toSignup.addEventListener("click", () => {
    signInForm.classList.toggle("disabled-form");
    signUpForm.classList.toggle("disabled-form");
    signinMsg.textContent = "";
  });
}

function switchSignin() {
  toSignin.addEventListener("click", () => {
    signInForm.classList.toggle("disabled-form");
    signUpForm.classList.toggle("disabled-form");
    signupMsg.textContent = "";
  });
}
const email_regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

function clickSigin() {
  const signinEmail = document.querySelector("#signin-email");
  const signinPassword = document.querySelector("#signin-password");
  signinBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    const email = signinEmail.value;
    const password = signinPassword.value;
    if (!password && !email) {
      signinMsg.textContent = "請輸入完整資訊";
      return 0;
    }
    if (!email_regex.test(email)) {
      signinMsg.textContent = "請輸入正確格式的Email";
      return 0;
    }

    const response = await fetch("http://127.0.0.1:3000/api/user/auth", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: signinEmail.value,
        password: signinPassword.value,
      }),
    });

    const result = await response.json();
    const navItem = document.querySelector(".nav-item:last-child p");
    if ("token" in result) {
      localStorage.setItem("token", result.token);
      navItem.textContent = "登出系統";
      const currentURL = window.location.href;
      window.location.href = currentURL;
    } else {
      console.log(`result = ${result}`);
      signinMsg.textContent = result["message"];
    }
  });
}

function clickSignup() {
  const signupEmail = document.querySelector("#signup-email");
  const signupName = document.querySelector("#signup-name");
  const signupPassword = document.querySelector("#signup-password");
  signupBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    const email = signupEmail.value;
    const name = signupName.value;
    const password = signupPassword.value;

    if (!email && !name && !password) {
      signupMsg.textContent = "請填寫完整資訊";
      return 0;
    }
    if (!email_regex.test(email)) {
      signupMsg.textContent = "請填寫正確的email格式";
      return 0;
    }
    const response = await fetch("/api/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        email: email,
        password: password,
      }),
    });
    const result = await response.json();

    if ("ok" in result) {
      signupMsg.setAttribute("style", "color: green;");
      signupMsg.textContent = "註冊成功！";
    } else if ("error" in result) {
      signupMsg.textContent = result["message"];
    }
  });
}

function clickClose(signinArea) {
  const closeBtn = document.querySelectorAll(".close-btn");
  closeBtn.forEach((btn) => {
    btn.addEventListener("click", () => {
      signinArea.classList.toggle("none");
    });
  });
}

function listenOrderBtn() {
  const orderBtn = document.querySelector(".nav-item:first-child");

  orderBtn.addEventListener("click", () => {
    console.log("orderBtn被點擊");
    if (token) {
      console.log("導向booking");
      window.location.href = "/booking";
    } else {
      console.log("顯示signin form");
      const signinArea = document.querySelector(".signin-area");
      signinArea.classList.toggle("none");
    }
  });
}
