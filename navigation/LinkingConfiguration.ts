import * as Linking from 'expo-linking';
import {LinkingOptions} from '@react-navigation/native';
import {getStateFromPath} from '@react-navigation/native';

const linkingOptions: LinkingOptions = {
    prefixes: [Linking.makeUrl('/')],
    config: {
        screens: {
            Root: {
                screens: {
                    SearchTab: {
                        path: 'search',
                        screens: {
                            SearchHomeScreen: '',
                            SearchServiceScreen: 'service/:code',
                            SearchStopScreen: 'stop/:code'
                        }
                    },
                    MapTab: {
                        path: 'map',
                        screens: {
                            MapHomeScreen: '',
                            MapServiceScreen: 'service/:code',
                            MapStopScreen: 'stop/:code'
                        }
                    },
                    SavedTab: {
                        path: 'saved',
                        screens: {
                            SavedHomeScreen: '',
                            SavedServiceScreen: 'service/:code',
                            SavedStopScreen: 'stop/:code'
                        }
                    },
                    SettingsTab: {
                        path: 'settings',
                        screens: {
                            SettingsHomeScreen: '',
                            SettingsTwitterScreen: 'twitter',
                            SettingsAccountLoginScreen: 'account/login',
                            SettingsAccountSignupScreen: 'account/signup',
                            SettingsAccountInfoScreen: 'account/info',
                        }
                    }
                },
            },
            NotFound: '*',
        },
    },
    getStateFromPath(path, config) {
        const state = getStateFromPath(path, config);

        // console.log('state', state)

        return state;
    }
};

export default linkingOptions;