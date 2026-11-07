# Instrucoes para agentes

Antes de alterar o projeto, consulte `conhecimento/visao-geral.md` e os arquivos relacionados ao comportamento solicitado.

## Convencoes

- Mantenha o projeto como um site estatico em HTML, CSS e JavaScript, sem adicionar frameworks, dependencias ou etapas de build sem necessidade explicita.
- Preserve o idioma pt-BR e a navegacao entre os jogos. Use `site.css` como fonte compartilhada de cores, tipografia e componentes comuns.
- Ao alterar uma pagina, mantenha sua aparencia alinhada ao restante do site em vez de criar uma identidade visual isolada.
- Mantenha os controles acessiveis por teclado, os estados semanticos dos botoes e o suporte a telas pequenas e a `prefers-reduced-motion`.
- Preserve os nomes e caminhos dos arquivos de imagem em `Animais/`; atualize as referencias se algum ativo for alterado.
- Ao adicionar ou reorganizar jogos, atualize o README e a documentacao em `conhecimento/` para refletir o estado real do projeto.
- Ao editar perguntas, confira se enunciado, alternativas, indice da resposta correta e explicacao correspondem entre si. Prefira fatos verificaveis e revise informacoes que possam mudar com o tempo.
- Evite reformatar ou reescrever arquivos inteiros quando uma mudanca localizada resolver a tarefa.

## Verificacao

- Abra as paginas alteradas no navegador e teste o fluxo principal, os links entre jogos e a apresentacao em tela pequena.
- No jogo da memoria, confirme que as imagens carregam e que iniciar um novo jogo reinicia o placar.
- No quiz, confira selecao de tema, resposta, feedback, avancar, resultado e reinicio.