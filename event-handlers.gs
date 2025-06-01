
/**
 * POST handler to get the summary of attendees for a theatre event.
 * 
 * @param payload - payload of the POST request.
 * @returns {object}
 */
function getTheatreEvent(payload)
{
  // Read spreadsheet data and do some processing
  // For the sake of this example, we will use hardcoded data.

  // dummy data
  const confirmats = [
    ['Institut Joan Guinjoan i Gispert', 2, 3, 4],
    ['Institut Poeta Maragall', 10, 11, 12],
    ['Institut Sant Elm', 2, 3, 4],
    ['Institut de Tecnificació', 10, 11, 12]
  ];
  const reserves = [
    ['Institut Les Planes', 2, 3, 4]
  ];
  const llistadespera = [
    ['Institut Vall d\'Arús', 10, 11, 12],
    ['Institut Antoni Ballester', 2, 3, 4]
  ];

  // Determine the maximum length among the three arrays
  const maxLength = Math.max(confirmats.length, reserves.length, llistadespera.length);

  // Construct the combined data
  const data = [];
  const empty = Array(4).fill(null);
  for (let i = 0; i < maxLength; i++) {
    const c = confirmats[i] || empty;
    const r = reserves[i] || empty;
    const e = llistadespera[i] || empty;
    data.push([...c, ...r, ...e]);
  }

  return {
    success: true,
    message: 'Success.',
    data: data
  };
}
