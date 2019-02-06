import { DISCOGS_KEY, DISCOGS_SECRET } from 'react-native-dotenv';

const discogsApiUrl = 'https://api.discogs.com';

export class DiscogsAPI {
    async get(endpoint, params = {}) {
        params.key = DISCOGS_KEY;
        params.secret = DISCOGS_SECRET;

        const queryString = Object.keys(params)
            .map(key => `${key}=${params[key]}`)
            .join('&');
        const url = `${discogsApiUrl}/${endpoint}?${queryString}`;

        return await fetch(url)
            .then(async response => {
                const json = await response.json();
                return json;
            });
    }
}