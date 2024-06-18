import React from 'react';
import { Notification, NotificationVariant } from 'src/notifications/notification';
import { constants } from 'src/constants';
import { v4 as uuidv4 } from 'uuid';

interface InternalNotification extends Notification {
  id: string;
}

/**
 * Component to control the notifications. The component listens to dom events and will display
 * the notification based on this.
 *
 */
export class NotificationController extends React.Component<
  {}, // inputs props
  { notifications: InternalNotification[] } // state type
> {
  constructor(props: any) {
    super(props);
    const notifs: InternalNotification[] = [];
    this.state = {
      notifications: notifs,
    };
  }

  addMsg = (event: CustomEvent) => {
    if (event.detail.variant === NotificationVariant.SUCCESS_WITH_PREFIX) {
      event.detail.variant = NotificationVariant.SUCCESS;
    } else if (event.detail.variant === NotificationVariant.SUCCESS) {
      event.detail.prefix = undefined;
    }
    if (event.detail.clearPrevious === true) {
      this.setState((_prevState) => ({
        notifications: [],
      }));
    }

    this.setState((prevState) => ({
      notifications: [
        ...prevState.notifications,
        {
          id: uuidv4(),
          message: event.detail.message,
          variant: event.detail.variant,
          prefix: event.detail.prefix,
          autohide: event.detail.autohide,
          dismissible: event.detail.dismissible,
        } as InternalNotification,
      ],
    }));
  };

  clearAllPermanentNotifications = () => {
    this.setState((prevState) => ({
      notifications: [...prevState.notifications.filter((notif) => notif.autohide)], // keep only ones that autohide, remove other permanent
    }));
  };

  clearAllNotifications = () => {
    this.setState((_prevState) => ({
      notifications: [],
    }));
  };

  onDismiss = (notification: InternalNotification): void => {
    const index = this.state.notifications.indexOf(notification);
    if (index >= 0) {
      const notifications = this.state.notifications;
      notifications.splice(index, 1);
      this.setState({ notifications: notifications }); // this will remove it from the DOM, otherwise it would stay in the DOM but hidden.
    }
  };

  public componentDidMount() {
    document.addEventListener(constants.addMessageEvent, this.addMsg as EventListener);
    document.addEventListener(constants.clearAllPermanentNotificationEvent, this.clearAllPermanentNotifications);
    document.addEventListener(constants.clearAllNotificationEvent, this.clearAllNotifications);
  }

  public componentWillUnmount() {
    document.removeEventListener(constants.addMessageEvent, this.addMsg as EventListener);
    document.removeEventListener(constants.clearAllPermanentNotificationEvent, this.clearAllPermanentNotifications);
    document.removeEventListener(constants.clearAllNotificationEvent, this.clearAllNotifications);
  }

  render() {
    return (
      <div id="notifications">
        {this.state.notifications.map((notif: InternalNotification) => (
          <Notification
            className="notification-item"
            id={`p0p-notif-${notif.id}`}
            key={notif.id}
            show={true}
            message={notif.message}
            autohide={notif.autohide ?? true}
            variant={notif.variant}
            dismissible={notif.dismissible ?? true}
            onDismiss={() => this.onDismiss(notif)}
          />
        ))}
      </div>
    );
  }
}
