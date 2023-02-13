// learn more about WebSocket functions here: https://arc.codes/ws

// import arc from "@architect/functions";
import { YSocketsARC } from "@architect/shared/YSocketsARC.mjs";
export async function handler(req) {
  let ysockets = new YSocketsARC();
  let docName = req.queryStringParameters.documentName;
  let connectionId = req.requestContext.connectionId;
  await ysockets.onConnection(connectionId, docName);

  // console.log(
  //   JSON.stringify(req.queryStringParameters.documentName, null, "  ")
  // );
  // let client = await arc.tables();
  // let documentClient = client._doc;

  // const ysockets = new YSockets({
  //   documentClient,
  //   tableName: client.name(`YConnectionsTable`),
  // });

  // // await arc.ws.send({
  // //   id: connectionId,
  // //   payload: { message: "hai 🐶" },
  // // });
  // //

  // let docName = "default";

  // console.log(JSON.stringify(req, null, 2));
  return { statusCode: 200 };
}
