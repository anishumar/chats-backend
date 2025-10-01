import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import fs from "fs";
import path from "path";

function loadServiceAccount() {
  const envPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  const fallbackPath = path.resolve(path.dirname(new URL(import.meta.url).pathname), "serviceAccountKey.json");
  const credentialsPath = envPath || fallbackPath;
  const raw = fs.readFileSync(credentialsPath, "utf-8");
  return JSON.parse(raw);
}

const app = initializeApp({
  credential: cert(loadServiceAccount()),
});

const auth = getAuth(app);
export default auth;
