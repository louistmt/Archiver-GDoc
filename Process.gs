/**
 * at the end returns
 * 
 * {
 *   type: "NORMAL_TEXT"
 *   content: ""
 *   style: {
 *     italic: false,
 *     bold: false,
 *     strike: false,
 *     under: false
 *   }
 * }[]
 * 
 * 
 * 
 */

function parseDocJSON(context) {
  const parsed = [];

  for (let paragraph of context.paragraphs) {
    parseParagraph(paragraph, context, parsed);
  }

  return parsed;
}

function parseParagraph(paragraph, context, parsed) {
  const styleName = paragraph.paragraphStyle.namedStyleType;
  const textRuns = extractTextRuns(paragraph);
  const list = paragraph.bullet ? true : false;

  context.styleName = styleName;
  context.list = list;
  parseTextRuns(textRuns, context, parsed);
}

function parseTextRuns(textRuns, context, parsed) {

  switch (context.styleName) {
    case "TITLE":
      parseTitle(textRuns, context, parsed);
      break;
    case "SUBTITLE":
      parseSubTitle(textRuns, context, parsed);
      break;
    case "HEADING_1":
      parseHeading1(textRuns, context, parsed);
      break;
    case "HEADING_2":
      parseHeading2(textRuns, context, parsed);
      break;
    case "HEADING_3":
      parseHeading3(textRuns, context, parsed);
      break;
    default:
      parseNormal(textRuns, context, parsed);
      break;
  }


}

function parseTitle(textRuns, context, parsed) {
  const contentObj = {
    type: "TITLE",
    content: [],
    style: createBasicStyle()
  };
  contentObj.style.bold = true;
  contentObj.style.under = true;

  if (context.list) {
    context.list = false;
    contentObj.content.push("\\> ");
  }
  contentObj.content.push(extractStringFromTextRuns(textRuns));
  parsed.push(contentObj);
}

function parseSubTitle(textRuns, context, parsed) {
  const contentObj = {
    type: "SUBTITLE",
    content: [],
    style: createBasicStyle()
  };
  contentObj.style.italic = true;

  if (context.list) {
    context.list = false;
    contentObj.content.push("\\> ");
  }
  contentObj.content.push(extractStringFromTextRuns(textRuns));
  parsed.push(contentObj);
}

function parseHeading1(textRuns, context, parsed) {
  const contentObj = {
    type: "HEADING_1",
    content: [],
    style: createBasicStyle()
  };
  contentObj.style.bold = true;

  if (context.list) {
    context.list = false;
    contentObj.content.push("\\> ");
  }
  contentObj.content.push(extractStringFromTextRuns(textRuns));
  parsed.push(contentObj);
}

function parseHeading2(textRuns, context, parsed) {
  const contentObj = {
    type: "HEADING_2",
    content: [],
    style: createBasicStyle()
  };
  contentObj.bold = true;

  if (context.list) {
    context.list = false;
    contentObj.content.push("\\> ");
  }
  contentObj.content.push("- ", extractStringFromTextRuns(textRuns));
  parsed.push(contentObj);
}

function parseHeading3(textRuns, context, parsed) {
  const contentObj = {
    type: "HEADING_3",
    content: [],
    style: createBasicStyle()
  };
  contentObj.style.italic = true;

  if (context.list) {
    context.list = false;
    contentObj.content.push("\\> ");
  }
  contentObj.content.push("- ", extractStringFromTextRuns(textRuns));
  parsed.push(contentObj);
}

function parseNormal(textRuns, context, parsed) {
  for (let textRun of textRuns) {
    const contentObj = {
      type: "NORMAL_TEXT",
      content: [],
      style: {
        ...context.normalStyle,
        ...textRun.style
      }
    };

    if (context.list) {
      context.list = false;
      contentObj.content.push("\\> ");
    }
    contentObj.content.push(textRun.content);
    parsed.push(contentObj);
  }
}










