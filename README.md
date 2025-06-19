# M365 Copilot Agent Integration with Azure AI Foundry (Logic Apps + SAP)

A ready-to-use solution and SDK patterns to connect **Microsoft 365 Copilot** (or Teams Apps) to **Azure AI Foundry-hosted agents**, leveraging Logic Apps for SAP OData workflows. Includes secure local proxy for dev/test, production best practices, and patterns for multi-agent extension.

---

## Solution landscape (local development environment)

![image-4 end to end soltuion landscape](https://github.com/user-attachments/assets/6d5166a2-5e2a-4e82-8806-e9e3acba46e0)

---

## Features

- Ask SAP product-related questions in Teams or Copilot using M365 Agents SDK.
- Connects to Azure AI Foundry-hosted agents (with tool actions & Logic App workflows).
- Local proxy for secure API development (hides Foundry endpoint).
- Extensible to production: Azure API Management & private endpoint support.
- Code samples: Node.js, Express, Azure Function proxy, Copilot/Teams-ready agent logic.

---

## 🚦 Prerequisites

- Azure subscription with **Azure AI Foundry** and **Logic Apps** enabled.
- Azure AI Foundry agent **already created**, with tools/actions configured to call SAP OData  
  [Integration architecture overview (LinkedIn)](https://www.linkedin.com/pulse/azure-ai-foundry-agent-service-logic-apps-sap-odata-integration-park-lxxwc/?trackingId=n1zaqnFhRg6PH6nPou%2Fe4Q%3D%3D)
- SAP OData endpoint reachable from Logic Apps:  
  - Local test uses SAP ES5 Gateway Demo  
  - Production should use VNet peering
- Logic Apps workflow already deployed and accessible
- All services (Foundry, Logic App, SAP) ideally in the **same tenant**
- Node.js (v18+) and NPM installed
- Azure Functions Core Tools installed
- [Microsoft 365 Agents Toolkit](https://learn.microsoft.com/en-us/microsoftteams/platform/toolkit/install-agents-toolkit?tabs=vscode) installed in VS Code

---

## Local Development Setup

Local testing uses **Microsoft 365 Agents Toolkit** with secure proxy to Azure AI Foundry.

### 1. Install Microsoft 365 Agents Toolkit

- Follow [this official guide](https://learn.microsoft.com/en-us/microsoft-365/agents-sdk/create-new-toolkit-project-vsc?context=%2Fmicrosoft-365-copilot%2Fextensibility%2Fcontext)
- Install Visual Studio Code extension for Toolkit
- Make sure `teamsfx-cli` is available

### 2. Clone This Repo and Copy Required Files

```bash
git clone https://github.com/cjpark-sapcsa/m365-copilot-aifoundry-saplogicapp.git
cd m365-copilot-aifoundry-saplogicapp
```
---
### 3. Copy Agent Logic and Proxy Function

Copy the following folders into your **M365 Agents Toolkit** project directory:

- `/src/` → Contains the core agent logic  
- `/src/proxy-function/` → Contains the Azure Function proxy for Foundry agent integration

> Alternatively, you can run and test directly inside this repo.

---

### 4. Set Environment Variables

Create a `.env` file in the project root (or under `/env/.env.local`) and add the following variables:

```env
# Azure OpenAI (optional)
AZURE_OPENAI_API_KEY=your-key
AZURE_OPENAI_ENDPOINT=https://your-openai-endpoint
AZURE_OPENAI_DEPLOYMENT_NAME=deployment-name

# Azure AI Foundry Agent
AZURE_AI_PROJECTS_CONNECTION_STRING=https://your-foundry-url
FOUNDRY_AGENT_ID=your-agent-id
FOUNDRY_PROJECT_URL=https://your-foundry-url

# Optional: reuse thread between runs
FOUNDRY_THREAD_ID=optional-thread-id

# For custom auth (if not using DefaultAzureCredential)
AZURE_TENANT_ID=your-tenant-id
AZURE_CLIENT_ID=your-client-id
AZURE_CLIENT_SECRET=your-client-secret
```
---
### 5. Install Dependencies and Start Local Proxy

This project requires the following packages:

```bash
npm install \
  @microsoft/agents-hosting \
  @microsoft/agents-activity \
  express \
  axios \
  @azure/ai-projects \
  @azure/identity
```
---
### 6. Debug in Teams or Copilot (Local)

To run your agent locally in **Teams** or **Copilot Studio**:

- Open the project in **Visual Studio Code**
- Ensure the **Microsoft 365 Agents Toolkit** extension is installed
- Press `F5` to launch the app, or use the **"Run: Debug in Teams (Edge)"** launch configuration

Your **M365 Copilot Chat** will start and interact using the logic you've implemented.

#### Example prompts to test:
- `List all notebook products in stock`
- `Show details for product HT-1001`
- `Compare prices for laptops from all suppliers`

### 7. How It Works (Runtime Flow)

1. **User** asks a question in **Teams** or **Copilot**
   ![image-2  copilot landing wiht startPrompts](https://github.com/user-attachments/assets/220af4f8-2856-4cd5-9e3f-fa1beb3f7cef)

3. The **Agent SDK** sends the prompt to your local Azure Function proxy (`/api/ask`)
4. The **proxy** securely forwards the request to your **Azure AI Foundry Agent** using the `FOUNDRY_AGENT_ID` and defined tools
5. The **Foundry Agent** invokes the **Logic App**, which triggers the SAP OData query
6. **SAP Odata** returns the data → **Logic App** processes the response → **Foundry Agent** formats the output → **Copilot** displays the final result
![image-3 reponse of copilot chat ](https://github.com/user-attachments/assets/bfb74925-4ee1-4de2-a828-0351fcc9a8c8)

---

### ⚠️ Known Limitation: Timeout Handling

**Note:**  
In the local development environment, end-to-end agent runs may exceed the Teams/Copilot UI timeout limit (typically **25–30 seconds**), especially for complex queries or large OData responses.

This may result in a generic error such as:

> “Sorry, something went wrong...”

even if the backend workflow completes successfully.

---

### 🔐 Production Guidance: Use API Management + Private Endpoint

- In local dev, a **Function proxy** is used to relay Copilot messages to Azure AI Foundry agents securely.
- For **production deployment**, using **Azure API Management (APIM)** is strongly recommended to:
  - Protect the Foundry endpoint
  - Apply authentication, throttling, and logging policies
  - Expose a secure public surface

Additionally:

- Use **Azure Private Endpoint** for Foundry and Logic App resources to ensure network isolation.
- Combine with **VNet-integrated** SAP OData access where applicable.

---

> ✅ Always test under real latency and load conditions to ensure your agent completes within UI interaction limits for a smoother Copilot user experience.

