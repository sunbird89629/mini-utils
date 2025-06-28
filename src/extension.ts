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
	const disposable = vscode.commands.registerCommand('mini-utils.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from mini-utils006!');
	});

	context.subscriptions.push(disposable);

	const editorListener = vscode.window.onDidChangeActiveTextEditor((editor) => {
		changeIME();
	});
	context.subscriptions.push(editorListener);

	// const stateDisposable = vscode.window.onDidChangeWindowState((state) => {
	// 	vscode.window.showInformationMessage(`mini-utils: onDidChangeWindowState.state=>${state}`);
	// })
	// context.subscriptions.push(stateDisposable);

	// const stateDisposable = vscode.window.onDidChangeActiveTextEditor(editor => {

	// 	vscode.window.showInformationMessage(`mini-utils: onDidChangeActiveTextEditor.editor=>${editor}`);

	// 	// if (!editor) {
	// 	// 	// 输入框或 Quick Open 等占据焦点
	// 	// 	// console.log('可能弹出了 Quick Open 或其他输入框');
	// 	// } else {
	// 	// 	// console.log('返回编辑器焦点');
	// 	// }
	// });
	// context.subscriptions.push(stateDisposable);


	// 要拦截的命令列表
	// const commandsToIntercept = [
	// 	'workbench.action.quickOpen',
	// 	'workbench.action.showAllSymbols',
	// 	'workbench.action.showCommands',
	// 	'editor.action.formatDocument'
	// ];

	// // 存储原始命令的映射
	// const originalCommands = new Map<string, vscode.Disposable>();

	// commandsToIntercept.forEach(commandId => {
	// 	interceptCommand(context, commandId, originalCommands);
	// });

	// // 清理函数
	// context.subscriptions.push({
	// 	dispose: () => {
	// 		originalCommands.forEach(disposable => disposable.dispose());
	// 	}
	// });

	// 根据 cursorStyle 的值来确定 neovim 现在处于什么模式
	// 经测试
	// cursorStyle 2 normal mode
	// cursorStyle 1 insert mo
	// cursorStyle 4 visual mode
	context.subscriptions.push(vscode.window.onDidChangeTextEditorOptions(async (e: vscode.TextEditorOptionsChangeEvent) => {
		// vscode.window.showInformationMessage(`cursorStyle:${e.options.cursorStyle}`);
		const cursorStyle = e.options.cursorStyle;
		if (cursorStyle == 2) {
			changeIME();
		} else if (cursorStyle == 4) {
			changeIME();
		}
	}));



	// const manager = new CommandInterceptionManager(context);


	// const commandsToIntercept = [
	// 	'workbench.action.quickOpen',
	// 	'workbench.action.showAllSymbols',
	// 	'workbench.action.showCommands',
	// 	'editor.action.formatDocument'
	// ]

	// commandsToIntercept.forEach(commandId => {
	// 	// 添加拦截器
	// 	manager.addInterceptor({
	// 		commandId: commandId,
	// 		before: async (args) => {
	// 			console.log('Quick Open 拦截 - 执行前');
	// 			vscode.window.showInformationMessage('Quick Open 即将打开');
	// 			return true;
	// 		},
	// 		after: async (args, result) => {
	// 			console.log('Quick Open 拦截 - 执行后');
	// 			vscode.window.showInformationMessage('Quick Open 已打开');
	// 		}
	// 	});
	// });
	// context.subscriptions.push(manager);

	// const quickSelectWindowDispose = vscode.window.

	// let currentMode = '';
	// // 定期检查状态栏中的模式信息
	// const modeChecker = setInterval(() => {
	// 	console.log("mini-utils checking......");
	// 	const statusBarItems = vscode.window.activeTextEditor?.document;
	// 	if (statusBarItems) {
	// 		// 通过 vscode-neovim 的 API 获取当前模式
	// 		const neovimMode = getNeovimMode();
	// 		if (neovimMode && neovimMode !== currentMode) {
	// 			currentMode = neovimMode;
	// 			onModeChanged(currentMode);
	// 		}
	// 	}
	// }, 100); // 每100ms检查一次

	// context.subscriptions.push({
	// 	dispose: () => clearInterval(modeChecker)
	// });


	// const neovimExtension = vscode.extensions.getExtension('asvetliakov.vscode-neovim');

	// if (neovimExtension) {
	// 	// Wait for the extension to be active
	// 	neovimExtension.activate().then(() => {
	// 		const neovimApi = neovimExtension.exports;

	// 		if (neovimApi && neovimApi.onModeChange) {
	// 			// Subscribe to mode change events
	// 			const disposable = neovimApi.onModeChange((mode: string) => {
	// 				console.log(`Neovim mode changed to: ${mode}`);
	// 				handleModeChange(mode);
	// 			});

	// 			context.subscriptions.push(disposable);
	// 		}
	// 	});
	// }


	// const editorListener = vscode.window.onDidChangeActiveTextEditor(() => {
	// 	console.log("onDidChangeActiveTextEditor called......");
	// 	console.log("mini-utils im start");
	// 	// 切换到英文输入法（macOS 下用 im-select com.apple.keylayout.ABC）
	// 	exec('/opt/homebrew/bin/im-select com.apple.keylayout.ABC', (error) => {
	// 		if (error) {
	// 			console.error('mini-utils im change fail:', error);
	// 		}
	// 	});
	// 	vscode.window.showInformationMessage('mimi-utils IM Changed');
	// 	// console.log("mini-utils im end");
	// });
	// const originExecuteCommand = vscode.commands.executeCommand
	// vscode.commands.executeCommand = myExecuteCommand;
}

