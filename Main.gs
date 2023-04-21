function doGet(e) {
  const {docId} = e.parameter
  // const docId = "1b9ptvcg9nO2JzK25H0mjgnu0AofLUYgoKBhI5oSfOF0" // Normal test
  // const docId = "1BdpHVjRpnV5iYjs7BC5w_XulVHP-PEOu3VvyLMM4f8A" // First Paragraph has more than 2000 characters;
  // const docId = "18Tdwd77KU7bb0oMLSDSZONK5WhfChqO0KC7VBBykShA";

  const jsonDoc = Docs.Documents.get(docId)
  const nodes = processDocToNodes(jsonDoc)

  const sizedNodes = splitLargeNodes(nodes)

  const discordMsgs = generateDiscordMsgs(sizedNodes)

  return ContentService.createTextOutput(JSON.stringify(discordMsgs)).setMimeType(ContentService.MimeType.JSON)
}
