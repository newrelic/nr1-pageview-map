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
        mapData: nrql(query: "SELECT count(*) as x, average(duration) as y, sum(asnLatitude)/count(*) as lat, sum(asnLongitude)/count(*) as lng FROM PageView FACET regionCode, countryCode WHERE appId = ${appId} ${timeRangeToNrql(
    launcherUrlState.timeRange
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
