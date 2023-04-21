
function generateDiscordMsgs(nodes) {
  const messageGenerator = new MessageGenerator()
  for (let node of nodes) {
    messageGenerator.pushNode(node)
  }

  return messageGenerator.msgs
}

class MessageGenerator {
  constructor() {
    this.msgs = [];
    this.state = new NormalState(this);
  }

  pushNode(node) {
    this.state.pushNode(node);
  }
}

class NormalState {
  constructor(generator) {
    this.generator = generator;
  }

  pushNode(node) {
    let msg = []
    let mk = generateMarkdownForNode(node)

    switch (node.type) {
      case "TITLE":
        msg.push(...mk)
        msg.push(node.content)
        msg.push(...mk.reverse())

        this.generator.msgs.push(msg.join(""))
        break
      case "SUBTITLE":
        msg.push(...mk)
        msg.push(node.content)
        msg.push(...mk.reverse())
        msg.push("\n")
        msg.push("** **")

        this.generator.msgs.push(msg.join(""))
        break
      case "HEADING_1":
        msg.push(...mk)
        msg.push(node.content)
        msg.push(...mk.reverse())
        msg.push("\n")
        msg.push("** **")
        
        this.generator.msgs.push(msg.join(""))
        break
      case "HEADING_2":
        msg.push(...mk)
        msg.push("- " + node.content)
        msg.push(...mk.reverse())
        
        this.generator.msgs.push(msg.join(""))
        break
      case "HEADING_3":
        msg.push(...mk)
        msg.push("- " + node.content)
        msg.push(...mk.reverse())
        
        this.generator.msgs.push(msg.join(""))
        break
      default:
        if (node.content.length === 0) {
          this.generator.msgs.push("** **")
          return
        }
        const nextState = new AccumulatingState(this.generator)
        this.generator.state = nextState
        nextState.pushNode(node)
        break
    }
  }
}

class AccumulatingState {
  constructor(generator) {
    this.msg = [];
    this.length = 0;
    this.generator = generator;
  }

  pushNode(node) {
    const mk = generateMarkdownForNode(node)

    if (this.length + node.length > 2000) {
      this.generator.msgs.push(this.msg.join(""))
      const nextState = new NormalState(this.generator)
      this.generator.state = nextState
      nextState.pushNode(node)
      return;
    }

    if (node.style.paragraph) {
      this.msg.push(...mk)
      this.msg.push(node.content)
      this.msg.push(...mk.reverse())
      this.generator.msgs.push(this.msg.join(""))
      this.generator.state = new NormalState(this.generator)
      return;
    }

    this.length += node.length
    this.msg.push(...mk)
    this.msg.push(node.content)
    this.msg.push(...mk.reverse())
  }
}

function generateMarkdownForNode(node) {
  const mk = []
  const {style} = node

  if (style.bold) mk.push("**")
  if (style.italic) mk.push("*")
  if (style.strikethrough) mk.push("~~")
  if (style.underline) mk.push("__")

  return mk
}
