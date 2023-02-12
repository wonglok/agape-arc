// // learn more about WebSocket functions here: https://arc.codes/ws
// export async function handler(req) {
//   console.log(JSON.stringify(req, null, 2));
//   return { statusCode: 200 };
// }
// learn more about WebSocket functions here: https://arc.codes/ws

import YSockets from "./lib/helpers/ysockets.mjs";
import arc from "@architect/functions";

export async function handler(req) {
  // console.log(JSON.stringify(req, null, 2));

  let client = await arc.tables();
  let YConn = await client.YConn;
  let YData = await client.YData;

  const ysockets = new YSockets({
    YConn,
    YData,
  });

  let connectionId = req.requestContext.connectionId;

  let send = async (connectionId, message) => {
    await arc.ws
      .send({
        id: connectionId,
        payload: `${message}`,
      })
      .catch((r) => {
        console.error("send error", r);

        ysockets.onDisconnect(connectionId);
      });
  };
  // console.log(req.body);

  let conn = await YConn.get({ oid: connectionId });
  await ysockets.onMessage(connectionId, conn.roomName, req.body, send);

  return { statusCode: 200 };
}

//

//
