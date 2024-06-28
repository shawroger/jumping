
import { I_DBController } from "./base";

export class JustGoto implements I_DBController {
    matchPriority =  () => -Infinity;
    matchURL = (url: string) => true;




    getName = () => "just-jumping";

    getDesp = () => "use origin input URL and do not shorten it";

    getItem(key: string) {
        return decodeURI(key);
    }

    async addItem(key: string, value: string) {

    }

    async addItemByAutoKey(value: string) {
        return encodeURI(value);
    }

    async init() {
        console.log("current mode is 'just-go-to'")
    }


    showURLText = (url: string) => decodeURI(url);

}