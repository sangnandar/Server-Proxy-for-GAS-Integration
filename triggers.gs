
/**
 * Handles POST requests to the web app.
 *
 * @param {GoogleAppsScript.Events.AppsScriptHttpRequestEvent} e - event object.
 * @returns {GoogleAppsScript.Content.TextOutput} JSON.
 */
function doPost(e)
{
  const body = JSON.parse(e.postData.contents);

  if (body.apiKey !== apiKey) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: MESSAGES.invalidApiKey
    })).setMimeType(ContentService.MimeType.JSON);
  }

  if (!isFunction(apiHandlers[body.task])) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: MESSAGES.invalidTask
    })).setMimeType(ContentService.MimeType.JSON);
  }

  const requiredProps = [
    'name',
    'date',
    'time',
    'place'
  ];
  if (!isObject(body.data) || !requiredProps.every(prop => prop in body.data)) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: MESSAGES.invalidData
    })).setMimeType(ContentService.MimeType.JSON);
  }

  const response = apiHandlers[body.task](body.data);
  return ContentService.createTextOutput(JSON.stringify(response)).setMimeType(ContentService.MimeType.JSON);
}
