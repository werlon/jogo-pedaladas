/**
 * Created by werlon on 08/02/16.
 */
var canvas;
var contexto;
var ALTURA;
var LARGURA;
var maxPulos = 3;
var velocidade = 6;
var estadoAtual;
var record;
var img;
var posicao = 0;
var posicoes = 3;
var estados = {jogar: 0, jogando: 1, perdeu: 2};
var chao = {
    x: 0,
    y: 550,
    altura: 50,
    atualiza: function(){
        this.x -= velocidade;
        if(this.x <= -580){
            this.x = 0;
        }
    },
    desenha: function(){
        spriteChao.desenha(this.x,this.y);
        spriteChao.desenha(this.x + spriteChao.largura, this.y);
    }
};
var bloco = {
    x: 50,
    y: 0,
    altura: spriteDilma.altura,
    largura: spriteDilma.largura,
    gravidade: 1.6,
    velocidade: 0,
    forcaDoPulo: 23.6,
    qtdPulos: 0,
    score: 0,
    vidas: 3,
    colidindo: false,
    atualiza: function(){
        this.velocidade += this.gravidade;
        this.y += this.velocidade;
        posicao++;
        if(posicao==posicoes){
            posicao=0;
        }
        switch(posicao){
            case 0:
                spriteDilma = new Sprite(650,84,78,110);
                break;
            case 1:
                spriteDilma = new Sprite(728,84,78,110);
                break;
            case 2:
                spriteDilma = new Sprite(806,84,78,110);
                break;
        }
        if(this.y > chao.y - this.altura && estadoAtual != estados.perdeu){
            this.y = chao.y -this.altura;
            this.qtdPulos = 0;
            this.velocidade = 0;
        }
    },
    pula: function () {
        if(this.qtdPulos < maxPulos){
            this.velocidade = -this.forcaDoPulo;
            this.qtdPulos++;
        }
    },
    reset: function(){
        this.velocidade = 0;
        this.y = 0;
        if(this.score > record){
            localStorage.setItem("record", this.score);
            record = this.score;
        }
        this.vidas = 3;
        this.score = 0;
    },
    desenha: function(){
        contexto.save();
        contexto.translate(this.x + this.largura / 2, this.y + this.altura / 2);
        spriteDilma.desenha(-this.largura / 2, -this.altura / 2);
        contexto.restore();
    }
};

var music = document.getElementById("music");
var tocado = document.getElementById("tocado");
var perdido = document.getElementById("perdido");

var obstaculos = {
    _obs: [],
    posicao:0,
    tempoInsere: 0,
    insere: function () {
        this.posicao = Math.floor(5 * Math.random());
        this._obs.push({
            x: LARGURA,
            largura: 54,
            altura: 90,
            ponto: 5 * Math.random(),
            blocoPosicao: this.posicao
        });
        this.tempoInsere = 40 + Math.floor(70 * Math.random());
    },
    atualiza: function () {
        if(this.tempoInsere==0){
            this.insere();
        }else{
            this.tempoInsere--;
        }
        for(var i = 0, tam = this._obs.length; i < tam; i++){
            var obs = this._obs[i];
            obs.x -= velocidade;
            if(!bloco.colidindo
                && bloco.x < obs.x + obs.largura
                && bloco.x + bloco.largura >= obs.x
                && bloco.y + bloco.altura >= chao.y - obs.altura){
                bloco.colidindo = true;
                setTimeout(function(){
                    bloco.colidindo = false;
                },700);

                if(bloco.vidas >= 1){
                    bloco.vidas--;
                    tocado.play();
                }else{
                    estadoAtual = estados.perdeu;
                    perdido.play();
                    paraMusica();
                }
            }else if(obs.x==0){bloco.score++;}else
            if(obs.x <= -obs.largura){
                this._obs.splice(i, 1);tam--;i--;
            }
        }
    },
    limpa: function(){
        this._obs = [];
    },
    desenha: function () {
        for(var i = 0, tam = this._obs.length; i < tam; i++){
            var obs = this._obs[i];
            spriteStf[obs.blocoPosicao].desenha(obs.x, chao.y-obs.altura);
        }
    }
};

function tocaMusica() {
    music.play();
}

function paraMusica() {
    music.pause();
}

function clique(event){
    if(estadoAtual==estados.jogando){
        bloco.pula();
    }else if(estadoAtual == estados.jogar){
        tocaMusica();
        estadoAtual = estados.jogando;
    }else if(estadoAtual == estados.perdeu && bloco.y >= 2 * ALTURA){
        estadoAtual = estados.jogar;
        obstaculos.limpa();
        bloco.reset();
    }
}
function main(){
    ALTURA = window.innerHeight;
    LARGURA = window.innerWidth;
    if(LARGURA >= 500){
        LARGURA = 600;
        ALTURA = 600;
    }
    canvas = document.createElement("canvas");
    canvas.width = LARGURA;
    canvas.height = ALTURA;
    canvas.style.border = "1px solid #000";
    contexto = canvas.getContext("2d");
    document.body.appendChild(canvas);

    canvas.addEventListener("mousedown",clique);

    estadoAtual = estados.jogar;
    record = localStorage.getItem("record");
    if(record == null){record=0;}
    img = new Image();
    img.src = "img/sheet.png";
    roda();
}
function roda(){
    atualiza();
    desenha();
    window.requestAnimationFrame(roda);
}
function atualiza(){
    bloco.atualiza();
    if(estadoAtual == estados.jogando){
        obstaculos.atualiza();
    }
    chao.atualiza();
}
function desenha(){
    spriteFundo.desenha(0,0);
    contexto.fillStyle = "#fff";
    contexto.font = "50px Arial";
    contexto.fillText(bloco.score, 30, 68);

    spriteVida.desenha(LARGURA - 2 - spriteVida.largura,15);
    contexto.fillText(bloco.vidas, 540, 68);

    if(estadoAtual == estados.jogando){
        obstaculos.desenha();
    }
    chao.desenha();
    bloco.desenha();
    if(estadoAtual == estados.jogar){
        spriteInicioJogo.desenha(
            LARGURA / 2 - spriteInicioJogo.largura / 2,
            ALTURA / 2 - spriteInicioJogo.altura / 2
        );
    }
    if(estadoAtual == estados.perdeu){
        spritePerdeu.desenha(
            LARGURA / 2 - spritePerdeu.largura / 2,
            ALTURA / 2 - spritePerdeu.altura / 2 - spriteRecord.altura / 2
        );
        contexto.fillStyle = "#fff";
        contexto.fillText(
            bloco.score,
            LARGURA / 2 + spritePerdeu.largura / 2,
            ALTURA / 2 + spritePerdeu.altura / 2 - spriteRecord.altura / 2 - 15
        );
        if(bloco.score > record){
            spriteNovoRecord.desenha(
                LARGURA / 2 - spriteRecord.largura / 2,
                ALTURA / 2 + spritePerdeu.altura / 2 - spriteRecord.altura / 2
            );
            contexto.fillText(
                bloco.score,
                LARGURA / 2 + spriteRecord.largura / 2,
                ALTURA / 2 + spritePerdeu.altura / 2 + spriteRecord.altura / 2
            );
        }else{
            spriteRecord.desenha(
                LARGURA / 2 - spriteRecord.largura / 2,
                ALTURA / 2 + spritePerdeu.altura / 2 - spriteRecord.altura / 2
            );
            contexto.fillText(
                record,
                LARGURA / 2 + spriteRecord.largura / 2,
                ALTURA / 2 + spritePerdeu.altura / 2 + spriteRecord.altura / 2
            );
        }
    }
}
main();