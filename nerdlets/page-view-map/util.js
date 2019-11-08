export const entityQuery = (guid) => {
  return `{
    actor {
      entity(guid: "${guid}") {
        ... on BrowserApplicationEntity {
          settings {
            apdexTarget
            __typename
          }
          accountId
          applicationId
          servingApmApplicationId
          __typename
        }
      }
    }
  }`;
}

export const mapData = (accountId, appId, launcherUrlState) => {
  return `{
    actor {
      account(id: ${accountId}) {
        mapBoundaries: nrql(query: "SELECT max(asnLatitude) as latMax, max(asnLongitude) as lngMax, min(asnLatitude) as latMin, min(asnLongitude) as lngMin FROM PageView WHERE appId = ${appId} ${createSinceQueryFragment(launcherUrlState)} ") {
          results
          nrql
        }
        mapData: nrql(query: "SELECT count(*) as x, average(duration) as y, sum(asnLatitude)/count(*) as lat, sum(asnLongitude)/count(*) as lng FROM PageView FACET regionCode, countryCode WHERE appId = ${appId} ${createSinceQueryFragment(launcherUrlState)} ") {
          results
          nrql
        }
      }
    }
  }`
}

export const createSinceQueryFragment = (launcherUrlState, compareWith = false) => {
  const {duration, begin_time, end_time } = launcherUrlState.timeRange;

  if (duration) {
    return `SINCE ${duration / 1000 / 60} minutes AGO ${compareWith ? ` COMPARE with ${duration / 1000 / 60} minutes AGO` : ''}`;
  } else {
    const beginTimeISO = new Date(begin_time).toISOString();
    const endTimeISO = new Date(end_time).toISOString();
    return `SINCE '${beginTimeISO}' UNTIL '${endTimeISO}'${compareWith ? ` COMPARE with '${beginTimeISO*2}' UNTIL '${endTimeISO+beginTimeISO}'` : ''}`;
  }
};
