import crypto from "crypto";
import { authConfig } from "./config";

const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
  modulusLength: 2048,
});

export const jwtPrivateKey = privateKey
  .export({ type: "pkcs1", format: "pem" })
  .toString();
export const jwtPublicKey = publicKey
  .export({ type: "pkcs1", format: "pem" })
  .toString();

export const jwk = {
  keys: [
    {
      kty: "RSA",
      use: "sig",
      alg: "RS256",
      kid: authConfig.keyId,
      n: publicKey.export({ format: "jwk" }).n,
      e: publicKey.export({ format: "jwk" }).e,
    },
  ],
};

