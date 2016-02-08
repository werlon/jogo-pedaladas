/**
 * Created by werlon on 08/02/16.
 */
function Sprite(x, y, largura, altura){
    this.x = x;
    this.y = y;
    this.largura = largura;
    this.altura = altura;
    this.desenha = function(xCanvas, yCanvas){
        contexto.drawImage(img, this.x, this.y, this.largura, this.altura, xCanvas, yCanvas,this.largura, this.altura);
    }
}
var spriteFundo = new Sprite(0,0,600,600);
var spriteDilma = new Sprite(645,84,87,110);
var spriteVida = new Sprite(885,84,90,80);
var spritePerdeu = new Sprite(660,720,258,80);
var spriteInicioJogo = new Sprite(630,202,324,266);
var spriteNovoRecord = new Sprite(80,800,260,55);
var spriteRecord = new Sprite(80,720,260,55);
var spriteChao = new Sprite(0,610,600,50);
var spriteStf = [
    new Sprite(30,880,54,90),
    new Sprite(84,880,54,90),
    new Sprite(138,880,54,90),
    new Sprite(192,880,54,90),
    new Sprite(246,880,54,90)
];