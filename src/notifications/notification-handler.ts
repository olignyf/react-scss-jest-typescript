import { ApiResponse } from 'apisauce';
import { TFunction } from 'i18next';
import { GenericResponse } from 'src/requests/generic-response';
import { NotificationVariant } from 'src//notifications/notification';
import { createAndDispatchNotification } from 'src/notifications/notification-helper';
import { constants } from 'src/constants';

export interface NotificationHandlerConfiguration {
  successMessage: string;
  errorMessage: string;
  reminderMessage: string;
  warningMessage: string;
}

/*
 * Non-Rx Handlers

export const handleGenericResponse = (response: GenericResponse, t: TFunction): GenericResponse => {
  if (response.error || response.success === false) {
    createAndDispatchNotification(response.message, NotificationVariant.ERROR, t);
    // TODO: Validate this behaviour
    throw new ServerError(response.message, 0);
  }
  return response;
}; */


/**
 * To use when you want to display a notification on success. Simply add this to the responseHandler, if the response
 * is not nil, it will display the notification you want
 * @param response: generic response, will receive what you need
 * @param t: translator for notification
 * @param type: notification type
 * @param message: notification message
 */
export const dispatchNotificationHandler = <T>(
  response: T,
  t: TFunction,
  type: NotificationVariant,
  message: string,
): T => {
  if (response != null) {
    createAndDispatchNotification(message, type, t);
  }
  return response;
};


/*
 * Notification to be used in the component views
   TODO: Product depedant. Adjust to your backend responses.
 */
export const notificationHandler = (
  response: ApiResponse<GenericResponse>,
  success: string,
  error: string,
  t: TFunction,
  withSuccessPrefix?: boolean,
): void => {
  if (response.ok) {
    createAndDispatchNotification(
      success,
      withSuccessPrefix ? NotificationVariant.SUCCESS_WITH_PREFIX : NotificationVariant.SUCCESS,
      t,
    );
  } else {
    // Error can be in json {errorText: ""} or as plain text "Error: Invalid stream id."
    if (typeof response.data === 'string' && (response.data as string).startsWith('<?xml version=')) {
      createAndDispatchNotification(t('notifications.internalServerError'), NotificationVariant.ERROR, t);
    } else if (typeof response.data === 'string') {
      const prefix = 'Error: ';
      const message = response.data as string;
      if (message.startsWith(prefix)) {
        createAndDispatchNotification(message.substring(prefix.length), NotificationVariant.ERROR, t);
      } else {
        createAndDispatchNotification(message, NotificationVariant.ERROR, t);
      }
    } else if (response.data && typeof response.data.error === 'string') {
      createAndDispatchNotification(response.data.error, NotificationVariant.ERROR, t);
    } else if (response.data && typeof response.data.error === 'boolean' && typeof response.data.message === 'string') {
      createAndDispatchNotification(response.data.message, NotificationVariant.ERROR, t);
    } else {
      createAndDispatchNotification(error, NotificationVariant.ERROR, t);
    }
  }
};
