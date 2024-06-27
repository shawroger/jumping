import { openDB } from "idb"
import { I_DBController } from "./base";

import { uid } from "uid/single";

export class JustGoto implements I_DBController {
    matchPriority =  () => -Infinity;
    matchURL = (url: string) => true;




    showAll?: (() => string[][]) | undefined;
    download?: (() => void) | undefined;
    upload?: (() => void) | undefined;
    getName = () => "justgoto";

    getDesp = () => "use origin input URL and do not shorten it";

    getItem(key: string) {
        return decodeURI(key);
    }

    async addItem(key: string, value: string) {

    }

    async addItemByAutoKey(value: string, uidLength = 5) {
        return encodeURI(value);
    }

    async init() {
        console.log("current mode is 'just-go-to'")
    }


    showURLText = (url: string) => decodeURI(url);

}