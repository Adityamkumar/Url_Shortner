import http from "k6/http";
import { sleep } from "k6";

export const options = {
  vus: 100,          // 👈 100 concurrent users
  duration: "30s",   // run for 30 seconds
};

export default function () {
  http.get("https://shortify-com.onrender.com/TQ1t70");
  sleep(1);
}