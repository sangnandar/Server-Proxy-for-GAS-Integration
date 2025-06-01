/*******************************************************
 **        GLOBAL VARIABLES AND CONFIGURATIONS        **
 *******************************************************/

/*
 * Rename this file to config.gs
 * and replace the placeholder values
 * with your actual values.
 */

// === START: Configuration for HTTP Requests ===
const apiKey = 'DEFINE-YOUR-API-KEY'; // static key implementation
const apiHandlers = {
  getTheatreEvent
};
// === END: Configuration for HTTP Requests ===

const MESSAGES = readOnlyObject({
  invalidApiKey: `API key is invalid!`,
  invalidTask: `Task name is invalid!`,
  invalidData: `Data is invalid or missing required properties!`
});

