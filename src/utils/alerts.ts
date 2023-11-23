import { Alert } from "react-native";

/**
 * Show alert with two action buttons
 * @param title: Title of the alert
 * @param message: Message of the alert
 * @param positiveText: Positive button text
 * @param positiveAction: Position button callback action
 * @param negativeText: Negative button text
 * @param negativeAction: Negative button callback action
 */
export const alertWithTwoButtons = (
  title: string,
  message: string,
  positiveText: string,
  positiveAction: any,
  negativeText: string,
  negativeAction: any
) => {
  Alert.alert(
    title,
    message,
    [
      {
        text: negativeText,
        onPress: () => {
          negativeAction();
        }
      },
      {
        text: positiveText,
        onPress: () => {
          positiveAction();
        }
      }
    ],
    { cancelable: false }
  );
};

/**
 * Show alert with one action button
 * @param title: Title of the alert
 * @param message: Message of the alert
 * @param positiveText: button text
 * @param positiveAction: Button callback action
 */
export const alertWithOneButton = (
  title: string,
  message: string,
  positiveText: string,
  positiveAction: any
) => {
  Alert.alert(
    title,
    message,
    [
      {
        text: positiveText,
        onPress: () => {
          positiveAction();
        }
      }
    ],
    { cancelable: false }
  );
};
