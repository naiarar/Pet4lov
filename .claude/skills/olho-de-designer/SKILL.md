---
name: "olho-de-designer"
description: "Use ao criar, revisar ou ajustar telas e componentes de interface (dashboards, listas, formulários, portais), principalmente sem design system, para aplicar boas práticas de UX/UI."
---

# Olho de designer

A IA não desenha mal: ela desenha a média. Sem direção, cada lacuna do pedido vira o resultado mais comum (usuário genérico, visual padrão, tudo com o mesmo peso). Esta skill dá a direção que falta antes, durante e depois de gerar uma tela.

## 1. Antes de gerar: os 5 ingredientes

Confira se o pedido tem os 5 ingredientes. Se faltar algum, pergunte em uma única mensagem curta. Se não houver como perguntar, assuma o mais provável e diga em uma linha o que assumiu.

| Ingrediente | Pergunta | Sem ele |
| --- | --- | --- |
| Contexto | Quem usa, para quê, com que frequência, em que dispositivo? | Usuário genérico |
| Prioridade | O que precisa ser visto primeiro? O que é secundário? | Mesmo peso em tudo |
| Referência | Com o que a tela deve se parecer? O que aproveitar de cada exemplo? | Visual padrão da IA |
| Direção visual | Cores, fontes, ícones, cantos, densidade, tom. O que evitar? | Identidade nova a cada tela |
| Conteúdo e estados | Que dados reais aparecem? Como fica vazio, carregando, com erro? | Lorem ipsum e só o caso feliz |

### Sempre pergunte: fonte, cores e logo do cliente

Esses três itens mudam de cliente para cliente, e são eles que dão a cara do cliente à tela. Por isso nunca invente nem chute nenhum deles. Antes de gerar a primeira tela de um projeto, pergunte numa mensagem curta o que ainda não tiver vindo no pedido ou no projeto:

1. **Fonte (tipografia):** o nome de uma fonte só. Uma basta para a tela inteira.
2. **Cores em hex:** a cor principal e as de apoio, por exemplo `#1F4FD8`.
3. **Logo:** o arquivo (SVG ou PNG), para anexar ou colocar no projeto.

Diga que, se a pessoa não tiver esses itens, há dois caminhos. Se o cliente tiver site, dá para tirar de lá: a fonte e as cores aparecem no próprio site, e o logo costuma estar no topo da página. Também dá para pedir ao cliente, porque normalmente estão no manual da marca ou com quem cuida do site.

Se ela não tiver como conseguir agora:
- **Fonte e cores:** tire do site, dos prints ou das telas do cliente (seção 2) e avise em uma linha de onde vieram, para ela confirmar com o cliente.
- **Logo:** use um espaço reservado com o nome do cliente em texto e avise que falta o arquivo. Nunca desenhe um logo inventado.

Pergunte uma vez por projeto. Depois disso, reaproveite as respostas em todas as telas.

Defina a tarefa principal da tela em uma frase (ex.: "o gestor entende em menos de 1 minuto se as vendas estão no ritmo"). Toda decisão de layout serve a essa frase.

**Reduza fricções.** Antes de desenhar, corte o que não ajuda essa tarefa: etapas desnecessárias, campos que o sistema já sabe, cliques extras, informação que não leva a nenhuma decisão. Pense na carga cognitiva: quanto esforço mental a pessoa faz para entender a tela? Prefira mostrar só o necessário agora e deixar o detalhe a um clique (divulgação progressiva), usar padrões que o usuário já conhece e preencher valores padrão sensatos.

## 2. Sem design system: de onde tirar a identidade

Sem design system, a estrutura vem sempre de `base-visual.md`, na pasta desta skill. Leia esse arquivo antes de gerar a tela: ele traz as escalas, as medidas dos componentes, a estrutura da página e os padrões de tela. Por cima dela, aplique a identidade do cliente.

A identidade, em ordem de preferência:

1. O que a pessoa informou ao responder à pergunta da seção 1 (fonte, cores em hex e logo). Isso sempre vale mais do que qualquer coisa tirada de site ou print.
2. Telas já existentes do produto: copie tokens (cores, fontes, raios, espaçamentos) e componentes, nunca invente outros.
3. Site ou prints do cliente: extraia paleta em hex, fontes, estilo de ícones, cantos, botões e o jeito dos status. A tela deve parecer do mesmo produto, mas com densidade de tela de trabalho, não de página de marketing.
4. Nada disponível: sugira ao dev gerar uma imagem de referência antes do código, com o prompt abaixo, e anexar ao pedido dizendo o que aproveitar (hierarquia, estilo da tabela, cores). Os textos da imagem podem sair errados; ela serve para layout e estilo.

```
Crie a imagem de uma tela de interface, no formato de um print plano e de alta fidelidade.
Não coloque mockup de aparelho, perspectiva, mãos nem fundo de mesa: só a tela.

TELA
- Tipo de tela: [dashboard / listagem com filtros / formulário em etapas / detalhe / login / configurações]
- Sistema: [que tipo de sistema é]
- Dispositivo e proporção: [desktop, 16:9 / celular, 9:16 / tablet, 4:3]

QUEM USA E PARA QUÊ
- Usuário: [perfil]
- Tarefa principal: [o que essa pessoa resolve nesta tela, em uma frase]

HIERARQUIA (do mais importante para o menos importante)
1. [elemento principal]
2. [elemento secundário]
3. [elemento terciário]
- Navegação: [menu lateral / barra superior / sem menu]

CONTEÚDO
- Textos curtos e realistas, em português do Brasil: [exemplos de títulos, nomes, valores e datas]
- Nada de lorem ipsum.

IDENTIDADE VISUAL
- Cores: principal [nome + #hex], apoio [#hex], fundo [#hex], texto [#hex]
- Tipografia: [fonte ou estilo]
- Ícones: [estilo]
- Formas: [raio dos cantos / botões / cards]
- Densidade e tom: [compacta ou confortável / sóbrio, amigável, premium, técnico]

EVITE
- [gradientes, sombras fortes, ilustrações 3D, emojis, excesso de cards, cores fora da paleta]
```

