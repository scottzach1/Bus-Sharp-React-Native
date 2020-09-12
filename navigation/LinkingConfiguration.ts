import * as Linking from 'expo-linking';

export default {
  prefixes: [Linking.makeUrl('/')],
  config: {
    screens: {
      Root: {
        screens: {
          SearchTab: {
            screens: {
              SearchScreen: 'search'
            }
          },
          MapTab: {
            screens: {
              MapScreen: 'map'
            }
          },
          SavedTab: {
            screens: {
              SavedScreen: 'saved'
            }
          },
          SettingsTab: {
            screens: {
              SettingsScreen: 'settings'
            }
          }
        },
      },
      NotFound: '*',
    },
  },
};
