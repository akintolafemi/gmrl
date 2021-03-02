import { AsyncStorage } from 'react-native';

export default async function useProfile() {
  try {
    const retrievedProfile =  await AsyncStorage.getItem('gmrl');
    const savedProfile = JSON.parse(retrievedProfile);
    return savedProfile
  } catch (error) {
    console.log(error.message);
  }
  return
}
