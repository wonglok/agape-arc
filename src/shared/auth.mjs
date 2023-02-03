import * as jose from "jose";
// let jose = require("jose");
// let bcrypt = require("bcrypt");

// let loginCode = () => {
//   var getRAND = () => Math.random().toString(36).slice(-8);
//   return `ONE_TIME_LOGIN_CODE_${getRAND()}_${getRAND()}`;
// };

// let yo = 123;

export const generateKeyPair = async () => {
  const appSecret = await jose.generateSecret("HS256");
  const appSecretJwk = await jose.exportJWK(appSecret);
  const ARC_APP_SECRET = Buffer.from(
    JSON.stringify(appSecretJwk),
    "utf8"
  ).toString("base64");

  const { publicKey, privateKey } = await jose.generateKeyPair("ES256");

  const publicJwk = await jose.exportJWK(publicKey);
  const privateJwk = await jose.exportJWK(privateKey);

  const JWT_B64_PUBLIC = Buffer.from(
    JSON.stringify(publicJwk),
    "utf8"
  ).toString("base64");

  const JWT_B64_PRIVATE = Buffer.from(
    JSON.stringify(privateJwk),
    "utf8"
  ).toString("base64");

  return {
    ARC_APP_SECRET,
    JWT_B64_PRIVATE,
    JWT_B64_PUBLIC,
  };
};

//
export const signUserJWT = async ({ address }) => {
  //
  let privateKeyObj = await jose.importJWK(
    JSON.parse(Buffer.from(process.env.JWT_B64_PRIVATE, "base64")),
    "ES256"
  );

  //
  const jwt = await new jose.SignJWT({
    address: `${address}`,
  })
    .setProtectedHeader({ alg: "ES256" })
    .setIssuer("urn:metaverse:issuer")
    .setAudience("urn:metaverse:audience")
    .sign(privateKeyObj);

  //
  // console.log("sign jwt", jwt);

  //
  return { jwt };
};

//
export const verifyUserJWT = async ({ jwt }) => {
  //
  let publicKeyObj = await jose.importJWK(
    JSON.parse(Buffer.from(process.env.JWT_B64_PUBLIC, "base64")),
    "ES256"
  );

  //
  const { payload, protectedHeader } = await jose.jwtVerify(
    jwt + "",
    publicKeyObj,
    {
      issuer: "urn:metaverse:issuer",
      audience: "urn:metaverse:audience",
    }
  );

  //
  // console.log("payload", payload);
  // console.log("protectedHeader", protectedHeader);
  //

  return {
    payload,
    protectedHeader,
  };
};

//
export const getPWHash = async ({ myPlaintextPassword, saltRounds = 20 }) => {
  return new Promise((resolve, reject) => {
    // bcrypt.hash(myPlaintextPassword, saltRounds, function (err, hash) {
    //   if (err) {
    //     reject(err);
    //   } else {
    //     resolve(hash);
    //   }
    // });
  });
};

//
export const verifyPW = async ({
  myPlaintextPassword,
  hashFromDB = "____",
}) => {
  return new Promise((resolve, reject) => {
    // bcrypt.compare(myPlaintextPassword, hashFromDB, function (err, result) {
    //   if (err) {
    //     reject(err);
    //   } else if (result === true) {
    //     resolve(result);
    //   } else {
    //     reject({ error: "bad password." });
    //   }
    // });
  });
};

export const createEmailLoginSession = () => {
  //
};

export const verifyingLoginNumberForSession = () => {
  //
};

//

export const getAdminAddressMD5 = () => {
  return [
    //
  ];
};

//
