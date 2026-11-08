# Visao geral do projeto

## Objetivo

O site `MandyGames` reune jogos curtos e quizzes em portugues. As paginas atuais sao independentes e podem ser abertas diretamente no navegador.

## Estrutura atual

| Caminho | Funcao |
| --- | --- |
| `index.html` | Pagina inicial escura do MandyGames, com catalogo interativo e disco voador decorativo; tambem contem o jogo da memoria com 10 pares de imagens de animais. |
| `quiz.html` | Quiz escuro sobre o Sistema Solar, com selecao de tema e 8 perguntas por tema. |
| `cozinha3d.html` | Primeira versao 3D do Miau Chef, com chef controlavel, cozinha exploravel, teclado e controles de toque. |
| `cozinha.html` | Jogo rapido de cozinha com ilustracoes locais dos gatos em uniformes de chef, comandas de estrogonofe, feijoada e churrasco e ingredientes selecionados por botoes. |
| `cozinha3d.js` | Cena Three.js, movimento, interacoes, comandas, temporizadores e pontuacao do prototipo 3D. |
| `site.css` | Cores, tipografia, navegacao, catalogo e componentes visuais compartilhados. |
| `assets/universo-nasa.jpg` | Imagem local da Nebulosa de Orion usada no fundo do quiz e na capa do catalogo de planetas. |
| `assets/catalogo-animais.svg` | Ilustracao do gato escondido usada na capa do jogo da memoria no catalogo. |
| `assets/cozinha/gato-chef-luna.svg` | Ilustracao original da gata Luna com uniforme de chef usada no Miau Chef. |
| `assets/cozinha/gato-chef-bento.svg` | Ilustracao original do gato Bento com uniforme de chef usada no Miau Chef. |
| `assets/cozinha/gato-chef-tita.svg` | Ilustracao original da gata Tita com uniforme de chef usada no Miau Chef. |
| `Animais/` | Imagens locais usadas pelas cartas do jogo da memoria. |
| `README.md` | Indice dos jogos e desta documentacao. |
| `AGENTS.md` | Instrucoes para agentes que trabalham no repositorio. |

Nao ha estrutura de framework ou etapa de build: as paginas contem seu proprio HTML, CSS e JavaScript, e compartilham os estilos comuns por `site.css`.

O prototipo 3D carrega Three.js 0.160.0 pelo CDN cdnjs, sem etapa de build; e necessaria conexao com a internet para abrir `cozinha3d.html`.

## Como o quiz funciona

Em `quiz.html`, o objeto `questionSets` guarda os temas e suas perguntas. Cada tema tem identificador, rotulo, simbolo e uma lista de perguntas. Cada pergunta tem `question`, `options`, `answer` (indice baseado em zero da alternativa correta) e `note` (explicacao exibida no feedback).

A tela de introducao, a rodada e o resultado sao renderizados a partir desses dados. A interface atual tambem tem textos que presumem tres temas e oito perguntas. Se esses totais mudarem, revise os contadores e textos da interface para que continuem corretos.

A pagina inicial apresenta o nome MandyGames, um disco voador com "MG" que percorre continuamente a tela, inclusive enquanto e arrastado, e pode ser reposicionado com as setas do teclado. Ele aparece apenas no catalogo inicial e fica oculto durante o jogo da memoria. As capas fotograficas dos jogos sao interativas. Com movimento reduzido, o disco fica parado, mas continua acessivel para movimentacao manual. O catalogo tambem liga ao jogo Miau Chef em uma pagina independente.

Ao abrir o jogo da memoria, a area de jogo muda para uma paleta verde de natureza, com pequenas moitas e animais discretos no fundo para manter as cartas em destaque.

A pagina do quiz usa tema escuro com uma imagem local da Nebulosa de Orion ao fundo, creditada no rodape como NASA/JPL-Caltech/STScI.

## Como o jogo da memoria funciona