function myExecuteCommand<T = unknown>(command: string, ...rest: any[]): Thenable<T> {
	vscode.window.showInformationMessage(`mini-utils command=>${command}`);
	// 调用实际命令并返回一个 Thenable<T>
	return vscode.commands.executeCommand<T>(command, ...rest);
}

async function interceptCommand(
	context: vscode.ExtensionContext,
	commandId: string,
	originalCommands: Map<string, vscode.Disposable>
) {
	const originCommands = await vscode.commands.getCommands();
	// 注册拦截器
	const interceptor = vscode.commands.registerCommand(commandId, async (...args) => {
		console.log(`🚀 拦截到命令: ${commandId}`, args);


		// vscode.commands.executeCommand

		// 执行拦截前的逻辑
		const shouldContinue = await onBeforeCommand(commandId, args);

		if (shouldContinue) {
			try {
				// 执行原始命令
				const result = await executeOriginalCommand(commandId, args);

				// 执行拦截后的逻辑
				await onAfterCommand(commandId, args, result);

				return result;
			} catch (error) {
				console.error(`命令执行失败: ${commandId}`, error);
				await onCommandError(commandId, args, error);
				throw error;
			}
		} else {
			console.log(`命令被阻止执行: ${commandId}`);
		}
	});

	originalCommands.set(commandId, interceptor);
	context.subscriptions.push(interceptor);
}


async function onBeforeCommand(commandId: string, args: any[]): Promise<boolean> {
	console.log(`⏳ 命令执行前: ${commandId}`);
	vscode.window.showInformationMessage(`mini-utils: onBeforeCommand.commandId=>${commandId}`);

	// 根据命令类型执行不同的逻辑
	switch (commandId) {
		case 'workbench.action.quickOpen':
			return await handleQuickOpenBefore(args);
		case 'editor.action.formatDocument':
			return await handleFormatDocumentBefore(args);
		default:
			return true; // 默认允许执行
	}
}

async function onAfterCommand(commandId: string, args: any[], result: any): Promise<void> {
	console.log(`✅ 命令执行后: ${commandId}`, result);

	// 执行后处理逻辑
	switch (commandId) {
		case 'workbench.action.quickOpen':
			await handleQuickOpenAfter(args, result);
			break;
		case 'editor.action.formatDocument':
			await handleFormatDocumentAfter(args, result);
			break;
	}
}

async function onCommandError(commandId: string, args: any[], error: any): Promise<void> {
	console.error(`❌ 命令执行错误: ${commandId}`, error);
	vscode.window.showErrorMessage(`命令 ${commandId} 执行失败: ${error.message}`);
}

// 执行原始命令的辅助函数
async function executeOriginalCommand(commandId: string, args: any[]): Promise<any> {
	// 这里需要想办法调用原始命令
	// 由于无法直接访问原始命令，我们需要使用其他方式
	return await vscode.commands.executeCommand(`original.${commandId}`, ...args);
}

// 具体的处理函数
async function handleQuickOpenBefore(args: any[]): Promise<boolean> {
	console.log('Quick Open 即将打开');
	// 可以在这里添加条件判断是否允许打开
	return true;
}

async function handleQuickOpenAfter(args: any[], result: any): Promise<void> {
	console.log('Quick Open 已打开');
}

async function handleFormatDocumentBefore(args: any[]): Promise<boolean> {
	const editor = vscode.window.activeTextEditor;
	if (editor) {
		console.log('即将格式化文档:', editor.document.fileName);
		// 可以在这里添加格式化前的检查
	}
	return true;
}

