//Elementos html - variaveis nao vao mudar de referencia
const board = document.querySelector(".board");
const select = document.getElementById("dificuldade");
const botao = document.querySelector("button");
const movimentosEl = document.getElementById("movimentos");
const tempoEl = document.getElementById("tempo");
const paresEl = document.getElementById("pares");
const messageContainer = document.getElementById("message");

//Estado do jogo
let primeiraCarta = null;
let segundaCarta = null;
let travar = false;//isso vai bloquear para que o jogador nao clque em uma terceira carta enquando o sistema verifica

//dados do jogo
let movimentos = 0;
let paresEncontrados = 0;
let totalPares = 0;


//tempo
let tempo = 0;
let intervalo = null;

//criando o baralho completo 
let valores = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
let naipes = ['espadas','copas','ouros','paus'];

let base = [];
naipes.forEach(naipe=> {
    valores.forEach(valor=> {
        base.push(`${valor}_${naipe}`);
    });
});

//funcao principal
function iniciarJogo() {
    board.innerHTML = "";//Tira todas as cartas antigas
    messageContainer.classList.add("hide");//esconde a mensagem de vitória
    let quantidade  = parseInt(select.value);
    totalPares = quantidade/2;


    //definindo o layout - quantas cartas 
    let colunas = 0;
    if(quantidade == 6) {
        colunas = 3;
    }
    if(quantidade == 12) {
        colunas = 4;
    }
    if(quantidade == 24) {
        colunas = 6;
    }

    board.style.gridTemplateColumns = `repeat(${colunas}, 120px)`;

    //resetando o jogo
    movimentos = 0;
    paresEncontrados = 0;
    primeiraCarta = null;
    segundaCarta = null;
    travar = false;

    //inicia a contagem do tempo
    iniciarTimer();

    //atualiza a tela
    atualizarHUD();

    //criando cartas aleatorias
    let selecionadas = base.sort(() => Math.random() - 0.5).slice(0, totalPares);//totalPares é quantidade de tipos de cartas que eu tenho no jogo
    let jogo = [...selecionadas, ...selecionadas];
    //embaralha de novo, agora todas as cartas
    jogo.sort(() => Math.random() - 0.5);

    //criando as cartas
    jogo.forEach(valor=>{
        let carta = document.createElement("div");
        carta.classList.add("card");

        //inicia a carta como virada para baixo
        let img = document.createElement("img");
        img.src = "img/card_bg.png";

        //guarda o valor da carta
        carta.dataset.valor = valor;

        //adiciona a carta na tela
        carta.appendChild(img);
        board.appendChild(carta);

        //faz ela reagir ao clique
        carta.addEventListener("click", clicarCarta);
    });

}

//função clicar na carta
function clicarCarta() {
    if (travar) return;//impede que o jogador clique em mais de duas cartas

    //pega a imagem da carta
    let img = this.querySelector("img");

    //mostra a imagem
    img.src = `img/${this.dataset.valor}.png`;
    console.log(`img/${this.dataset.valor}.png`);//controlar a carta clicada

    if (this === primeiraCarta) return;//nao deixar clicar na mesma carta

    ///guarda primeira carta, se ela aina nao existe
    if (!primeiraCarta) {
        primeiraCarta = this;
    } else {//se existe primeira, então guarda a seguna
        segundaCarta = this;
        travar = true;
        movimentos++;

        verificarPar();
    }

    atualizarHUD();
}

//verificando se é um par
function verificarPar() {
    let carta1 = primeiraCarta.dataset.valor;
    let carta2 = segundaCarta.dataset.valor;

    if (carta1 === carta2) {
        paresEncontrados++;
        resetarJogada();

        if (paresEncontrados === totalPares) {//verifica se achou todos os pares
            pararTimer();
            setTimeout(() => {
                messageContainer.classList.remove("hide");
            }, 500);
        }
    } else {
        setTimeout(() => {//da um pequeno tempo para o jogador ver as cartas e depois desvira
            primeiraCarta.querySelector("img").src = "img/card_bg.png";
            segundaCarta.querySelector("img").src = "img/card_bg.png";
            resetarJogada();
        }, 1000);
    }

    atualizarHUD();
}

//reiniciar uma jogada
function resetarJogada() {
    primeiraCarta = null;
    segundaCarta = null;
    travar = false;
}

//cria o timer
function iniciarTimer() {
    clearInterval(intervalo);//para o timer atual
    tempo = 0;//zera o tempo

    intervalo = setInterval(() => {//cria um novo timer
        tempo++;
        atualizarHUD();
    }, 1000);
}

//para o timer
function pararTimer() {
    clearInterval(intervalo);
}

//formata o tempo
function formatarTempo() {
    let min = String(Math.floor(tempo / 60)).padStart(2, '0');
    let seg = String(tempo % 60).padStart(2, '0');
    return `${min}:${seg}`;
}

//atualiza os dados do hud
function atualizarHUD() {
    movimentosEl.textContent = movimentos;
    tempoEl.textContent = formatarTempo();
    paresEl.textContent = `${paresEncontrados}/${totalPares}`;
}


botao.addEventListener("click", iniciarJogo);

//reinicia o jogo quando muda-se a dificuldade
function mudarDificuldade() {
    iniciarJogo();
}


//inicia o jogo automaticamente
iniciarJogo();

