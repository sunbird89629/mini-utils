// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { exec } from 'child_process';
import * as vscode from 'vscode';
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	// console.log('Congratulations, your extension "mini-utils" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	registerHelloCammand(context);
	// registerProxyShowCammand(context);
	registerEditorChangeListener(context);
	subscribeToTextEditorOptions(context);
	registerRemoveConstCammand(context);
	registSelectMethodAction(context);
	registSelectClassAction(context);
}

function registSelectMethodAction(context: vscode.ExtensionContext) {
	const disposable = vscode.commands.registerCommand('mini-utils.selectFunction', async () => selectSymbolByPositionAndType(5));
	context.subscriptions.push(disposable);
}

function registSelectClassAction(context: vscode.ExtensionContext) {
	const disposable = vscode.commands.registerCommand('mini-utils.selectClass', async () => selectSymbolByPositionAndType(4));
	context.subscriptions.push(disposable);
}



async function selectSymbolByPositionAndType(type: number) {
	const editor = vscode.window.activeTextEditor;
	if (!editor) return;

	const uri = editor.document.uri;
	const position = editor.selection.active;

	// 发送 LSP Request
	const symbols = await vscode.commands.executeCommand<any[]>(
		'vscode.executeDocumentSymbolProvider',
		uri
	);

	if (!symbols) {
		vscode.window.showWarningMessage('无法获取 Dart 方法信息');
		return;
	}

	const flatSymbols = flattenSymbols(symbols);
	const currentSymbol = flatSymbols.find(sym => sym.range && sym.kind == type && within(sym.range, position));

	if (currentSymbol) {
		const range = new vscode.Range(
			currentSymbol.range.start.line,
			currentSymbol.range.start.character,
			currentSymbol.range.end.line,
			currentSymbol.range.end.character
		);
		editor.selection = new vscode.Selection(range.start, range.end);
		editor.revealRange(range, vscode.TextEditorRevealType.InCenter);
	} else {
		vscode.window.showInformationMessage('当前未找到方法');
	}
}

function flattenSymbols(symbols: any[]): any[] {
	const result: any[] = [];
	for (const sym of symbols) {
		result.push(sym);
		if (sym.children) result.push(...flattenSymbols(sym.children));
	}
	return result;
}

function within(range: vscode.Range | vscode.Location | any, pos: vscode.Position): boolean {
	const start = new vscode.Position(range.start.line, range.start.character);
	const end = new vscode.Position(range.end.line, range.end.character);
	return pos.isAfterOrEqual(start) && pos.isBeforeOrEqual(end);
}

function testModalDialog(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('mini-utils.showCustomDialog', () => {
		const panel = vscode.window.createWebviewPanel(
			'customDialog',
			'自定义模态对话框',
			vscode.ViewColumn.Active,
			{
				enableScripts: true,
				retainContextWhenHidden: false
			}
		);

		panel.webview.html = getWebviewContent();

		// 监听 webview 消息
		panel.webview.onDidReceiveMessage(message => {
			switch (message.command) {
				case 'submit':
					vscode.window.showInformationMessage(`你提交了：${message.text}`);
					panel.dispose();
					return;
				case 'cancel':
					panel.dispose();
					return;
			}
		});
	});

	context.subscriptions.push(disposable);
}

function registerEditorChangeListener(context: vscode.ExtensionContext) {
	const editorListener = vscode.window.onDidChangeActiveTextEditor((editor) => {
		changeIME();
	});
	context.subscriptions.push(editorListener);
}

// 根据 cursorStyle 的值来确定 neovim 现在处于什么模式
// 经测试
// cursorStyle 2 normal mode
// cursorStyle 1 insert mo
// cursorStyle 4 visual mode
function subscribeToTextEditorOptions(context: vscode.ExtensionContext) {
	context.subscriptions.push(vscode.window.onDidChangeTextEditorOptions(async (e: vscode.TextEditorOptionsChangeEvent) => {
		// vscode.window.showInformationMessage(`cursorStyle:${e.options.cursorStyle}`);
		const cursorStyle = e.options.cursorStyle;
		if (cursorStyle == 2) {
			changeIME();
		} else if (cursorStyle == 4) {
			changeIME();
		}
	}));
}

// function registerProxyShowCammand(context: vscode.ExtensionContext) {
// 	const proxyShowCommands = vscode.commands.registerCommand('mini-utils.proxyShowCommands', () => {
// 		// 在这里执行你自己的代码
// 		vscode.window.showInformationMessage('mini-utils: Command palette is about to open!');
// 		console.log('mini-utils: Intercepted workbench.action.showCommands');

