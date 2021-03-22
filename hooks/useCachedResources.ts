import { Ionicons, FontAwesome } from '@expo/vector-icons';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import * as React from 'react';

export default function useCachedResources() {
  const [isLoadingComplete, setLoadingComplete] = React.useState(false);

  // Load any resources or data that we need prior to rendering the app
  React.useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        SplashScreen.preventAutoHideAsync();

        // Load fonts
        await Font.loadAsync({
          ...Ionicons.font,
          FontAwesome: require('native-base/Fonts/FontAwesome.ttf'),
          'space-mono': require('../assets/fonts/SpaceMono-Regular.ttf'),
          'barcelony': require('../assets/fonts/Barcelony.ttf'),
          'lily': require('../assets/fonts/Lily-of-the-Valley.ttf'),
          'open-sans': require('../assets/fonts/OpenSans.ttf'),
          'open-sans-light': require('../assets/fonts/OpenSans-Light.ttf'),
        });
      } catch (e) {
        // We might want to provide this error information to an error reporting service
        console.warn(e);
      } finally {
        setLoadingComplete(true);
        SplashScreen.hideAsync();
      }
    }

    loadResourcesAndDataAsync();
  }, []);

  return isLoadingComplete;
}
