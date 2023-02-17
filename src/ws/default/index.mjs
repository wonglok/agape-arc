// // learn more about WebSocket functions here: https://arc.codes/ws
// export async function handler(req) {
//   console.log(JSON.stringify(req, null, 2));
//   return { statusCode: 200 };
// }
// learn more about WebSocket functions here: https://arc.codes/ws

// import YSockets from "@architect/shared/lib/helpers/ysockets.mjs";
import arc from "@architect/functions";
import { DynamoDbPersistence, Y } from "@architect/shared/YDyna.mjs";
import { toBase64, fromBase64 } from "lib0/buffer";
import { v4 } from "uuid";

export async function handler(req) {
  let bodyData = JSON.parse(req.body);
  let connectionId = req.requestContext.connectionId;

  let client = await arc.tables();

  let send = async (connectionId, message) => {
    await arc.ws
      .send({
        id: connectionId,
        payload: message,
      })
      .catch(async (r) => {
        console.error("send error", r);
        return await client.YConn.delete({ oid: connectionId });
      });
  };

  // console.log(JSON.stringify(req, null, 2));

  if (bodyData.action === "init") {
    let yDoc = new Y.Doc();

    let updates = await client.YUpdates.scan({
      FilterExpression: `docName = :dd`,
      ExpressionAttributeValues: {
        [":dd"]: bodyData.docName,
      },
    });

    for (let item of updates.Items) {
      if (item.update) {
        try {
          Y.applyUpdate(yDoc, fromBase64(item.update));
        } catch (ex) {
          console.error(ex);
        }
      }
    }

    await send(connectionId, {
      action: "init",
      connectionId,
      update: toBase64(Y.encodeStateAsUpdate(yDoc)),
    });
  }

  if (bodyData.action === "operation") {
    let otherPlayers = await client.YConn.scan({
      FilterExpression: `docName = :dd`,
      ExpressionAttributeValues: {
        [":dd"]: bodyData.docName,
      },
    });

    for (let it of otherPlayers.Items) {
      if (it.oid !== connectionId) {
        try {
          await send(it.oid, {
            action: "operation",
            docName: bodyData.docName,
            update: bodyData.update,
          });
        } catch (e) {
          console.error(e);
          await client.YConn.delete({ oid: it.oid });
        }
      }
    }

    await client.YUpdates.put({
      oid: v4(),
      update: bodyData.update,
      docName: bodyData.docName,
    });

    //
    // let { Items } = await client.YUpdates.scan({
    //   FilterExpression: `docName = :doc`,
    //   ExpressionAttributeValues: {
    //     [":doc"]: { S: docName },
    //   },
    // });
    // //
  }

  // console.log(req.body);

  // let documentClient = client._doc;

  // const ysockets = new YSockets({
  //   documentClient,
  //   tableName: client.name(`YConnectionsTable`),
  // });

  // if (msg.action === "sync") {
  //   await ysockets.onMessage(connectionId, msg.update, send);
  // }

  return { statusCode: 200 };
}

//

//
