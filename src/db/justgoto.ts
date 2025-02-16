import {
  findSettingByName,
  I_DBController,
  I_DBControllerSettings,
} from "./base";

function isBase64Text(text?: string) {
    if (!text) return true;
    return false === "!%@#:<*&->.?|;".split("").some((e) => text.includes(e));
}

export function safeAtob(text?: string) {
    if (!text) return "";
    if (isBase64Text(text)) return atob(text);
    return text;
}

export class JustGoto implements I_DBController {
  useBase64 = true;
  matchPriority = () => -Infinity;
  matchURL = (url: string) => true;

  getName = () => "just-jumping";

  getDesp = () => "USE ORIGIN URL";

  getItem(key: string) {
    return decodeURI(key);
  }

  async addItem(key: string, value: string) {}

  async addItemByAutoKey(value: string) {
    return this.useBase64 ? btoa(encodeURI(value)) : encodeURI(value);
  }

  async init() {
    console.log("current mode is 'just-go-to'");
    this.useBase64 = Boolean(findSettingByName(this, "USE_BASE64"));
  }

  showURLText = (url: string) => decodeURI(url);

  getSettings(): I_DBControllerSettings[] {
    return [
      {
        default: true,
        type: "boolean",
        name: "USE_BASE64",
        desp: "USE BASE64 TO ENCODE URL",
      },
    ];
  }
}
