# Visao geral do projeto

## Objetivo

O projeto `amandafun` reune jogos curtos e quizzes em portugues. As paginas atuais sao independentes e podem ser abertas diretamente no navegador.

## Estrutura atual

| Caminho | Funcao |
| --- | --- |
| `index.html` | Pagina inicial para escolher uma experiencia; tambem contem o jogo da memoria com 10 pares de imagens de animais. |
| `quiz.html` | Quiz sobre o Sistema Solar, com selecao de tema e 8 perguntas por tema. |
| `site.css` | Cores, tipografia, navegacao e componentes visuais compartilhados. |
| `Animais/` | Imagens locais usadas pelas cartas do jogo da memoria. |
| `README.md` | Indice dos jogos e desta documentacao. |
| `AGENTS.md` | Instrucoes para agentes que trabalham no repositorio. |

Nao ha estrutura de framework ou etapa de build: as paginas contem seu proprio HTML, CSS e JavaScript, e compartilham os estilos comuns por `site.css`.

## Como o quiz funciona

Em `quiz.html`, o objeto `questionSets` guarda os temas e suas perguntas. Cada tema tem identificador, rotulo, simbolo e uma lista de perguntas. Cada pergunta tem `question`, `options`, `answer` (indice baseado em zero da alternativa correta) e `note` (explicacao exibida no feedback).

A tela de introducao, a rodada e o resultado sao renderizados a partir desses dados. A interface atual tambem tem textos que presumem tres temas e oito perguntas. Se esses totais mudarem, revise os contadores e textos da interface para que continuem corretos.

## Como o jogo da memoria funciona

Em `index.html`, a pagina inicial apresenta as experiencias disponiveis. A opcao de animais abre o jogo da memoria, cuja lista `images` aponta para os dez arquivos da pasta `Animais/`. O jogo duplica e embaralha essa lista para montar vinte cartas, controla tentativas e pares e permite reiniciar a partida.

## Organizar novos jogos e quizzes

- Para adicionar um tema ao quiz existente, inclua um conjunto em `questionSets` e confira os textos e contadores da introducao.
- Para adicionar uma nova experiencia, crie uma pagina ou fluxo apropriado e inclua uma opcao na grade inicial de `index.html` e nos links de navegacao relevantes.
- Use `site.css` para manter cores, tipografia, cabecalho e cartoes consistentes entre as paginas.
- Mantenha o README como indice dos jogos disponiveis e atualize esta pagina quando a estrutura ou o comportamento mudar.
- Mantenha imagens e outros ativos locais organizados em pastas com nomes claros e use caminhos relativos compativeis com abertura direta no navegador.

## Verificacao manual

Abra `index.html` e `quiz.html` no navegador. Confirme que a pagina inicial permite escolher as duas experiencias, teste os fluxos completos, o uso por teclado, a leitura em uma tela estreita e o carregamento das imagens. Ao mudar perguntas, confirme que a resposta indicada e sua explicacao estao corretas.