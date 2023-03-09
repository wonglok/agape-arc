import arc from "@architect/functions";

export const pushGraph = async ({ connectionID, payload, action }) => {
  let roomID = payload?.roomID;

  let tables = await arc.tables();
  let SocketConnection = await tables.SocketConnection;

  // await SocketConnection.put({ oid: connectionID, roomID, type: "pushGraph" });

  // arc.ws.send({
  //   id: connectionID,
  //   payload: {
  //     action: "setup-connectionID",
  //     payload: {
  //       //
  //       connectionID,
  //       roomID,
  //     },
  //   },
  // });

  // console.log("connectionObject", connectionObject);
  console.log("pushGraph", connectionID, roomID);
};

//
