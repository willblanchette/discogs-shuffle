import { action, observable, toJS } from 'mobx';
import moment from 'moment';
import { AsyncStorage } from 'react-native';

class HistoryStore {
    @observable history;

    constructor () {
        AsyncStorage.getItem('history').then(history => {
            this.history = observable(JSON.parse(history) || {});

            // Convert timestamps to dates

            (Object.values(this.history)).forEach(release => {
                release.forEach(item => {
                    item.date = moment.unix(item.date);
                });
            });
        });
    }

    @action async play (release) {
        if (!this.history[release.id]) {
            this.history[release.id] = [];
        }

        this.history[release.id].push({
            date: moment()
        })

        await this.save();
    }

    @action async delete (release, item) {
        if (this.history[release.id]) {
            const index = this.history[release.id].indexOf(item);

            if (index > -1) {
                this.history[release.id].splice(index, 1);
            }

            await this.save();
        }
    }

    @action async save() {
        const history = toJS(this.history);

        // Convert dates to timestamps

        Object.values(history).forEach(release => {
            release.forEach(item => {
                item.date = item.date.unix();
            });
        });

        await AsyncStorage.setItem('history', JSON.stringify(history));
    }
}

export default new HistoryStore();