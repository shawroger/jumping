import { openDB } from "idb";
import {
  I_DBController,
  I_DBControllerSettings,
  findSettingByName,
  loadSettings,
  parseNumber,
} from "./base";
import { getXID } from "../utils/xid";

import { uid } from "uid/single";
import { createDownloadTxt, getTimestampStr } from "../utils/createDownloadTxt";

export class IndexDBController implements I_DBController {
  private storeName = "urlstore";
  private tableName = "jumping";

  private autoKeyLen = 6;
  private useXID = true;

  matchPriority = () => 0;
  matchURL = (url: string) =>
    /^[A-Z0-9]+$/.test(url) &&
    (url.length >= this.autoKeyLen - 1 || url.length <= this.autoKeyLen + 1);

  showURLText = (url: string) => url;
  downloadPrefix: string = "jumpingData@indexDB-";

  async download() {
    const data = await this.getAll();
    const timestamp = this.useXID ? "(" + getXID() + ")" : getTimestampStr();
    const filename = this.downloadPrefix + timestamp + ".txt";
    createDownloadTxt(filename, data.map((e) => e.join(",")).join("\n"));
    return "download " + filename + " successfully";
  }

  async deleteItem(key: string) {
    const db = await openDB(this.storeName, 1);
    try {
      await db.delete(this.tableName, key);
    } catch (err) {
      return String(err);
    } finally {
      return "Delete key " + key + " successfully";
    }
  }

  async editItem(key: string, value: string) {
    const db = await openDB(this.storeName, 1);
    try {
      await db.put(this.tableName, value, key);
    } catch (err) {
      return String(err);
    } finally {
      return "Edit key " + key + " into new value " + value + " successfully";
    }
  }

  getSettings(): I_DBControllerSettings[] {
    return [
      {
        default: 6,
        type: "number",
        name: "UUID_LENGTH",
        desp: "DEFINE YOUR UID LENGTH",
      },
      {
        type: "string",
        name: "DOWNLOAD_PREFIX",
        default: "JUMPING_URL@INDEXDB",
        desp: "DEFINE DOWNLOAD FILE PREFIX",
      },
      {
        type: "boolean",
        name: "USE_XID",
        default: true,
        desp: "USE XID RATHER THAN UID",
      },
    ];
  }

  async rewriteAll(data: string[][]) {
    const db = await openDB(this.storeName, 1);
    try {
      let transaction = db.transaction(this.tableName, "readwrite");
      await transaction.store.clear();
      for (const [key, value] of data) {
        await transaction.store.add(value, key);
      }
    } catch (err) {
      return String(err);
    } finally {
      return "rewrite the indexDB datatable successfully";
    }
  }

  getName = () => "IndexDB";

  getDesp = () => "USE UID WITH INDEXDB";

  async getItem(key: string) {
    const db = await openDB(this.storeName, 1);
    const value = await db.get(this.tableName, key);
    db.close();
    return value ? String(value) : "";
  }

  async addItem(key: string, value: string) {
    const db = await openDB(this.storeName, 1);
    db.add(this.tableName, value, key);
    db.close();
  }

  async addItemByAutoKey(value: string, uidLength?: number) {
    const key = this.useXID
      ? getXID()
      : uid(uidLength || this.autoKeyLen).toUpperCase();
    this.addItem(key, value);
    return key;
  }
  async init() {
    this.useXID = Boolean(findSettingByName(this, "USE_XID"));
    this.autoKeyLen = parseNumber(
      findSettingByName(this, "UUID_LENGTH") as string,
      6
    );
    this.downloadPrefix = (
      findSettingByName(this, "DOWNLOAD_PREFIX") || this.downloadPrefix
    ).toString();

    console.log(
      this.getName() + " is initialized\nauto key length is " + this.autoKeyLen
    );

    openDB(this.storeName, 1, {
      upgrade: (db) => {
        db.createObjectStore(this.tableName);
      },
    });
  }

  async getAll() {
    const res: string[][] = [];
    const db = await openDB(this.storeName, 1);
    const allVals = await db.getAll(this.tableName);
    const allKeys = await db.getAllKeys(this.tableName);
    db.close();
    const count = Math.min(allKeys.length, allVals.length);

    for (let i = 0; i < count; i++) {
      res.push([String(allKeys[i]), String(allVals[i])]);
    }
    return res;
  }
}
