// Copyright 2019 New Relic Corporation. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import { Base64 } from 'js-base64';

/**
 * Returns an array of [accountId, domain, type, domainId]
 * @param {*} entityGuid
 */
export const decodeEntityId = entityGuid => {
  return Base64.decode(entityGuid).split('|');
};
