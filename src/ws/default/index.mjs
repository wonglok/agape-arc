// // learn more about WebSocket functions here: https://arc.codes/ws
// export async function handler(req) {
//   console.log(JSON.stringify(req, null, 2));
//   return { statusCode: 200 };
// }
// learn more about WebSocket functions here: https://arc.codes/ws

import YSockets from "@architect/shared/lib/helpers/ysockets.mjs";
import arc from "@architect/functions";

export async function handler(req) {
  // console.log(JSON.stringify(req, null, 2));

  let client = await arc.tables();
  let documentClient = client._doc;

  const ysockets = new YSockets({
    documentClient,
    tableName: client.name(`YConnectionsTable`),
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
        client.YConnectionsTable.delete({ PartitionKey: connectionId }).then(
          (r) => {
            console.log(r);
          }
        );
      });
  };

  // console.log(req.body);
  let msg = JSON.parse(req.body);
  if (msg.action === "sync") {
    await ysockets.onMessage(connectionId, msg.update, send);
  }

  return { statusCode: 200 };
}

//

//
