import {Ionicons} from '@expo/vector-icons';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import * as React from 'react';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import {
    BottomTabParamList,
    MapTabParamList,
    SavedTabParamList,
    SearchTabParamList,
    SettingsTabParamList
} from '../types';
import SearchScreen from "../screens/SearchScreen";
import MapScreen from "../screens/MapScreen";
import SavedScreen from "../screens/SavedScreen";
import SettingsScreen from "../screens/SettingsScreen";
import {createStackNavigator} from "@react-navigation/stack";
import ServiceScreen from "../screens/ServiceScreen";
import StopScreen from "../screens/StopScreen";
import TwitterScreen from "../screens/TwitterScreen";

const BottomTab = createBottomTabNavigator<BottomTabParamList>();

export default function BottomTabNavigator() {
    const colorScheme = useColorScheme();

    return (
        <BottomTab.Navigator
            initialRouteName="SearchTab"
            tabBarOptions={{activeTintColor: Colors[colorScheme].tint}}>
            <BottomTab.Screen
                name={"SearchTab"}
                component={SearchTabNavigator}
                options={{
                    tabBarIcon: ({color}) => <TabBarIcon name="ios-search" color={color}/>,
                }}
            />
            <BottomTab.Screen
                name={"MapTab"}
                component={MapTabNavigator}
                options={{
                    tabBarIcon: ({color}) => <TabBarIcon name="ios-map" color={color}/>,
                }}
            />
            <BottomTab.Screen
                name={"SavedTab"}
                component={SavedTabNavigator}
                options={{
                    tabBarIcon: ({color}) => <TabBarIcon name="ios-star" color={color}/>,
                }}
            />
            <BottomTab.Screen
                name={"SettingsTab"}
                component={SettingsTabNavigator}
                options={{
                    tabBarIcon: ({color}) => <TabBarIcon name="ios-settings" color={color}/>,
                }}
            />
        </BottomTab.Navigator>
    );
}

// You can explore the built-in icon families and icons on the web at:
// https://icons.expo.fyi/
function TabBarIcon(props: { name: string; color: string }) {
    return <Ionicons size={30} style={{marginBottom: -3}} {...props} />;
}

// Each tab has its own navigation stack, you can read more about this pattern here:
// https://reactnavigation.org/docs/tab-based-navigation#a-stack-navigator-for-each-tab

const SearchTabStack = createStackNavigator<SearchTabParamList>();

function SearchTabNavigator() {
    return (
        <SearchTabStack.Navigator initialRouteName={"SearchScreen"}>
            <SearchTabStack.Screen
                name={"SearchScreen"}
                component={SearchScreen}
                options={{headerTitle: 'Search Tab'}}
            />
            <SearchTabStack.Screen
                name={"ServiceScreen"}
                component={ServiceScreen}
                options={{headerTitle: 'Service Perspective'}}
            />
            <SearchTabStack.Screen
                name={"StopScreen"}
                component={StopScreen}
                options={{headerTitle: 'Stop Perspective'}}
            />
        </SearchTabStack.Navigator>
    )
}

const MapTabStack = createStackNavigator<MapTabParamList>();

function MapTabNavigator() {
    return (
        <MapTabStack.Navigator initialRouteName={"MapScreen"}>
            <MapTabStack.Screen
                name={"MapScreen"}
                component={MapScreen}
                options={{headerTitle: 'Map Tab'}}
            />
            <SearchTabStack.Screen
                name={"ServiceScreen"}
                component={ServiceScreen}
                options={{headerTitle: 'Service Perspective'}}
            />
            <SearchTabStack.Screen
                name={"StopScreen"}
                component={StopScreen}
                options={{headerTitle: 'Stop Perspective'}}
            />
        </MapTabStack.Navigator>
    )
}

const SavedTabStack = createStackNavigator<SavedTabParamList>();

function SavedTabNavigator() {
    return (
        <SavedTabStack.Navigator initialRouteName={"SavedScreen"}>
            <SavedTabStack.Screen
                name={"SavedScreen"}
                component={SavedScreen}
                options={{headerTitle: 'Saved Tab'}}
            />
            <SearchTabStack.Screen
                name={"ServiceScreen"}
                component={ServiceScreen}
                options={{headerTitle: 'Service Perspective'}}
            />
            <SearchTabStack.Screen
                name={"StopScreen"}
                component={StopScreen}
                options={{headerTitle: 'Stop Perspective'}}
            />
        </SavedTabStack.Navigator>
    )
}

const SettingsTabStack = createStackNavigator<SettingsTabParamList>();

function SettingsTabNavigator() {
    return (
        <SettingsTabStack.Navigator initialRouteName={"SettingsScreen"}>
            <SettingsTabStack.Screen
                name={"SettingsScreen"}
                component={SettingsScreen}
                options={{headerTitle: 'Settings Tab'}}
            />
            <SettingsTabStack.Screen
                name={"TwitterScreen"}
                component={TwitterScreen}
                options={{headerTitle: 'Twitter Feed'}}
            />
        </SettingsTabStack.Navigator>
    )
}