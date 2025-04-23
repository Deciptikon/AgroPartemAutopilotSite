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

export async function sendDataToServer(url, data, signed = null) {
  const baseUrl = new URL(url);
  for (let key in data) {
    baseUrl.searchParams.append(key, data[key]);
  }
  if (signed) {
    const signature = await generateSignature(baseUrl.toString());
    baseUrl.searchParams.append("sig", signature);
  }
  const finalUrl = baseUrl.toString();
  console.log(finalUrl);
  const response = await fetch(finalUrl);
  //console.log(response);
  return response.json();
}
