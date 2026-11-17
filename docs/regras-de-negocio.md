# Pet4lov — Regras de negócio

Atualizado em 17/11/2026.

## Visão geral

O Pet4lov é uma vitrine de pets para adoção: ONGs publicam os animais e os interessados entram em contato com a ONG por e-mail. A adoção em si acontece fora do sistema; hoje não existe solicitação, aprovação nem baixa de pet adotado.

Este documento descreve as regras **como estão implementadas hoje** (backend Django/DRF em `backend/adocao/` e frontend Angular em `frontend/src/app/`). Onde o front e a API divergem, as duas regras aparecem. Mudanças já planejadas estão na última seção, com a chave do card no Jira.

| Perfil | Quem é | O que faz |
| --- | --- | --- |
| Visitante | Qualquer pessoa sem login | Lista e busca pets e ONGs, vê o detalhe do pet e abre o e-mail para a ONG |
| Usuário | Pessoa com conta e logada | Tudo do visitante, vê "Minha conta", edita os próprios dados e cadastra uma ONG |
| Responsável pela ONG | Usuário que cadastrou uma ONG | Edita a própria ONG e cadastra, edita e remove pets dela |
| Administrador | Usuário com `is_staff` | Gerencia usuários, ONGs e pets pelo Django Admin (`/admin/`), sem as restrições de dono |

Jornada para publicar um pet:

1. Criar conta em `/cadastro`.
2. Entrar em `/login`.
3. Cadastrar a ONG em `/ongs/nova` (uma por usuário).
4. Cadastrar os pets em `/pets/novo`; eles aparecem na hora na lista pública.

## Usuários e conta

Qualquer pessoa cria conta sem confirmação de e-mail, e o e-mail é a identidade de login. O front exige todos os campos, mas a API só exige nome, usuário, e-mail e senha.

### Cadastro (`POST /api/register/`, tela `/cadastro`)

| Campo | Obrigatório na API | Obrigatório no front | Regra |
| --- | --- | --- | --- |
| Nome (`name`) | Sim | Sim | Até 100 caracteres |
| Usuário (`username`) | Sim | Sim | Até 100 caracteres; não é único e não serve para login |
| E-mail (`email`) | Sim | Sim | Formato válido, até 100 caracteres, único no sistema |
| Senha (`password`) | Sim | Sim | Regras de senha abaixo; nunca volta nas respostas |
| CPF (`document_cpf`) | Não | Sim | Exatamente 11 dígitos, sem pontuação; os dígitos verificadores não são conferidos |
| Data de nascimento (`birth_date`) | Não | Sim | Qualquer data, inclusive futura |
| Endereço (`address`) | Não | Sim | Até 150 caracteres |
| Contato (`contact`) | Não | Sim | Até 50 caracteres, texto livre |
| Aceite dos termos | Não existe | Sim | Só no front; não é gravado |

Regras de senha (validadores padrão do Django, mensagens em pt-BR):

- No mínimo 8 caracteres (o front também confere isso).
- Não pode ser parecida demais com nome, usuário ou e-mail. Essa regra não funciona no cadastro, porque o usuário ainda não existe quando a senha é validada (PET-75).
- Não pode estar na lista de senhas comuns.
- Não pode ser só números.

Depois do cadastro, o usuário vai para `/login` (não entra automaticamente) e, ao entrar, cai em `/minha-conta`.

### Consulta, edição e exclusão

- `GET /api/usuarios/me/` devolve os dados do usuário logado. A listagem `/api/usuarios/` só devolve ele mesmo.
- `PUT`/`PATCH /api/usuarios/{id}/` só funciona para a própria conta; o id de outra pessoa responde 404.
- Hoje o `PATCH` aceita uma senha nova sem pedir a atual.
- `DELETE /api/usuarios/{id}/` exclui a própria conta sem pedir senha e apaga junto a ONG e todos os pets dela.
- O front só mostra os dados em "Minha conta"; não tem tela para editar dados, trocar senha ou excluir a conta.

## Autenticação e sessão

O login usa e-mail e senha e devolve um par de tokens JWT. O token de acesso dura 30 minutos e o de renovação dura 1 dia, então a pessoa precisa entrar de novo no máximo 24 horas depois do login.

