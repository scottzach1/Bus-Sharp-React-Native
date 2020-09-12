import * as Linking from 'expo-linking';

export default {
  prefixes: [Linking.makeUrl('/')],
  config: {
    screens: {
      Root: {
        screens: {
          SearchTab: {
            path: 'search',
            screens: {
              SearchScreen: '',
              ServiceScreen: 'service/:code',
              StopScreen: 'stop/:code'
            }
          },
          MapTab: {
            path: 'map',
            screens: {
              MapScreen: '',
              ServiceScreen: 'service/:code',
              StopScreen: 'stop/:code'
            }
          },
          SavedTab: {
            path: 'saved',
            screens: {
              SavedScreen: '',
              ServiceScreen: 'service/:code',
              StopScreen: 'stop/:code'
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
