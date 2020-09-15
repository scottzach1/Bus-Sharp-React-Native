import {StatusBar} from 'expo-status-bar';
import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
// @ts-ignore Webstorm won't recognize this, functions normally.
import Toast from 'react-native-toast-message';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import {initSavedServices, initSavedStops, initServices, initStops, initTheme} from "./external/StorageManager";
import CustomThemeProvider from "./providers/ThemeProvider";
import UserProvider from "./providers/UserProvider";

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
            <UserProvider>
                <CustomThemeProvider>
                    <SafeAreaProvider>
                        <Navigation colorScheme={colorScheme}/>
                        <Toast ref={(ref: any) => Toast.setRef(ref)}/>
                        <StatusBar/>
                    </SafeAreaProvider>
                </CustomThemeProvider>
            </UserProvider>
        );
    }
}
