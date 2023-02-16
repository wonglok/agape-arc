import arc from "@architect/functions";
import { fromUint8Array, toUint8Array } from "js-base64";

import { Y, DynamoDbPersistence } from "@architect/shared/YDyna.mjs";

// learn more about WebSocket functions here: https://arc.codes/ws
export async function handler(req) {
  let client = await arc.tables();

  let docName = req.queryStringParameters.docName;
  let connectionId = req.requestContext.connectionId;

  await client.YConnARC.put({ oid: connectionId, docName: docName });

  console.log("connectionId", connectionId);
  console.log("docName", docName);

  // console.log({ oid: connectionId, docName: docName });

  return { statusCode: 200 };
}
