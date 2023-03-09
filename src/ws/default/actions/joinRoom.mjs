import arc from "@architect/functions";

export const joinRoom = async ({ connectionID, payload, action }) => {
  let roomID = payload?.roomID;

  let tables = await arc.tables();
  let SocketConnection = await tables.SocketConnection;
  // let connectionObject = await SocketConnection.get({
  //   oid: connectionID,
  // });

  await SocketConnection.put({ oid: connectionID, roomID, type: "joinRoom" });

  // console.log("connectionObject", connectionObject);
  console.log("joinRoom", connectionID, roomID);
};
