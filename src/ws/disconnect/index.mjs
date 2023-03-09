import arc from "@architect/functions";

// learn more about WebSocket functions here: https://arc.codes/ws
export async function handler(req) {
  //console.log(JSON.stringify(req, null, 2));
  let connectionID = req.requestContext.connectionId;

  let tables = await arc.tables();
  let SocketConnection = await tables.SocketConnection;

  await new Promise((resolve) => {
    SocketConnection.delete({ oid: connectionID }, () => {
      console.log("disconnected", connectionID);
      resolve();
    });
  });
  return { statusCode: 200 };
}
