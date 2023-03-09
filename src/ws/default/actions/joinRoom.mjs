import arc from "@architect/functions";

export const joinRoom = async ({ connectionID, payload, action }) => {
  let roomID = payload?.roomID;

  let tables = await arc.tables();
  let SocketConnection = await tables.SocketConnection;

  await SocketConnection.put({ oid: connectionID, roomID, type: "joinRoom" });

  arc.ws.send({
    id: connectionID,
    payload: {
      action: "setup-connectionID",
      payload: {
        //
        connectionID,
        roomID,
      },
    },
  });

  // console.log("connectionObject", connectionObject);
  console.log("joinRoom", connectionID, roomID);
};
