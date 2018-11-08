import * as storage from './storage';
import fetchJsonp from 'fetch-jsonp';

const discogsApiUrl = 'https://api.discogs.com';
const updateInterval = 60 * 60 * 1000;

export function fetchLibrary(username, forceRefresh) {
    const promise = new Promise(async (resolve, reject) => {
        let releases = [];
        let page = 1;
        let pages;
        const library = storage.get('library') || {};
        const now = (new Date()).getTime();

        if (forceRefresh || !library || library.username !== username || now - library.lastUpdated >= updateInterval) {
            do {
                await fetchJsonp(`${discogsApiUrl}/users/${username}/collection/folders/0/releases?per_page=100&page=${page}`)
                    .then(response => response.json())
                    .then(json => {
                        pages = json.data.pagination.pages
                        releases = [...releases, ...json.data.releases];
                    });
                page++;
            } while(page <= pages);

            library.lastUpdated = (new Date()).getTime();
            library.releases = releases;
            storage.set('library', library);
        }

        library.username = username;

        resolve(library);
    });

    return promise;
}

export async function setUser(user) {
    storage.set('user', user);
}

export async function fetchUser() {
    return storage.get('user');
}

export async function fetchShuffledItem(username) {
    const library = await fetchLibrary(username);
    const storedCounts = storage.get('playCounts') || [];
    const playCounts = library.releases.map(r => storedCounts.find(s => s.releaseId === r.id) || {releaseId: r.id, count: 0});
    const minCount = Math.min(...playCounts.map(p => p.count));
    const minPlayCounts = playCounts.filter(p => p.count === minCount);
    const randomItem = minPlayCounts[Math.floor(Math.random() * minPlayCounts.length)];
    const randomRelease = library.releases.find(r => r.id === randomItem.releaseId);

    randomItem.count ++;
    storage.set('playCounts', playCounts)
    return randomRelease;
}