const config = {
  // For planner
  azureOpenAIKey: process.env.AZURE_OPENAI_API_KEY,
  azureOpenAIEndpoint: process.env.AZURE_OPENAI_ENDPOINT,
  azureOpenAIDeploymentName: process.env.AZURE_OPENAI_DEPLOYMENT_NAME,

  // For Foundry Agent access
  foundryConnectionString: process.env.AZURE_AI_PROJECTS_CONNECTION_STRING,
  foundryAgentId: process.env.FOUNDRY_AGENT_ID,
  foundryThreadId: process.env.FOUNDRY_THREAD_ID,

  // Optional: for custom auth if not using DefaultAzureCredential()
  azureTenantId: process.env.AZURE_TENANT_ID,
  azureClientId: process.env.AZURE_CLIENT_ID,
  azureClientSecret: process.env.AZURE_CLIENT_SECRET,
};

module.exports = config;