// 		// 然后执行原始命令
// 		vscode.commands.executeCommand('workbench.action.showCommands');
// 	});
// 	context.subscriptions.push(proxyShowCommands);
// }

function registerHelloCammand(context: vscode.ExtensionContext) {
	const disposable = vscode.commands.registerCommand('mini-utils.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from mini-utils006!');
	});
	context.subscriptions.push(disposable);
}

// function myExecuteCommand<T = unknown>(command: string, ...rest: any[]): Thenable<T> {
// 	vscode.window.showInformationMessage(`mini-utils command=>${command}`);
// 	// 调用实际命令并返回一个 Thenable<T>
// 	return vscode.commands.executeCommand<T>(command, ...rest);
// }

// async function interceptCommand(
// 	context: vscode.ExtensionContext,
// 	commandId: string,
// 	originalCommands: Map<string, vscode.Disposable>
// ) {
// 	const originCommands = await vscode.commands.getCommands();
// 	// 注册拦截器
// 	const interceptor = vscode.commands.registerCommand(commandId, async (...args) => {
// 		console.log(`🚀 拦截到命令: ${commandId}`, args);


// 		// vscode.commands.executeCommand

// 		// 执行拦截前的逻辑
// 		const shouldContinue = await onBeforeCommand(commandId, args);

// 		if (shouldContinue) {
// 			try {
// 				// 执行原始命令
// 				const result = await executeOriginalCommand(commandId, args);

// 				// 执行拦截后的逻辑
// 				await onAfterCommand(commandId, args, result);

// 				return result;
// 			} catch (error) {
// 				console.error(`命令执行失败: ${commandId}`, error);
// 				await onCommandError(commandId, args, error);
// 				throw error;
// 			}
// 		} else {
// 			console.log(`命令被阻止执行: ${commandId}`);
// 		}
// 	});

// 	originalCommands.set(commandId, interceptor);
// 	context.subscriptions.push(interceptor);
// }


// async function onBeforeCommand(commandId: string, args: any[]): Promise<boolean> {
// 	console.log(`⏳ 命令执行前: ${commandId}`);
// 	vscode.window.showInformationMessage(`mini-utils: onBeforeCommand.commandId=>${commandId}`);

// 	// 根据命令类型执行不同的逻辑
// 	switch (commandId) {
// 		case 'workbench.action.quickOpen':
// 			return await handleQuickOpenBefore(args);
// 		case 'editor.action.formatDocument':
// 			return await handleFormatDocumentBefore(args);
// 		default:
// 			return true; // 默认允许执行
// 	}
// }

// async function onAfterCommand(commandId: string, args: any[], result: any): Promise<void> {
// 	console.log(`✅ 命令执行后: ${commandId}`, result);

// 	// 执行后处理逻辑
// 	switch (commandId) {
// 		case 'workbench.action.quickOpen':
// 			await handleQuickOpenAfter(args, result);
// 			break;
// 		case 'editor.action.formatDocument':
// 			await handleFormatDocumentAfter(args, result);
// 			break;
// 	}
// }

// async function onCommandError(commandId: string, args: any[], error: any): Promise<void> {
// 	console.error(`❌ 命令执行错误: ${commandId}`, error);
// 	vscode.window.showErrorMessage(`命令 ${commandId} 执行失败: ${error.message}`);
// }

// // 执行原始命令的辅助函数
// async function executeOriginalCommand(commandId: string, args: any[]): Promise<any> {
// 	// 这里需要想办法调用原始命令
// 	// 由于无法直接访问原始命令，我们需要使用其他方式
// 	return await vscode.commands.executeCommand(`original.${commandId}`, ...args);
// }

// // 具体的处理函数
// async function handleQuickOpenBefore(args: any[]): Promise<boolean> {
// 	console.log('Quick Open 即将打开');
// 	// 可以在这里添加条件判断是否允许打开
// 	return true;
// }

// async function handleQuickOpenAfter(args: any[], result: any): Promise<void> {
// 	console.log('Quick Open 已打开');
// }

// async function handleFormatDocumentBefore(args: any[]): Promise<boolean> {
// 	const editor = vscode.window.activeTextEditor;
// 	if (editor) {
// 		console.log('即将格式化文档:', editor.document.fileName);
// 		// 可以在这里添加格式化前的检查
// 	}
// 	return true;
// }

// async function handleFormatDocumentAfter(args: any[], result: any): Promise<void> {
// 	console.log('文档格式化完成');
// }


