# mcp-figma-read-files

**mcp-figma-read-files** is a server that fetches Figma component data through the **Model Context Protocol (MCP)** and converts it into a format that large-language models can easily understand.

> **⚠️ Prototype for learning & experimentation.**  
> The API specification and output format may change without notice.

---

## Features

- Retrieve component data by specifying either a Figma URL **or** a `fileKey` / `nodeId` pair  
- Export key layout information (size, padding, colors, typography, …) as compact JSON  
- Provide an AI-friendly data structure optimised for code generation and design review  

## Setup

1. **Get a Figma Personal Access Token**  
   - Create the token with permission **“File contents → Read only.”**

## Usage

Add the following entry to the MCP configuration of your tool (Cursor, VS Copilot, etc.).  
Make sure to supply your Figma token.

```json
"mcp-figma-read-files": {
    "command": "npx",
    "args": ["mcp-figma-read-files"],
    "env": {
        "FIGMA_API_TOKEN": "{Get figma token.}"
    }
}
```

After configuring, simply paste the target Figma design URL in your prompt and ask, for example, “Fetch the design information.”

## Disclaimer

* This tool is provided for educational purposes and may exhibit unexpected behaviour.
* It may stop working if Figma changes its API or enforces rate limits.
* Use at your own risk.