| Regra | Valor hoje |
| --- | --- |
| Rota de login | `POST /api/auth/obtain/` com `email` e `password` |
| Resposta do login | `access`, `refresh` e `user` (`email`, `id_user`, `name`) |
| Validade do token de acesso | 30 minutos |
| Validade do token de renovação | 1 dia, sem rotação: renovar não estende a sessão |
| Rota de renovação | `POST /api/auth/refresh/` com `refresh` |
| Envio do token | Cabeçalho `Authorization: Bearer <access>` |
| Conta inativa (`is_active = false`) | Não consegue entrar |
| Credenciais erradas | 401, e o front mostra a mensagem da API |

Comportamento do front:

- Os tokens ficam nos cookies `access` e `refresh` (caminho `/`, `SameSite=Lax`, expirando junto com o token). Eles são gravados pelo JavaScript, então não são `HttpOnly`.
- A pessoa é considerada logada enquanto o cookie `refresh` existir.
- Toda chamada à API, menos as de `/auth/`, leva o token de acesso.
- Se a API responder 401 e houver sessão, o front renova o token uma vez e repete a chamada. Se a renovação falhar, faz logout e manda para `/login` guardando a página de volta (`returnUrl`).
- Rotas que exigem login: `/minha-conta`, `/ongs/nova`, `/ongs/{id}/editar`, `/pets/novo` e `/pets/{id}/editar`. Sem sessão, a pessoa vai para `/login` e volta para a rota pedida depois de entrar.
- "Sair" só apaga os cookies. Os tokens já emitidos continuam válidos na API até expirarem.

## ONGs

Cada usuário pode ter uma ONG, que fica pública assim que é cadastrada, sem verificação de documento nem aprovação. Só quem cadastrou a ONG pode alterá-la.

### Cadastro (`POST /api/ongs/`, tela `/ongs/nova`)

| Campo | Obrigatório | Regra |
| --- | --- | --- |
| Nome (`name`) | Sim | Até 100 caracteres |
| Documento (`document`) | Sim | Texto livre até 100 caracteres; o CNPJ não é validado |
| E-mail (`email`) | Sim | Formato válido, único entre as ONGs; aparece publicamente como contato para adoção |
| Endereço (`address`) | Sim | Texto livre, sem limite |
| Cidade (`city`) | Sim | Até 100 caracteres |
| Estado (`state`) | Sim | O front oferece as 27 UFs; a API aceita qualquer texto até 100 caracteres |
| Responsável (`responsible`) | Automático | Sempre o usuário logado; não pode ser enviado nem trocado |

- Um usuário que já tem ONG recebe 400 com "Já existe uma ONG cadastrada para este responsável." Essa trava está só na aplicação, não no banco.
- Depois de salvar, o front volta para `/minha-conta`.

### Consulta

- A lista (`GET /api/ongs/`, tela `/ongs`) é pública, ordenada por nome e sem paginação.
- A busca `?search=` procura no nome e na cidade.
- Os filtros `?responsible=`, `?city=` e `?state=` exigem valor exato.
- Cada ONG da lista leva aos pets dela (`/pets?ong={id}`).

### Edição e exclusão

- `PUT`/`PATCH /api/ongs/{id}/` só é aceito para o responsável. Qualquer outro usuário recebe 403, e a tela de edição mostra "Você só pode editar a sua própria ONG."
- `DELETE /api/ongs/{id}/` também é só do responsável e apaga junto todos os pets da ONG. O front não tem botão para excluir ONG.

## Pets

Só quem tem ONG cadastra pet, e o pet sempre fica na ONG dessa pessoa. O pet aparece na lista pública assim que é salvo e continua lá até ser removido: não existe status de "adotado".

### Cadastro (`POST /api/pets/`, tela `/pets/novo`)

