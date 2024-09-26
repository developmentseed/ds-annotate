import { NotificationManager } from "react-notifications";

export const setDefaultNotification = (text, title, duration) => {
  NotificationManager.warning(text, title, duration);
};

// export const setCustomNotification = (text, title, duration) => {
//   if (!notificationShown) {
//     NotificationManager.warning(text, title, duration);
//     setNotificationShown(true);
//     setTimeout(() => {
//       setNotificationShown(false);
//     }, 10 * 1000);
//   }
// };
