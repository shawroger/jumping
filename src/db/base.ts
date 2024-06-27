
export interface I_DBControllerSettings {
    name: string;
    desp?: string;
    placeholder?: string;
    value?: string | number;
    default: string | number;
    type: "string" | "number" | "password";
}

export function parseNumber(value: string | number | undefined, defaultValue: number) {
    if(typeof value === "number") return value;
    if(typeof value === "undefined") return defaultValue;
    const num = parseInt(value);
    return isNaN(num) ? defaultValue : num;
}

export function findSettingByName(db: I_DBController, name: string): string | number | undefined {
    const settings = loadSettings(db);

    for (const item of settings) {
        if (item.name == name) {
            return item.value;
        }
    }

    return undefined;
}

export function loadSettings(db: I_DBController) {
    const key = (db.getName() + "@settings").toUpperCase();

    let settingJson: I_DBControllerSettings[] = [];
    const settingsValue = window.localStorage.getItem(key);

    if (settingsValue) {
        const json = JSON.parse(settingsValue);
        settingJson = json.settings;

    } else if (db.getSettings) {
        settingJson = db.getSettings();
    }

    for (const item of settingJson) {
        if (item.value === undefined) {
            item.value = item.default;
        }

        if (item.desp === undefined) {
            item.desp = item.name;
        }

        if (item.placeholder === undefined) {
            item.placeholder = item.desp;
        }
    }
    return settingJson;
}

export function setSettings(db: I_DBController, settingsValue: I_DBControllerSettings[]) {
    const key = (db.getName() + "@settings").toUpperCase();

    const json = {
        key,
        settings: (settingsValue)
    };

    window.localStorage.setItem(key, JSON.stringify(json));
}

export function mergeSettings(settingsValue: I_DBControllerSettings[], newValues: any) {
    for (const item of settingsValue) {
        if (newValues[item.name] !== undefined) {
            item.value = newValues[item.name];
        } else if (item.value === undefined) {
            item.value = item.default;
        }
    }
    return settingsValue;
}


export interface I_DBController {
    getName: () => string;
    getDesp: () => string;
    matchPriority: () => number;
    matchURL: (url: string) => boolean;
    showURLText: (url: string) => string;


    deleteItem?: (key: string) => string | Promise<string>;
    editItem?: (key: string, value: string) => string | Promise<string>;


    init: (params?: any) => void;
    addItem: (key: string, value: string) => void;
    getItem: (key: string) => string | Promise<string>;
    addItemByAutoKey: (value: string, uidLength?: number) => string | Promise<string>;


    // can ignore
    download?: () => string | Promise<string>;
    rewriteAll?: (data: string[][]) => string | Promise<string>;
    getAll?: () => string[][] | Promise<string[][]>;

    getSettings?: () => I_DBControllerSettings[];

}