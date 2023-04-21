function splitLargeNodes(nodes) {
  const splitNodes = []

  for (let node of nodes) {
    if (node.length <= 2000) {
      splitNodes.push(node)
      continue
    }

    const regex = /\s/gm
    let prevLastIndex = 0;
    let lastIndex = node.content.search(regex);

    while (regex.exec(node.content) != null) {

      if (regex.lastIndex - prevLastIndex + node.styleLength > 2000) {
        let splitNode = createNode()
        splitNode.type = node.type
        splitNode.content = node.content.substring(prevLastIndex, lastIndex)
        splitNode.style = {...node.style}
        splitNode.length = calculateNodeContentLength(splitNode)
        splitNode.styleLength = calculateNodeStyleLength(splitNode)
        splitNodes.push(splitNode)
        prevLastIndex = lastIndex;
      }

      lastIndex = regex.lastIndex;
    }

    const lastSplitNode = createNode()
    lastSplitNode.type = node.type
    lastSplitNode.content = node.content.substring(prevLastIndex)
    lastSplitNode.style = {...node.style}
    lastSplitNode.length = calculateNodeContentLength(lastSplitNode)
    lastSplitNode.styleLength = calculateNodeStyleLength(lastSplitNode)
    splitNodes.push(lastSplitNode)
  }

  return splitNodes
}
