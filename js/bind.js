import { SERIAL_KEY } from "./config.js";

const serialKeyInput = document.getElementById("serialKeyInput");

document.addEventListener("DOMContentLoaded", function () {
  const serialKey = localStorage.getItem(SERIAL_KEY);
  serialKeyInput.value = serialKey;
});
