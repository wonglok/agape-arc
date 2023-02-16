// learn more about WebSocket functions here: https://arc.codes/ws

import YSockets from "@architect/shared/lib/helpers/ysockets.mjs";
import arc from "@architect/functions";

export async function handler(req) {
  //

  console.log(
    JSON.stringify(req.queryStringParameters.documentName, null, "  ")
  );
  let client = await arc.tables();
  let documentClient = client._doc;

  const ysockets = new YSockets({
    documentClient,
    tableName: client.name(`YConnectionsTable`),
  });

  let docName = req.queryStringParameters.documentName;
  let connectionId = req.requestContext.connectionId;
  await ysockets.onConnection(connectionId, docName);

  // // await arc.ws.send({
  // //   id: connectionId,
  // //   payload: { message: "hai 🐶" },
  // // });
  // //

  // let docName = "default";

  // console.log(JSON.stringify(req, null, 2));
  return { statusCode: 200 };
}
