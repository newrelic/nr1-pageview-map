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
  const { duration, begin_time, end_time } = launcherUrlState.timeRange;

  if (duration) {
    return `SINCE ${duration / 1000 / 60} minutes AGO ${
      compareWith ? ` COMPARE with ${duration / 1000 / 60} minutes AGO` : ''
    }`;
  } else {
    const beginTimeISO = new Date(begin_time).toISOString();
    const endTimeISO = new Date(end_time).toISOString();
    return `SINCE '${beginTimeISO}' UNTIL '${endTimeISO}'${
      compareWith
        ? ` COMPARE with '${beginTimeISO * 2}' UNTIL '${endTimeISO +
            beginTimeISO}'`
        : ''
    }`;
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
