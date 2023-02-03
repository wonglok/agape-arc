let arc = require("@architect/functions");
let Auth = require("@architect/shared/auth.js");
// let { generateNonce, SiweMessage } = require("siwe");
let { utils } = require("ethers");
// let uuidv4 = require("uuid").v4;
exports.handler = async function http(req) {
  try {
    let body = JSON.parse(await arc.http.helpers.bodyParser(req));

    // console.log(req);
    const { originalString, originalSignature } = body;
    // const siweMessage = new SiweMessage(message);

    let result = {
      //
    };

    let address = utils.verifyMessage(originalString, originalSignature);

    let obj = JSON.parse(originalString);
    if (address !== obj.address) {
      throw new Error("signature mismatch");
    }

    let verifyNonce = await Auth.verifyUserJWT({ jwt: obj.nonce });

    // nonce is origin
    if (verifyNonce.payload.address !== obj.uri) {
      throw new Error("nonce a mismatch");
    }
    if (verifyNonce.payload.address !== req.headers.origin) {
      throw new Error("nonce b mismatch");
    }
    if (req.headers.origin !== obj.uri) {
      throw new Error("orign mismatch");
    }

    //
    // await siweMessage.validate(signature);

    let { jwt } = await Auth.signUserJWT({
      address: `${address}`,
    });

    result.jwt = jwt;

    //
    // console.log(body);
    //

    // let client = await arc.tables();

    // console.log(client);

    // let result = await Auth.checkUsernameTaken({ useranme: body.username });

    // console.log(result);

    //
    //
    //
    //
    // let graphTable = client.graph;

    // let id = uuidv4() + "";

    // let graphType = body.graphType + "";
    // let title = body.title + "";
    // let text = body.text + "";

    // let result = await graphTable.put({
    //   primaryKey: `${graphType}-${id}`,
    //   sortKey: `${graphType}-${id}`,
    //   graphType: `${graphType}`,
    //   title: `${title}`,
    //   text: `${text}`,

    //   detailTableName: ``,
    //   detailID: ``,
    // });

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
        ...result,
      }),
    };
  } catch (e) {
    console.error(e);
    return {
      cors: true,
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        msg: e.message || "failed",
      }),
    };
  }
};

//
