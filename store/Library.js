import { observable } from 'mobx';
import { AsyncStorage } from 'react-native';

const discogsApiUrl = 'https://api.discogs.com';
const updateInterval = 60 * 60 * 1000 * 24;

class LibraryStore {
    @observable library = undefined;
    @observable fetching = false;

    constructor() {
        this.fetch('wblanchette');
    }

    async fetch (username, forceRefresh) {
        this.fetching = true;

        let releases = [];
        let page = 1;
        let pages;
        const library = await AsyncStorage.getItem('library') || {releases: []};
        const now = (new Date()).getTime();

        if (forceRefresh || !library || library.username !== username || now - library.lastUpdated >= updateInterval) {
            do {
                const url = `${discogsApiUrl}/users/${username}/collection/folders/0/releases?per_page=100&page=${page}`;
                await fetch(url)
                    .then(async response => {
                        const json = await response.json();
                        return json;
                    })
                    .then(json => {
                        pages = 1; //json.pagination.pages
                        releases = [...releases, ...json.releases];
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
        }

        library.username = username;
        AsyncStorage.setItem('library', library);
        this.library = library;
        this.fetching = false;
    };
}

export default new LibraryStore();