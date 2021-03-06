import {getStateFromPath, LinkingOptions} from '@react-navigation/native';
import {StackNavigationProp} from "@react-navigation/stack";
import {Route} from "react-native";
import {FirebaseAuthTypes} from "@react-native-firebase/auth";

/**
 * Describe application's path schema to be used (describes all valid path states the application can be in).
 */
const linkingOptions: LinkingOptions = {
    prefixes: ['/'],
    config: {
        screens: {
            Root: {
                screens: {
                    SearchTab: {
                        path: 'search',
                        screens: {
                            SearchHomeScreen: '',
                            SearchServiceScreen: 'service/:code',
                            SearchStopScreen: 'stop/:code',
                            SearchScheduleScreen: 'schedule,',
                            SearchStopMapScreen: 'stop/:code/map',
                        }
                    },
                    MapTab: {
                        path: 'map',
                        screens: {
                            MapHomeScreen: '',
                            MapServiceScreen: 'service/:code',
                            MapStopScreen: 'stop/:code',
                            MapScheduleScreen: 'schedule',
                            MapStopMapScreen: 'stop/:code/map',
                        }
                    },
                    SavedTab: {
                        path: 'saved',
                        screens: {
                            SavedHomeScreen: '',
                            SavedServiceScreen: 'service/:code',
                            SavedStopScreen: 'stop/:code',
                            SavedScheduleScreen: 'schedule',
                            SavedStopMapScreen: 'stop/:code/map',
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
                            SettingsAccountPasswordResetScreen: 'account/reset',
                        }
                    }
                },
            },
            NotFound: '*',
        },
    },
    /**
     * Attempts to determine the state of the application based off the path (reverse engineering navigation).
     *
     * @param path - the string path to obtain state from.
     * @param config - the current configurations (see parent method).
     */
    getStateFromPath(path, config) {
        // Use default method to obtain target state, we want to manipulate this to inject our state into.
        let state: any = getStateFromPath(path, config);

        // State could not be found.
        if (state?.routes[0].name === "NotFound") return state;

        // Trim path as implemented within underlying library ('@react-navigation/native').
        let cleanPath = path
            .replace(/\/+/g, '/') // Replace multiple slash (//) with single ones
            .replace(/^\//, '') // Remove extra leading slash
            .replace(/\?.*$/, ''); // Remove query params which we will handle later

        // Valid sub-paths to inject previous tab.
        const subNames = ['stop', 'service', 'twitter', 'account', 'schedule'];

        // Apply changes.
        if (subNames.find((name) => cleanPath.includes(name))) {
            // Extract current stack (hard coded, but schema defined above ^).
            let routes: any[] = state!.routes[0].state!.routes[0].state!.routes;

            // Capitalise first letter.
            const tabName = capitalizeFirstLetter(cleanPath.split('/')[0]);

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


/**
 * Handles navigation to the schedule screen.
 *
 * @param stopCode - the code of the intersecting stop.
 * @param serviceCode - the code of the intersecting service.
 * @param arrivalTime - the time of intersection.
 * @param navigation - the navigation prop passed to the screen.
 * @param route - the route prop passed to the screen.
 */
export const navigateToSchedule = (stopCode: string, serviceCode: string,
                                   arrivalTime: Date, navigation: StackNavigationProp<any>, route: Route) => {
    const params = {
        date: arrivalTime.toJSON(),
        serviceCode: serviceCode,
        stopCode: stopCode,
    };

    if (route.name.startsWith('Search'))
        navigation.navigate(`SearchScheduleScreen`, params);
    else if (route.name.startsWith('Map'))
        navigation.navigate(`MapScheduleScreen`, params);
    else if (route.name.startsWith('Saved'))
        navigation.navigate(`SavedScheduleScreen`, params);
}

/**
 *  Handles navigation to the Metlink stop map screen (single stop on the map).
 *
 * @param stopCode - the stop code.
 * @param navigation - the navigation prop passed ot the screen.
 * @param route - the route prop passed to the screen.
 */
export const navigateToStopMap = (stopCode: string, navigation: StackNavigationProp<any>, route: Route) => {

    const params = {
        code: stopCode
    }

    if (route.name.startsWith('Search'))
        navigation.navigate(`SearchStopMapScreen`, params);
    else if (route.name.startsWith('Map'))
        navigation.navigate(`MapStopMapScreen`, params);
    else if (route.name.startsWith('Saved'))
        navigation.navigate(`SavedStopMapScreen`, params);
}


/**
 * Handles navigation to Metlink stop and service screens.
 *
 * @param code - the stop or service code.
 * @param isStop - whether the code is for a stop or service.
 * @param navigation - the navigation prop passed to the screen.
 * @param route - the route prop passed to the screen.
 */
export const navigateToMetlink = (code: string, isStop: boolean, navigation: StackNavigationProp<any>, route: Route) => {
    const targScreen: string = (isStop) ? 'Stop' : 'Service';

    const params = {
        code: code,
    }

    if (route.name.startsWith('Search'))
        navigation.navigate(`Search${targScreen}Screen`, params);
    else if (route.name.startsWith('Map'))
        navigation.navigate(`Map${targScreen}Screen`, params);
    else if (route.name.startsWith('Saved'))
        navigation.navigate(`Saved${targScreen}Screen`, params);
}


/**
 * Handles navigation to the different account screens based on the provided UserContext.
 *
 * @param context - the UserContext of the caller.
 * @param navigation - the navigation prop passed to the screen.
 * @param route - the route prop passed to the screen.
 */
export const checkAccountPath = (context: FirebaseAuthTypes.User | null | undefined, navigation: StackNavigationProp<any>, route: Route) => {
    // Context has not mounted, defer to loading screen.
    if (typeof context === 'undefined') return;

    if (context && context.uid) {
        // User context loaded and user logged in.
        if (['SettingsAccountLoginScreen', 'SettingsAcountSignupScreen', 'SettingsAccountPasswordResetScreen'].includes(route.name))
            navigation.navigate('SettingsAccountInfoScreen');
    } else {
        // User context loaded, but no user logged in.
        if (['SettingsAccountInfoScreen'].includes(route.name)) {
            navigation.navigate('SettingsAccountLoginScreen');
        } else {
            // User context has not loaded, don't redirect user.
        }
    }
}

/**
 * Helper method to capitalize the first letter of a string.
 *
 * @param text - input string.
 */
const capitalizeFirstLetter = (text: string) => {
    return text.charAt(0).toUpperCase() + text.slice(1);
}
