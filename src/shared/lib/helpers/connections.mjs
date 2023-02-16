import { DDBHelper } from "../utils/ddb.mjs";
import * as Y from "yjs";
import arc from "@architect/functions";
export class ConnectionsTableHelper {
  constructor({ documentClient, tableName }) {
    this.DatabaseHelper = new DDBHelper({
      documentClient,
      tableName: tableName || "YConnectionsTable",
      primaryKeyName: "PartitionKey",
    });
  }
  async createConnection(id, docName) {
    return this.DatabaseHelper.createItem(id, {
      DocName: docName,
      ttl: Date.now() / 1000 + 3600,
    });
  }
  async getConnection(id) {
    const connections = await this.DatabaseHelper.queryItemByKey(id);
    if (connections && connections.length > 0) {
      return connections[0];
    }
    if (!connections || connections.length === 0) {
      await this.removeConnection(id);
      throw undefined;
    }
    return undefined;
  }
  async removeConnection(id) {
    return await this.DatabaseHelper.deleteItem(id);
  }
  async getConnectionIds(docName) {
    try {
      let client = await arc.tables();
      let FilterExpression = "DocName = :docName";
      let ExpressionAttributeValues = { ":docName": docName };

      let resultsRaw = await client.YConnectionsTable.scan({
        FilterExpression,
        ExpressionAttributeValues,
      });

      let results = resultsRaw.Items.map((r) => r.PartitionKey);
      console.log(results);

      return results;
    } catch (e) {
      console.error(e);
    }

    // const results = await this.DatabaseHelper.queryItemByKey(docName, {
    //   indexKeyName: "DocName",
    //   indexName: "DocNameIndex",
    // });

    // if (results) return results.map((item) => item.PartitionKey);
    return [];
  }
  async getOrCreateDoc(docName) {
    // const existingDoc = await this.DatabaseHelper.getItem(docName);
    let dbDoc = {
      Updates: [],
    };
    // if (existingDoc) {
    //   dbDoc = existingDoc;

    //   console.log();
    // } else {
    //   await this.DatabaseHelper.createItem(docName, dbDoc, undefined, true);
    // }

    let client = await arc.tables();
    let scan = await client.YUpdates.scan({
      FilterExpression: `docName = :dd`,
      ExpressionAttributeValues: { [":dd"]: { S: docName } },
    });

    dbDoc.Updates = scan.Items.map((r) => {
      return r.update;
    });

    // convert updates to an encoded array
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
  async updateDoc(docName, update) {
    let client = await arc.tables();

    let scan = await client.YUpdates.scan({
      FilterExpression: `docName = :dd`,
      ExpressionAttributeValues: { [":dd"]: { S: docName } },
    });

    let updatesOnly = scan.Items.map((r) => {
      return r.update;
    });

    // convert updates to an encoded array
    const updates = updatesOnly.map(
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

    let combinedUpdates = Y.encodeStateAsUpdate(ydoc);

    await Promise.all([
      ...updatesOnly.map((up) => {
        return Promise.resolve(up)
          .then((up) => {
            return client.YUpdates.delete({ oid: up.oid });
          })
          .catch((ex) => {
            console.error(ex);
          });
      }),
    ]);
    // .delete({})

    let info = await client.YUpdates.scan({});
    let data = await client.YUpdates.put({
      oid: `${docName}-${info.Count}`,
      inc: info.Count,
      docName,
      update: combinedUpdates,
    });

    info = await client.YUpdates.scan({});
    data = await client.YUpdates.put({
      oid: `${docName}-${info.Count}`,
      inc: info.Count,
      docName,
      update: update,
    });

    //

    console.log(data);

    // return await this.DatabaseHelper.updateItemAttribute(
    //   docName,
    //   "Updates",
    //   [update],
    //   undefined,
    //   { appendToList: true }
    // );

    /*
        Future: Try to compute diffs as one large update

        const existingDoc = await this.DatabaseHelper.getItem<DocumentItem>(docName);

            let dbDoc = {
                Updates: []
            }
            if(existingDoc) {
                dbDoc = existingDoc
            }else{
                await this.DatabaseHelper.createItem(docName, dbDoc, undefined, true)
            }

            const oldUpdates = dbDoc.Updates.map(update => new Uint8Array(Buffer.from(update, 'base64')))

            // merge updates into one large update
            const mergedUpdate = Y.mergeUpdates(oldUpdates.concat([update]));

            return await this.DatabaseHelper.updateItemAttribute(docName,'Updates', [toBase64(mergedUpdate)], undefined)*/
  }
}
//# sourceMappingURL=connections.js.map
