function generateDiscordMsgs(grouped) {
  const msgs = [];

  for (let group of grouped) {
    const msg = generateDiscordMsg(group);
    msgs.push(msg);
  }

  return msgs;
}

function generateDiscordMsg(group) {
  let msg = [];

  for (let e of group) {
    const mk = generateStyleMarkdown(e.style);
    msg.push(...mk);
    msg.push(...e.content);
    msg.push(...mk.reverse())
  }

  return msg.join("");
}

function generateStyleMarkdown(style) {
  const mk = [];
  if (style.italic) mk.push("*");
  if (style.bold) mk.push("**");
  if (style.strike) mk.push("~~");
  if (style.under) mk.push("__");

  return mk;
}
