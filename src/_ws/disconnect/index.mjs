// learn more about WebSocket functions here: https://arc.codes/ws

// import YSockets from "./lib/helpers/ysockets.mjs";
import arc from "@architect/functions";

export async function handler(req) {
  //

  // let client = await arc.tables();
  // let documentClient = client._doc;

  // const ysockets = new YSockets({
  //   documentClient,
  //   tableName: client.name(`YConnectionsTable`),
  // });

  // let connectionId = req.requestContext.connectionId;

  // await ysockets.onDisconnect(connectionId);

  // console.log(JSON.stringify(req, null, 2));
  return { statusCode: 200 };
}
