function processJSON(docJSON) {
  const processedJSON = [];
  const {content} = docJSON.body;

  for (let structElement of content) {
    // Logger.log(structElement);
    if (structElement.paragraph) processParagraph(structElement.paragraph, processedJSON);
  } 

  return processedJSON;
}

function processParagraph(paragraph, processedJSON) {
  const {elements} = paragraph;

  for (let element of elements) {
    if (element.textRun) processTextRun(element.textRun, processedJSON);
  }

}

function processTextRun(textRun, processedJSON) {
  const {content, textStyle} = textRun;
  processedJSON.push(content);
}
