var miniCasillas = document.querySelectorAll('.casilla-mini');
var grandesCasillas = document.querySelectorAll('.casilla-grande')
var jugador = true;
var turno = 1;
var startButton = document.querySelector('#start-button');
var tabla = document.querySelector('#movimientos').children[1];
var casillasHidden = document.querySelectorAll('.casilla-grande-hidden')
var localPath = window.location.pathname.split("/");
var imagePath = 'resources/images/background.jpeg';
for (let i = (localPath.length - 2); i > 0; i--) {
    imagePath = localPath[i] + "/" + imagePath;
}
imagePath = "/" + imagePath
console.log(imagePath)
document.querySelector('#juego').style.backgroundImage = `url(${imagePath})`;
startButton.onclick = ()=>{
    startButton.innerHTML = 'Reset';
    StartGame();
};

function OscurecerCasillaMini(event) {
    console.log("OscurecerCasillaMini")
    event.target.style.backgroundColor = '#A4A4A4';
    event.target.style.opacity = '0.3';
}
function RegresarFondoCasillaMini(event) {
    console.log("RegresarFondoCasillaMini")
    event.target.style.backgroundColor = '';
    event.target.style.opacity = '';
}
function Tiro(event){
    console.log("Tiro")
    let casillaGrande = event.target.parentElement.parentElement.parentElement.parentElement.parentElement;
    let clases = event.target.attributes.class.nodeValue.split(" ");
    let strClases = ".casilla-grande" + "." + clases[1] + "." + clases[2];
    let nextCasillaGrande = document.querySelector(strClases);
    if (turno === 1){
        let casillasGrandes = document.querySelectorAll('.casilla-grande')
        casillasGrandes.forEach(casillaGrande => {
            DesactivarCasillaGrande(casillaGrande)
        });
        startButton.innerHTML = 'Reset'
    }
    if (!event.target.innerHTML) {
        let value
        if (jugador) {
            value = 'X';
        }else{
            value = 'O';
        }
        event.target.innerHTML = value;
        AddMove(event.target)
        DesactivarCasillaMini(event.target);
        jugador = !jugador;
        turno++;
        if(turno > 6){
            let valueEnd = isEndedMini(event.target)
            if(valueEnd != -1){
                TurnOffCasillaGrande(casillaGrande, valueEnd);
            }
        }
    }
    grandesCasillas.forEach(casilla=>{
        DesactivarCasillaGrande(casilla);
    })
    if(isActivableGrande(nextCasillaGrande)){
        ActivarCasillaGrande(nextCasillaGrande);
    }else{
        grandesCasillas.forEach(casillaGrande =>{
            if (isActivableGrande(casillaGrande)) {
                ActivarCasillaGrande(casillaGrande);
            }
        })
    }
    if (turno > 8) {
        if (isEnded() != -1) {
            EndGame(isEnded());
        }
    }
}
function ActivarCasillaMini(casillaMini) {
    console.log("ActivarCasillaMini")
    casillaMini.addEventListener('mouseover', OscurecerCasillaMini);
    casillaMini.addEventListener('mouseout', RegresarFondoCasillaMini);
    casillaMini.addEventListener('mousedown', Tiro);
    casillaMini.style.cursor = 'pointer';
}
function DesactivarCasillaMini(casillaMini) {
    console.log("DesactivarCasillaMini")
    casillaMini.removeEventListener('mousedown', Tiro);
    casillaMini.removeEventListener('mouseover', OscurecerCasillaMini);
    casillaMini.style.backgroundColor = '';
    casillaMini.style.opacity = '';
    casillaMini.removeEventListener('mouseout',RegresarFondoCasillaMini);
    casillaMini.style.cursor = 'default';
}
function isActivable(casillaMini) {
    console.log("isActivable")
    if (casillaMini.innerHTML) {
        return false;
    }else{
        return true;
    }
}
function isActivableGrande(casillaGrande){
    console.log("isActivableGrande")
    let clases = casillaGrande.attributes.class.nodeValue.split(" ");
    let str = ".casilla-grande-hidden" + "." + clases[1] + "." + clases[2];
    let casillaGrandeHidden = document.querySelector(str);
    if(casillaGrandeHidden.innerHTML){
        return false;
    } else{
        return true;
    }
}
function ActivarCasillaGrande(casillaGrande) {
    console.log("ActivarCasillaGrande")
    let tableroMini = casillaGrande.children[0].children[0].children[0].children;
    for (let i = 0; i < tableroMini.length; i++) {
        let tableRow = tableroMini[i].children;
        for (let j = 0; j < tableRow.length; j++) {
            let casillaMini = tableRow[j];
            if (isActivable(casillaMini)) {
                ActivarCasillaMini(casillaMini);
            }
        }
    }
    casillaGrande.style.border = 'solid 5px #424242';
}
function DesactivarCasillaGrande(casillaGrande) {
    console.log("DesactivarCasillaGrande")
    let tableroMini = casillaGrande.children[0].children[0].children[0].children;
    for (let i = 0; i < tableroMini.length; i++) {
        let tableRow = tableroMini[i].children;
        for (let j = 0; j < tableRow.length; j++) {
            let casillaMini = tableRow[j];
            if (isActivable(casillaMini)) {
            DesactivarCasillaMini(casillaMini);
            }
        }
    }
    casillaGrande.style.border = '';
}
function StartGame() {
    console.log("StartGame")
    jugador = true;
    turno = 1;
    tabla.innerHTML = '';
    miniCasillas.forEach(miniCasilla =>{
        miniCasilla.innerHTML = ''
    });
    grandesCasillas.forEach(casillaGrande => {
        ActivarCasillaGrande(casillaGrande)
        casillaGrande.style.filter = '';
    });
    casillasHidden.forEach(casillaHidden =>{
        casillaHidden.innerHTML = '';
        casillaHidden.style.visibility = 'hidden';
    })
}
function AddMove(casillaMini) {
    console.log("AddMove")
    let casillaGrande = event.target.parentElement.parentElement.parentElement.parentElement.parentElement;
    let clases = event.target.attributes.class.nodeValue.split(" ");
    let clases2 = casillaGrande.attributes.class.nodeValue.split(" ");
    let UbicacionTiro = [clases2[1] + clases2[2], clases[1] + clases[2]];
    let newRow = document.createElement('tr');
    let simbol = '';
    jugador?  simbol = 'X' :  simbol = 'O';
    let ubicacion = AsignarNumeros(UbicacionTiro[0]) + "/" + AsignarNumeros(UbicacionTiro[1]);
    newRow.innerHTML = `<td>${turno}</td>
                        <td class="simbol">${simbol}</td>
                        <td>${ubicacion}</td>`;
    tabla.appendChild(newRow);
}
function AsignarNumeros(clases) {
    console.log("AsignarNumeros")
    let value = "";
    switch (clases) {
        case "arribaizquierda":
            value = "1";
            break;
        case "arribacentro":
            value = "2";
            break;
        case "arribaderecha":
            value = "3";
            break;
        case "medioizquierda":
            value = "4";
            break;
        case "mediocentro":
            value = "5";
            break;
        case "medioderecha":
            value = "6";
        case "abajoizquierda":
            value = "7";
            break;
        case "abajocentro":
            value = "8";
            break;
        case "abajoderecha":
            value = "9";
            break;
        default:
            alert("Error en la Tabla de Movimentos")
            break;
    }
    return value;
}
function isEndedMini(casillaMini) {
    console.log("isEndedMini")
    let tableroMini = [];
    let arr = casillaMini.parentElement.parentElement.children;
    for (let i = 0; i < arr.length; i++) {
        let Row = arr[i].children;
        for (let j = 0; j < Row.length; j++) {
            tableroMini.push(Row[j].innerHTML);   
        }
    }
    console.log(is3Line(tableroMini))
    return is3Line(tableroMini);
}
function isEnded() {
    console.log("isEnded")
    let tablero = [];
    casillasHidden.forEach(casilla =>{
        tablero.push(casilla.innerHTML)
    })
    return is3Line(tablero)
}
function is3Line(tableroMini) {
    console.log("is3Line")
    let xindex = []
    let oindex = []
    for (let i = 0; i < tableroMini.length; i++) {
        if(tableroMini[i] === 'X'){
            xindex.push(i);
        }else if(tableroMini[i] === 'O'){
            oindex.push(i);
        }
    }
    if(xindex.length >= 3){
        if(xindex.some(val => {return val === 0}) && xindex.some(val => {return val === 1;}) && xindex.some(val => {return val === 2})){
            return 'X';
        } else if(xindex.some(val => {return val === 3}) && xindex.some(val => {return val === 4;}) && xindex.some(val => {return val === 5})){
            return 'X';
        } else if(xindex.some(val => {return val === 6}) && xindex.some(val => {return val === 7;}) && xindex.some(val => {return val === 8})){
            return 'X';
        } else if(xindex.some(val => {return val === 0}) && xindex.some(val => {return val === 3;}) && xindex.some(val => {return val === 6})){
            return 'X';
        } else if(xindex.some(val => {return val === 1}) && xindex.some(val => {return val === 4;}) && xindex.some(val => {return val === 7})){
            return 'X';
        } else if(xindex.some(val => {return val === 2}) && xindex.some(val => {return val === 5;}) && xindex.some(val => {return val === 8})){
            return 'X';
        } else if(xindex.some(val => {return val === 0}) && xindex.some(val => {return val === 4;}) && xindex.some(val => {return val === 8})){
            return 'X';
        } else if(xindex.some(val => {return val === 2}) && xindex.some(val => {return val === 4;}) && xindex.some(val => {return val === 6})){
            return 'X';
        }
    } 
    if(oindex.length >= 3){
        if(oindex.some(val => {return val === 0}) && oindex.some(val => {return val === 1;}) && oindex.some(val => {return val === 2})){
            return 'O';
        } else if(oindex.some(val => {return val === 3}) && oindex.some(val => {return val === 4;}) && oindex.some(val => {return val === 5})){
            return 'O';
        } else if(oindex.some(val => {return val === 6}) && oindex.some(val => {return val === 7;}) && oindex.some(val => {return val === 8})){
            return 'O';
        } else if(oindex.some(val => {return val === 0}) && oindex.some(val => {return val === 3;}) && oindex.some(val => {return val === 6})){
            return 'O';
        } else if(oindex.some(val => {return val === 1}) && oindex.some(val => {return val === 4;}) && oindex.some(val => {return val === 7})){
            return 'O';
        } else if(oindex.some(val => {return val === 2}) && oindex.some(val => {return val === 5;}) && oindex.some(val => {return val === 8})){
            return 'O';
        } else if(oindex.some(val => {return val === 0}) && oindex.some(val => {return val === 4;}) && oindex.some(val => {return val === 8})){
            return 'O';
        } else if(oindex.some(val => {return val === 2}) && oindex.some(val => {return val === 4;}) && oindex.some(val => {return val === 6})){
            return 'O';
        }
    }
    if(oindex.length + xindex.length >= 9){
        return 'full';
    }
    return -1;
}
function TurnOffCasillaGrande(casillaGrande, etiqueta) {
    console.log("TurnOffCasillaGrande")
    casillaGrande.style.filter = 'blur(4px)';
    let clases = casillaGrande.attributes.class.nodeValue.split(" ");
    let str = ".casilla-grande-hidden" + "." + clases[1] + "." + clases[2];
    let casillaToOff = document.querySelector(str);
    if (etiqueta === 'X') {
        casillaToOff.innerHTML = 'X';
    } else if (etiqueta === 'O') {
        casillaToOff.innerHTML = 'O';
    } else{
        casillaToOff.innerHTML = '-';
    }
    casillaToOff.style.visibility = 'visible';
    casillaToOff.style.zIndex = '100';
}
function EndGame(etiqueta) {
    if (etiqueta === 'full') {
        alert("Empate")
    } else{
        alert("Gana Jugador " + etiqueta)
    }
    grandesCasillas.forEach(casilla =>{
        DesactivarCasillaGrande(casilla)
    })
}