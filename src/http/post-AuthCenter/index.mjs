import * as arc from "@architect/functions";
import ORMClass from "@architect/shared/ORMClass.mjs";
import * as Auth from "@architect/shared/Auth.mjs";

export const AuthToken = new ORMClass({ collection: "AuthToken" });

async function reply(req) {
  //
  try {
    //
    let inData = JSON.parse(req.body);

    if (inData.__networkAction === "getToken") {
      //
      await AuthToken.create({
        data: {
          oid: AuthToken.getID(),
          userID: "",
          timestamp: new Date().getTime(),
        },
      });
    }

    if (inData.__networkAction === "getJWT") {
      let isVerified = await Auth.verifyMessage({
        dataObject: inData.dataObject,
        signature: inData.signature,
      });

      if (!isVerified) {
        throw new Error({ reason: "signature-not-match" });
      }

      if (!inData.dataObject.userID) {
        throw new Error({ reason: "no-user-id" });
      }

      let jwt = null;
      if (inData.dataObject) {
        let result = await Auth.signUserJWT({
          userID: inData.dataObject.userID,
        });

        jwt = result.jwt;
      }

      if (jwt === null || !jwt) {
        throw new Error({ reason: "no-jwt" });
      }

      return {
        cors: true,
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "cache-control":
            "no-cache, no-store, must-revalidate, max-age=0, s-maxage=0",
          "content-type": "application/json; charset=utf8",
        },
        body: JSON.stringify({
          //
          jwt: jwt,
        }),
      };
    }

    //
    throw new Error({ reason: "no-response" });
  } catch (e) {
    //
    console.error(e);

    //
    let reason = e?.reason || "no-reason";
    return {
      cors: true,
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        status: "failed",
        reason: reason,
      }),
    };
  }
}

export const handler = arc.http.async(reply);
