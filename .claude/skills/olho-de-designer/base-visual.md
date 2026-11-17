# Base visual para sistemas web

Use esta base quando o projeto não tiver design system. Ela é só a estrutura: escalas, medidas, estados e padrões de tela. A identidade (cores da marca, fonte, tom) vem sempre do cliente: do site, dos prints ou da imagem de referência.

Pensada para sistemas internos e painéis (backoffice) no desktop, com densidade confortável.

## 1. O que vem do cliente e o que é fixo

| Camada | O quê | De onde vem |
| --- | --- | --- |
| Cliente | Cor primária, cor de destaque, tom dos neutros, fonte, estilo dos ícones | Site, prints, marca |
| Fixa | Espaçamento, tipografia (tamanhos e alturas de linha), raios, sombras, alturas de componente, estados, estrutura de página | Este arquivo |

Se o cliente só tiver uma cor e um logo, gere a escala da cor a partir desse hex (seção 4) e use a base inteira.

## 2. Espaçamento

Escala única, em px: **4, 8, 12, 16, 24, 32, 48**.

| Uso | Valor |
| --- | --- |
| Ícone e texto, itens de uma tag | 4 |
| Dentro de um grupo (label e campo, botões lado a lado) | 8 |
| Entre linhas de uma lista, padding de célula | 12 a 16 |
| Entre blocos e cards de uma mesma área | 16 |
| Padding interno de card, painel e modal | 24 |
| Margem da área de conteúdo, entre seções da página | 32 |
| Separação de áreas grandes, estados vazios | 48 |

## 3. Tipografia

Uma família sem serifa para tudo; pesos 400, 500 e 700. Use no máximo 4 tamanhos por tela, escolhidos desta escala:

| Papel | Tamanho / altura de linha | Peso |
| --- | --- | --- |
| Título da página | 28 / 1.2 | 500 a 700 |
| Título de modal, de bloco grande | 24 / 1.2 | 500 |
| Subtítulo, título de card | 20 / 1.2 | 500 |
| Texto de destaque, botões grandes | 16 / 1.5 | 400 a 700 |
| Corpo, células de tabela, labels, botões | 14 / 1.5 (label de uma linha: 1.2) | 400 a 500 |
| Texto de apoio, helper, tags, metadados | 12 / 1.5 (label de uma linha: 1.2) | 400 a 700 |

- Texto corrido usa altura de linha 1.5; rótulos de uma linha, 1.2.
- Hierarquia dentro do mesmo tamanho: peso (400 → 500 → 700) e cor (texto principal → secundário).
- Links de texto: peso 500 e sublinhado.

## 4. Cor (estrutura, não valores da marca)

**Neutros (6 níveis).** Ajuste levemente o tom em direção à cor do cliente.

| Token | Uso | Valor de partida |
| --- | --- | --- |
| superficie | Cards, tabelas, modais, campos | #FFFFFF |
| fundo | Fundo da página | #F6F7F8 |
| borda | Bordas, divisórias, campo vazio | #D9DCE1 |
| apagado | Placeholder, ícone inativo, desabilitado | #8B9099 |
| secundario | Texto de apoio, labels | #5F6570 |
| texto | Texto principal | #1F2328 |

**Cor do cliente.** Gere 4 tons a partir do hex principal:

| Token | Uso |
| --- | --- |
| primaria | Botão principal, item ativo do menu, links |
| primaria-escura | Hover do botão principal, texto sobre fundo claro da marca |
| primaria-clara | Fundo de item selecionado, linha selecionada, tag primária |
| destaque (opcional) | Uma segunda cor da marca, só para "atenção", contador de pendências e foco |

**Feedback (sempre 3 tons por tipo).**

| Tipo | Fundo claro | Ícone e borda | Texto |
| --- | --- | --- | --- |
| Sucesso | #E6F6EE | #1FA36B | #12704A |
| Alerta | #FFF6E5 | #E5A23A | #8A5A12 |
| Erro | #FDECEC | #E05A52 | #A83232 |
| Informação | #EAF1FD | #4A86E8 | #2F5DA8 |

Confira contraste AA de todo par texto/fundo depois de aplicar as cores do cliente.

## 5. Formas e profundidade

| Token | Valor | Uso |
| --- | --- | --- |
| raio-sm | 12 | Campos, alertas, células com fundo, itens de lista |
| raio-md | 16 | Cards, blocos, painéis, dropdowns |
| raio-xl | 32 | Modais |
| raio-pilula | 999 | Botões, tags, filtros em chip, paginação |
| sombra-1 | 0 4px 8px -4px rgba(0,0,0,.12) | Dropdown, tooltip, card no hover |
| sombra-2 | 0 16px 24px -16px rgba(0,0,0,.12) | Modal, painel lateral, menu flutuante |
| overlay | rgba(0,0,0,.16) | Fundo atrás de modal |

Cards parados não levam sombra: separe pelo contraste entre superfície e fundo. Sombra é para o que flutua.

