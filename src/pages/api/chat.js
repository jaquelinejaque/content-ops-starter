import Anthropic from '@anthropic-ai/sdk';

const SYSTEM_PROMPT = `Você é o Claude, assistente de IA da Anthropic, especializado em mercados financeiros e finanças.

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

const FALLBACK_RESPONSES = {
    selic: `A Taxa Selic é a taxa básica de juros da economia brasileira, definida pelo Copom (Comitê de Política Monetária) do Banco Central a cada 45 dias.

Como ela afeta seus investimentos:

1. **Renda Fixa**: Quando a Selic sobe, investimentos como Tesouro Selic, CDBs e LCIs rendem mais. Quando cai, rendem menos.

2. **Ações**: Selic alta tende a desvalorizar ações, pois investidores migram para renda fixa. Selic baixa favorece a bolsa.

3. **FIIs**: Fundos imobiliários também sofrem com Selic alta, pois competem com a renda fixa.

4. **Câmbio**: Selic alta atrai capital estrangeiro, valorizando o real.

⚠️ Este conteúdo é educacional e não constitui recomendação de investimento.`,

    'renda fixa': `**Renda Fixa** e **Renda Variável** são as duas grandes classes de investimentos:

**Renda Fixa:**
- Você sabe (ou pode prever) quanto vai receber
- Exemplos: Tesouro Direto, CDB, LCI, LCA, debêntures
- Menor risco, retornos mais previsíveis
- Ideal para reserva de emergência e perfil conservador

**Renda Variável:**
- O retorno não é garantido, pode variar positiva ou negativamente
- Exemplos: Ações, FIIs, ETFs, criptomoedas
- Maior risco, potencial de retornos maiores
- Ideal para longo prazo e perfil moderado/arrojado

A diversificação entre as duas classes é fundamental para uma carteira equilibrada.

⚠️ Este conteúdo é educacional e não constitui recomendação de investimento.`,

    tesouro: `O **Tesouro Direto** é um programa do governo federal que permite a compra de títulos públicos por pessoas físicas pela internet.

**Principais títulos:**

1. **Tesouro Selic (LFT)**: Rende conforme a taxa Selic. Ideal para reserva de emergência. Baixa volatilidade.

2. **Tesouro Prefixado (LTN)**: Taxa fixa definida na compra. Você sabe exatamente quanto vai receber no vencimento.

3. **Tesouro IPCA+ (NTN-B)**: Rende IPCA + taxa fixa. Protege contra a inflação. Ideal para longo prazo.

**Vantagens:**
- Investimento mínimo a partir de R$ 30
- Segurança (garantido pelo governo federal)
- Liquidez diária (pode vender antes do vencimento)

**Custos:**
- Taxa de custódia da B3 (0,20% ao ano)
- IR regressivo (22,5% a 15% conforme o prazo)

⚠️ Este conteúdo é educacional e não constitui recomendação de investimento.`,

    fii: `**FIIs (Fundos de Investimento Imobiliário)** são fundos que investem em imóveis ou ativos ligados ao setor imobiliário.

**Como funcionam:**
- Você compra cotas na bolsa (B3), como se fossem ações
- O fundo investe em imóveis (shoppings, galpões, escritórios) ou papéis imobiliários (CRIs, LCIs)
- Os rendimentos (aluguéis) são distribuídos mensalmente aos cotistas

**Tipos principais:**
1. **Tijolo**: Investem em imóveis físicos (shoppings, lajes corporativas, galpões logísticos)
2. **Papel**: Investem em títulos ligados ao mercado imobiliário (CRIs, LCIs)
3. **Híbridos**: Combinam tijolo e papel
4. **FOFs**: Fundos que investem em outros FIIs

**Vantagens:**
- Rendimentos mensais isentos de IR para pessoa física
- Diversificação imobiliária com pouco capital
- Liquidez na bolsa

