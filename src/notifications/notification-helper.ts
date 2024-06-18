import { TFunction } from 'i18next';
import { Notification, NotificationVariant } from 'src/notifications/notification';
import { constants } from 'src/constants';

// createAndDispatchNotification() can be used publicly by components
export const createAndDispatchNotification = (
  message: string,
  type: NotificationVariant,
  t?: TFunction,
  options?: {
    autohide?: boolean;
    dismissible?: boolean;
    clearPrevious?: boolean;
  },
) => {
  if (message) {
    document.dispatchEvent(
      new CustomEvent<Notification>(constants.addMessageEvent, {
        detail: {
          message: message ?? t?.(`notifications.messages.${type}`),
          variant: type,
          prefix: t ? t(`notifications.prefixes.${type}`): '',
          autohide: options?.autohide,
          dismissible: options?.dismissible,
          clearPrevious: options?.clearPrevious,
        },
      }),
    );
  }
};

// clearAllPermanentNotifications() can be used publicly by components
export const clearAllPermanentNotifications = () => {
  document.dispatchEvent(new CustomEvent(constants.clearAllPermanentNotificationEvent, { detail: {} }));
};

// clearAllNotifications() can be used publicly by components
export const clearAllNotifications = () => {
  document.dispatchEvent(new CustomEvent(constants.clearAllNotificationEvent, { detail: {} }));
};
