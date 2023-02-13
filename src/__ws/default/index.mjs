// // learn more about WebSocket functions here: https://arc.codes/ws
// export async function handler(req) {
//   console.log(JSON.stringify(req, null, 2));
//   return { statusCode: 200 };
// }
// learn more about WebSocket functions here: https://arc.codes/ws

import { YSocketsARC } from "@architect/shared/YSocketsARC.mjs";
import arc from "@architect/functions";

export async function handler(req) {
  let ysockets = new YSocketsARC();
  let connectionId = req.requestContext.connectionId;

  let send = async (connectionId, message) => {
    await arc.ws
      .send({
        id: connectionId,
        payload: `${message}`,
      })
      .catch(async (r) => {
        console.error("send error", r);
        await ysockets.onDisconnect(connectionId);
      });
  };

  await ysockets.onMessage(connectionId, req.body, send);

  return { statusCode: 200 };
}

//

//
