const h1 = document.querySelector("h1");
h1.addEventListener("click", () => {
  window.location.href = "/";
});

const navItem = document.querySelector(".nav-item:last-child");
const signinArea = document.querySelector(".signin-area");
const token = localStorage.getItem("token");

// console.log(`if token${token}`);
function init() {
  if (token) {
    userStatus("login");
  } else {
    userStatus("logout");
  }
}

init();
function userStatus(status) {
  const navMsg = navItem.querySelector("p");
  if (status == "logout") {
    navItem.setAttribute("data-status", "logout");
    navMsg.textContent = "登入/註冊";
    navItem.addEventListener("click", () => {
      console.log("logout nav被點擊");
      signinArea.classList.toggle("none");
    });
  } else if (status == "login") {
    navMsg.textContent = "登出系統";
    navItem.addEventListener("click", () => {
      localStorage.removeItem("token");
      window.location.href = "/";
      navItem.textContent = "登入/註冊";
      navItem.setAttribute("data-status", "logout");
    });
  }
}

const closeBtn = document.querySelectorAll(".close-btn");
closeBtn.forEach((btn) => {
  btn.addEventListener("click", () => {
    signinArea.classList.toggle("none");
  });
});

const signUpForm = document.querySelector(".signup-form");
const toSignup = document.querySelector("#toSignup");
const signInForm = document.querySelector(".sigin-form");
const toSignin = document.querySelector("#toSignin");
const signinBtn = document.querySelector(".sigin-form button");
const signupBtn = document.querySelector(".signup-form button");
const signinMsg = document.querySelector(".signin-msg");
const signupMsg = document.querySelector(".signup-msg");

toSignup.addEventListener("click", () => {
  signInForm.classList.toggle("disabled-form");
  signUpForm.classList.toggle("disabled-form");
  signinMsg.textContent = "";
});

toSignin.addEventListener("click", () => {
  signInForm.classList.toggle("disabled-form");
  signUpForm.classList.toggle("disabled-form");
  signupMsg.textContent = "";
});

const email_regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
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

  const response = await fetch("http://44.219.72.138:3000/api/user/auth", {
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
  console.log(result);
  if ("token" in result) {
    console.log(result.token);
    localStorage.setItem("token", result.token);
    navItem.textContent = "登出系統";
    navItem.setAttribute("data-status", "login");
    window.location.href = "/";
  } else if ("error" in result) {
    console.log(`result = ${result}`);
    signinMsg.textContent = result["message"];
  }
});

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

async function getUserData(token) {
  const response = await fetch("http://44.219.72.138:3000/api/user/auth", {
    method: "GET",
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  const data = await response.json();
  console.log(data);
}
getUserData(token);