function changeIME() {
	exec('/opt/homebrew/bin/im-select com.apple.keylayout.ABC', (error, stdout, stderr) => {
		if (error) {
			// vscode.window.showErrorMessage(`IMC err: ${error.message}`);
			return;
		}
		if (stderr) {
			// vscode.window.showWarningMessage(`IMC stderr: ${stderr}`);
		}
		// vscode.window.showInformationMessage(`IMC: PinYin`);
	});
}

// function getNeovimMode(): string | undefined {
// 	// 尝试从 vscode-neovim 插件获取模式信息
// 	const neovimExtension = vscode.extensions.getExtension('asvetliakov.vscode-neovim');
// 	if (neovimExtension?.isActive) {
// 		logWithTag(`neovim mode is:${neovimExtension.exports?.mode}`)
// 		// 这里需要根据 vscode-neovim 的具体 API 来获取模式
// 		return neovimExtension.exports?.mode;
// 	}
// 	return undefined;
// }

// function logWithTag(msg: string) {
// 	console.log(`mini-utils>> ${msg}`);
// }

// function onModeChanged(mode: string) {
// 	console.log(`Neovim mode changed to: ${mode}`);
// 	// 在这里处理模式变化的逻辑

// 	// 例如：根据模式改变光标样式或其他 UI 元素
// 	switch (mode) {
// 		case 'normal':
// 			// 处理普通模式
// 			break;
// 		case 'insert':
// 			// 处理插入模式
// 			break;
// 		case 'visual':
// 			// 处理可视模式
// 			break;
// 	}
// }

// function handleModeChange(mode: string) {
// 	switch (mode) {
// 		case 'n': // normal mode
// 			vscode.window.showInformationMessage('Normal mode');
// 			break;
// 		case 'i': // insert mode
// 			vscode.window.showInformationMessage('Insert mode');
// 			break;
// 		case 'v': // visual mode
// 			vscode.window.showInformationMessage('Visual mode');
// 			break;
// 		case 'V': // visual line mode
// 			vscode.window.showInformationMessage('Visual Line mode');
// 			break;
// 		case '\x16': // visual block mode (Ctrl+V)
// 			vscode.window.showInformationMessage('Visual Block mode');
// 			break;
// 	}
// }

interface CommandInterceptor {
	commandId: string;
	before?: (args: any[]) => Promise<boolean>;
	after?: (args: any[], result: any) => Promise<void>;
	onError?: (args: any[], error: any) => Promise<void>;
}

// class CommandInterceptionManager {
// 	private interceptors = new Map<string, CommandInterceptor>();
// 	private originalExecuteCommand: typeof vscode.commands.executeCommand;

// 	constructor(private context: vscode.ExtensionContext) {
// 		this.originalExecuteCommand = vscode.commands.executeCommand;
// 		this.setupGlobalInterception();
// 	}

// 	private setupGlobalInterception() {
// 		// 注意：这种方法在实际的 VSCode 环境中可能不工作
// 		// 因为 vscode.commands.executeCommand 不能被重写
// 		// 这里仅作为概念示例

// 		const self = this;

// 		// 创建代理来拦截所有命令执行
// 		(vscode.commands as any).executeCommand = new Proxy(this.originalExecuteCommand, {
// 			apply: async function (target, thisArg, argumentsList) {
// 				const [commandId, ...args] = argumentsList;
// 				return await self.interceptCommand(commandId, args, target, thisArg);
// 			}
// 		});
// 	}

// 	private async interceptCommand(
// 		commandId: string,
// 		args: any[],
// 		originalFunction: Function,
// 		thisArg: any
// 	): Promise<any> {
// 		const interceptor = this.interceptors.get(commandId);

// 		if (interceptor) {
// 			console.log(`🔍 拦截命令: ${commandId}`);

// 			try {
// 				// 执行前处理
// 				if (interceptor.before) {
// 					const shouldContinue = await interceptor.before(args);
// 					if (!shouldContinue) {
// 						console.log(`⛔ 命令被阻止: ${commandId}`);
// 						return;
// 					}
// 				}

// 				// 执行原始命令
// 				const result = await originalFunction.apply(thisArg, [commandId, ...args]);

// 				// 执行后处理
// 				if (interceptor.after) {
// 					await interceptor.after(args, result);
// 				}

// 				return result;
// 			} catch (error) {
// 				if (interceptor.onError) {
// 					await interceptor.onError(args, error);
// 				}
// 				throw error;
// 			}
// 		} else {
// 			// 没有拦截器，直接执行原始命令
// 			return await originalFunction.apply(thisArg, [commandId, ...args]);
// 		}
// 	}

// 	addInterceptor(interceptor: CommandInterceptor) {
// 		this.interceptors.set(interceptor.commandId, interceptor);
// 	}

// 	removeInterceptor(commandId: string) {
// 		this.interceptors.delete(commandId);
// 	}

