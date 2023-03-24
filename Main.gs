function doGet(e) {
  const {docId} = e.parameter;

  const docJSON = Docs.Documents.get(docId);
  const processedJSON = processJSON(docJSON);
  const cleanedJSON = cleanJSON(processedJSON);

  return ContentService.createTextOutput(
    JSON.stringify(cleanedJSON)
  ).setMimeType(ContentService.MimeType.JSON);
}
