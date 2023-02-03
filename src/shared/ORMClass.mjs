import { v4 } from "uuid";
import * as arc from "@architect/functions";
// let arc = require("@architect/functions");
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

class ORMClass {
  constructor({ collection }) {
    this.collection = collection;
    this.DBProm = arc.tables();
    this.DocProm = this.DBProm.then((DB) => {
      return DB._doc;
    });
    this.TableProm = this.DBProm.then((DB) => {
      return DB[this.collection];
    });
  }
  async create({ data }) {
    let Table = await this.TableProm;
    let createdItem = await Table.put(data);

    return createdItem;
  }
  async remove({ data }) {
    let Table = await this.TableProm;
    let removedItem = await Table.delete(data);

    return removedItem;
  }
  async list({
    FilterExpression = "age >= :givenAge",
    ExpressionAttributeValues = { ":givenAge": 3 },
  }) {
    let Table = await this.TableProm;
    let result = await Table.scan({
      FilterExpression,
      ExpressionAttributeValues,
    });

    return result;
  }

  async update({ data }) {
    let Table = await this.TableProm;
    let createdItem = await Table.put(data);

    return createdItem;
  }

  async batchWrite({ list = [] }) {
    // let Table = await this.TableProm;
    let Doc = await this.DocProm;
    let res = await Doc.batchWrite({
      //
      RequestItems: {
        [this.collection]: [
          ...list.map((li) => {
            return {
              PutRequest: {
                Item: marshall(li),
              },
            };
          }),
        ],
      },
    }).promise();

    console.log(res);

    return res;
  }

  async get({ keyName, keyValue }) {
    let Table = await this.TableProm;
    let queryResult = await Table.get({
      [keyName]: keyValue,
    });

    return queryResult;
  }

  getID() {
    return v4();
  }
}

export default ORMClass;
