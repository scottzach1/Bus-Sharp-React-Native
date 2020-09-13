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

        // Check whether we should insert a previous state in the routes stack.
        if (path.includes('/service/') || path.includes('/stop/')) {
            // Extract current stack (hard coded, but schema defined above ^).
            let routes: any[] = state!.routes[0].state!.routes[0].state!.routes;
            console.log('alt', routes, JSON.stringify(routes));

            let tab: string;

            if (path.includes('/search/'))
                tab = 'Search';
            else if (path.includes('/map/'))
                tab = 'Map';
            else if (path.includes('/saved/'))
                tab = 'Saved';
            else
                return undefined;

            // Insert to the first index of list (how elegant JS!).
            routes = [{
                name: tab + "HomeScreen",
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