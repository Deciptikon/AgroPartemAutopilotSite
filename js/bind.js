import {
  DEFAULT_TEXT_CODE_VIEW,
  SERIAL_KEY,
  BASE_URL,
  SECRET_KEY,
} from "./config.js";
import { sendDataToServer } from "./crypto-utils.js";

const serialKeyInput = document.getElementById("serialKeyInput");
const codeView = document.getElementById("codeView");
const updBtn = document.getElementById("updBtn");

let intervalId = null;

document.addEventListener("DOMContentLoaded", function () {
  const serialKey = localStorage.getItem(SERIAL_KEY);
  serialKeyInput.value = serialKey;
  codeView.textContent = DEFAULT_TEXT_CODE_VIEW;

  setTimeout(function () {
    //codeView.textContent = createTextCode("183469");
    startInterval(updateCodeView, 10000);
  }, 1000);
});

updBtn.addEventListener("click", async () => {
  updateCodeView();
});

function createTextCode(code) {
  return `${code}`.split("").join(" ");
}

function updateCodeView() {
  const result = {
    message: "////", ///////////////////////////////////////////////////////////////////////////////////
    code: 300, ////////////////////////////////////////////////////////////////////////
    data: {
      id: 666, /////////////////////////
      code: "154862",
    },
  };

  //const result = await sendDataToServer(BASE_URL, data, true);
  console.log(result);

  if (result.code === 300 && result.data?.code) {
    codeView.textContent = createTextCode(result.data.code);
    //stopInterval();
  } else if (result.code === 301 && result.data?.secret_key) {
    localStorage.setItem(SECRET_KEY, result.data.secret_key);
  } else {
    codeView.textContent = DEFAULT_TEXT_CODE_VIEW;
  }
}

// Запуск интервальных вызовов
function startInterval(func, period) {
  if (!intervalId) {
    intervalId = setInterval(func, period);
  }
}

// Остановка интервальных вызовов
function stopInterval() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
}
