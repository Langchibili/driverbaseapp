'use strict';

/**
 * device-id service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::device-id.device-id');
