import arc from "@architect/functions";

export const pushGraph = async ({ connectionID, payload, action }) => {
  let tables = await arc.tables();

  let GraphDoc = await tables.GraphDoc;
  let DocNodes = await tables.DocNodes;
  let DocEdges = await tables.DocEdges;
  let DocAsset = await tables.DocAsset;
  let DocJS = await tables.DocJS;

  // console.log(payload, SocketConnection);
  // await SocketConnection.put({ oid: connectionID, roomID, type: "pushGraph" });

  await arc.ws.send({
    id: connectionID,
    payload: {
      action: "pushGraph",
      payload: {
        //
        //
        docs: [
          {
            nodes: [],
            edges: [],
            assets: [],
            js: [],
          },
        ],

        //
        //
        //
      },
    },
  });

  //

  // console.log("connectionObject", connectionObject);
  // console.log("pushGraph", connectionID, roomID);
};

//

//!SECTION

//
