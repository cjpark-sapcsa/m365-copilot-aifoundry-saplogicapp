const { AIProjectClient } = require("@azure/ai-projects");
const { DefaultAzureCredential } = require("@azure/identity");
const axios = require("axios");

const credential = new DefaultAzureCredential();

/**
 * Calls the Azure AI Foundry agent directly using the SDK.
 */
async function callFoundryMessage(userText) {
  const { FOUNDRY_PROJECT_URL, FOUNDRY_AGENT_ID } = process.env;
  if (!FOUNDRY_PROJECT_URL || !FOUNDRY_AGENT_ID) {
    throw new Error("Missing environment variables: FOUNDRY_PROJECT_URL or FOUNDRY_AGENT_ID.");
  }

  const client = new AIProjectClient(FOUNDRY_PROJECT_URL, credential);
  const agent = await client.agents.getAgent(FOUNDRY_AGENT_ID);
  const thread = await client.agents.threads.create();

  try {
    await client.agents.messages.create(thread.id, "user", userText);
    let run = await client.agents.runs.create(thread.id, agent.id);

    const timeoutMs = 120000; // 2 minutes
    const start = Date.now();

    while (["queued", "in_progress"].includes(run.status)) {
      if (Date.now() - start > timeoutMs) {
        throw new Error("Agent run timed out after 2 minutes.");
      }
      await new Promise((r) => setTimeout(r, 2000));
      run = await client.agents.runs.get(thread.id, run.id);
    }

    if (run.status === "failed") {
      const msg = run.lastError?.message || "Unknown failure during execution.";
      return `Agent run failed: ${msg}`;
    }

    // Convert async iterator to array
    const iterator = client.agents.messages.list(thread.id, { order: "asc" });
    const messages = [];
    for await (const msg of iterator) {
      messages.push(msg);
    }

    const assistant = messages
      .reverse()
      .find((m) => m.role === "assistant" && m.content?.[0]?.type === "text");

    return assistant?.content?.[0]?.text?.value || "No valid message returned by agent.";
  } catch (err) {
    console.error("Agent run error:", err.message);
    throw err;
  }

}

/**
 * Optional fallback: call Azure Function proxy if set.
 */
async function callViaFunctionProxy(userText) {
  const proxyUrl = process.env.FUNCTION_PROXY_URL;
  if (!proxyUrl) {
    throw new Error("FUNCTION_PROXY_URL is not set.");
  }

  try {
    const response = await axios.post(proxyUrl, { text: userText });
    return response.data?.reply || "No response from function proxy.";
  } catch (err) {
    throw new Error(`Proxy error: ${err.message}`);
  }
}

/**
 * Entry point for Copilot or Teams requests.
 */
async function invokeSapAgent(context, state, { text }) {
  try {
    if (process.env.FUNCTION_PROXY_URL) {
      return await callViaFunctionProxy(text);
    }
    return await callFoundryMessage(text);
  } catch (err) {
    return `Error invoking SAP agent: ${err.message}`;
  }
}

module.exports = { invokeSapAgent };
