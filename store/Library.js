import { action, observable } from 'mobx';
import { AsyncStorage } from 'react-native';

const discogsApiUrl = 'https://api.discogs.com';

class LibraryStore {
    @observable releases;
    @observable username;
    @observable fetching = false;

    constructor () {
        AsyncStorage.getItem('username').then(username => {
            this.username = username;
            this.fetch();
        });
    }

    @action async setUsername (username) {
        AsyncStorage.setItem('username', username);
        this.username = username;
    }

    @action async fetch (forceRefresh) {
        this.fetching = true;

        let releases = [];
        let page = 1;
        let pages;
        const library = await AsyncStorage.getItem('library') || {releases: []};

        if (this.username && (forceRefresh || !library.lastFetched)) {
            do {
                const url = `${discogsApiUrl}/users/${this.username}/collection/folders/0/releases?per_page=100&page=${page}`;
                await fetch(url)
                    .then(async response => {
                        const json = await response.json();
                        return json;
                    })
                    .then(json => {
                        pages = json.pagination.pages
                        releases = [...releases, ...json.releases];
                    });
                page++;
            } while(page <= pages);

            library.lastFetched = (new Date()).getTime();

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

        AsyncStorage.setItem('library', library);
        this.releases = library.releases;
        this.fetching = false;
    };
}

export default new LibraryStore();