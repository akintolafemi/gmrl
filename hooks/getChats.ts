import { AsyncStorage } from 'react-native';

export default async function getChats(chatId) {
  try {
    const retrievedChats =  await AsyncStorage.getItem('gmrl_chats_'+chatId);
    const savedChats = JSON.parse(retrievedChats);
    return savedChats;
  } catch (error) {
    console.log(error.message);
    return [];
  }
}
