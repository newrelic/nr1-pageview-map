import { timeRangeToNrql } from '@newrelic/nr1-community';

export const ENTITY_QUERY = `query($entityGuid: String!) {
  actor {
    entity(guid: $entityGuid) {
      ... on BrowserApplicationEntity {
        settings {
          apdexTarget
        }
        guid
        accountId
        applicationId
        name
        servingApmApplicationId
      }
      spa: nrdbQuery(nrql: "SELECT count(*) FROM BrowserInteraction") {
        results
        nrql
      }
    }
  }
}`;

export const createSinceQueryFragment = (
  platformUrlState,
  compareWith = false
) => {
  if (!platformUrlState || !platformUrlState.timeRange) {
    return 'SINCE 30 minutes ago COMPATE WITH 30 minutes ago';
  }
  const { timeRange } = platformUrlState;
  const since = timeRangeToNrql({ timeRange });
  if (compareWith) {
    const SECOND = 1000;
    let delta = timeRange.duration;
    if (timeRange.beginTime && timeRange.endTime) {
      delta = timeRange.endTime - timeRange.beginTime;
    } else if (timeRange.begin_time && timeRange.end_time) {
      delta = timeRange.end_time - timeRange.begin_time;
    }
    return `${since} COMPARE WITH ${delta / SECOND} SECONDS ago`;
  } else {
    return since;
  }
};

/**
 * Provide a color from the standard palette based on apdexTarget
 * @param {number} measure - value beign measure, commonly duration
 * @param {number} apdexTarget - configured value of the apdex target for a given entity
 */
export const getMarkerColor = (measure, apdexTarget) => {
  if (measure <= apdexTarget) {
    return '#11A600';
  } else if (measure >= apdexTarget && measure <= apdexTarget * 4) {
    return '#FFD966';
  } else {
    return '#BF0016';
  }
};
