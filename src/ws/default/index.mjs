import { joinRoom } from "./actions/joinRoom.mjs";
import { pushGraph } from "./actions/pushGraph.mjs";
// learn more about WebSocket functions here: https://arc.codes/ws
export async function handler(req) {
  //console.log(JSON.stringify(req, null, 2));
  let connectionID = req.requestContext.connectionId;
  let { action, payload } = JSON.parse(req.body);
  //
  if (action === "joinRoom") {
    await joinRoom({ action, payload, connectionID });
  }
  if (action === "pushGraph") {
    await pushGraph({ action, payload, connectionID });
  }

  return { statusCode: 200 };
}
