import { openDB } from "idb";
import {
  I_DBController,
  I_DBControllerSettings,
  findSettingByName,
  loadSettings,
  parseNumber,
} from "./base";
import { getXID } from "../utils/xid";
import axios from "axios";

import { uid } from "uid/single";

export class WebhookController implements I_DBController {
  private storeName = "webhook";
  private tableName = "jumping";

  private autoKeyLen = 6;
  private useXID = true;
  private webhook_url = "";

  matchPriority = () => (this.isValidWebhookURL() ? 5 : -2000);
  matchURL = (url: string) =>
    /^[A-Z0-9]+$/.test(url) &&
    (url.length >= this.autoKeyLen - 1 || url.length <= this.autoKeyLen + 1);

  showURLText = (url: string) => url;
  downloadPrefix: string = "jumpingData@indexDB-";

  private isValidWebhookURL(): boolean {
    return !!this.webhook_url && this.webhook_url.startsWith("http");
  }

  getSettings(): I_DBControllerSettings[] {
    return [
      {
        default: "",
        type: "string",
        name: "WEBHOOK_URL",
        desp: "SET THE WEBHOOK ADDRESS",
      },
    ];
  }

  getName = () => "Webhook";

  getDesp = () => "USE UID VIA WEBHOOK";

  async getItem(key: string) {
    if (!this.isValidWebhookURL()) {
      throw new Error("Invalid webhook url: " + this.webhook_url);
    }
    return axios
      .get(this.webhook_url, {
        params: {
          uid: key,
        },
      })
      .then((res) => {
        const url = res.data.url ?? "";
        if (!url) throw new Error("Bad response url: " + url);
        return url;
      });
  }

  async addItemByAutoKey(value: string, uidLength?: number) {
    if (!this.isValidWebhookURL()) {
      throw new Error("Invalid webhook url: " + this.webhook_url);
    }

    return await axios
      .post(this.webhook_url, {
        url: value,
      })
      .then((res) => {
        const uid = res.data.uid ?? "";
        if (!uid) throw new Error("Bad response uid: " + uid);
        return uid;
      });
  }

  async init() {
    this.webhook_url = String(findSettingByName(this, "WEBHOOK_URL"));

    if (this.isValidWebhookURL()) {
      console.log(
        this.getName() +
          " is initialized\nas webhook url is " +
          this.webhook_url
      );
    } else {
      console.log(
        this.getName() +
          " is initialized incorrectly\nas webhook url " +
          this.webhook_url +
          " is invalid"
      );
    }
  }
}
