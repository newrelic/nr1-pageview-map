import { Base64 } from "js-base64";

/**
 * Returns an array of [accountId, domain, type, domainId]
 * @param {*} entityId
 */
export const decodeEntityId = entityId => {
  return Base64.decode(entityId).split("|");
};
