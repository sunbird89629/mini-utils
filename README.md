# mini-utils

> VS Code extension bundling small everyday productivity commands for Flutter/Dart developers.

Small IME/text helpers plus Dart-scope refactor shortcuts, all in one lightweight extension.

## Features

| Command | Description |
|---|---|
| **Change IME to English on tab switch** | Automatically switch IME to English when the editor tab changes (macOS-focused) |
| **Proxy: Show Commands** | Quick access to a curated command palette |
| **Remove `const` in current Dart scope** | Strip `const` keywords inside the current class/function scope — handy when refactoring `const` widgets |
| **Select Dart function** | Expand selection to the enclosing Dart function |
| **Select Dart class** | Expand selection to the enclosing Dart class |
| **Show custom modal dialog** | Demo command for custom dialog UI |

## Install

Install from VS Code marketplace:

```
ext install sunbird89629.mini-utils
```

Or search "mini-utils" in the Extensions panel.

## Development

```bash
npm install
npm run compile       # tsc build
npm run watch         # incremental compile
npm run lint          # eslint src
npm run test          # vscode-test
```

Package a `.vsix` for local install:

```bash
npx @vscode/vsce package
```

## Requirements

- VS Code ≥ 1.101.0
- Node ≥ 20.x

## Roadmap

- 🚧 IME switcher currently macOS-only — Windows/Linux support pending
- 🚧 More Dart refactor helpers

## License

MIT