| Campo | Obrigatório na API | Obrigatório no front | Regra |
| --- | --- | --- | --- |
| ONG (`ong`) | Sim | Automático | Tem de ser a ONG do usuário logado; senão, 400 com "Você só pode cadastrar pets na sua própria ONG." |
| Nome (`name_animal`) | Não | Sim | Até 200 caracteres; sem nome, as telas mostram "Sem nome" |
| Espécie (`type`) | Sim | Sim | O front oferece Cachorro, Gato, Coelho, Pássaro e Outro; a API aceita qualquer texto até 50 caracteres |
| Raça (`breed`) | Sim | Sim | Até 50 caracteres |
| Cor (`color`) | Sim | Sim | Até 20 caracteres |
| Data de nascimento (`birth_date`) | Sim | Sim | Qualquer data, inclusive futura |
| Saúde (`health_condition`) | Sim | Sim | Até 200 caracteres |
| Vacinação (`vaccination_status`) | Não | Não | Até 50 caracteres; vazio aparece como "Não informado" |
| Vermifugação (`deworming_status`) | Não | Não | Até 50 caracteres; vazio aparece como "Não informado" |
| Observações (`observations`) | Não | Não | Até 250 caracteres |
| Cidade (`city`) | Sim | Sim | Até 30 caracteres; o front preenche com a cidade da ONG |
| Estado (`state`) | Sim | Sim | Até 30 caracteres na API; o front oferece as 27 UFs e preenche com o estado da ONG |
| Foto (`image`) | Não | Não | Precisa ser uma imagem válida; sem limite de tamanho; salva como `pets/{id}-{arquivo}`; sem foto, aparece uma imagem padrão |
| Data de adoção (`adoption_date`) | Não | Não existe | A API aceita, mas nenhuma tela usa e ela não tira o pet da lista |
| Quem cadastrou (`responsible`) | Automático | Automático | Sempre o usuário logado; não pode ser enviado nem trocado |

Sem ONG, a tela de cadastro avisa "Para cadastrar pets você precisa ter uma ONG" e leva para `/ongs/nova`. Depois de salvar, o front abre o detalhe do pet.

### Consulta

- A lista (`GET /api/pets/`, tela `/pets`) é pública, ordenada por nome e sem paginação.
- A busca `?search=` procura no nome, na raça e na cidade.
- Os filtros `?ong=`, `?type=`, `?city=`, `?state=` e `?responsible=` exigem valor exato. A tela usa busca, espécie e ONG, e guarda os filtros na URL.
- O detalhe (`/pets/{id}`) é público e mostra o nome e o e-mail da ONG.
- "Entrar em contato" abre o e-mail da pessoa para a ONG com o assunto "Quero adotar {nome do pet}". "Outros pets da ONG" filtra a lista pela ONG.

### Edição e remoção

- `PUT`/`PATCH /api/pets/{id}/` só é aceito para quem cadastrou o pet. Qualquer outro usuário recebe 403, e a tela mostra "Você só pode editar pets cadastrados por você."
- Na edição, a regra da ONG própria continua valendo, então o pet não pode ser movido para a ONG de outra pessoa. Sem foto nova, a atual é mantida.
- `DELETE /api/pets/{id}/` também é só de quem cadastrou e apaga o registro de vez. No front, o botão "Remover" fica em "Minha conta" e pede confirmação ("Remover {nome} da lista de adoção?").

## Matriz de permissões

Leitura de pets e ONGs é aberta a todos. Toda escrita exige login, e só o dono do registro pode alterá-lo ou excluí-lo. O Django Admin fica fora dessas regras.

| Ação | Visitante | Usuário sem ONG | Responsável pela ONG | Admin (`/admin/`) |
| --- | --- | --- | --- | --- |
| Ver e buscar pets e ONGs | Sim | Sim | Sim | Sim |
| Criar conta | Sim | — | — | Sim |
| Ver, editar e excluir a conta | Não | Só a própria | Só a própria | Qualquer uma |
| Cadastrar ONG | Não | Sim, uma | Não, já tem uma | Sim |
| Editar ou excluir ONG | Não | Não | Só a própria | Qualquer uma |
| Cadastrar pet | Não | Não | Só na própria ONG | Em qualquer ONG |
| Editar ou remover pet | Não | Não | Só os que cadastrou | Qualquer um |

Códigos de resposta da API: sem login em rota de escrita, 401; logado mas sem ser o dono, 403; conta de outra pessoa em `/api/usuarios/{id}/`, 404.

## Validações de dados

A API confere formato e tamanho, mas quase nunca confere o significado do dado: CPF, CNPJ, UF e datas passam sem checagem de conteúdo.

