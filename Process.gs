/**
 * Processes the text runs contained in the json of the google
 * doc into a list that contains items such as the following
 * 
 * {
 *   type: "NORMAL_TEXT"
 *   content: ""
 *   style: {
 *     italic: false,
 *     bold: false,
 *     strike: false,
 *     under: false,
 *     bullet: false,
 *     paragraph: false
 *   }
 * }[]
 * 
 * The format of the context is
 * 
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
function processDocToNodes(jsonDoc) {
  const nodes = []
  const context = createContext(jsonDoc)

  for (let paragraph of context.paragraphs) {
    nodes.push(...processParagraphToNodes(paragraph, context))
  }

  return nodes
}

function processDocToContext(jsonDoc) {
  const {styles} = jsonDoc.namedStyles;
  const normalStyle = styles.find((style) => style.namedStyleType == "NORMAL_TEXT").textStyle;
  const {content} = jsonDoc.body;
  const paragraphs = content.filter((element) => element.paragraph).map(element => element.paragraph);

  return {normalStyle: extractStyle(normalStyle), styleName: "NORMAL_TEXT", paragraphs};
}

function processParagraphToNodes(paragraph, context) {
  const nodes = []
  const textRuns = extractTextRuns(paragraph)
  const styleName = paragraph.paragraphStyle.namedStyleType
  const {normalStyle} = context
  const basicStyle = createBasicStyle()
  basicStyle.list = paragraph.bullet ? true : false

  switch (styleName) {
    case "TITLE":
      var node = createNode()
      node.type = "TITLE"
      node.content = extractStringFromTextRuns(textRuns)
      node.style = {
        ...basicStyle,
        bold: true,
        underline: true,
        paragraph: true
      }
      node.length = calculateNodeContentLength(node)
      node.styleLength = calculateNodeStyleLength(node)
      nodes.push(node)
      break;
    case "SUBTITLE":
      var node = createNode()
      node.type = "SUBTITLE"
      node.content = extractStringFromTextRuns(textRuns)
      node.style = {
        ...basicStyle,
        italic: true,
        paragraph: true
      }
      node.length = calculateNodeContentLength(node)
      node.styleLength = calculateNodeStyleLength(node)
      nodes.push(node)
      break;
    case "HEADING_1":
      var node = createNode()
      node.type = "HEADING_1",
      node.content = extractStringFromTextRuns(textRuns)
      node.style = {
        ...basicStyle,
        bold: true,
        paragraph: true
      }
      node.length = calculateNodeContentLength(node)
      node.styleLength = calculateNodeStyleLength(node)
      nodes.push(node)
      break;
    case "HEADING_2":
      var node = createNode()
      node.type = "HEADING_2",
      node.content = extractStringFromTextRuns(textRuns)
      node.style = {
        ...basicStyle,
        bold: true,
        paragraph: true
      }
      node.length = calculateNodeContentLength(node)
      node.styleLength = calculateNodeStyleLength(node)
      nodes.push(node)
      break;
    case "HEADING_3":
      var node = createNode()
      node.type = "HEADING_3",
      node.content = extractStringFromTextRuns(textRuns)
      node.style = {
        ...basicStyle,
        italic: true,
        paragraph: true
      }
      node.length = calculateNodeContentLength(node)
      node.styleLength = calculateNodeStyleLength(node)
      nodes.push(node)
      break;
    default:
      for (let i = 0; i < textRuns.length; i++) {
        const textRun = textRuns[i]
        var node = createNode()
        node.type = "NORMAL_TEXT"
        node.content = textRun.content
        node.style = {
          ...normalStyle,
          ...textRun.style,
          list: i == 0 && basicStyle.list,
          paragraph: i == textRuns.length - 1
        }
        node.length = calculateNodeContentLength(node)
        node.styleLength = calculateNodeStyleLength(node)
        nodes.push(node)
      }
      break;
  }

  return nodes
}