async function handleFormatDocumentAfter(args: any[], result: any): Promise<void> {
	console.log('文档格式化完成');
}


function changeIME() {
	exec('/opt/homebrew/bin/im-select com.apple.keylayout.ABC', (error, stdout, stderr) => {
		if (error) {
			// vscode.window.showErrorMessage(`IMC err: ${error.message}`);
			return;
		}
		if (stderr) {
			// vscode.window.showWarningMessage(`IMC stderr: ${stderr}`);
		}
		vscode.window.showInformationMessage(`IMC: PinYin`);
	});
}

function getNeovimMode(): string | undefined {
	// 尝试从 vscode-neovim 插件获取模式信息
	const neovimExtension = vscode.extensions.getExtension('asvetliakov.vscode-neovim');
	if (neovimExtension?.isActive) {
		logWithTag(`neovim mode is:${neovimExtension.exports?.mode}`)
		// 这里需要根据 vscode-neovim 的具体 API 来获取模式
		return neovimExtension.exports?.mode;
	}
	return undefined;
}

function logWithTag(msg: string) {
	console.log(`mini-utils>> ${msg}`);
}

function onModeChanged(mode: string) {
	console.log(`Neovim mode changed to: ${mode}`);
	// 在这里处理模式变化的逻辑

	// 例如：根据模式改变光标样式或其他 UI 元素
	switch (mode) {
		case 'normal':
			// 处理普通模式
			break;
		case 'insert':
			// 处理插入模式
			break;
		case 'visual':
			// 处理可视模式
			break;
	}
}

function handleModeChange(mode: string) {
	switch (mode) {
		case 'n': // normal mode
			vscode.window.showInformationMessage('Normal mode');
			break;
		case 'i': // insert mode
			vscode.window.showInformationMessage('Insert mode');
			break;
		case 'v': // visual mode
			vscode.window.showInformationMessage('Visual mode');
			break;
		case 'V': // visual line mode
			vscode.window.showInformationMessage('Visual Line mode');
			break;
		case '\x16': // visual block mode (Ctrl+V)
			vscode.window.showInformationMessage('Visual Block mode');
			break;
	}
}

interface CommandInterceptor {
	commandId: string;
	before?: (args: any[]) => Promise<boolean>;
	after?: (args: any[], result: any) => Promise<void>;
	onError?: (args: any[], error: any) => Promise<void>;
}

class CommandInterceptionManager {
	private interceptors = new Map<string, CommandInterceptor>();
	private originalExecuteCommand: typeof vscode.commands.executeCommand;

	constructor(private context: vscode.ExtensionContext) {
		this.originalExecuteCommand = vscode.commands.executeCommand;
		this.setupGlobalInterception();
	}

	private setupGlobalInterception() {
		// 注意：这种方法在实际的 VSCode 环境中可能不工作
		// 因为 vscode.commands.executeCommand 不能被重写
		// 这里仅作为概念示例

		const self = this;

		// 创建代理来拦截所有命令执行
		(vscode.commands as any).executeCommand = new Proxy(this.originalExecuteCommand, {
			apply: async function (target, thisArg, argumentsList) {
				const [commandId, ...args] = argumentsList;
				return await self.interceptCommand(commandId, args, target, thisArg);
			}
		});
	}

	private async interceptCommand(
		commandId: string,
		args: any[],
		originalFunction: Function,
		thisArg: any
	): Promise<any> {
		const interceptor = this.interceptors.get(commandId);

		if (interceptor) {
			console.log(`🔍 拦截命令: ${commandId}`);

			try {
				// 执行前处理
				if (interceptor.before) {
					const shouldContinue = await interceptor.before(args);
					if (!shouldContinue) {
						console.log(`⛔ 命令被阻止: ${commandId}`);
						return;
					}
				}

				// 执行原始命令
				const result = await originalFunction.apply(thisArg, [commandId, ...args]);

				// 执行后处理
				if (interceptor.after) {
					await interceptor.after(args, result);
				}

				return result;
			} catch (error) {
				if (interceptor.onError) {
					await interceptor.onError(args, error);
				}
				throw error;
			}
		} else {
			// 没有拦截器，直接执行原始命令
			return await originalFunction.apply(thisArg, [commandId, ...args]);
		}
	}

	addInterceptor(interceptor: CommandInterceptor) {
		this.interceptors.set(interceptor.commandId, interceptor);
	}

	removeInterceptor(commandId: string) {
		this.interceptors.delete(commandId);
	}

	dispose() {
		// 恢复原始函数
		(vscode.commands as any).executeCommand = this.originalExecuteCommand;
	}
}




// This method is called when your extension is deactivated
export function deactivate() { }