⚠️ Este conteúdo é educacional e não constitui recomendação de investimento.`,

    diversificar: `**Diversificação** é a estratégia de distribuir seus investimentos entre diferentes ativos para reduzir riscos.

**Princípio:** "Não coloque todos os ovos na mesma cesta."

**Como diversificar:**

1. **Entre classes de ativos:**
   - Renda Fixa (Tesouro, CDBs, LCIs)
   - Renda Variável (Ações, FIIs, ETFs)
   - Câmbio (dólar, ouro)

2. **Dentro de cada classe:**
   - Ações de setores diferentes
   - FIIs de segmentos variados
   - Títulos com prazos diferentes

3. **Geograficamente:**
   - Investimentos nacionais
   - Investimentos internacionais (BDRs, ETFs globais)

**Exemplo por perfil:**
- Conservador: 80% renda fixa, 20% renda variável
- Moderado: 50% renda fixa, 50% renda variável
- Arrojado: 20% renda fixa, 80% renda variável

⚠️ Este conteúdo é educacional e não constitui recomendação de investimento.`,

    fundamentalista: `**Análise Fundamentalista** é o estudo dos fundamentos financeiros de uma empresa para avaliar se suas ações estão caras ou baratas.

**Principais indicadores:**

1. **P/L (Preço/Lucro)**: Quantos anos levaria para recuperar o investimento via lucros. Menor = mais barato.

2. **P/VP (Preço/Valor Patrimonial)**: Compara preço da ação com o patrimônio da empresa. Abaixo de 1 pode indicar desconto.

3. **ROE (Retorno sobre Patrimônio)**: Mede a rentabilidade. Quanto maior, melhor a empresa gera lucro.

4. **Dividend Yield**: Percentual de dividendos pagos em relação ao preço da ação.

5. **Dívida Líquida/EBITDA**: Mede o endividamento. Abaixo de 3 é geralmente saudável.

6. **Margem Líquida**: Percentual de lucro em relação à receita.

**Etapas da análise:**
- Análise do setor e economia
- Leitura de balanços e demonstrativos
- Cálculo dos indicadores
- Comparação com concorrentes
- Avaliação de governança corporativa

⚠️ Este conteúdo é educacional e não constitui recomendação de investimento.`
};

function getFallbackResponse(userMessage) {
    const msg = userMessage.toLowerCase();

    if (msg.includes('selic')) return FALLBACK_RESPONSES.selic;
    if (msg.includes('renda fixa') || msg.includes('renda variável') || msg.includes('renda variavel') || msg.includes('diferença') || msg.includes('diferenca'))
        return FALLBACK_RESPONSES['renda fixa'];
    if (msg.includes('tesouro')) return FALLBACK_RESPONSES.tesouro;
    if (msg.includes('fii') || msg.includes('fundo imobiliário') || msg.includes('fundo imobiliario'))
        return FALLBACK_RESPONSES.fii;
    if (msg.includes('diversific')) return FALLBACK_RESPONSES.diversificar;
    if (msg.includes('fundamentalista') || msg.includes('fundamental'))
        return FALLBACK_RESPONSES.fundamentalista;

    return `Olá! Sou o Claude, especializado em mercados financeiros. Posso te ajudar com os seguintes temas:

- **Taxa Selic** e política monetária
- **Renda Fixa vs Renda Variável**
- **Tesouro Direto** e seus títulos
- **FIIs** (Fundos Imobiliários)
- **Diversificação** de carteira
- **Análise Fundamentalista** de ações

Experimente perguntar sobre um desses temas!

⚠️ Este conteúdo é educacional e não constitui recomendação de investimento.`;
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: 'Messages array is required' });
    }

    const lastMessage = messages[messages.length - 1]?.content || '';
    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (apiKey) {
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
            console.error('Anthropic API error, using fallback:', error.message);
            return res.status(200).json({ reply: getFallbackResponse(lastMessage) });
        }
    }

    return res.status(200).json({ reply: getFallbackResponse(lastMessage) });
}
