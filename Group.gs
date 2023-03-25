function groupParsed(parsed) {
  const clean = [];
  const context = {
    currentGroup: [],
    currentStyle: createBasicStyle(),
    currentLength: 0
  };

  for (let e of parsed) {
    const contentLength = calculateContentLength(e.content) + calculateStyleLength(e.style);

    context.currentStyle = e.style;

    if (contentLength > 2000) {
      pushCurrentAndSplit(e, context, clean);
    } else if (context.currentLength + contentLength > 2000) {
      pushCurrentAndSwitch(e, context, clean);
    } else {
      pushIntoCurrent(e, context, clean);
    }
  }

  clean.push(context.currentGroup);

  return clean;
}

function pushCurrentAndSplit(e, context, clean) {
  if (context.currentLength > 0) {
    clean.push(context.currentGroup);
    context.currentGroup = [];
    context.currentLength = 0;
  }

  const regex = /\s/gm;
  const content = e.content.join("");
  const styleLength = calculateStyleLength(e.style);
  let prevLastIndex = 0;
  let lastIndex = content.search(regex);

  while (regex.exec(content) != null) {

    if (regex.lastIndex - prevLastIndex + styleLength > 2000) {
      clean.push([{
        type: e.type,
        content: [content.substring(prevLastIndex, lastIndex)],
        style: e.style
      }]);
      prevLastIndex = lastIndex;
    }

    lastIndex = regex.lastIndex;
  }

  const lastContent = content.substring(prevLastIndex);
  context.currentGroup.push({
    type: e.type,
    content: [lastContent],
    style: context.currentStyle
  });
  context.currentLength = lastContent.length + styleLength;
}

function pushCurrentAndSwitch(e, context, clean) {
  clean.push(context.currentGroup);
  context.currentGroup = [e];
  context.currentLength = calculateContentLength(e.content) + calculateStyleLength(e.style);
}

function pushIntoCurrent(e, context, clean) {
  context.currentGroup.push(e);
  context.currentLength += calculateContentLength(e.content) + calculateStyleLength(e.style);
}
