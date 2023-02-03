let arc = require("@architect/functions");
let Auth = require("@architect/shared/auth.js");
// let { generateNonce } = require("siwe");
// let uuidv4 = require("uuid").v4;

//

exports.handler = async function http(req) {
  try {
    let body = JSON.parse(await arc.http.helpers.bodyParser(req));

    let { origin } = body;

    if (origin !== req.headers.origin) {
      throw new Error("bad origin");
    }

    let result = {
      // nonce: generateNonce(),
      nonce: (await Auth.signUserJWT({ address: req.headers.origin })).jwt,
    };

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
        msg: "failed",
      }),
    };
  }
};

//
