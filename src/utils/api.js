import * as storage from './storage';
import fetchJsonp from 'fetch-jsonp';

const discogsApiUrl = 'https://api.discogs.com';
const updateInterval = 60 * 60 * 1000;

export function fetchLibrary(username, forceRefresh) {
    const promise = new Promise(async (resolve, reject) => {
        let releases = [];
        let page = 1;
        let pages;
        let library = storage.get('library');
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
            } while(page < pages);

            library = {
                lastUpdated: (new Date()).getTime(),
                releases,
                username
            };
            storage.set('library', library);
        }

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