
interface I_DBControllerSettings {
    name: string;
    value: string;
    type: "string" | "number" | "password";
}


export function loadSettingsUtils(db: I_DBController, settings: I_DBControllerSettings[]) {
    const key = db.getName() + "@settings";
    const settingsJson = {
        name: key,
        settings
    }

    window.localStorage.setItem(key.toUpperCase(), JSON.stringify(settingsJson));
    return key;
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

    settingTools?: () => ({
        defineSettings: () => I_DBControllerSettings[],
        loadSettings: (settings: I_DBControllerSettings[]) => void;
    });

}