## 3. Ao gerar: regras de interface

**Hierarquia**
- Um elemento principal por tela, maior e primeiro na leitura (topo à esquerda em desktop).
- No máximo 4 indicadores no topo de um dashboard. Se tudo é importante, nada é.
- Diferencie por tamanho, peso e posição antes de usar cor.

**Tipografia**
- No máximo 4 tamanhos de texto na tela (ex.: título, subtítulo, corpo, legenda).
- Altura de linha: cerca de 130% a 150% em parágrafos e textos corridos; menor nos títulos (cerca de 110% a 120%).
- Espaçamento entre letras: levemente negativo em títulos grandes, normal no corpo e levemente positivo em rótulos em maiúsculas. Linhas de texto com cerca de 60 a 75 caracteres.
- Uma família de fonte (a do cliente); uma segunda só se o cliente já usar duas. Números em tabelas com algarismos tabulares e alinhados à direita.

**Espaçamento e alinhamento**
- Espaçamentos em múltiplos de 8px (4px para ajustes finos).
- Proximidade: o que é relacionado fica perto; o que é diferente fica separado por mais espaço, não por mais bordas.
- Tudo alinhado a uma grade de colunas, com margens consistentes; nenhum elemento "flutuando".
- Deixe a interface respirar: na dúvida, mais espaço em branco, não menos.

**Cor**
- Comece a tela em escala de cinza e tons neutros; acerte hierarquia e espaçamento sem cor. Só depois adicione cor.
- Uma cor principal de destaque e no máximo uma ou duas secundárias, mais as cores de status (sucesso, alerta, erro).
- A cor principal aparece só na ação principal e nos destaques; o resto em neutros.
- Status sempre com cor E texto (ex.: "Atrasado" em vermelho), nunca só cor.
- Evite gradientes, sombras fortes e cores fora da paleta, a menos que a referência peça.

**Contraste e acessibilidade**
- Texto com contraste WCAG AA: 4.5:1 (texto normal) e 3:1 (texto grande e ícones).
- Área clicável de pelo menos 44×44px no mobile; foco visível no teclado; labels em todos os campos.
- Não dependa de hover para mostrar informação essencial.

**Consistência**
- Botões, cards, ícones, raios e sombras iguais na tela inteira (e entre telas).
- O comportamento também é padrão: a mesma ação funciona do mesmo jeito em todas as telas e dispositivos (navegação no mesmo lugar, mesmo feedback ao salvar, mesma forma de confirmar e de voltar).
- Um único estilo de ícone. Um único botão primário por área.

**Usabilidade**
- Ações perto do conteúdo que afetam; ação destrutiva com confirmação e cor distinta.
- Formulários: um campo por linha, labels acima, erros junto do campo e em linguagem clara, validação sem apagar o que foi digitado.
- Tabelas: cabeçalho fixo em listas longas, filtros e busca visíveis, ação por linha à direita.
- Textos de interface curtos, no idioma do usuário, com verbos nos botões ("Salvar pedido", não "OK").

**Conteúdo e estados**
- Dados realistas: nomes longos, valores grandes, datas reais.
- Sempre entregue os estados: vazio (com mensagem e próximo passo), carregando (skeleton), erro (o que houve + como resolver) e sucesso.

## 4. Depois de gerar: checklist do olho de designer

Antes de entregar, passe a tela pelas 8 perguntas. Diga ao dev o que não passou.

1. **Teste dos 5 segundos.** Dá para dizer qual é a informação mais importante?
2. **Cor com propósito.** O destaque aparece só em ações e status? Status tem cor e texto?
3. **Hierarquia.** Títulos, subtítulos e textos têm pesos claros, com até 4 tamanhos?
4. **Contraste.** Todo texto é legível, inclusive o secundário e o que fica sobre cor?
5. **Espaçamento.** O que é relacionado está perto e o que é diferente está separado?
6. **Consistência.** Botões, cards, ícones e cantos são iguais na tela inteira?
7. **Alinhamento.** Tudo segue as mesmas linhas, sem elementos flutuando?
8. **Mundo real.** Como fica com nome longo, lista vazia, erro ou 300 linhas?

## 5. Ajustes: um de cada vez, com nome e endereço

Quando o dev pedir "melhore o design", não mude tudo um pouco. Rode o checklist, escolha os 2 ou 3 problemas mais importantes e corrija um por vez, dizendo o que mudou. Modelos de pedido pontual:

| Problema | Pedido |
| --- | --- |
| Tudo com o mesmo peso | "O [indicador] é o principal: deixe-o maior e em primeiro lugar; reduza o peso dos outros." |
| Cores demais | "Use a cor principal só no botão principal e nos destaques; o resto em tons neutros." |
| Tela apertada | "Aumente o espaço entre os grupos; espaçamentos em múltiplos de 8px." |
| Status só por cor | "Os status devem ter cor e texto, como 'Atrasado' em vermelho." |
| Só o caso feliz | "Mostre como fica sem dados, carregando e com erro." |

## Como responder

- Ao entregar uma tela, diga em 2 ou 3 linhas as decisões de hierarquia e de onde veio a identidade visual.
- Liste o que ficou assumido e o que não passou no checklist, se houver.
- Se a fonte, as cores ou o logo não vieram do cliente, lembre a pessoa de confirmar com ele.
- Não explique teoria de design além do necessário: o dev quer a tela e o porquê em poucas palavras.
