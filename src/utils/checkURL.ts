export function catchParam(queryName: string): [string | null, string];
export function catchParam(queryName: string[]): [string | null, string];
export function catchParam(queryName: string | string[]): [string | null, string] {

    if (!Array.isArray(queryName)) {
        let href = window.location.href;
        if (href.includes("#/")) {
            href = href.replace("#/", "");
        }
        const current = new URL(href);
        const value = current.searchParams.get(queryName);
        if (value) {
            return [value, queryName];
        }
        return [null, ""];
    }



    for (const name of queryName) {
        const res = catchParam(name);
        if (res[0] !== null) {
            return res;
        }
    }

    return [null, ""];
}