Em `index.html`, a pagina inicial apresenta as experiencias disponiveis. A opcao de animais abre o jogo da memoria "Encontre os doguinhos", cuja lista `images` aponta para os dez arquivos da pasta `Animais/`. O jogo duplica e embaralha essa lista para montar vinte cartas, controla tentativas e pares e permite reiniciar a partida.

## Como o Miau Chef funciona

Em `cozinha.html`, os tres cozinheiros sao ilustracoes SVG originais criadas para o jogo, com pelagens e uniformes distintos. O turno dura cinco minutos e o cronometro da comanda reinicia a cada novo prato. A rapidez e os erros de preparo determinam a avaliacao em estrelas dada pelo cliente e os pontos acumulados; ao fim do turno, o placar mostra os pontos e a media de estrelas. Cada receita tem ingredientes e acoes de preparo proprios: estrogonofe e feijoada vao para a panela no fogao, enquanto o churrasco e preparado na churrasqueira com brasa, grelha, abanador e pegador. A feijoada leva feijao, carnes, bacon e coentro; depois de cozinhar, e montada no prato e finalizada com laranja, que nao entra na panela. Todos os pratos precisam ser montados antes da entrega.

Ingredientes e utensilios fora de ordem descontam dois segundos e zeram o combo. A cada pedido, o cliente comenta enquanto espera e reage quando recebe a comida. As chamas, o vapor, os ingredientes, os movimentos da panela e a virada das carnes sao animados em CSS; a interface respeita a preferencia por movimento reduzido. A fila embaralhada garante que estrogonofe, feijoada e churrasco aparecam em cada grupo de tres pedidos.

## Como o Miau Chef 3D funciona

`cozinha3d.html` e `cozinha3d.js` formam um prototipo inicial em Three.js. O jogador controla um gatinho cozinheiro com WASD/setas ou controles direcionais de toque sobre a cena em telas pequenas; tocar em uma seta move um passo e segurar continua o movimento. A tecla E ou o botao de interacao funciona perto das estacoes. Para concluir um pedido, recolhe os ingredientes na bancada, cozinha no fogao ou na churrasqueira, monta o prato, finaliza a feijoada com laranja e entrega no balcao. O turno dura cinco minutos, cada comanda tem seu proprio cronometro e os clientes avaliam rapidez e erros com estrelas e pontos. A cena e composta por primitivas 3D e os controles respeitam movimento reduzido; este prototipo precisa de acesso ao CDN Three.js.

## Organizar novos jogos e quizzes

- Para adicionar um tema ao quiz existente, inclua um conjunto em `questionSets` e confira os textos e contadores da introducao.
- Para adicionar uma nova experiencia, crie uma pagina ou fluxo apropriado e inclua uma opcao na grade inicial de `index.html` e nos links de navegacao relevantes.
- Use `site.css` para manter cores, tipografia, cabecalho e cartoes consistentes entre as paginas.
- Mantenha o README como indice dos jogos disponiveis e atualize esta pagina quando a estrutura ou o comportamento mudar.
- Mantenha imagens e outros ativos locais organizados em pastas com nomes claros e use caminhos relativos compativeis com abertura direta no navegador.

## Verificacao manual

Abra `index.html`, `quiz.html`, `cozinha.html` e `cozinha3d.html`. Confirme que a pagina inicial permite escolher cada experiencia, teste os fluxos completos, o uso por teclado, a leitura em uma tela estreita e o carregamento das imagens. No Miau Chef classico, confira o turno de cinco minutos, o cronometro individual reiniciado a cada prato, as avaliacoes e os pontos por rapidez e erros, o resultado final, as tres receitas, panela e fogao para estrogonofe e feijoada, churrasqueira e grelha para o churrasco, montagem de todos os pratos, laranja adicionada somente ao prato da feijoada, reacoes dos clientes e reinicio do turno; confirme tambem a apresentacao com movimento reduzido. No Miau Chef 3D, confirme o carregamento da cena, o movimento com teclado e controles de toque, as interacoes nas quatro estacoes, a finalizacao da feijoada com laranja e o cronometro de cinco minutos. Ao mudar perguntas, confirme que a resposta indicada e sua explicacao estao corretas.