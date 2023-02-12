// learn more about WebSocket functions here: https://arc.codes/ws

import YSockets from "./lib/helpers/ysockets.mjs";
import arc from "@architect/functions";

export async function handler(req) {
  //

  // console.log(
  //   JSON.stringify(req.queryStringParameters.documentName, null, "  ")
  // );

  let client = await arc.tables();
  let YConn = await client.YConn;
  let YData = await client.YData;

  const ysockets = new YSockets({
    YConn,
    YData,
  });

  let connectionId = req.requestContext.connectionId;
  let docName = req.queryStringParameters.documentName;
  let roomName = req.queryStringParameters.roomName;

  await ysockets.onConnection(connectionId, docName, roomName);

  // // await arc.ws.send({
  // //   id: connectionId,
  // //   payload: { message: "hai 🐶" },
  // // });
  // //

  // let docName = "default";

  // console.log(JSON.stringify(req, null, 2));
  return { statusCode: 200 };
}
