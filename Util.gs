/**
 * {
 *   normalStyle: {
 *     italic: false,
 *     bold: false,
 *     strike: false,
 *     under: false
 *   }
 *   styleName: "NORMAL_TEXT",
 *   list: false,
 *   paragraphs: []
 * }
 */
function createContext(jsonDoc) {
  const {styles} = jsonDoc.namedStyles;
  const normalStyle = styles.find((style) => style.namedStyleType == "NORMAL_TEXT").textStyle;
  const {content} = jsonDoc.body;
  const paragraphs = content.filter((element) => element.paragraph).map(element => element.paragraph);

  return {normalStyle: extractStyle(normalStyle), styleName: "NORMAL_TEXT", list: false, paragraphs};
}

function createBasicStyle() {
  return {
    italic: false,
    bold: false,
    strike: false,
    under: false
  };
}

function extractStyle(docStyle) {
  const style = {};
  if ("italic" in docStyle) {
    style.italic = docStyle.italic
  }

  if ("bold" in docStyle) {
    style.bold = docStyle.bold
  }

  if ("strikethrough" in docStyle) {
    style.strike = docStyle.strikethrough
  }

  if ("underline" in docStyle) {
    style.under = docStyle.underline
  }

  return style
}

function copyStyle(context) {
  return Object.assign({}, context.normalStyle);
}

function extractTextRuns(paragraph) {
  const {elements} = paragraph;
  const textRuns = elements.filter(element => element.textRun).map(element => element.textRun);
  return textRuns.map(textRun => {
    return {content: textRun.content, style: extractStyle(textRun.textStyle)}
  })
}

function extractStringFromTextRuns(textRuns) {
  return textRuns.map(textRun => textRun.content).join("") 
}

function calculateContentLength(content) {
  let length = 0;

  for (let str of content) {
    length += str.length;
  }

  return length;
}

function calculateStyleLength(style) {
  let length = 0;
  length += style.italic ? 2 : 0;
  length += style.bold ? 4 : 0;
  length += style.strike ? 4 : 0;
  length += style.under ? 4 : 0;

  return length;
}
