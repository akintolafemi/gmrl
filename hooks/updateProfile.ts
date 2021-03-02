import { AsyncStorage } from 'react-native';

export default async function useProfile(profile) {
  try {
    await AsyncStorage.setItem('gmrl', JSON.stringify(profile));
  } catch (error) {
    console.log(error.message);
  }
  return
}
