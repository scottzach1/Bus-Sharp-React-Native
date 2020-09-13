import * as Linking from 'expo-linking';
import {getStateFromPath, LinkingOptions} from '@react-navigation/native';

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
        let state: any = getStateFromPath(path, config);

        // State could not be found.
        if (state?.routes[0].name === "NotFound") return state;

        // Trim path as implemented within underlying library ('@react-navigation/native').
        let cleanPath = path
            .replace(/\/+/g, '/') // Replace multiple slash (//) with single ones
            .replace(/^\//, '') // Remove extra leading slash
            .replace(/\?.*$/, ''); // Remove query params which we will handle later

        // Valid sub-paths to inject previous tab.
        const subNames = ['stop', 'service', 'twitter', 'account'];

        // Apply changes.
        if (subNames.find((name) => cleanPath.includes(name))) {
            // Extract current stack (hard coded, but schema defined above ^).
            let routes: any[] = state!.routes[0].state!.routes[0].state!.routes;
            console.log('alt', routes, JSON.stringify(routes));

            // Capitalise first letter.
            let tabName = cleanPath.split('/')[0];
            tabName = tabName.charAt(0).toUpperCase() + tabName.slice(1);

            // Insert to the first index of list (how elegant JS!).
            routes = [{
                name: tabName + "HomeScreen",
                params: null
            }].concat(routes);

            // Update the state
            state!.routes[0].state!.routes[0].state!.routes = routes;
        }

        // Bob's ya aunty!
        return state;
    }
};

export default linkingOptions;