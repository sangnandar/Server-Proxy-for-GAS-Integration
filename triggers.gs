
/**
 * Handles POST requests to the web app.
 *
 * @param {GoogleAppsScript.Events.AppsScriptHttpRequestEvent} e - event object.
 * @returns {GoogleAppsScript.Content.TextOutput} JSON.
 */
function doPost(e)
{
  const body = JSON.parse(e.postData.contents);

  if (!body.apiKey || body.apiKey !== apiKey) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: messages.invalidApiKey
    })).setMimeType(ContentService.MimeType.JSON);
  }

  let response = {};

  if (isFunction(apiHandlers[body.task])) {
    response = apiHandlers[body.task](body.data);

  } else {
    response = {
      success: false,
      message: messages.invalidTask
    };
  }

  return ContentService.createTextOutput(JSON.stringify(response)).setMimeType(ContentService.MimeType.JSON);
}
