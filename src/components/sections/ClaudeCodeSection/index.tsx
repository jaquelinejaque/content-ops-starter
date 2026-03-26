import * as React from 'react';
import { useState, useRef, useEffect } from 'react';

const WELCOME_LINES = [
    { type: 'system', text: '╔══════════════════════════════════════════════════════════╗' },
    { type: 'system', text: '║              Welcome to Claude Code Desktop              ║' },
    { type: 'system', text: '║          Your AI-powered coding assistant                ║' },
    { type: 'system', text: '╚══════════════════════════════════════════════════════════╝' },
    { type: 'info', text: '' },
    { type: 'info', text: '  Type a message to start coding with Claude.' },
    { type: 'info', text: '  Commands: /help, /clear, /model, /new' },
    { type: 'info', text: '' }
];

const SAMPLE_RESPONSES: Record<string, string[]> = {
    '/help': [
        '  Available commands:',
        '    /help    - Show this help message',
        '    /clear   - Clear the terminal',
        '    /model   - Show current model info',
        '    /new     - Start a new conversation',
        '    /version - Show version info',
        '',
        '  You can also type any coding question or request!'
    ],
    '/model': [
        '  Current model: claude-opus-4-6',
        '  Context window: 200K tokens',
        '  Status: Ready'
    ],
    '/version': [
        '  Claude Code Desktop v1.0.0',
        '  Runtime: Next.js 15.1.0',
        '  Framework: React 19'
    ]
};

const CODE_RESPONSES = [
    {
        keywords: ['hello', 'hi', 'oi', 'ola', 'olá'],
        response: [
            '  Hello! I\'m Claude Code, your AI coding assistant.',
            '  How can I help you today? I can:',
            '',
            '  - Write and explain code',
            '  - Debug issues',
            '  - Suggest improvements',
            '  - Answer programming questions',
        ]
    },
    {
        keywords: ['react', 'component', 'componente'],
        response: [
            '  Here\'s an example React component:',
            '',
            '  ```tsx',
            '  import React, { useState } from "react";',
            '',
            '  export default function Counter() {',
            '    const [count, setCount] = useState(0);',
            '    return (',
            '      <div className="p-4">',
            '        <p>Count: {count}</p>',
            '        <button onClick={() => setCount(c => c + 1)}>',
            '          Increment',
            '        </button>',
            '      </div>',
            '    );',
            '  }',
            '  ```'
        ]
    },
    {
        keywords: ['python', 'py'],
        response: [
            '  Here\'s a Python example:',
            '',
            '  ```python',
            '  def fibonacci(n: int) -> list[int]:',
            '      """Generate Fibonacci sequence."""',
            '      if n <= 0:',
            '          return []',
            '      fib = [0, 1]',
            '      for i in range(2, n):',
            '          fib.append(fib[i-1] + fib[i-2])',
            '      return fib[:n]',
            '',
            '  print(fibonacci(10))',
            '  # [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]',
            '  ```'
        ]
    }
];

const DEFAULT_RESPONSE = [
    '  I\'m a demo of the Claude Code interface.',
    '  In the real Claude Code Desktop, I would process',
    '  your request using AI. Try commands like /help',
    '  or ask about React or Python!'
];

interface TermLine {
    type: 'system' | 'info' | 'user' | 'assistant' | 'command';
    text: string;
}

