function cleanJSON(processedJSON) {
  const trimedJSON = processedJSON.slice(0);

  while (trimedJSON.length !== 0 && (trimedJSON[0].length === 0 || trimedJSON[0] === "\n")) {
    trimedJSON.shift();
  }

  while (trimedJSON.length !== 0 && (trimedJSON[trimedJSON.length - 1].length === 0 || trimedJSON[trimedJSON.length - 1] === "\n")) {
    trimedJSON.pop();
  }

  const cleanJSON = [];
  let currentMsg = [];
  let currentLength = 0;
  for (let line of trimedJSON) {
    // If the content has more than 2000 characters
    // We push any stored content into the cleanJSON array if there is any
    // And then we append the current line split into chunks smaller or equal to 2000
    // characters
    if (line.length > 2000) {

      if (currentMsg.length > 0) {
        cleanJSON.push(currentMsg.join(""))
        currentMsg = [];
        currentLength = 0;
      }

      for (let portion of splitLineIfTooLarge(line)) {
        cleanJSON.push(portion)
      }

      continue;
    }

    // If the currentLength + line.length + 1 (for the \n) is larger than 2000 characters
    // we push the stored content into the cleanJSON array
    // and we set the line as the store content
    if (currentLength + line.length > 2000) {
      cleanJSON.push(currentMsg.join(""))
      currentMsg = [line];
      currentLength = line.length;
      continue;
    }

    // We simply append the line to the stored content
    // and update its length to currentLengh += 1 + line.length
    currentMsg.push(line);
    currentLength += line.length;
  }

  // Push the remaining content into the cleanJSON array
  if (currentMsg.length > 0) {
    cleanJSON.push(currentMsg.join(""));
  }

  return cleanJSON;
}

function splitLineIfTooLarge(line) {
  if (line.length <= 2000) return [line];

  const portions = [];
  const regex = /\s/gm;
  let prevLastIndex = 0;
  let lastIndex = line.search(regex);

  while (regex.test(line) != null) {
    if (prevLastIndex - regex.lastIndex > 2000) {
      portions.push(line.substring(prevLastIndex, lastIndex));
      prevLastIndex = lastIndex;
    }

    lastIndex = regex.lastIndex;
  }

  portions.push(line.substring(prevLastIndex));

  return portions;
}
