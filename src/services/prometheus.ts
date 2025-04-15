/**
 * Represents a Prometheus query result.
 */
export interface PrometheusQueryResult {
  /**
   * The metric name.
   */
  metric: { [key: string]: string };
  /**
   * The values of the metric over time.
   */
  values: [number, string][];
}

/**
 * Queries Prometheus for a given query.
 *
 * @param query The Prometheus query to execute.
 * @returns A promise that resolves to an array of PrometheusQueryResult objects.
 */
export async function queryPrometheus(
  query: string
): Promise<PrometheusQueryResult[]> {
  // TODO: Implement this by calling an API.
  console.log('Querying Prometheus with query:', query);

  return [
    {
      metric: { __name__: 'cpu_usage', pod: 'pod-1' },
      values: [
        [1678886400, '0.5'],
        [1678886460, '0.6'],
      ],
    },
  ];
}
