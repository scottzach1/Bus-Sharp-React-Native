import {StatusBar} from 'expo-status-bar';
import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import CustomThemeProvider from "./providers/CustomThemeProvider";
import {initSavedServices, initSavedStops, initServices, initStops, initTheme} from "./external/StorageManager";
import UserProvider from "./providers/UserProvider";
import NotificationProvider from "./providers/NotificationProvider";

/**
 * This components represents the entire application encompassing all of the components of the app.
 *
 * This component not only encompasses the different view components but also any provider, state or context components.
 */
export default function App() {
    console.disableYellowBox = true;

    const isLoadingComplete = useCachedResources();
    const colorScheme = useColorScheme();

    // Initialise data within local storage (if not present).
    initTheme().then();
    initStops().then();
    initServices().then();
    initSavedServices().then();
    initSavedStops().then();

    if (!isLoadingComplete) {
        // Component not loaded, don't return anything yet.
        return null;
    } else {
        // Return the entire application wrapped within the provider components.
        return (
            <SafeAreaProvider>
                <NotificationProvider>
                    <UserProvider>
                        <CustomThemeProvider>
                            <Navigation colorScheme={colorScheme}/>
                            <StatusBar/>
                        </CustomThemeProvider>
                    </UserProvider>
                </NotificationProvider>
            </SafeAreaProvider>
        );
    }
}
