declare module "jwk-to-pem" {
  type JwkRsa = {
    kty: "RSA";
    n: string;
    e: string;
    kid?: string;
    use?: string;
    alg?: string;
  };
  export default function jwkToPem(jwk: JwkRsa): string;
}

