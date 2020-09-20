// useColorScheme from react-native does not support web currently. You can replace
// this with react-native-appearance if you would like theme support on web.
export default function useColorScheme() {
  // Grabs the user's `prefers-color-scheme` exposed by the browser.
  // https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme
  return window.matchMedia("(prefers-color-scheme: dark)") ? 'dark' : 'light';
}
