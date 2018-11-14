export function set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

export function get(key) {
    const value = localStorage.getItem(key);

    return value ? JSON.parse(value) : undefined;
}

export function remove(key) {
    localStorage.removeItem(key);
}