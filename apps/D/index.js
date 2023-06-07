import { Platform, UIManager } from 'react-native';
import { enableScreens } from 'react-native-screens';
import App from './src/App';

// Enable react-native-screens
if (Platform.OS === 'android') {
    enableScreens(true);

    try {
        if (UIManager.setLayoutAnimationEnabledExperimental) {
            UIManager.setLayoutAnimationEnabledExperimental(true);
        }
    } catch (error) {}
}

// Mount app
export default App;
