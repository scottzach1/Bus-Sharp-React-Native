import * as Linking from 'expo-linking';

export default {
  prefixes: [Linking.makeUrl('/')],
  config: {
    screens: {
      Root: {
        screens: {
          SearchTab: {
            screens: {
              SearchScreen: 'search',
              ServiceScreen: 'service',
              StopScreen: 'stop'
            }
          },
          MapTab: {
            screens: {
              MapScreen: 'map',
              ServiceScreen: 'service',
              StopScreen: 'stop'
            }
          },
          SavedTab: {
            screens: {
              SavedScreen: 'saved',
              ServiceScreen: 'service',
              StopScreen: 'stop'
            }
          },
          SettingsTab: {
            screens: {
              SettingsScreen: 'settings',
              TwitterScreen: 'twitter'
            }
          }
        },
      },
      NotFound: '*',
    },
  },
};
