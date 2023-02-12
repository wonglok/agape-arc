import * as syncProtocol from "y-protocols/sync";
import * as encoding from "lib0/encoding";
import * as decoding from "lib0/decoding";
import { toBase64, fromBase64 } from "lib0/buffer";
import * as Y from "yjs";
const messageSync = 0;
const messageAwareness = 1;
export class YSockets {
  constructor({ YConn, YData }) {
    /** @type {import("@architect/functions/types/tables.js").ArcTable} */
    this.YConn = YConn;

    /** @type {import("@architect/functions/types/tables.js").ArcTable} */
    this.YData = YData;

    // this.ct = new ConnectionsTableHelper({
    //   dbHelperClient,
    //   documentClient,
    //   tableName,
    // });
  }

  async getDBDoc({ docName }) {
    let dbDoc = await this.YData.get({ oid: docName })
      .then(async (r) => {
        if (typeof r === "undefined") {
          let dbDoc = {
            oid: docName,
            Updates: [],
          };

          await this.YData.put(dbDoc);
          return dbDoc;
        }

        return r;
      })
      .catch(async (r) => {
        let dbDoc = {
          oid: docName,
          Updates: [],
        };

        await this.YData.put(dbDoc);
        return dbDoc;
      });

    return dbDoc;
  }
  async provideDoc({ docName }) {
    let dbDoc = await this.getDBDoc({ docName });

    const updates = dbDoc.Updates.map(
      (update) => new Uint8Array(Buffer.from(update, "base64"))
    );

    const ydoc = new Y.Doc();
    for (const update of updates) {
      try {
        Y.applyUpdate(ydoc, update);
      } catch (ex) {
        console.log("Something went wrong with applying the update");
      }
    }

    return ydoc;
  }
  async onConnection(connectionId, docName, roomName) {
    await this.YConn.put({
      oid: connectionId,
      documentName: docName,
      roomName: roomName,
    });

    const doc = await this.provideDoc({ docName });

    const encoder = encoding.createEncoder();
    encoding.writeVarUint(encoder, messageSync);
    syncProtocol.writeSyncStep1(encoder, doc);

    // TODO: cannot send message during connection.. Need to broadcast likely
    // await send({ context, message: encoding.toUint8Array(encoder), id })
    console.log(`${connectionId} connected`);
  }
  async onDisconnect(connectionId) {
    await this.YConn.delete({ oid: connectionId });

    console.log(`${connectionId} disconnected`);
  }
  async onMessage(connectionId, b64Message, send) {
    // const { ct } = this;
    let messageArray = fromBase64(b64Message);

    // console.log(messageArray);

    let conn = await this.YConn.get({ oid: connectionId });

    console.log(conn);

    if (!conn) {
      return;
    }

    const docName = conn.documentName;
    const roomName = conn.roomName;

    const connectionIds = await this.YConn.scan({
      FilterExpression: "documentName = :docName",
      ExpressionAttributeValues: { ":docName": docName },
    }).then((r) => {
      return r.Items.filter((conn) => {
        // console.log(conn, roomName);
        return conn.roomName === roomName;
      }).map((r) => r.oid);
    });

    //
    const otherConnectionIds = connectionIds.filter(
      (id) => id !== connectionId
    );

    const broadcast = (message) => {
      return Promise.all(
        otherConnectionIds.map((id) => {
          return send(id, toBase64(message));
        })
      );
    };

    const doc = await this.provideDoc({ docName });

    const encoder = encoding.createEncoder();
    const decoder = decoding.createDecoder(messageArray);
    const messageType = decoding.readVarUint(decoder);

    // encoding.writeVarUint(encoder, messageSync);

    switch (messageType) {
      // Case sync1: Read SyncStep1 message and reply with SyncStep2 (send doc to client wrt state vector input)
      // Case sync2 or yjsUpdate: Read and apply Structs and then DeleteStore to a y instance (append to db, send to all clients)
      case messageSync:
        encoding.writeVarUint(encoder, messageSync);
        const messageType = decoding.readVarUint(decoder);
        switch (messageType) {
          case syncProtocol.messageYjsSyncStep1:
            syncProtocol.writeSyncStep1(encoder, doc);

            break;
          case syncProtocol.messageYjsSyncStep2:
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

            //
            let dbDoc = await this.getDBDoc({ docName });
            dbDoc.Updates.push(toBase64(update));

            await this.YData.put(dbDoc);

            break;
          default:
            throw new Error("Unknown message type");
        }
        //
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
export default YSockets;
//# sourceMappingURL=ysockets.js.map
