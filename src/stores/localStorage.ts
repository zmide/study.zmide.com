/*
 * @Author: Bin
 * @Date: 2021-11-13
 * @FilePath: /so.jszkk.com/src/stores/localStorage.ts
 */
var storage = window.localStorage;
async function removeItem(key: string) {
    try {
        await storage.removeItem(key);
        // console.log(`It was removed ${key} successfully`);
        return true;
    } catch (error) {
        // console.log(`It was removed ${key} failure`);
    }
}

async function setItem(key: string, value: any) {
    try {
        await storage.setItem(key, JSON.stringify(value));
        // console.log(`It was saved ${key} successfully`);
        return value;
    } catch (error) {
        // console.log(`It was saved ${key} failure`);
    }
}

async function getItem(key: string) {
    let results: any;
    try {
        results = await storage.getItem(key);
        return JSON.parse(results);
    } catch (error) {
        return null;
    }
}

export {
    removeItem,
    getItem,
    setItem,
};
