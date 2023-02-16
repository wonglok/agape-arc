import arc from "@architect/functions";
import { Y, DynamoDbPersistence } from "@architect/shared/YDyna.mjs";
import { fromUint8Array, toUint8Array } from "js-base64";
// import { v4 } from "uuid";

export async function handler(req) {
  // console.log(JSON.stringify(req.body, null, 2));

  // console.log(req.body + "body");

  let bodyData = JSON.parse(req.body);

  let client = await arc.tables();

  let connectionId = req.requestContext.connectionId;

  let docName = bodyData.docName;

  let actionType = bodyData.actionType;

  let send = async (connectionId, payload) => {
    await arc.ws
      .send({
        id: connectionId,
        payload: payload,
      })
      .catch((r) => {
        console.error("send error");
        return client.YConnARC.delete({ oid: connectionId }).then((r) => {
          console.log(r);
        });
      });
  };

  // let DocResult = await client.YConnARC.scan({
  //   FilterExpression: `docName = :dd`,
  //   ExpressionAttributeValues: {
  //     //
  //     [":dd"]: { S: docName },
  //   },
  // });
  // console.log("DocResult", DocResult);

  // await client.YUpdates.put({
  //   oid: v4(),
  //   docName: docName,
  //   update64: bodyData.update64,
  //   origin: bodyData.origin,
  //   connectionId: connectionId,
  // });

  if (actionType === "sync") {
    const config = {
      aws: {
        dynamoDBClient: client._db,
        dynamoDBDocClient: client._doc,
        // region: "us-west-2",
        // accessKeyId: "accessKeyId",
        // secretAccessKey: "secretAccessKey",
        // endpoint: "http://localhost:8000",
      },
      skipCreateTable: true, // skips creating table, assumes it already exists
      tableName: "agape-yjs-dynamodb",
    };

    const persistence = DynamoDbPersistence(config);

    let updateBin = toUint8Array(bodyData.update64);

    try {
      // Y.applyUpdate(ydoc, updateBin, origin);
      await persistence.storeUpdate(docName, updateBin);
    } catch (e) {
      console.log(e);
    }

    // let ydoc = await persistence.getYDoc(docName).catch((r) => {
    //   return new Y.Doc();
    // });

    const MyConnections = await client.YConnARC.scan({
      FilterExpression: `docName = :dd`,
      ExpressionAttributeValues: {
        //
        [":dd"]: docName,
      },
    });

    // console.log(MyConnections.Items);
    // let connectionsAll = MyConnections.Items.filter((r = r.aaa === ""))

    // console.log(connectionsAll);
    let conns = MyConnections.Items
      // .map((r) => r.docName === docName)
      .filter((all) => all !== connectionId)
      .map((r) => r.oid);

    console.log(conns);

    conns.forEach((connId) => {
      send(connId, {
        ...bodyData,
        actionType: "sync",
      });
    });

    // console.log(connectionsNoSelf);
    //docName
  } else if (actionType === "init") {
    const config = {
      aws: {
        dynamoDBClient: client._db,
        dynamoDBDocClient: client._doc,
        // region: "us-west-2",
        // accessKeyId: "accessKeyId",
        // secretAccessKey: "secretAccessKey",
        // endpoint: "http://localhost:8000",
      },
      skipCreateTable: false, // skips creating table, assumes it already exists
      tableName: "agape-yjs-dynamodb",
    };

    const persistence = DynamoDbPersistence(config);
    let ydoc = await persistence.getYDoc(docName).catch((r) => {
      return new Y.Doc();
    });

    let updateBin = Y.encodeStateAsUpdate(ydoc);

    let send = async (connectionId, payload) => {
      await arc.ws
        .send({
          id: connectionId,
          payload: payload,
        })
        .catch((r) => {
          console.error("send error");
          return client.YConnARC.delete({ oid: connectionId }).then((r) => {
            console.log(r);
          });
        });
    };

    send(connectionId, {
      actionType: "initDown",
      docName,
      update64: fromUint8Array(updateBin),
      origin: "cloud",
    });
  }

  //
  return { statusCode: 200 };
}
