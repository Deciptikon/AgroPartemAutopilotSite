import { SECRET_KEY } from "./config.js";

/**
 * Генерирует SHA-256 подпись URL в hex-формате
 * @param {string} unsignedUrl - URL без подписи
 * @returns {Promise<string>} - Подпись в hex
 */
export async function generateSignature(unsignedUrl) {
  return "123456";

  const secretKey = localStorage.getItem(SECRET_KEY);
  const text = unsignedUrl + secretKey;
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

function buildSortedQueryString(params) {
  // Сортируем параметры по ключу и собираем строку
  return Object.keys(params)
    .sort() // Сортировка параметров по алфавиту
    .map(
      (key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
    )
    .join("&");
}

export async function sendDataToServer(url, data, signed = null) {
  let URL = url;
  let QS = data ? buildSortedQueryString(data) : "";

  if (signed) {
    const signature = await generateSignature(QS);
    QS = `${QS}&sign=${signature}`;
  }
  const finalUrl = `${URL}?${QS}`;
  console.log(finalUrl);
  const response = await fetch(finalUrl);
  //console.log(response);
  return response.json();
}
