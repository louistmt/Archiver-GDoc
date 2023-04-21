/**
 * {
 *   normalStyle: {
 *     italic: false,
 *     bold: false,
 *     strike: false,
 *     under: false
 *   }
 *   styleName: "NORMAL_TEXT",
 *   paragraphs: []
 * }
 */
function createContext(jsonDoc) {
  const {styles} = jsonDoc.namedStyles;
  const normalStyle = styles.find((style) => style.namedStyleType == "NORMAL_TEXT").textStyle;
  const {content} = jsonDoc.body;
  const paragraphs = content.filter((element) => element.paragraph).map(element => element.paragraph);

  return {normalStyle: extractStyle(normalStyle), styleName: "NORMAL_TEXT", paragraphs};
}

function createBasicStyle() {
  return {
    italic: false,
    bold: false,
    strikethrough: false,
    underline: false,
    list: false,
    paragraph: false
  };
}

function extractStyle(docStyle) {
  const style = createBasicStyle()
  if ("italic" in docStyle) {
    style.italic = docStyle.italic
  }

  if ("bold" in docStyle) {
    style.bold = docStyle.bold
  }

  if ("strikethrough" in docStyle) {
    style.strikethrough = docStyle.strikethrough
  }

  if ("underline" in docStyle) {
    style.under = docStyle.underline
  }

  return style
}

function extractTextRuns(paragraph) {
  const {elements} = paragraph;
  const textRuns = elements.filter(element => element.textRun).map(element => element.textRun);
  return textRuns.map(textRun => {
    return {content: textRun.content.replaceAll("\n", ""), style: textRun.textStyle}
  })
}

function extractStringFromTextRuns(textRuns) {
  return textRuns.map(textRun => textRun.content).join("") 
}

function createNode() {
  return {
    type: "NORMAL_TEXT",
    length: 0,
    content: "",
    styleLength: 0,
    style: createBasicStyle()
  }
}

function nodeType(node) {
  return node ? undefined : node.type
}

function calculateNodeContentLength(node) {
  let length = 0
  length += calculateNodeStyleLength(node)
  // Length of the content. It will be 5 if it empty (basically an empty paragraph)
  length += node.content.length > 0 ? node.content.length : 5

  return length
}

function calculateNodeStyleLength(node) {
  let length = 0

  // Italic style **
  length += node.style.italic ? 2 : 0
  // Bold style ****
  length += node.style.bold ? 4 : 0
  // Strike style ~~~~
  length += node.style.strikethrough ? 4 : 0
  // Under style ____
  length += node.style.underline ? 4 : 0
  // Paragraph character \n
  length += node.style.paragraph ? 1 : 0
  // List items start with a "\\> "
  length += node.style.list ? 4 : 0
  // Heading 2 and 3 have start with a "- "
  length += node.type === "HEADING_2" || node.type === "HEADING_3" ? 2 : 0
  // Subtitle and Heading 1 may have a "** **" after
  length += node.type === "SUBTITLE" || node.type === "HEADING_1" ? 5 : 0

  return length
}
