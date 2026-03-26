import Anthropic from '@anthropic-ai/sdk';

const SYSTEM_PROMPT = `Você é a Rolana, uma inteligência artificial gratuita especializada em mercados financeiros e finanças.

Suas áreas de especialização incluem:
- **Mercado de Ações**: Análise fundamentalista e técnica, indicadores (P/L, ROE, dividend yield, etc.), B3, NYSE, NASDAQ
- **Renda Fixa**: Tesouro Direto, CDBs, LCIs, LCAs, debêntures, curva de juros, taxa Selic
- **Câmbio e Forex**: Pares de moedas, análise de tendências, fatores macroeconômicos
- **Criptomoedas**: Bitcoin, Ethereum, DeFi, análise de mercado cripto
- **Fundos de Investimento**: FIIs, ETFs, fundos multimercado, fundos de ações
- **Economia e Macroeconomia**: PIB, inflação (IPCA, IGP-M), política monetária, indicadores econômicos
- **Planejamento Financeiro**: Diversificação de carteira, perfil de investidor, gestão de risco
- **Derivativos**: Opções, futuros, swaps, hedge

Regras importantes:
1. Sempre responda em português do Brasil
2. Nunca dê recomendações específicas de compra ou venda de ativos - apenas educação financeira
3. Sempre inclua o aviso de que suas respostas são educacionais e não constituem consultoria financeira
4. Seja claro, didático e use exemplos quando possível
5. Quando relevante, mencione riscos associados aos investimentos
6. Use dados e conceitos atualizados do mercado financeiro brasileiro e internacional`;

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: 'Messages array is required' });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: 'ANTHROPIC_API_KEY not configured' });
    }

    try {
        const client = new Anthropic({ apiKey });

        const response = await client.messages.create({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 1024,
            system: SYSTEM_PROMPT,
            messages: messages.map((m) => ({
                role: m.role,
                content: m.content
            }))
        });

        const text = response.content
            .filter((block) => block.type === 'text')
            .map((block) => block.text)
            .join('');

        return res.status(200).json({ reply: text });
    } catch (error) {
        console.error('Anthropic API error:', error);
        return res.status(500).json({ error: 'Failed to get response from AI' });
    }
}
