import { PERIOD_PINGOUT, SERIAL_KEY } from "./config.js";

const serialKeyInput = document.getElementById("serialKeyInput");

document.addEventListener("DOMContentLoaded", function () {
  const serialKey = localStorage.getItem(SERIAL_KEY);
  serialKeyInput.value = serialKey;

  // Первое обновление при загрузке страницы
  updateCoordinates();

  setInterval(updateCoordinates, PERIOD_PINGOUT);
});

// Функция для обновления координат
function updateCoordinates() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        // Успешно получили координаты
        document.getElementById("latitude").value =
          position.coords.latitude.toFixed(6);
        document.getElementById("longitude").value =
          position.coords.longitude.toFixed(6);

        // Обновляем время последнего обновления
        const now = new Date();
        document.getElementById("lastUpdate").textContent =
          now.toLocaleTimeString();
      },
      function (error) {
        // Ошибка при получении координат
        console.error("Ошибка при получении координат: ", error);
        document.getElementById("latitude").value = "Ошибка";
        document.getElementById("longitude").value = "Ошибка";
      }
    );
  } else {
    // Геолокация не поддерживается
    document.getElementById("latitude").value = "Не поддерживается";
    document.getElementById("longitude").value = "Не поддерживается";
  }
}
