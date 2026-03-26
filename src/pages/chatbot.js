import { useState, useRef, useEffect } from 'react';
import Head from 'next/head';

const SUGGESTED_QUESTIONS = [
    'O que é a taxa Selic e como ela afeta meus investimentos?',
    'Qual a diferença entre renda fixa e renda variável?',
    'Como funciona o Tesouro Direto?',
    'O que são FIIs e como investir neles?',
    'Como diversificar minha carteira de investimentos?',
    'O que é análise fundamentalista de ações?'
];

function ChatMessage({ message }) {
    const isUser = message.role === 'user';

    return (
        <div className={`py-4 px-4 ${isUser ? '' : 'bg-[#1a1a2e]'}`}>
            <div className="max-w-3xl mx-auto flex gap-3">
                <div className="flex-shrink-0 mt-0.5">
                    {isUser ? (
                        <div className="w-7 h-7 rounded-full bg-[#6e56cf] flex items-center justify-center">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                <circle cx="12" cy="7" r="4" />
                            </svg>
                        </div>
                    ) : (
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#d97706] to-[#b45309] flex items-center justify-center">
                            <span className="text-white text-xs font-bold">C</span>
                        </div>
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium mb-1" style={{ color: isUser ? '#a78bfa' : '#d97706' }}>
                        {isUser ? 'Voce' : 'Claude'}
                    </div>
                    <div className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: '#e2e8f0' }}>
                        {message.content}
                    </div>
                </div>
            </div>
        </div>
    );
}

