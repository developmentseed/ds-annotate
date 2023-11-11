import { NotificationManager } from "react-notifications";

export const showNotification = (text, duration) => {
  NotificationManager.warning(text, "Map interaction", duration);
  // setNotificationShown(true);
  // Reactivate the notification after a 10 sec
  // setTimeout(() => {
  //     // setNotificationShown(false);
  // }, 10 * 1000);
};
