import { BASE_URL, SERIAL_KEY } from "./config.js";
import { dateToStr } from "./utils.js";
import { sendDataToServer } from "./crypto-utils.js";

const serialKeyInput = document.getElementById("serialKeyInput");
let serialKey = serialKeyInput.value;

const btn = document.getElementById("sendBtn");
const status = document.getElementById("status");

document.addEventListener("DOMContentLoaded", function () {
  // Инициализация
  //document.querySelector("main").innerHTML = getSendBlock();
  //initSendSystem(serialKey);
});

// Отслеживаем изменения в реальном времени
serialKeyInput.addEventListener("input", function () {
  serialKey = serialKeyInput.value;
  console.log("Серийный номер изменён:", this.value);
});

btn.addEventListener("click", async () => {
  btn.disabled = true;
  serialKeyInput.disabled = true;

  console.log("Button Clicked");
  status.innerHTML =
    '<div class="alert alert-warning">Формирование запроса...</div>';

  try {
    const data = {
      serial: serialKey,
      time: dateToStr(new Date()),
    };

    const result = await sendDataToServer(BASE_URL, data, true);
    console.log(result);

    status.innerHTML = `
        <div class="alert alert-success">
          <h5>${result.message}</h5>
          <p>ID: ${result.data.id}</p>
        </div>
      `;

    if (result.code === 200) {
      localStorage.setItem(SERIAL_KEY, serialKey);
      setTimeout(() => {
        window.location.href = "./gps.html";
      }, 3000);
    }
    if (result.code === 300) {
      localStorage.setItem(SERIAL_KEY, serialKey);
      setTimeout(() => {
        window.location.href = "./bind.html";
      }, 3000);
    }
  } catch (error) {
    btn.disabled = false;
    serialKeyInput.disabled = false;

    status.innerHTML = `
        <div class="alert alert-danger">
          <h5>Ошибка!</h5>
          <p>${error.message}</p>
        </div>
      `;
  }
});