export default function ClaudeCodeSection(props: any) {
    const { elementId } = props;
    const [lines, setLines] = useState<TermLine[]>([...WELCOME_LINES] as TermLine[]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const terminalRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
    }, [lines]);

    function getResponse(message: string): string[] {
        const lower = message.toLowerCase().trim();

        if (SAMPLE_RESPONSES[lower]) {
            return SAMPLE_RESPONSES[lower];
        }

        for (const cr of CODE_RESPONSES) {
            if (cr.keywords.some((kw) => lower.includes(kw))) {
                return cr.response;
            }
        }

        return DEFAULT_RESPONSE;
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!input.trim() || isTyping) return;

        const userMessage = input.trim();
        setInput('');

        if (userMessage === '/clear') {
            setLines([...WELCOME_LINES] as TermLine[]);
            return;
        }

        if (userMessage === '/new') {
            setLines([
                ...WELCOME_LINES,
                { type: 'info', text: '  New conversation started.' },
                { type: 'info', text: '' }
            ] as TermLine[]);
            return;
        }

        const newLines: TermLine[] = [
            ...lines,
            { type: 'user', text: `  > ${userMessage}` },
            { type: 'info', text: '' }
        ];
        setLines(newLines);
        setIsTyping(true);

        const response = getResponse(userMessage);

        // Simulate typing effect
        let i = 0;
        const interval = setInterval(() => {
            if (i < response.length) {
                setLines((prev) => [...prev, { type: 'assistant', text: response[i] }]);
                i++;
            } else {
                setLines((prev) => [...prev, { type: 'info', text: '' }]);
                setIsTyping(false);
                clearInterval(interval);
                inputRef.current?.focus();
            }
        }, 60);
    }

    function getLineColor(type: string) {
        switch (type) {
            case 'system':
                return 'text-orange-400';
            case 'user':
                return 'text-green-400';
            case 'assistant':
                return 'text-blue-300';
            case 'command':
                return 'text-yellow-400';
            case 'info':
            default:
                return 'text-gray-400';
        }
    }

    return (
        <section id={elementId || 'claude-code'} className="bg-gray-950 min-h-screen flex flex-col">
            {/* Title Bar */}
            <div className="bg-gray-900 border-b border-gray-700 px-4 py-2 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                    <div className="flex gap-2">
                        <span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span>
                        <span className="w-3 h-3 rounded-full bg-yellow-500 inline-block"></span>
                        <span className="w-3 h-3 rounded-full bg-green-500 inline-block"></span>
                    </div>
                    <span className="text-gray-400 text-sm font-mono ml-2">Claude Code Desktop</span>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-gray-500 text-xs font-mono">claude-opus-4-6</span>
                    <span className="w-2 h-2 rounded-full bg-green-400 inline-block"></span>
                </div>
            </div>

            {/* Sidebar + Terminal */}
            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <div className="w-56 bg-gray-900 border-r border-gray-700 p-4 hidden md:flex flex-col">
                    <div className="text-gray-300 text-xs font-mono uppercase tracking-wider mb-4">Explorer</div>
                    <div className="space-y-1 text-sm font-mono">
                        <div className="text-gray-500 flex items-center gap-2">
                            <span>&#9660;</span> <span className="text-gray-300">src/</span>
                        </div>
                        <div className="text-gray-500 pl-4 flex items-center gap-2">
                            <span>&#9660;</span> <span className="text-gray-300">components/</span>
                        </div>
                        <div className="text-blue-400 pl-8">ClaudeCode.tsx</div>
                        <div className="text-gray-400 pl-8">Header.tsx</div>
                        <div className="text-gray-400 pl-8">Footer.tsx</div>
                        <div className="text-gray-500 pl-4 flex items-center gap-2">
                            <span>&#9660;</span> <span className="text-gray-300">pages/</span>
                        </div>
                        <div className="text-gray-400 pl-8">index.tsx</div>
                        <div className="text-gray-400 pl-8">api/</div>
                        <div className="text-gray-500 pl-4 flex items-center gap-2">
                            <span>&#9660;</span> <span className="text-gray-300">utils/</span>
                        </div>
                        <div className="text-gray-400 pl-8">helpers.ts</div>
                    </div>

                    <div className="mt-8 text-gray-300 text-xs font-mono uppercase tracking-wider mb-4">Terminal</div>
                    <div className="space-y-2 text-sm font-mono">
                        <div className="text-green-400 flex items-center gap-2 cursor-pointer hover:text-green-300">
                            <span>&#9654;</span> Run Dev
                        </div>
                        <div className="text-yellow-400 flex items-center gap-2 cursor-pointer hover:text-yellow-300">
                            <span>&#9654;</span> Build
                        </div>
                        <div className="text-blue-400 flex items-center gap-2 cursor-pointer hover:text-blue-300">
                            <span>&#9654;</span> Test
                        </div>
                    </div>

                    <div className="mt-auto pt-4 border-t border-gray-700">
                        <div className="text-gray-500 text-xs font-mono">
                            <div>Claude Code v1.0</div>
                            <div className="mt-1">Powered by Anthropic</div>
                        </div>
                    </div>
                </div>

                {/* Main Terminal Area */}
                <div className="flex-1 flex flex-col">
                    {/* Tab Bar */}
                    <div className="bg-gray-900 border-b border-gray-700 px-2 flex items-center shrink-0">
                        <div className="flex items-center gap-1 px-3 py-2 bg-gray-950 border-t-2 border-orange-500 text-gray-300 text-sm font-mono">
                            <span className="text-orange-400">&#9679;</span> Terminal
                        </div>
                        <div className="flex items-center gap-1 px-3 py-2 text-gray-500 text-sm font-mono hover:text-gray-300 cursor-pointer">
                            Output
                        </div>
                        <div className="flex items-center gap-1 px-3 py-2 text-gray-500 text-sm font-mono hover:text-gray-300 cursor-pointer">
                            Problems
                        </div>
                    </div>

                    {/* Terminal Output */}
                    <div
                        ref={terminalRef}
                        className="flex-1 overflow-y-auto p-4 font-mono text-sm leading-6"
                        onClick={() => inputRef.current?.focus()}
                    >
                        {lines.map((line, i) => (
                            <div key={i} className={getLineColor(line.type)}>
                                {line.text || '\u00A0'}
                            </div>
                        ))}
                        {isTyping && (
                            <div className="text-blue-300 animate-pulse">  ...</div>
                        )}
                    </div>

                    {/* Input Area */}
                    <div className="border-t border-gray-700 bg-gray-900 p-3 shrink-0">
                        <form onSubmit={handleSubmit} className="flex items-center gap-3">
                            <span className="text-orange-400 font-mono text-sm shrink-0">claude &gt;</span>
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder={isTyping ? 'Waiting for response...' : 'Type a message or command...'}
                                disabled={isTyping}
                                className="flex-1 bg-transparent text-gray-200 font-mono text-sm outline-none placeholder-gray-600 disabled:opacity-50"
                                autoFocus
                            />
                            <button
                                type="submit"
                                disabled={isTyping || !input.trim()}
                                className="px-3 py-1 bg-orange-600 hover:bg-orange-500 disabled:bg-gray-700 disabled:text-gray-500 text-white text-sm font-mono rounded transition-colors"
                            >
                                Send
                            </button>
                        </form>
                    </div>

                    {/* Status Bar */}
                    <div className="bg-orange-700 px-4 py-1 flex items-center justify-between text-xs font-mono text-white shrink-0">
                        <div className="flex items-center gap-4">
                            <span>Claude Code Desktop</span>
                            <span>UTF-8</span>
                            <span>TypeScript React</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <span>Ln 1, Col 1</span>
                            <span>Spaces: 2</span>
                            <span className="flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-green-300 inline-block"></span>
                                Connected
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
