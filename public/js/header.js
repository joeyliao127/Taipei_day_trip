const h1 = document.querySelector("h1");
h1.addEventListener("click", () => {
  window.location.href = "/";
});

const navItem = document.querySelector(".nav-item:last-child");
const signinArea = document.querySelector(".signin-area");
const token = localStorage.getItem("token");

function init() {
  userStatus();
}

init();

async function userStatus() {
  const navMsg = navItem.querySelector("p");
  let userData;
  if (token) {
    const response = await fetch("http://127.0.0.1:3000/api/user/auth", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    const data = await response.json();
    userData = data["data"];
  } else {
    const response = await fetch("http://127.0.0.1:3000/api/user/auth");
    const data = await response.json();
    userData = data["data"];
  }

  if (userData) {
    console.log(userData);
    navMsg.textContent = "登出系統";
    navItem.addEventListener("click", () => {
      localStorage.removeItem("token");
      window.location.href = "/";
    });
  } else {
    navMsg.textContent = "登入/註冊";
    navItem.addEventListener("click", () => {
      signinArea.classList.toggle("none");
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