// 	dispose() {
// 		// 恢复原始函数
// 		(vscode.commands as any).executeCommand = this.originalExecuteCommand;
// 	}
// }

function registerRemoveConstCammand(context: vscode.ExtensionContext) {
	context.subscriptions.push(
		vscode.commands.registerCommand('mini-utils.removeConstInScope', async () => {
			const editor = vscode.window.activeTextEditor;
			if (!editor) return;
			const doc = editor.document;
			if (doc.languageId !== 'dart') {
				vscode.window.showWarningMessage('📍 当前不是 Dart 文件');
				return;
			}

			const cursor = editor.selection.active;
			const symbols = await vscode.commands.executeCommand<vscode.DocumentSymbol[]>(
				'vscode.executeDocumentSymbolProvider',
				doc.uri
			);
			if (!symbols) {
				vscode.window.showErrorMessage('⚠️ 无法获取文档符号');
				return;
			}

			function findSymbol(syms: vscode.DocumentSymbol[]): vscode.DocumentSymbol | null {
				for (const sym of syms) {
					if (sym.range.contains(cursor)) {
						const child = findSymbol(sym.children);
						return child ?? sym;
					}
				}
				return null;
			}

			const sym = findSymbol(symbols);
			if (!sym) {
				vscode.window.showInformationMessage('🔍 无法定位当前组件');
				return;
			}

			const startLine = sym.range.start.line;
			if (startLine === 0) {
				vscode.window.showInformationMessage('⚠️ 组件前没有内容');
				return;
			}

			const lineText = doc.lineAt(startLine - 1).text;
			const constMatch = lineText.match(/\bconst\s*$/);
			if (!constMatch) {
				vscode.window.showInformationMessage('📎 组件前没有 const');
				return;
			}

			const startPos = new vscode.Position(startLine - 1, lineText.indexOf('const'));
			const endPos = startPos.translate(0, 'const'.length);
			const edit = vscode.TextEdit.delete(new vscode.Range(startPos, endPos));

			const we = new vscode.WorkspaceEdit();
			we.set(doc.uri, [edit]);
			const ok = await vscode.workspace.applyEdit(we);
			vscode.window.showInformationMessage(ok ? '✅ 删除 const 成功' : '❌ 删除失败');
		})
	);

}

// function getWebviewContent() {
// 	return `
//     <!DOCTYPE html>
//     <html lang="zh-CN">
//     <head>
//       <meta charset="UTF-8">
//       <style>
//         body {
//           font-family: sans-serif;
//           padding: 20px;
//         }
//         input {
//           width: 100%;
//           margin-bottom: 10px;
//           padding: 8px;
//         }
//         button {
//           margin-right: 10px;
//         }
//       </style>
//     </head>
//     <body>
//       <h2>请输入内容</h2>
//       <input type="text" id="input" placeholder="请输入内容" />
//       <div>
//         <button onclick="submit()">提交</button>
//         <button onclick="cancel()">取消</button>
//       </div>

//       <script>
//         const vscode = acquireVsCodeApi();

//         function submit() {
//           const value = document.getElementById('input').value;
//           vscode.postMessage({ command: 'submit', text: value });
//         }

//         function cancel() {
//           vscode.postMessage({ command: 'cancel' });
//         }
//       </script>
//     </body>
//     </html>
//   `;
// }


function getWebviewContent() {
	return `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <style>
    html, body {
      margin: 0;
      padding: 0;
      height: 100%;
      font-family: sans-serif;
      background: rgba(0, 0, 0, 0.3); /* 模拟遮罩 */
    }
    .modal-container {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
    }
    .modal {
      background: white;
      padding: 30px;
      border-radius: 10px;
      width: 400px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    }
    .modal h2 {
      margin-top: 0;
    }
    .modal input {
      width: 100%;
      padding: 10px;
      margin-top: 10px;
      margin-bottom: 20px;
      box-sizing: border-box;
    }
    .modal button {
      padding: 8px 16px;
      margin-right: 10px;
    }
  </style>
</head>
<body>
  <div class="modal-container">
    <div class="modal">
      <h2>请输入信息</h2>
      <input type="text" id="input" placeholder="内容..." />
      <div>
        <button onclick="submit()">提交</button>
        <button onclick="cancel()">取消</button>
      </div>
    </div>
  </div>

  <script>
    const vscode = acquireVsCodeApi();
    function submit() {
      const value = document.getElementById('input').value;
      vscode.postMessage({ command: 'submit', text: value });
    }
    function cancel() {
      vscode.postMessage({ command: 'cancel' });
    }
  </script>
</body>
</html>
  `;
}