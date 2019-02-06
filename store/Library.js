import { action, observable } from 'mobx';
import { AsyncStorage } from 'react-native';

import { DiscogsAPI } from '../util/DiscogsAPI';

const discogs = new DiscogsAPI();

class LibraryStore {
    @observable releases;
    @observable username;
    @observable fetching = false;

    constructor () {
        AsyncStorage.getItem('username').then(username => {
            this.username = 'wblanchette'; //username;
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
        const library = JSON.parse((await AsyncStorage.getItem('library'))) || {releases: []};

        if (this.username && (forceRefresh || !library.lastFetched)) {
            do {
                const url = `users/${this.username}/collection/folders/0/releases`;
                const params = {
                    per_page: 100,
                    page,
                };
                await discogs.get(url, params)
                    .then(result => {
                        pages = result.pagination.pages
                        releases = [...releases, ...result.releases];
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

        try {
            await AsyncStorage.setItem('library', JSON.stringify(library));
        } catch(e) {
            // TODO: Handle error
            console.error('Error persisting library:', e);
        }
        this.releases = library.releases;
        this.fetching = false;
    };
}

export default new LibraryStore();