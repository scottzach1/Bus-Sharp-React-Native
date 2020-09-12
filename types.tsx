export type RootStackParamList = {
    Root: undefined;
    NotFound: undefined;
};

export type BottomTabParamList = {
    SearchTab: undefined;
    MapTab: undefined;
    SavedTab: undefined;
    SettingsTab: undefined;
};

export type SearchTabParamList = {
    search: undefined;
    service: {
        code: string
    };
    stop: {
        code: string
    };
}

export type MapTabParamList = {
    map: undefined;
    service: {
        code: string
    };
    stop: {
        code: string
    };
}

export type SavedTabParamList = {
    saved: undefined;
    service: {
        code: string
    };
    stop: {
        code: string
    };
}

export type SettingsTabParamList = {
    settings: undefined;
    twitter: undefined;
}