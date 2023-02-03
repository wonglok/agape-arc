let jose = require("jose");
// let bcrypt = require("bcrypt");

// let loginCode = () => {
//   var getRAND = () => Math.random().toString(36).slice(-8);
//   return `ONE_TIME_LOGIN_CODE_${getRAND()}_${getRAND()}`;
// };

//
exports.signUserJWT = async ({ address }) => {
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
exports.verifyUserJWT = async ({ jwt }) => {
  //
  let publicKeyObj = await jose.importJWK(
    JSON.parse(Buffer.from(process.env.JWT_B64_PUBLIC, "base64")),
    "ES256"
  );

  //
  const { payload, protectedHeader } = await jose.jwtVerify(jwt, publicKeyObj, {
    issuer: "urn:metaverse:issuer",
    audience: "urn:metaverse:audience",
  });

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
exports.getPWHash = async ({ myPlaintextPassword, saltRounds = 20 }) => {
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
exports.verifyPW = async ({ myPlaintextPassword, hashFromDB = "____" }) => {
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

exports.createEmailLoginSession = () => {
  //
};

exports.verifyingLoginNumberForSession = () => {
  //
};

//

exports.getAdminAddressMD5 = () => {
  return [
    //
    "5a0aff6d6c3b3d0fc0a77c41da37b6d7", // lok
  ];
};

//
