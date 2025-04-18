import { BASE_URL } from "./config.js";
import { generateSignature } from "./crypto-utils.js";
import { dateToStr } from "./utils.js";

/**
 * Генерирует HTML блока отправки
 */
export function getSendBlock() {
  return `
    <div class="text-center p-4">
      <button id="sendBtn" class="btn btn-primary btn-lg">
        Отправить данные
      </button>
      <div id="status" class="mt-3"></div>
      <div id="debugInfo" class="mt-2 small text-muted font-monospace"></div>
    </div>
  `;
}

/**
 * Инициализирует систему отправки
 * @param {string} serialKey - Серийный номер
 */
export async function initSendSystem(serialKey = API_CONFIG.DEFAULT_SERIAL) {
  const btn = document.getElementById("sendBtn");
  const status = document.getElementById("status");
  //const debugInfo = document.getElementById("debugInfo");

  btn.addEventListener("click", async () => {
    btn.disabled = true;
    status.innerHTML =
      '<div class="alert alert-warning">Формирование запроса...</div>';

    try {
      const data = {
        serial: serialKey,
        time: dateToStr(new Date()),
      };
      const result = await sendDataToServer(BASE_URL, data, true);
      console.log(result);

      if (result.code !== 200) throw new Error(result.message);

      status.innerHTML = `
        <div class="alert alert-success">
          <h5>${result.message}</h5>
          <p>ID: ${result.data.id}</p>
        </div>
      `;
    } catch (error) {
      status.innerHTML = `
        <div class="alert alert-danger">
          <h5>Ошибка!</h5>
          <p>${error.message}</p>
        </div>
      `;
    } finally {
      btn.disabled = false;
    }
  });
}
