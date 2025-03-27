import {
  I_DBController,
  I_DBControllerSettings,
  findSettingByName,
} from "./base";
import axios from "axios";

export class WebhookController implements I_DBController {
  private autoKeyLen = 6;
  private webhookURL = "";

  matchPriority = () => (this.isValidWebhookURL() ? 5 : -2000);
  matchURL = (url: string) =>
    /^[A-Z0-9]+$/.test(url) &&
    (url.length >= this.autoKeyLen - 1 || url.length <= this.autoKeyLen + 1);

  showURLText = (url: string) => url;
  downloadPrefix: string = "jumpingData@indexDB-";

  private isValidWebhookURL(): boolean {
    return this.webhookURL.startsWith("http");
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

  getName = () => "webhook";

  getDesp = () => "USE UID VIA WEBHOOK";

  async getItem(key: string) {
    if (!this.isValidWebhookURL()) {
      throw new Error("Invalid webhook url " + this.webhookURL);
    }
    return axios
      .get(this.webhookURL, {
        params: {
          key,
        },
      })
      .then((res) => {
        const url = res.data.url ?? "";
        if (!url) throw new Error(res.data.message);
        return url;
      })
      .catch((e) => {
        throw e;
      });
  }

  async addItemByAutoKey(value: string) {
    if (!this.isValidWebhookURL()) {
      throw new Error("Invalid webhook url " + this.webhookURL);
    }

    return await axios
      .post(this.webhookURL, {
        url: value,
      })
      .then((res) => {
        const key = res.data.key ?? "";
        if (!key) throw new Error(res.data.message);
        return key;
      })
      .catch((e) => {
        throw e;
      });
  }

  async init() {
    this.webhookURL = String(findSettingByName(this, "WEBHOOK_URL"));

    if (this.isValidWebhookURL()) {
      console.log(
        this.getName() + " is initialized\nas webhook url is " + this.webhookURL
      );
    } else {
      console.log(
        this.getName() +
          " is initialized incorrectly\nas webhook url " +
          this.webhookURL +
          " is invalid"
      );
    }
  }
}
