import get from 'lodash.get';
import { createSinceQueryFragment } from '../util';

/**
 * Generate the NRQL for a given type of Browser application, traditional or single page app
 */
export default class NrqlFactory {
  static getFactory(data) {
    // console.debug(data);
    const hasSpa = get(data, 'actor.entity.spa.results[0].count');
    // console.debug(`hasSpa = ${hasSpa}`);
    if (parseInt(hasSpa) > 0) {
      return new SPAFactory();
    } else {
      return new PageViewFactory();
    }
  }

  constructor() {
    if (this.constructor === 'NrqlFactory') {
      throw new TypeError(
        'Abstract class "NrqlFactory" cannot be instantiated.'
      );
    }
    if (this.getType === undefined) {
      throw new TypeError('NrqlFactory classes must implement getType');
    }
    if (this.getMapDataGraphQL === undefined) {
      throw new TypeError('NrqlFactory classes must implement mapData');
    }
    if (this.getQuery1 === undefined) {
      throw new TypeError('NrqlFactory classes must implement getQuery1');
    }
    if (this.getQueryTitle1 === undefined) {
      throw new TypeError('NrqlFactory classes must implement getQueryTitle1');
    }
    if (this.getQuery2 === undefined) {
      throw new TypeError('NrqlFactory classes must implement getQuery2');
    }
    if (this.getQueryTitle2 === undefined) {
      throw new TypeError('NrqlFactory classes must implement getQueryTitle2');
    }
    if (this.getQuery3 === undefined) {
      throw new TypeError('NrqlFactory classes must implement getQuery3');
    }
    if (this.getQueryTitle3 === undefined) {
      throw new TypeError('NrqlFactory classes must implement getQueryTitle3');
    }
  }
}

class PageViewFactory extends NrqlFactory {
  constructor() {
    super();
  }

  getType() {
    return 'PAGEVIEW';
  }

  getMapDataGraphQL(options) {
    const { accountId, appId, platformUrlState } = options;
    const graphql = `{
      actor {
        account(id: ${accountId}) {
          mapData: nrql(query: "SELECT count(*) as x, average(duration) as y, sum(asnLatitude)/count(*) as lat, sum(asnLongitude)/count(*) as lng FROM PageView FACET regionCode, countryCode WHERE appId = ${appId} ${createSinceQueryFragment(
      platformUrlState
    )}  LIMIT 1000 ") {
            results
            nrql
          }
        }
      }
    }`;
    // console.debug(graphql);
    return graphql;
  }

  getQuery1(options) {
    const { appId, openedFacet, platformUrlState } = options;
    return `SELECT histogram(duration) FROM PageView WHERE appId = ${appId} ${
      openedFacet.facet[0]
        ? ` WHERE regionCode = '${openedFacet.facet[0]}' `
        : ''
    } ${
      openedFacet.facet[1]
        ? ` WHERE countryCode = '${openedFacet.facet[1]}' `
        : ''
    } ${createSinceQueryFragment(platformUrlState)}`;
  }

  getQueryTitle1() {
    return 'Overall Duration';
  }

  getQuery2(options) {
    const { appId, openedFacet, platformUrlState } = options;

    return `SELECT histogram(backendDuration) FROM PageView WHERE appId = ${appId} ${
      openedFacet.facet[0]
        ? ` WHERE regionCode = '${openedFacet.facet[0]}' `
        : ''
    } ${
      openedFacet.facet[1]
        ? ` WHERE countryCode = '${openedFacet.facet[1]}' `
        : ''
    } ${createSinceQueryFragment(platformUrlState)} `;
  }

  getQueryTitle2() {
    return 'Backend Duration';
  }

  getQuery3(options) {
    const { appId, openedFacet, platformUrlState } = options;
    return `SELECT histogram(timeToDomComplete) FROM PageView WHERE appId = ${appId} ${
      openedFacet.facet[0]
        ? ` WHERE regionCode = '${openedFacet.facet[0]}' `
        : ''
    } ${
      openedFacet.facet[1]
        ? ` WHERE countryCode = '${openedFacet.facet[1]}' `
        : ''
    } ${createSinceQueryFragment(platformUrlState)} `;
  }

  getQueryTitle3() {
    return 'DOM Processing';
  }
}

class SPAFactory extends NrqlFactory {
  constructor() {
    super();
  }

  getType() {
    return 'SPA';
  }

  getMapDataGraphQL(options) {
    const { accountId, entity, platformUrlState } = options;
    const graphql = `{
      actor {
        account(id: ${accountId}) {
          mapData: nrql(query: "SELECT count(*) as x, average(duration) as y, sum(asnLatitude)/count(*) as lat, sum(asnLongitude)/count(*) as lng FROM BrowserInteraction FACET regionCode, countryCode WHERE entityGuid = '${
            entity.guid
          }' ${createSinceQueryFragment(platformUrlState)}  LIMIT 1000 ") {
            results
            nrql
          }
        }
      }
    }`;
    // console.debug(graphql);
    return graphql;
  }

  getQuery1(options) {
    const { entity, openedFacet, platformUrlState } = options;
    const query = `SELECT histogram(duration) FROM BrowserInteraction WHERE entityGuid = '${
      entity.guid
    }'  ${
      openedFacet.facet[0]
        ? ` WHERE regionCode = '${openedFacet.facet[0]}' `
        : ''
    } ${
      openedFacet.facet[1]
        ? ` WHERE countryCode = '${openedFacet.facet[1]}' `
        : ''
    } ${createSinceQueryFragment(platformUrlState)} `;
    // console.debug(query);
    return query;
  }

  getQueryTitle1() {
    return 'Overall Duration';
  }

  getQuery2(options) {
    const { entity, openedFacet, platformUrlState } = options;

    const query = `SELECT histogram(timeToDomLoading) FROM BrowserInteraction WHERE entityGuid = '${
      entity.guid
    }' ${
      openedFacet.facet[0]
        ? ` WHERE regionCode = '${openedFacet.facet[0]}' `
        : ''
    } ${
      openedFacet.facet[1]
        ? ` WHERE countryCode = '${openedFacet.facet[1]}' `
        : ''
    } ${createSinceQueryFragment(platformUrlState)} `;
    // console.debug(query);
    return query;
  }

  getQueryTitle2() {
    return 'Time to DOM Loading';
  }

  getQuery3(options) {
    const { entity, openedFacet, platformUrlState } = options;
    const query = `SELECT histogram(timeToDomComplete) FROM BrowserInteraction WHERE entityGuid = '${
      entity.guid
    }' ${
      openedFacet.facet[0]
        ? ` WHERE regionCode = '${openedFacet.facet[0]}' `
        : ''
    } ${
      openedFacet.facet[1]
        ? ` WHERE countryCode = '${openedFacet.facet[1]}' `
        : ''
    } ${createSinceQueryFragment(platformUrlState)} `;
    // console.debug(query);
    return query;
  }

  getQueryTitle3() {
    return 'DOM Processing';
  }
}
