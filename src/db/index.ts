import { I_DBController } from "./base";
import { IndexDBController } from "./indexdb";
import { JustGoto } from "./justgoto";

type Constructor<T> = new (...args: any[]) => T;

export class DB_Provider {

    private _db: I_DBController[] = []

    getProviders() {
        return this._db;
    }

    findBy(key: ((p: I_DBController) => string) | string, value: string): [I_DBController | null, number] {
        for (let i = 0; i < this._db.length; i++) {
            const provider = this._db[i];
            if (typeof key === "string") {
                //@ts-expect-error
                if (provider[key] === value) {
                    return [provider, i];
                }
            } else {
                if (key(provider) === value) {
                    return [provider, i];
                }
            }
        }
        return [null, -1];
    }

    findByName(name: string) {
        return this.findBy((item) => item.getName(), name);
    }

    findByDesp(desp: string) {
        return this.findBy((item) => item.getDesp(), desp);
    }



    static init() {
        return new DB_Provider();
    }

    use(dbController: I_DBController | Constructor<I_DBController>) {
        if (typeof dbController === "function") {
            this._db.push(new dbController());
        } else {
            this._db.push(dbController);
        }

        return this;
    }

    current() {
        return this._db[this.mode()];
    }

    isValidModeIndex(modeIndex: number) {
        return 0 <= modeIndex && modeIndex < this._db.length;
    }

    matchProvider(url: string) {
        const matchList = this._db.sort((a, b) => -a.matchPriority() + b.matchPriority());
        for (const provider of matchList) {
            console.log("matchProvider: " + provider.getName())
            if (provider.matchURL(url)) {
                return provider;
            }
        }

        return matchList[0];
    }

    mode(modeIndex?: number) {
        const KEY = "CURRENT_STORAGE_MODE";
        if (modeIndex !== undefined) {
            window.localStorage.setItem(KEY, String(modeIndex));
            console.log("set key{" + KEY + "} with value = " + modeIndex);
        } else {
            const val = window.localStorage.getItem(KEY);
            if (val) {
                modeIndex = parseInt(val);
            }

            if (modeIndex === undefined || modeIndex === null || isNaN(modeIndex) || modeIndex < 0) {
                modeIndex = 0;
            }
        }

        const resMode = Math.min(modeIndex, this._db.length);

        if (this.isValidModeIndex(modeIndex)) {
            this._db[resMode].init();
        }

        return resMode;
    }
}

export const db_Provider = DB_Provider
    .init()
    .use(JustGoto)
    .use(IndexDBController);
export const DB_PROVIDER_KEY = "db_provider"