| Dado | O que é validado hoje | O que não é validado |
| --- | --- | --- |
| E-mail | Formato válido; único entre usuários e entre ONGs | Maiúsculas e minúsculas: `Ana@x.com` e `ana@x.com` podem virar duas contas |
| CPF | 11 dígitos, só números (front e API) | Dígitos verificadores e unicidade |
| CNPJ da ONG | Nada além de obrigatório e até 100 caracteres | Formato, dígitos verificadores e unicidade |
| UF | Lista das 27 UFs, só no front | Na API, qualquer texto |
| Datas de nascimento | Formato de data | Datas futuras |
| Telefone (`contact`) | Até 50 caracteres | Formato |
| Foto do pet | Arquivo de imagem válido; o front só oferece `image/*` | Tamanho e dimensões |

Mensagens de erro: a API devolve os erros por campo, e o front junta tudo numa frase com o nome do campo em português (por exemplo, "E-mail: usuário com este e-mail já existe."). Se a API não responder, a mensagem é "Não foi possível conectar à API. Verifique se o backend está rodando."

## Lacunas conhecidas e regras planejadas

O backlog do projeto PET no Jira tem 11 bugs que contrariam regras acima e uma série de regras novas. Quando um card for entregue, a seção correspondente deste documento deve ser atualizada.

### Bugs que afetam regras de negócio

| Card | Regra afetada | Comportamento errado hoje |
| --- | --- | --- |
| PET-67 | E-mail único | O mesmo e-mail com maiúsculas diferentes cria outra conta e muda o login |
| PET-68 | Troca de senha | A senha muda sem informar a atual |
| PET-69 | Foto do pet | As fotos não carregam com `DEBUG=False` |
| PET-70 | Foto do pet | O arquivo antigo fica no disco ao trocar a foto ou excluir o pet |
| PET-71 | Sessão | O menu continua como "logado" depois que a sessão expira |
| PET-72 | Cadastro de pet | Falha quando a cidade da ONG tem mais de 30 caracteres |
| PET-73 | Contato com a ONG | O assunto do e-mail quebra com caracteres especiais no nome do pet |
| PET-74 | Datas de nascimento | Datas futuras são aceitas |
| PET-75 | Regras de senha | A regra de senha parecida com os dados não roda no cadastro |
| PET-76 | Cadastro de usuário | Front e API exigem campos diferentes |
| PET-77 | Sessão | Várias respostas 401 disparam várias renovações de token ao mesmo tempo |

### Regras que vão mudar

| Tema | Regra hoje | Regra planejada | Cards |
| --- | --- | --- | --- |
| Adoção | Contato por e-mail, fora do sistema | Solicitação de adoção no site, com aprovar, recusar e cancelar; a ONG é avisada por e-mail | PET-13 a PET-16, PET-18 |
| Pet adotado | Não existe; o pet fica na lista até ser removido | A ONG marca o pet como adotado | PET-17 |
| Publicação de ONG | Pública assim que é cadastrada | Só aparece depois de aprovada pelo admin | PET-31 |
| CNPJ | Texto livre | CNPJ válido e único | PET-29 |
| Equipe da ONG | Só o responsável edita a ONG e os pets | Vários membros por ONG; a permissão sobre o pet passa a vir da ONG | PET-32, PET-33 |
| Exclusão de ONG | Só pela API | Pela interface | PET-30 |
| Cadastro de usuário | Sem confirmação de e-mail; muitos campos | Confirmação de e-mail; formulário enxuto; login automático | PET-37, PET-39, PET-40 |
| Dados da conta | Edição só pela API | Editar dados, trocar senha com a atual, recuperar senha e excluir a conta pela interface | PET-34 a PET-36, PET-38 |
| Sessão | Renovação de 1 dia sem rotação; tokens em cookies lidos pelo JavaScript | Rotação com lista de bloqueio e cookie `HttpOnly` emitido pela API | PET-42, PET-43 |
| Abuso | Sem limite de tentativas | Limite de tentativas de login e cadastro | PET-41 |
| Catálogo | Sem paginação; ordem por nome; espécie, vacinação e vermifugação em texto livre | Paginação, mais recentes primeiro, listas fechadas, sexo, porte e castração, filtro por estado e cidade | PET-19 a PET-23 |
| Fotos | Uma foto, sem limite de tamanho | Várias fotos, validadas e redimensionadas | PET-24, PET-45 |
| Privacidade | E-mail da ONG e dados do responsável expostos nas APIs públicas | Revisão do que é público; termos de uso e política de privacidade | PET-46, PET-47 |
