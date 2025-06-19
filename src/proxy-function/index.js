const { AIProjectClient } = require("@azure/ai-projects");
const { DefaultAzureCredential } = require("@azure/identity");

// Initialize Azure credentials and AIProject client
const credential = new DefaultAzureCredential();
const client = new AIProjectClient(process.env.FOUNDRY_PROJECT_URL, credential);

// Core logic to interact with Azure AI Agent
async function callFoundry(userText) {
  const agentId = process.env.FOUNDRY_AGENT_ID;

  const thread = await client.agents.threads.create();
  await client.agents.messages.create(thread.id, "user", userText);

  let run = await client.agents.runs.create(thread.id, agentId);

  // Wait for the agent to complete (max ~30s via polling)
  while (["queued", "in_progress"].includes(run.status)) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    run = await client.agents.runs.get(thread.id, run.id);
  }

  if (run.status === "failed") {
    throw new Error(run.lastError?.message || "Agent run failed");
  }

  // Extract response from assistant
  const messages = await client.agents.messages.list(thread.id, { order: "asc" });
  for await (const msg of messages) {
    const textPart = msg.content.find(p => p.type === "text" && p.text?.value);
    if (msg.role === "assistant" && textPart) {
      return textPart.text.value;
    }
  }

  return "No response from the agent.";
}

// Azure Function entrypoint
module.exports = async function (context, req) {
  if (!req.body?.text) {
    context.res = {
      status: 400,
      body: "Missing 'text' in request body."
    };
    return;
  }

  try {
    const response = await callFoundry(req.body.text);
    context.res = {
      status: 200,
      body: { reply: response }
    };
  } catch (error) {
    context.log.error("Proxy error:", error);
    context.res = {
      status: 500,
      body: `Error: ${error.message}`
    };
  }
};
