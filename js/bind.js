import {
  DEFAULT_TEXT_CODE_VIEW,
  SERIAL_KEY,
  BASE_URL,
  SECRET_KEY,
  PERIOD_PINGOUT,
} from "./config.js";
import { dateToStr } from "./utils.js";
import { sendDataToServer } from "./crypto-utils.js";

const serialKeyInput = document.getElementById("serialKeyInput");
const codeView = document.getElementById("codeView");
const updBtn = document.getElementById("updBtn");

const serialKey = localStorage.getItem(SERIAL_KEY);

let intervalId = null;

document.addEventListener("DOMContentLoaded", function () {
  serialKeyInput.value = serialKey;
  codeView.textContent = DEFAULT_TEXT_CODE_VIEW;
  console.log(`Serial Key: "${serialKey}"`);

  startInterval(async () => {
    try {
      await updateCodeView();
    } catch (error) {
      console.error("Ошибка в updateCodeView:", error);
    }
  }, PERIOD_PINGOUT);
});

updBtn.addEventListener("click", async () => {
  try {
    await updateCodeView();
  } catch (error) {
    console.error("Ошибка в updateCodeView:", error);
  }
});

function createTextCode(code) {
  return `${code}`.split("").join(" ");
}

async function updateCodeView() {
  console.log("Отправляем данные...");
  /**const result = {
    message: "////", ///////////////////////////////////////////////////////////////////////////////////
    code: 202, ////////////////////////////////////////////////////////////////////////
    data: {
      id: 666, /////////////////////////
      bind_key: "154862",
    },
  }; */
  const data = {
    serial_key: serialKey,
    timestamp: dateToStr(new Date()),
  };

  const result = await sendDataToServer(BASE_URL, data, true);
  console.log(result);

  // Если устройство готово к привязке
  if (result.code === 202 && result.data?.bind_key) {
    codeView.textContent = createTextCode(result.data.bind_key);
    //stopInterval();

    // Если код привязки верный и устройство было привязано
  } else if (result.code === 201 && result.data?.secret_key) {
    localStorage.setItem(SECRET_KEY, result.data.secret_key);
    setTimeout(() => {
      window.location.href = "./index.html";
    }, 3000);
    // Если случилась ошибка
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
