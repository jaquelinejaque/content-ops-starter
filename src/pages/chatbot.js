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
        <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
            <div className={`flex items-start max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'} gap-3`}>
                <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                        isUser ? 'bg-emerald-600 text-white' : 'bg-gradient-to-br from-blue-600 to-indigo-700 text-white'
                    }`}
                >
                    {isUser ? 'Eu' : 'FB'}
                </div>
                <div
                    className={`rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                        isUser ? 'bg-emerald-600 text-white rounded-tr-sm' : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-tl-sm'
                    }`}
                >
                    {message.content}
                </div>
            </div>
        </div>
    );
}

function TypingIndicator() {
    return (
        <div className="flex justify-start mb-4">
            <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
                    FB
                </div>
                <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm border border-gray-100">
                    <div className="flex gap-1">
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
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
                <title>FinBot - Chatbot de Mercados Financeiros</title>
                <meta name="description" content="Assistente inteligente especializado em mercados financeiros, investimentos e economia." />
            </Head>

            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col">
                {/* Header */}
                <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
                    <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-bold text-lg shadow-md">
                                F
                            </div>
                            <div>
                                <h1 className="text-lg font-bold text-gray-900 leading-tight">FinBot</h1>
                                <p className="text-xs text-gray-500">Assistente de Mercados Financeiros</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {messages.length > 0 && (
                                <button
                                    onClick={handleClear}
                                    className="text-sm text-gray-500 hover:text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    Limpar conversa
                                </button>
                            )}
                            <a
                                href="/"
                                className="text-sm text-blue-600 hover:text-blue-700 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                            >
                                Voltar ao site
                            </a>
                        </div>
                    </div>
                </header>

                {/* Chat area */}
                <main className="flex-1 overflow-y-auto">
                    <div className="max-w-4xl mx-auto px-4 py-6">
                        {messages.length === 0 && !isLoading ? (
                            <div className="flex flex-col items-center justify-center py-12">
                                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white text-3xl font-bold shadow-lg mb-6">
                                    F
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">Bem-vindo ao FinBot</h2>
                                <p className="text-gray-500 text-center max-w-md mb-8">
                                    Sou seu assistente especializado em mercados financeiros. Pergunte sobre ações, renda fixa, criptomoedas, economia e muito mais.
                                </p>

                                <div className="w-full max-w-2xl">
                                    <p className="text-sm font-medium text-gray-600 mb-3">Sugestões para começar:</p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        {SUGGESTED_QUESTIONS.map((q, i) => (
                                            <button
                                                key={i}
                                                onClick={() => handleSuggestion(q)}
                                                className="text-left text-sm bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-700 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 transition-all shadow-sm"
                                            >
                                                {q}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-xl max-w-2xl">
                                    <p className="text-xs text-amber-700 text-center">
                                        <strong>Aviso:</strong> As informações fornecidas são apenas educacionais e não constituem recomendação de investimento.
                                        Consulte sempre um profissional certificado antes de tomar decisões financeiras.
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <>
                                {messages.map((msg, i) => (
                                    <ChatMessage key={i} message={msg} />
                                ))}
                                {isLoading && <TypingIndicator />}
                                {error && (
                                    <div className="flex justify-center mb-4">
                                        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700 max-w-md">
                                            <strong>Erro:</strong> {error}
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </>
                        )}
                    </div>
                </main>

                {/* Input area */}
                <footer className="bg-white border-t border-gray-200 sticky bottom-0">
                    <div className="max-w-4xl mx-auto px-4 py-3">
                        <form onSubmit={handleSubmit} className="flex gap-2">
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Pergunte sobre mercados financeiros..."
                                disabled={isLoading}
                                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-400"
                            />
                            <button
                                type="submit"
                                disabled={!input.trim() || isLoading}
                                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl text-sm font-medium hover:from-blue-700 hover:to-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                            >
                                Enviar
                            </button>
                        </form>
                        <p className="text-xs text-gray-400 text-center mt-2">
                            FinBot pode cometer erros. Verifique informações importantes. Não constitui consultoria financeira.
                        </p>
                    </div>
                </footer>
            </div>
        </>
    );
}
