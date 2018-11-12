import * as storage from './storage';
import fetchJsonp from 'fetch-jsonp';

const discogsApiUrl = 'https://api.discogs.com';
const updateInterval = 60 * 60 * 1000 * 24;

export function fetchLibrary(username, forceRefresh) {
    const promise = new Promise(async (resolve, reject) => {
        let releases = [];
        let page = 1;
        let pages;
        const library = storage.get('library') || {releases: []};
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
            releases.forEach(release => {
                const existing = library.releases.find(r => r.id === release.id);

                if (existing) {
                    release.metadata = existing.metadata;
                } else {
                    release.metadata = {
                        playedCount: 0,
                        skippedCount: 0,
                        played: false
                    }
                }
            });
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
    let unplayed = library.releases.filter(r => !r.metadata.played);

    if (!unplayed.length) {
        library.releases.forEach(r => r.metadata.played = false);
        unplayed = library.releases();
    }

    const randomRelease = unplayed[Math.floor(Math.random() * unplayed.length)];

    randomRelease.metadata.playedCount ++;
    randomRelease.metadata.played = true;

    storage.set('library', library)
    return randomRelease;
}

export async function skipItem(release) {
    const library = storage.get('library');
    const libraryRelease = library.releases.find(r => r.id === release.id);

    if (libraryRelease) {
        libraryRelease.metadata.playedCount = Math.max(0, libraryRelease.metadata.playedCount - 1);
        libraryRelease.metadata.skippedCount++;
        libraryRelease.metadata.played = false;
        storage.set('library', library);
    }
}