function TypingIndicator() {
    return (
        <div className="py-4 px-4 bg-[#1a1a2e]">
            <div className="max-w-3xl mx-auto flex gap-3">
                <div className="flex-shrink-0 mt-0.5">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#d97706] to-[#b45309] flex items-center justify-center">
                        <span className="text-white text-xs font-bold">C</span>
                    </div>
                </div>
                <div className="flex-1">
                    <div className="text-xs font-medium mb-1" style={{ color: '#d97706' }}>Claude</div>
                    <div className="flex items-center gap-1 py-1">
                        <span className="inline-block w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: '#d97706', animationDelay: '0ms' }} />
                        <span className="inline-block w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: '#d97706', animationDelay: '200ms' }} />
                        <span className="inline-block w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: '#d97706', animationDelay: '400ms' }} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function Chatbot() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    async function sendMessage(text) {
        const userMessage = { role: 'user', content: text };
        const updatedMessages = [...messages, userMessage];
        setMessages(updatedMessages);
        setInput('');
        setError(null);
        setIsLoading(true);

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: updatedMessages })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Erro ao obter resposta');
            }

            setMessages([...updatedMessages, { role: 'assistant', content: data.reply }]);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }

    function handleSubmit(e) {
        e.preventDefault();
        const trimmed = input.trim();
        if (!trimmed || isLoading) return;
        sendMessage(trimmed);
    }

    function handleSuggestion(question) {
        if (isLoading) return;
        sendMessage(question);
    }

    function handleClear() {
        setMessages([]);
        setError(null);
        inputRef.current?.focus();
    }

    return (
        <>
            <Head>
                <title>Claude Code - Mercados Financeiros</title>
                <meta name="description" content="Claude Code para mercados financeiros - assistente de IA da Anthropic especializado em financas." />
                <style>{`
                    body { margin: 0; padding: 0; background: #0f0f1a; }
                    * { box-sizing: border-box; }
                    @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
                    .fade-in { animation: fadeIn 0.3s ease-out; }
                    @keyframes gradientShift {
                        0% { background-position: 0% 50%; }
                        50% { background-position: 100% 50%; }
                        100% { background-position: 0% 50%; }
                    }
                    .gradient-animate {
                        background-size: 200% 200%;
                        animation: gradientShift 3s ease infinite;
                    }
                    .scrollbar-thin::-webkit-scrollbar { width: 6px; }
                    .scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
                    .scrollbar-thin::-webkit-scrollbar-thumb { background: #2a2a3e; border-radius: 3px; }
                    .scrollbar-thin::-webkit-scrollbar-thumb:hover { background: #3a3a4e; }
                `}</style>
            </Head>

            <div className="flex flex-col" style={{ minHeight: '100vh', background: '#0f0f1a', fontFamily: "'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>

                {/* Top bar - Claude Code style */}
                <header style={{ background: '#13131f', borderBottom: '1px solid #1e1e30' }} className="sticky top-0 z-10">
                    <div className="max-w-5xl mx-auto px-4 py-2.5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center gradient-animate"
                                style={{ background: 'linear-gradient(135deg, #d97706, #b45309, #d97706)' }}>
                                <span className="text-white font-bold text-sm">C</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold" style={{ color: '#f1f5f9' }}>Claude Code</span>
                                <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: '#1e1e30', color: '#64748b' }}>Financas</span>
                                <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: '#1e1e30', color: '#d97706' }}>by Anthropic</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {messages.length > 0 && (
                                <button
                                    onClick={handleClear}
                                    className="text-xs px-3 py-1.5 rounded-md transition-all"
                                    style={{ color: '#94a3b8', border: '1px solid #1e1e30' }}
                                    onMouseEnter={(e) => { e.target.style.background = '#1e1e30'; e.target.style.color = '#e2e8f0'; }}
                                    onMouseLeave={(e) => { e.target.style.background = 'transparent'; e.target.style.color = '#94a3b8'; }}
                                >
                                    Nova conversa
                                </button>
                            )}
                            <a href="/" className="text-xs px-3 py-1.5 rounded-md transition-all"
                                style={{ color: '#64748b' }}
                                onMouseEnter={(e) => { e.target.style.color = '#e2e8f0'; }}
                                onMouseLeave={(e) => { e.target.style.color = '#64748b'; }}
                            >
                                Sair
                            </a>
                        </div>
                    </div>
                </header>

                {/* Chat area */}
                <main className="flex-1 overflow-y-auto scrollbar-thin">
                    {messages.length === 0 && !isLoading ? (
                        <div className="flex flex-col items-center justify-center px-4 fade-in" style={{ minHeight: 'calc(100vh - 140px)' }}>
                            {/* Hero */}
                            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 gradient-animate"
                                style={{ background: 'linear-gradient(135deg, #d97706, #b45309, #d97706)' }}>
                                <span className="text-white text-2xl font-bold">C</span>
                            </div>
                            <h2 className="text-xl font-semibold mb-2" style={{ color: '#f1f5f9' }}>
                                Claude Code - Mercados Financeiros
                            </h2>
                            <p className="text-sm text-center max-w-md mb-8" style={{ color: '#64748b' }}>
                                Inteligencia artificial da Anthropic especializada em mercados financeiros. Pergunte sobre acoes, renda fixa, cripto, economia e mais.
                            </p>

                            {/* Suggestion cards */}
                            <div className="w-full max-w-2xl mb-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {SUGGESTED_QUESTIONS.map((q, i) => (
                                        <button
                                            key={i}
                                            onClick={() => handleSuggestion(q)}
                                            className="text-left text-xs px-4 py-3 rounded-lg transition-all"
                                            style={{ background: '#13131f', border: '1px solid #1e1e30', color: '#94a3b8' }}
                                            onMouseEnter={(e) => { e.target.style.borderColor = '#d97706'; e.target.style.color = '#e2e8f0'; e.target.style.background = '#1a1a2e'; }}
                                            onMouseLeave={(e) => { e.target.style.borderColor = '#1e1e30'; e.target.style.color = '#94a3b8'; e.target.style.background = '#13131f'; }}
                                        >
                                            {q}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Disclaimer */}
                            <div className="px-4 py-2.5 rounded-lg max-w-2xl" style={{ background: '#1a1510', border: '1px solid #2d2010' }}>
                                <p className="text-xs text-center" style={{ color: '#b08940' }}>
                                    Conteudo educacional. Nao constitui recomendacao de investimento.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="fade-in">
                            {messages.map((msg, i) => (
                                <ChatMessage key={i} message={msg} />
                            ))}
                            {isLoading && <TypingIndicator />}
                            {error && (
                                <div className="py-3 px-4">
                                    <div className="max-w-3xl mx-auto">
                                        <div className="px-4 py-2.5 rounded-lg text-xs" style={{ background: '#1a1015', border: '1px solid #2d1020', color: '#f87171' }}>
                                            Erro: {error}
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    )}
                </main>

                {/* Input - Claude Code style */}
                <footer style={{ background: '#13131f', borderTop: '1px solid #1e1e30' }} className="sticky bottom-0">
                    <div className="max-w-3xl mx-auto px-4 py-3">
                        <form onSubmit={handleSubmit} className="flex items-center gap-2">
                            <div className="flex-1 flex items-center rounded-lg px-3 py-2.5"
                                style={{ background: '#0f0f1a', border: '1px solid #1e1e30' }}>
                                <span className="text-sm mr-2" style={{ color: '#d97706' }}>&gt;</span>
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Pergunte sobre mercados financeiros..."
                                    disabled={isLoading}
                                    className="flex-1 bg-transparent text-sm outline-none"
                                    style={{ color: '#e2e8f0', caretColor: '#d97706' }}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={!input.trim() || isLoading}
                                className="px-4 py-2.5 rounded-lg text-sm font-medium transition-all"
                                style={{
                                    background: !input.trim() || isLoading ? '#1e1e30' : 'linear-gradient(135deg, #d97706, #b45309)',
                                    color: !input.trim() || isLoading ? '#475569' : '#fff',
                                    cursor: !input.trim() || isLoading ? 'not-allowed' : 'pointer',
                                    opacity: !input.trim() || isLoading ? 0.5 : 1
                                }}
                            >
                                Enviar
                            </button>
                        </form>
                        <div className="flex items-center justify-between mt-2 px-1">
                            <p className="text-xs" style={{ color: '#334155' }}>
                                Claude pode cometer erros. Nao constitui consultoria financeira.
                            </p>
                            <p className="text-xs" style={{ color: '#334155' }}>
                                Powered by Claude - Anthropic
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
