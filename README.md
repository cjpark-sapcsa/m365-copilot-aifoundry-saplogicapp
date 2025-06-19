M365 Copilot Agent Integration with Azure AI Foundry (Logic Apps + SAP)
A ready-to-use solution and SDK patterns to connect Microsoft 365 Copilot (or Teams Apps) to Azure AI Foundry-hosted agents, leveraging Logic Apps for SAP OData workflows. Includes secure local proxy for dev/test, production best practices, and patterns for multi-agent extension.

✨ Features
Ask SAP questions in Teams or Copilot using M365 Agents SDK.

Connects to Azure AI Foundry-hosted agents (incl. tool actions & Logic App workflows).

Local proxy for secure API development (hide Foundry endpoint).

Extensible for production: Azure API Management & private endpoint support.

Code samples: Node.js, Express, Azure Function proxy, Copilot/Teams-ready agent logic.

🚦 Prerequisites
Azure Subscription with Azure AI Foundry and Logic Apps enabled.

Azure AI Foundry agent already created, with tools/actions configured to call SAP OData (see this integration flow).

SAP OData endpoint reachable from Logic Apps (local XML for dev; production should use VNet peering).

Azure Logic Apps workflow for SAP OData must be deployed and accessible.

All resources (AI Foundry, Logic App, SAP) should ideally be in the same Azure tenant for easier authentication.

Node.js (v18+) and NPM installed.

Azure Functions Core Tools installed for local proxy.

🔑 Local Development Setup
This setup uses Microsoft 365 Agents Toolkit for local debugging and secure proxying of Foundry API calls.

1. Install the Microsoft 365 Agents Toolkit
Follow the official quickstart guide to create a Toolkit project in VS Code.

Install Microsoft 365 Agents SDK.

2. Clone & Prepare Project Files
Clone this repo:

sh
Copy
Edit
git clone https://github.com/cjpark-sapcsa/m365-copilot-aifoundry-saplogicapp.git
cd m365-copilot-aifoundry-saplogicapp
Copy the /src folder (agent logic) and /src/proxy-function (local Azure Function proxy) into your local Agents Toolkit project, or work in this repo.

3. Environment Variables
Create an .env file in the project root (or use /env/.env.local).

Set variables:

env
Copy
Edit
# Azure OpenAI (if used)
AZURE_OPENAI_API_KEY=...
AZURE_OPENAI_ENDPOINT=...
AZURE_OPENAI_DEPLOYMENT_NAME=...

# Foundry agent
AZURE_AI_PROJECTS_CONNECTION_STRING=https://your-foundry-url
FOUNDRY_AGENT_ID=your-agent-id
FOUNDRY_PROJECT_URL=https://your-foundry-url

# Optional for session reuse
FOUNDRY_THREAD_ID=...

# For custom auth (if not using DefaultAzureCredential)
AZURE_TENANT_ID=...
AZURE_CLIENT_ID=...
AZURE_CLIENT_SECRET=...
4. Install NPM Dependencies
From the repo/project root, run:

sh
Copy
Edit
npm install
5. Start the Azure Function Proxy (Local)
Go to the proxy folder and start the proxy:

sh
Copy
Edit
cd src/proxy-function
func start
The proxy exposes a local endpoint (e.g., http://localhost:7071/api/ask) which is used by your bot logic to securely connect to Azure AI Foundry.

6. Debug and Run in Teams/Copilot Studio (Local)
Press F5 in VS Code or use the debugger for your Agents Toolkit project.

Your agent will respond in Teams or Copilot, relaying user queries to the local proxy and Azure AI Foundry.

🏢 Production Deployment Notes
API Security: In production, use Azure API Management (APIM) and/or private endpoints to secure access to Foundry APIs.

Environment: Deploy Azure AI Foundry, Logic App, and SAP OData integration in the same Azure tenant.

SAP OData: For production, connect Logic Apps directly to SAP (use VNet peering, secure endpoints).

Agent Proxy: Replace local proxy with managed API surface, update environment variables accordingly.

📦 NPM Dependencies
Install these from your project root:

sh
Copy
Edit
npm install @microsoft/agents-hosting @microsoft/agents-activity express axios @azure/ai-projects @azure/identity
(If using Teams SDK or M365 Copilot SDK, install those per your Agents Toolkit project requirements.)

🚫 .gitignore Recommendations
Ensure your repo does not commit secrets or local-only files:

bash
Copy
Edit
.env
.env.*
env/
node_modules/
.vscode/
*.local
*.DS_Store
/deployment
/lib
🖼 Adding Images
Store screenshots in /img (create this folder if needed).

Reference images in your README as:

md
Copy
Edit
![Architecture](img/architecture.png)
📖 Additional References
Azure AI Foundry Agent Service docs

Microsoft 365 Agents Toolkit

Copilot extensibility patterns

SAP OData for Logic Apps

For detailed end-to-end flows, see this LinkedIn article.

💡 Local Development Summary
Local testing uses a proxy to protect Foundry project URLs.

For production, use Azure API Management + private endpoints for secure agent/bot integration.

📝 License
MIT (or your team’s preferred license)