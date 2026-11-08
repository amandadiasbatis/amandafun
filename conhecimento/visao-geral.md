# Visao geral do projeto

## Objetivo

O site `MandyGames` reune jogos curtos e quizzes em portugues. As paginas atuais sao independentes e podem ser abertas diretamente no navegador.

## Estrutura atual

| Caminho | Funcao |
| --- | --- |
| `index.html` | Pagina inicial escura do MandyGames, com catalogo interativo e disco voador decorativo; tambem contem o jogo da memoria com 10 pares de imagens de animais. |
| `quiz.html` | Quiz escuro sobre o Sistema Solar, com selecao de tema e 8 perguntas por tema. |
| `cozinha.html` | Jogo rapido de cozinha com gatos fotografados, comandas de estrogonofe, feijoada e churrasco e ingredientes selecionados por botoes. |
| `site.css` | Cores, tipografia, navegacao, catalogo e componentes visuais compartilhados. |
| `assets/universo-nasa.jpg` | Imagem local da Nebulosa de Orion usada no fundo do quiz e na capa do catalogo de planetas. |
| `assets/catalogo-animais.svg` | Ilustracao do gato escondido usada na capa do jogo da memoria no catalogo. |
| `assets/cozinha/` | Fotografias locais dos tres gatos cozinheiros usadas no jogo Miau Chef (Unsplash). |
| `Animais/` | Imagens locais usadas pelas cartas do jogo da memoria. |
| `README.md` | Indice dos jogos e desta documentacao. |
| `AGENTS.md` | Instrucoes para agentes que trabalham no repositorio. |

Nao ha estrutura de framework ou etapa de build: as paginas contem seu proprio HTML, CSS e JavaScript, e compartilham os estilos comuns por `site.css`.

## Como o quiz funciona

Em `quiz.html`, o objeto `questionSets` guarda os temas e suas perguntas. Cada tema tem identificador, rotulo, simbolo e uma lista de perguntas. Cada pergunta tem `question`, `options`, `answer` (indice baseado em zero da alternativa correta) e `note` (explicacao exibida no feedback).

A tela de introducao, a rodada e o resultado sao renderizados a partir desses dados. A interface atual tambem tem textos que presumem tres temas e oito perguntas. Se esses totais mudarem, revise os contadores e textos da interface para que continuem corretos.

A pagina inicial apresenta o nome MandyGames, um disco voador com "MG" que percorre continuamente a tela, inclusive enquanto e arrastado, e pode ser reposicionado com as setas do teclado. Ele aparece apenas no catalogo inicial e fica oculto durante o jogo da memoria. As capas fotograficas dos jogos sao interativas. Com movimento reduzido, o disco fica parado, mas continua acessivel para movimentacao manual. O catalogo tambem liga ao jogo Miau Chef em uma pagina independente.

Ao abrir o jogo da memoria, a area de jogo muda para uma paleta verde de natureza, com pequenas moitas e animais discretos no fundo para manter as cartas em destaque.

A pagina do quiz usa tema escuro com uma imagem local da Nebulosa de Orion ao fundo, creditada no rodape como NASA/JPL-Caltech/STScI.

## Como o jogo da memoria funciona

Em `index.html`, a pagina inicial apresenta as experiencias disponiveis. A opcao de animais abre o jogo da memoria "Encontre os doguinhos", cuja lista `images` aponta para os dez arquivos da pasta `Animais/`. O jogo duplica e embaralha essa lista para montar vinte cartas, controla tentativas e pares e permite reiniciar a partida.

## Como o Miau Chef funciona

Em `cozinha.html`, o turno dura 60 segundos. A cada comanda, o jogador seleciona tres ingredientes na ordem mostrada e serve o prato. Ingredientes incorretos descontam dois segundos e encerram o combo; a fila embaralhada garante que estrogonofe, feijoada e churrasco aparecam em cada grupo de tres pedidos. Os retratos locais dos gatos foram obtidos do Unsplash.

## Organizar novos jogos e quizzes

- Para adicionar um tema ao quiz existente, inclua um conjunto em `questionSets` e confira os textos e contadores da introducao.
- Para adicionar uma nova experiencia, crie uma pagina ou fluxo apropriado e inclua uma opcao na grade inicial de `index.html` e nos links de navegacao relevantes.
- Use `site.css` para manter cores, tipografia, cabecalho e cartoes consistentes entre as paginas.
- Mantenha o README como indice dos jogos disponiveis e atualize esta pagina quando a estrutura ou o comportamento mudar.
- Mantenha imagens e outros ativos locais organizados em pastas com nomes claros e use caminhos relativos compativeis com abertura direta no navegador.

## Verificacao manual

Abra `index.html`, `quiz.html` e `cozinha.html` no navegador. Confirme que a pagina inicial permite escolher cada experiencia, teste os fluxos completos, o uso por teclado, a leitura em uma tela estreita e o carregamento das imagens. No Miau Chef, confira o cronometro, as tres receitas, o preparo correto, o erro de ingrediente, a entrega e o reinicio do turno. Ao mudar perguntas, confirme que a resposta indicada e sua explicacao estao corretas.