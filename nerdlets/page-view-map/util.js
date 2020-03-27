import { timeRangeToNrql } from '@newrelic/nr1-community';

export const entityQuery = guid => {
  return `{
    actor {
      entity(guid: "${guid}") {
        ... on BrowserApplicationEntity {
          settings {
            apdexTarget
          }
          accountId
          applicationId
          name
          servingApmApplicationId
        }
      }
    }
  }`;
};

export const mapData = (accountId, appId, launcherUrlState) => {
  const query = `{
    actor {
      account(id: ${accountId}) {
        mapData: nrql(query: "SELECT count(*) as x, average(duration) as y, sum(asnLatitude)/count(*) as lat, sum(asnLongitude)/count(*) as lng FROM PageView FACET regionCode, countryCode WHERE appId = ${appId} ${createSinceQueryFragment(
    launcherUrlState
  )}  LIMIT 1000 ") {
          results
          nrql
        }
      }
    }
  }`;
  // console.debug(query);
  return query;
};

export const createSinceQueryFragment = (
  launcherUrlState,
  compareWith = false
) => {
  if (!launcherUrlState || !launcherUrlState.timeRange) {
    return 'SINCE 30 minutes ago COMPATE WITH 30 minutes ago';
  }
  const { timeRange } = launcherUrlState;
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
