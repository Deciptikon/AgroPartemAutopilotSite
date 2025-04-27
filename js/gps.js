import {
  ACCURACY_GPS,
  GPS_URL,
  PERIOD_GPS_UPDATE,
  SERIAL_KEY,
} from "./config.js";
import { dateToStr } from "./utils.js";
import { sendDataToServer } from "./crypto-utils.js";

const serialKeyInput = document.getElementById("serialKeyInput");
const serialKey = localStorage.getItem(SERIAL_KEY);

document.addEventListener("DOMContentLoaded", function () {
  serialKeyInput.value = serialKey;

  // Первое обновление при загрузке страницы
  updateCoordinates();

  setInterval(updateCoordinates, PERIOD_GPS_UPDATE);
});

// Функция для обновления координат
function updateCoordinates() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        // Успешно получили координаты
        const now = new Date();
        const time = dateToStr(now);
        const point = {
          lat: position.coords.latitude.toFixed(ACCURACY_GPS),
          lon: position.coords.longitude.toFixed(ACCURACY_GPS),
          time: time,
        };

        document.getElementById("latitude").value = point.lat;
        document.getElementById("longitude").value = point.lon;
        document.getElementById("lastUpdate").textContent =
          now.toLocaleTimeString();

        // По хорошему, нужно сделать буффер отправки и сохранять его
        // в локальном хранилище, и по овзможности передавать точки из него.
        // что бы положение не оерялось при сбоях и потерях связи...
        // удалять точки из буффера только после подтверждения от сервера
        // и передавать лучше пакетами, а не по одной точке
        sendPosition(point);
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

async function sendPosition(point) {
  const data = {
    serial_key: serialKey,
    timestamp: dateToStr(new Date()),
    track_lat: point.lat,
    track_lon: point.lon,
    track_time: point.time,
  };

  const result = await sendDataToServer(GPS_URL, data, true);
  console.log(result);
}
