# Fabric VSCode Plugin

Official Visual Studio Code plugin for the **Fabric `.fab` language**, enabling:
- Syntax highlighting for Fabric DSL
- Snippets for agent definitions and policy blocks
- Command palette tools for `fab build`, `fab audit`, and `fab claim`
- Integration with Fabric compiler and registry

---

## Features

- `.fab` language syntax highlighting
- Policy block auto-completion
- CLI integration with Fabric commands
- Hover tooltips for DSL keywords
- Validation errors surfaced directly in editor

---

## Installation

1. Clone the repository:
```bash
git clone https://github.com/fabric-alliance/vscode-fab-plugin.git  
cd vscode-fab-plugin  
Install dependencies:  
npm install  
Build:  
npm run compile  
Package:  
npm run package  
Install locally:  
code --install-extension vscode-fab-plugin-0.1.0.vsix  
Usage  
Open any .fab file to see syntax highlighting.  
Use Ctrl+Shift+P → "Fabric: Build" to compile Fabric agents.  
Hover over DSL keywords to see contextual help.  
Contributing  
Contributions must pass DAO-approved reviews in the Fabric Alliance.  
Follow coding standards in CONTRIBUTING.md.  
© 2025 Fabric Alliance – DAO-governed developer tooling for decentralized AI.  

