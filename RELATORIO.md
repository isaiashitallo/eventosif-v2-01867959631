# Relatório — Estudo de caso EventosIF 2.1

**Aluno(a): Isaias Hitallo Durante Amaral**  **Matrícula: 01867959631   **  **Turma: 2026/2 - Curso Sistemas para Internet** 

---

## Etapa 0 — Medição inicial

# Bancada de medição — 09/10/2026, 21:33:07

Matrícula: 01867959631 · eventos na massa de dados: 2131 · Node v24.15.0

| Interação | Tempo (ms) | Renders de ItemEvento | Renders de ListaEventos |
|---|---:|---:|---:|
| 1. Abrir a aba Eventos | 3237 | 2131 | 1 |
| 2. Digitar "progra" (6 teclas) | 4807 | 2580 | 6 |
| 3. Favoritar o primeiro evento da lista | 492 | 156 | 1 |

> Tempo varia com a máquina; contagem de renders é determinística e será conferida pelo professor.
---

## Parte A — Diagnóstico (SEM IA)

> Preencha e faça o commit `diag: hipoteses iniciais` **antes** de qualquer correção e **antes** de conversar com IA.

| Chamado | Consegui reproduzir? Como? | Minha hipótese (arquivo e linha) | Como vou provar |
|---|---|---|---|
| C1 | Sim. Favoritei um evento e depois atualizei a pag. Após a atualização, observei que os favoritos não foram mantidos | Minha hipótese é que exista um problema no gerenciamento do estado ou na persistência dos favoritos, a investigação é no arquivo FavoritosContexto.js, no userEstadoPersistido | Vou utilizar console.log para observar o estado dos favoritos depois da atualização da pag e ver se o valor carregado bate com os dados salvos |
| C2 | Sim. Reproduzi o problema atualizando a pag e observando o comportamento da lista de eventos depois do recarregamento | Minha hipótese é que exista um problema na persistência dos dados da lista de eventos, talvez relacionado ao uso de userEstadoPersistido no arquivo ListaEventos.js | Vou no console.log para acompanhar os valores da lista de eventos antes e depois da atualização da pag, vendo se os dados são mantidos ou se ocorre alguma alteração no recarregamento |
| C3 | | | |
| C4 | | | |
| C5 | | | |
| C6 | | | |
| C7 | | | |

### Hipóteses revisadas (preencha ao final)

| Chamado | Hipótese inicial estava… (certa / parcial / errada) | O que me fez mudar de ideia (evidência) |
|---|---|---|
| | | |

---

## Parte B — Persistência

### B1 · Chamados C1 e C2
- Causa(s) encontrada(s):
- Teste de regressão (arquivo e nome do teste):
- Commit do teste vermelho: `hash` · commit da correção: `hash`
- **B-Q1.** Descreva, em ordem temporal, o que acontece desde a montagem do provedor até o valor salvo ser perdido.

O app começava com uma lista vazia e no mesmo tempo, lia os favoritos salvos. Enquanto isso podia gravar essa lista vazia no armazenamento, aí os favoritos eram apagados.
Agora o hook espera a leitura terminar antes de gravar.

- **B-Q2.** Quantas causas o chamado C1 tinha? Como você descobriu?

2 causas
A gravacão da lista vazia podia apagar os dados e msm com os dados salvos, as estrelas podiam ficar vazias: o app comparava objetos diferentes como se fossem o mesmo evento

Achei isso seguindo o fluxo do hook e comparando como a lista e a tela Início mostram os favoritos. A correção atual resolve a primeira causa, não comparei os eventos pelo id

### B2 · Chamado C3
- Causa:
- Teste de regressão:
- Commits:
- **B-Q3.** Por que "apagar o armazenamento inteiro quando der erro" não é uma correção aceitável?
Pq apagaria dados que não têm relação com o erro, como favoritos e token. É melhor corrigir o dado que falhou sem afetar o resto


### B3 · Chamado C4
- Causa:
- Teste de regressão:
- Commits:
- **B-Q4.** O que acontece com os dados de quem já usa a versão 2.1 (favoritos e token já gravados) quando instalar a sua versão? Sua correção trata isso?

Os favoritos continuam salvos e o token tbm
A correção não apaga nenhum dos dois, mas as estrelas ainda podem aparecer vazias por causa da comparação entre objetos, essa parte precisa ser corrigida pelo id.

---

## Parte C — Desempenho

| Commit | Mudança (uma por commit) | Hipótese | Abrir aba (ms / renders) | Digitar (ms / renders) | Favoritar (ms / renders) | Mantive? |
|---|---|---|---|---|---|---|
| inicial | — | — | | | | — |
| | | | | | | |

- 1.Parta da medição inicial (Etapa 0). Leia os três números de renderizações de ItemEvento e explique, no relatório, de onde vem cada um.
2.131 ao abrir Eventos: uma renderização para cada evento carregado.
2.580 ao digitar “progra”: soma das renderizações nas seis atualizações da busca, uma por tecla.
156 ao favoritar: nova renderização dos 156 resultados exibidos, pois as funções passadas nas props de cada item mudam quando a lista atualiza.



- **C-Q1.** Qual mudança deu o maior ganho? Explique o **mecanismo** (não basta dizer "FlatList é melhor").
- **C-Q2.** Descreva um experimento que **não** melhorou a medição. O que você fez com ele?
- **C-Q3.** Por que o tempo medido no Jest não é o tempo que o usuário sente no celular? O que a contagem de renderizações mede de forma mais confiável?
- (Opcional) Medição no aparelho com o Performance Monitor, antes e depois.

---

## Parte D — Testes e depuração

### D1 · Auditoria da suíte do estagiário

| Problema encontrado | Arquivo / teste | Como provei que era um problema (comando) | Correção |
|---|---|---|---|
| | | | |
| | | | |
| | | | |

- O que aconteceu quando o teste defeituoso passou a verificar de verdade?

### D2 · Relatórios de depuração (seis passos, até 15 linhas cada)

**C3 — tela branca**
1. Reproduzir:
2. Isolar:
3. Hipótese:
4. Instrumentar / evidência:
5. Correção da causa:
6. Teste de regressão:

**C7 — próximos eventos mudam**
1. Reproduzir:
2. Isolar:
3. Hipótese:
4. Instrumentar / evidência:
5. Correção da causa:
6. Teste de regressão:

### D3 · Chamado C6
- Causa:
- Por que o sintoma só aparece depois de filtrar?
- Teste de regressão:

---

## Parte E — Auditoria da resposta de IA

| Item | Classificação (correta / parcial / incorreta) | Evidência (o que executei e o resultado) |
|---|---|---|
| 1 | | |
| 2 | | |
| 3 | | |
| 4 | | |
| 5 | | |
| 6 | | |
| 7 | | |
| 8 | | |
| 9 | | |
| 10 | | |

---

## Parte F — Reflexão (até 20 linhas)

1. O que você aprendeu neste estudo que a IA não poderia ter aprendido por você?
2. Descreva um momento em que a IA te levou para o caminho errado (ou quase). Como você percebeu?
3. Como você vai usar IA de forma diferente no projeto da sua equipe?

---

## Declaração de autoria

Declaro que diagnostiquei, escrevi e verifiquei o código e os textos deste repositório. Usei IA conforme as regras do estudo de caso e registrei esse uso em `DIARIO-IA.md`. Estou ciente de que serei chamado(a) a explicar, sem IA, qualquer trecho entregue.

Nome: ______________________ Data: ___/___/2026
