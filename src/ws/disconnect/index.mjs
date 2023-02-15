import arc from "@architect/functions";

// learn more about WebSocket functions here: https://arc.codes/ws
export async function handler(req) {
  console.log(
    "disconnect",
    JSON.stringify(req.requestContext.connectionId, null, 2)
  );
  let client = await arc.tables();

  let connectionId = req.requestContext.connectionId;

  await client.YConnARC.delete({ oid: connectionId });

  return { statusCode: 200 };
}
