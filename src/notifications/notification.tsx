export enum NotificationVariant {
  ERROR = 'Error',
  REMINDER = 'Reminder',
  SUCCESS = 'Success',
  WARNING = 'Warning',
  SUCCESS_WITH_PREFIX = 'SUCCESS_WITH_PREFIX',
}

export interface Notification {
  prefix: string /* TODO remove? */;
  message: string;
  /**
   * The type of notification
   * @default 'Reminder'
   */
  variant?: NotificationVariant;
  /**
   * specify if the notification is hidden automatically
   * @default true
   */
  autohide?: boolean;
  /**
   * number of milliseconds the notification is showing
   * before being auto dismissed
   * @default 5000
   */
  delay?: number;
  /**
   * when set to true, the notification can be
   * dismissed either automatically or manually;
   * when set to false, the notification won't
   * be dismissed by the user
   * @default true
   */
  dismissible?: boolean;
  /**
   * message to be displayed on the second line
   * Note: Only for Argon theme
   */
  subMessage?: string;
  /**
   * Clear previous notification shown before showing this one
   */
  clearPrevious?: boolean;
}
interface Props {
  [key: string]: any;
  message: string;
  id?: string;
}

/**
 *
 */
export const Notification = (props: Props) => {
   const { id, message, ...rest } = props;
  
    return <div id={id} {...rest}>
    <div /><span>{message}</span>
   
    </div>;
  };
  