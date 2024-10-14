import { AndroidImportance } from '@notifee/react-native';
import {
  MetaMaskAndroidChannel,
  notificationChannels,
} from './androidChannels';

describe('notificationChannels', () => {
  it('should have two channels', () => {
    expect(notificationChannels).toHaveLength(2);
  });

  it('should have the correct properties for the first channel', () => {
    const firstChannel: MetaMaskAndroidChannel = notificationChannels[0];
    expect(firstChannel).toEqual({
      id: 'DEFAULT_NOTIFICATION_CHANNEL_ID',
      name: 'Transaction Complete',
      lights: true,
      vibration: true,
      importance: AndroidImportance.HIGH,
      title: 'Transaction',
      subtitle: 'Transaction Complete',
    });
  });

  it('should have the correct properties for the second channel', () => {
    const secondChannel: MetaMaskAndroidChannel = notificationChannels[1];
    expect(secondChannel).toEqual({
      id: 'ANNOUNCEMENT_NOTIFICATION_CHANNEL_ID',
      name: 'MetaMask Announcement',
      lights: true,
      vibration: true,
      importance: AndroidImportance.HIGH,
      title: 'Announcement',
      subtitle: 'MetaMask Announcement',
    });
  });

  it('should have unique titles for each channel', () => {
    const titles = notificationChannels.map((channel) => channel.title);
    const uniqueTitles = new Set(titles);
    expect(uniqueTitles.size).toBe(titles.length);
  });

  it('should have unique subtitles for each channel', () => {
    const subtitles = notificationChannels.map((channel) => channel.subtitle);
    const uniqueSubtitles = new Set(subtitles);
    expect(uniqueSubtitles.size).toBe(subtitles.length);
  });
});
