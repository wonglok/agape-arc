import * as syncProtocol from "y-protocols/sync";
import * as encoding from "lib0/encoding";
import * as decoding from "lib0/decoding";
import { toBase64, fromBase64 } from "lib0/buffer";
import * as Y from "yjs";
import arc from "@architect/functions";
import { uuidv4 } from "lib0/random";
const messageSync = 0;
const messageAwareness = 1;
export class YSocketsARC {
  constructor() {
    // this.ct = new ConnectionsTableHelper({ documentClient, tableName });
  }
  provideDocByUpdates(updatesB64Array = []) {
    const updatesBuffers = updatesB64Array.map(
      (update) => new Uint8Array(Buffer.from(update, "base64"))
    );
    const ydoc = new Y.Doc();
    for (const update of updatesBuffers) {
      try {
        Y.applyUpdate(ydoc, update);
      } catch (ex) {
        console.log("Something went wrong with applying the update", ex);
      }
    }
    return ydoc;
  }

  async onConnection(connectionId, docName) {
    let client = await arc.tables();

    let connDoc = await client.YConn.put({
      oid: connectionId,
      docName: docName,
      createdAt: new Date().getTime(),
    });

    // await client.YData.put({
    //   oid: docName,
    // });

    // let updates = await client.YUpdates.scan({
    //   FilterExpression: `docName = :dd`,
    //   ExpressionAttributeValues: {
    //     [`:dd`]: `${docName}`,
    //   },
    // });

    // console.log("updates.Count", updates.Count);

    // let doc = await this.provideDocByUpdates(
    //   updates.Items.map((r) => r.updateB64)
    // );

    // const encoder = encoding.createEncoder();
    // encoding.writeVarUint(encoder, messageSync);
    // syncProtocol.writeSyncStep1(encoder, doc);

    // let send = async (connectionId, message) => {
    //   await arc.ws
    //     .send({
    //       id: connectionId,
    //       payload: `${message}`,
    //     })
    //     .catch(async (r) => {
    //       console.error("send error", r);
    //       this.onDisconnect(connectionId);
    //     });
    // };

    // setTimeout(() => {
    //   send(connectionId, toBase64(encoding.toUint8Array(encoder)));
    // }, 1000);
    console.log(`${connectionId} connected`);
  }
  async onDisconnect(connectionId) {
    console.log(`${connectionId} disconnected`);
    let client = await arc.tables();

    await client.YConn.delete({ oid: connectionId });
  }
  async onMessage(connectionId, b64Message, send) {
    let messageArray = fromBase64(b64Message);

    let client = await arc.tables();

    let connDoc = await client.YConn.get({
      oid: connectionId,
    });

    if (!connDoc) {
      console.error("no connection item");
      return;
    }

    // console.log(connDoc);

    let docName = connDoc.docName;

    let connectionIdsInfo = await client.YConn.scan({
      FilterExpression: `docName = :dd`,
      ExpressionAttributeValues: {
        [`:dd`]: `${docName}`,
      },
    });

    let connectionIds = connectionIdsInfo.Items.map((r) => r.oid);

    const otherConnectionIds = connectionIds.filter(
      (id) => id !== connectionId
    );

    let updates = await client.YUpdates.scan({
      FilterExpression: `docName = :dd`,
      ExpressionAttributeValues: {
        [`:dd`]: `${docName}`,
      },
    });

    console.log("updates.Count", updates.Count);

    let doc = await this.provideDocByUpdates(
      updates.Items.map((r) => r.updateB64)
    );

    //!SECTION

    const broadcast = (message) => {
      return Promise.all(
        otherConnectionIds.map((id) => {
          return send(id, toBase64(message));
        })
      );
    };

    const decoder = decoding.createDecoder(messageArray);
    const messageType = decoding.readVarUint(decoder);

    switch (messageType) {
      // Case sync1: Read SyncStep1 message and reply with SyncStep2 (send doc to client wrt state vector input)
      // Case sync2 or yjsUpdate: Read and apply Structs and then DeleteStore to a y instance (append to db, send to all clients)
      case messageSync:
        const encoder = encoding.createEncoder();
        const messageType = decoding.readVarUint(decoder);
        switch (messageType) {
          case syncProtocol.messageYjsSyncStep1:
            encoding.writeVarUint(encoder, messageSync);
            syncProtocol.writeSyncStep1(
              encoder,
              doc,
              decoding.readVarUint8Array(decoder)
            );
            break;
          case syncProtocol.messageYjsSyncStep2:
            encoding.writeVarUint(encoder, messageSync);
            syncProtocol.writeSyncStep2(
              encoder,
              doc,
              decoding.readVarUint8Array(decoder)
            );
            break;
          case syncProtocol.messageYjsUpdate:
            const update = decoding.readVarUint8Array(decoder);
            Y.applyUpdate(doc, update);
            await broadcast(messageArray);
            await client.YUpdates.put({
              oid: uuidv4(),
              docName: docName,
              updateB64: toBase64(update),
            });
            break;
          default:
            throw new Error("Unknown message type");
        }

        if (encoding.length(encoder) > 1) {
          await send(connectionId, toBase64(encoding.toUint8Array(encoder)));
        }
        break;
      case messageAwareness: {
        await broadcast(messageArray);
        break;
      }
    }
  }
}
//# sourceMappingURL=ysockets.js.map
