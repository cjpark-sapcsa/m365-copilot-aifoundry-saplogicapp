const { AgentApplication, MemoryStorage } = require("@microsoft/agents-hosting");
const { ActivityTypes } = require("@microsoft/agents-activity");
const { invokeSapAgent } = require("./action");

console.log("Environment Configuration:", {
  FOUNDRY_PROJECT_URL: process.env.FOUNDRY_PROJECT_URL,
  FOUNDRY_AGENT_ID: process.env.FOUNDRY_AGENT_ID
});

const agentApp = new AgentApplication({
  storage: new MemoryStorage(),
});


// Main message handler
agentApp.activity(ActivityTypes.Message, async (context) => {
  const userText = context.activity.text?.trim();

  console.log("Received user message:", {
    text: userText,
    userId: context.activity.from?.id,
    conversationId: context.activity.conversation?.id,
    timestamp: context.activity.timestamp,
  });

  if (!userText) {
    await context.sendActivity("Sorry, I didn’t catch that. Please ask a product-related question.");
    return;
  }

  try {
    const response = await invokeSapAgent(context, null, { text: userText });
    await context.sendActivity(response);
  } catch (err) {
    console.error("Agent invocation failed:", err);
    await context.sendActivity("An error occurred while processing your request. Please try again later.");
  }
});

module.exports = { agentApp };