## 6. Estrutura de página (desktop 1440)

```
┌──────────────────────── Cabeçalho 72px ─────────────────────────┐
├── Menu 256px ──┬── Conteúdo (margem 32) ──────────────────────────┤
│ (recolhido 64) │  Título 72: título + breadcrumb | ações à direita │
│                │  (16)                                             │
│                │  Barra de contexto / filtros                      │
│                │  (16)                                             │
│                │  Área de trabalho: tabela, grade de blocos...     │
│                │  Rodapé discreto 18px                             │
└────────────────┴───────────────────────────────────────────────────┘
```

- **Cabeçalho (72):** logo, seletor de contexto (unidade, empresa), notificações com contador, avatar.
- **Menu lateral:** 256 aberto, 64 recolhido só com ícones. Item 48 de altura (subitem 40), com estados desabilitado, normal, hover e selecionado. O selecionado usa fundo claro, não só cor de texto.
- **Título da página (72):** título à esquerda com breadcrumb de 12 embaixo; à direita, no máximo um botão principal e um secundário em contorno.
- **Conteúdo:** largura útil de cerca de 1120 com menu aberto. Grades de blocos em 2 colunas com 16 de espaço.
- **Painel lateral (400):** detalhe de um item sem sair da lista; ações principais fixas no fim do painel.
- **Modal:** largura 500 (confirmação, formulário curto), 560 a 720 (formulário maior, lista de seleção), 960 (tabela). Botões no rodapé, à direita.

## 7. Componentes e medidas

**Botões** (altura 40, pílula, texto 14)
- Tipos: primário (preenchido), secundário (preenchido claro), terciário (só texto), contorno, perigo, atenção.
- Estados: normal, hover, desabilitado e ativo (para botões de alternância).
- Um primário por área. Ações de linha e de card usam contorno pequeno, com ícone e verbo ("Revisar", "Ver detalhes").

**Campos de formulário**
- Label em cima (14, peso 500), campo de cerca de 40 de altura com raio-sm, helper text de 12 embaixo.
- Estados: vazio, preenchido, foco (borda na cor de destaque), desabilitado e erro (borda e helper em vermelho).
- Desabilitado sempre diz o motivo no helper ("Definido pelo administrador").
- Seleção múltipla mostra os itens como chips dentro do campo.
- Também fazem parte: radio, checkbox, toggle (40×24) e seleção em botões.

**Tabela**
- Cabeçalho de 48 com texto 12 a 14 em cor secundária; linha de 56; padding horizontal de 16.
- Tipos de célula: texto, texto com linha de apoio, link, número alinhado à direita, tag de status, toggle, checkbox, campo editável, ações com ícone e cabeçalho ordenável.
- Linha selecionada com fundo primaria-clara. Paginação embaixo com botões de 32.

**Filtros e abas**
- Barra de filtros de 48: busca, mais selects em chip (vazio ou selecionado) e "Limpar".
- Abas de 48 com sublinhado no ativo e contador quando ajudar.

**Tags** (altura 24, pílula, texto 12)
- Três estilos: preenchida clara (padrão), contorno (informação secundária) e forte (preenchida escura, para o status que mais importa).
- Sempre com texto.

**Mensagens**
- Alerta da página: largura total, 48 de altura, ícone + texto e as 3 cores do tipo.
- Snackbar: 56 de altura, canto inferior, some sozinho, para confirmar ações.
- Badge de contador: pílula pequena na cor de destaque.

**Outros:** tooltip (sombra-1), avatar (32, 40 e 64; sem foto mostra as iniciais), breadcrumb (12, separador ›, o último em negrito).

## 8. Padrões de tela

**Painel inicial em blocos**
- Uma barra de contexto no topo: data, última atualização, seletor do recorte.
- Depois, blocos em 2 colunas. Cada bloco tem:
  - título com contador de pendências;
  - lista curta de itens: nome, uma linha de apoio e uma ação em contorno à direita;
  - link "Ver todos" no fim.
- Pendências em destaque usam cards de contagem: número grande, rótulo e ação.
- Progresso em barra, com o texto do valor ao lado ("38%, 12 de 32"), nunca só a barra.

**Listagem**
- Título com ação principal, abas por status com contador, barra de filtros, tabela e paginação.
- Clicar na linha abre um painel lateral ou a página de detalhe.

**Formulário**
- Uma coluna, campos agrupados em seções com título de 16 a 20.
- Ações no fim, com o primário à direita.
- Formulários longos em etapas.

**Estados que toda tela e todo bloco precisa ter**
- **Vazio:** ícone num círculo de fundo claro, frase do que significa e próximo passo ("Nenhum pedido pendente. Novos pedidos aparecem aqui.").
- **Carregando:** skeleton com o mesmo formato do conteúdo, bloco por bloco.
- **Erro:** alerta da página ou do bloco, explicando o que fazer.
- **Sem permissão:** o bloco some e os outros se reorganizam, ou a ação fica desabilitada com o motivo.
- **Sucesso:** snackbar.
