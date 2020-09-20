/**
 * Defines the different screens within each of the different tabs.
 */

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
  SearchHomeScreen: undefined;
  SearchServiceScreen: undefined;
  SearchStopScreen: undefined;
  SearchScheduleScreen: undefined;
}

export type MapTabParamList = {
  MapHomeScreen: undefined;
  MapServiceScreen: undefined;
  MapStopScreen: undefined;
  MapScheduleScreen: undefined;
}

export type SavedTabParamList = {
  SavedHomeScreen: undefined;
  SavedServiceScreen: undefined;
  SavedStopScreen: undefined;
  SavedScheduleScreen: undefined;
}

export type SettingsTabParamList = {
  SettingsHomeScreen: undefined;
  SettingsTwitterScreen: undefined;
  SettingsAccountLoginScreen: undefined;
  SettingsAccountSignupScreen: undefined;
  SettingsAccountInfoScreen: undefined;
  SettingsAccountPasswordResetScreen: undefined;
}
