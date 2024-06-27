import { openDB } from "idb"
import { I_DBController } from "./base";

import { uid } from "uid/single";

export class IndexDBController implements I_DBController {
    

    private storeName = 'urlstore';
    private tableName = 'jumping';

    
    matchPriority =  () => 0;
    matchURL = (url: string) => /^[A-Z0-9]{5}$/.test(url);


    showURLText = (url: string) => url;

    
    download?: (() => void) | undefined;
    upload?: (() => void) | undefined;
    getName = () => "IndexDB";

    getDesp = () => "use IndexDB to store data";

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

    async addItemByAutoKey(value: string, uidLength = 5) {
        const key = uid(uidLength).toUpperCase();
        this.addItem(key, value);
        return key;
    }
    async init() {
        console.log(this.getName() + " is initialized")
        openDB(this.storeName, 1, {
            upgrade: (db) => {
                db.createObjectStore(this.tableName);
            },
        });
    }

    async showAll() {

        const db = await openDB(this.storeName, 1);
        const data = await db.getAll(this.tableName);
    }

}