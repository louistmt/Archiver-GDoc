function doGet(e) {
  const {docId} = e.parameter;
  const jsonDoc = Docs.Documents.get(docId);

  const context = createContext(jsonDoc);
  const parsed = parseDocJSON(context);
  const grouped = groupParsed(parsed);
  const msgs = generateDiscordMsgs(grouped);


  return ContentService.createTextOutput(JSON.stringify(msgs))
                       .setMimeType(ContentService.MimeType.JSON);
}
