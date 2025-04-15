/**
 * Represents an alert received from Alertmanager.
 */
export interface Alert {
  /**
   * The labels associated with the alert, providing context.
   */
  labels: { [key: string]: string };
  /**
   * The annotations associated with the alert, providing additional information.
   */
  annotations: { [key: string]: string };
  /**
   * The start time of the alert.
   */
  startsAt: string;
  /**
   * The end time of the alert (if resolved).
   */
  endsAt?: string;
  /**
   * The generator URL for the alert.
   */
  generatorURL: string;
  /**
   * The URL to the alert in Alertmanager.
   */
  alertmanagerURL: string;
}

/**
 * Represents the data structure received from Alertmanager's webhook.
 */
export interface AlertManagerWebhookPayload {
  /**
   * The status of the alert group (e.g., 'firing', 'resolved').
   */
  status: string;
  /**
   * The group labels associated with the alerts.
   */
  groupLabels: { [key: string]: string };
  /**
   * The common annotations shared by the alerts in the group.
   */
  commonAnnotations: { [key: string]: string };
  /**
   * The common labels shared by the alerts in the group.
   */
  commonLabels: { [key: string]: string };
  /**
   * The external URL where Alertmanager can be accessed.
   */
  externalURL: string;
  /**
   * An array of Alert objects representing the individual alerts in the group.
   */
  alerts: Alert[];
}

/**
 * Handles the alert received from Alertmanager.
 *
 * @param alertData The AlertManagerWebhookPayload received from Alertmanager.
 * @returns A promise that resolves when the alert has been handled.
 */
export async function handleAlert(alertData: AlertManagerWebhookPayload): Promise<void> {
  // TODO: Implement this by calling an API.
  console.log('Alert received from Alertmanager:', alertData);
}
