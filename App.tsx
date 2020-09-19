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

export default function App() {
    const isLoadingComplete = useCachedResources();
    const colorScheme = useColorScheme();

    initTheme().then();
    initStops().then();
    initServices().then();
    initSavedServices().then();
    initSavedStops().then();

    if (!isLoadingComplete) {
        return null;
    } else {
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
