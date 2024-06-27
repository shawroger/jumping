import { inject } from "vue"
import { DB_PROVIDER_KEY, DB_Provider } from "../db";

export function loadDB(): DB_Provider {
    return inject(DB_PROVIDER_KEY)!;
}