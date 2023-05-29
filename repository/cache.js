import NodeCache from "node-cache";

const cache = new NodeCache({ stdTTL: 30 });

export function verifyCache(key) {
    try {
        if (cache.has(key) && key.startsWith('select')) {
            return cache.get(key);
        }
    } catch (err) {
        console.log(err);
    }
}

export function delCache(key) {
    cache.del(key);
}
export function setCache(key, value) {
    let time = cache.stdTTL;
    cache.set(key, value, time);
}