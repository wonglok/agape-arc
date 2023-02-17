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
    const config = {
      dynamoDBClient: client._db,
      skipCreateTable: false, // skips creating table, assumes it already exists
      tableName: "arc-agape-y-dynamodb",
    };

    const persistence = DynamoDbPersistence(config);

    let yDoc = await persistence.getYDoc(bodyData.docName);

    await send(connectionId, {
      action: "init",
      connectionId,
      update: toBase64(Y.encodeStateAsUpdate(yDoc)),
    });
  }

  if (bodyData.action === "operation") {
    const config = {
      dynamoDBClient: client._db,
      skipCreateTable: true, // skips creating table, assumes it already exists
      tableName: "arc-agape-y-dynamodb",
    };

    const persistence = DynamoDbPersistence(config);

    await persistence.storeUpdate(
      bodyData.docName,
      fromBase64(bodyData.update)
    );

    let others = await client.YConn.scan({
      FilterExpression: `docName = :dd`,
      ExpressionAttributeValues: {
        [":dd"]: bodyData.docName,
      },
    });

    console.log(others.Items);
    for (let it of others.Items) {
      if (it.oid !== connectionId) {
        await send(it.oid, {
          action: "operation",
          docName: bodyData.docName,
          update: bodyData.update,
        });
      }
    }

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
