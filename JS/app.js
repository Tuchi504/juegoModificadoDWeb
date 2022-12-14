//CARS
var car = document.getElementById("car");
car.init = function () {
   //Definición de las propiedades y estado inicial del carro
   car.speed = 0.2;
   car.turn = 0;
   car.x = car.offsetLeft;
   car.y = 1;
   car.width = car.offsetWidth;
   car.height = car.offsetHeight;
   car.maxSpeed = 8;
   car.km = 0;
   car.motor = 1;
   car.crashed = false;
   (car.acc = 0.03), (car.break = 0.08);
};
//Función para simular el movimiento de las llantas y el motor
car.frame = function () {
   car.motor *= -1;
   car.style.left = parseInt(car.x) + "px";
   car.style.transform = "scaleX(" + car.motor + ")";
   car.steer();
};
//Función para hacer girar al carro
car.steer = function () {
   car.x += car.sx;
   road.P0.x -= car.sx / 4;
};
//Función que se ejecuta cuando el carro choca
car.crash = function (d) {
   if (!car.crashed) {
      choque();
      car.crashed = true;
      car.speed = -0.4;
      car.sx = d ? d : 0;
      game.audio.oscillator.frequency.value = 20;
      setTimeout(function () {
         game.audio.oscillator.frequency.value = 60;
         car.crashed = false;
         car.sx = 0;
      }, 1000);
   }
};
var cars = document.getElementById("cars");
//Función para asignar propiedades a los carros oponentes
cars.init = function () {
   cars.n = 24; //Distancia a la cual los carros oponentes ya son visibles en la carretera
   cars.x = 0; 
   cars.speed = 1;//velocidad de los carros oponentes
   cars.interval = 500;
   cars.oponents = [];
   cars.easy = 0.2; //cantidad de tráfico
   for (var j = 0; j < cars.n; j++) {
      cars.oponents[j] = [];
      for (var i = 0; i < 3; i++) {
         cars.oponents[j][i] = cars.create(i, j);
      }
   }
   car.st = document.createElement("style");
   document.body.appendChild(car.st);
   cars.builded = true;
};
/*Función para redimensionar el tamaño de los carros oponentes de acuerdo con la posición de la pista
Definición de los límites para que se considere que el carro ha chocado
Definición de los límites para desaparecer los carros oponentes*/
cars.frame = function () {
   var relative = cars.speed - car.speed;
   for (var j = 0; j < cars.n; j++) {
      for (var i = 0; i < 3; i++) {
         var c = cars.oponents[j][i];
         var d = road.width * 0.42,
            w = road.width - d - car.width;
         c.x =
            (road.P0.x - road.height - 40) * (c.y * c.y * 0.00001) +
            d / 2 +
            i * (w / 2);
         c.y += relative;
         var h = cars.n * car.height * 3;
         if (!c.classList.contains("hidden") && c.y < car.height - 5 && c.y > 0) {
            //collision
            if (car.x < 115 && i == 0) car.crash(0.1);
            if (car.x > 100 && car.x < 175 && i == 1) car.crash();
            if (car.x > 165 && i == 2) car.crash(-0.1);
         }
         if (c.y > h) {
            // back to bottom
            cars.color(c);
            c.classList.remove("hidden");
            if (car.x < 115 && i == 0) c.classList.add("hidden");
            if (car.x > 100 && car.x < 175 && i == 1) c.classList.add("hidden");
            if (car.x > 165 && i == 2) c.classList.add("hidden");
            if (Math.random() > cars.easy) c.classList.add("hidden");
            if (!c.classList.contains("hidden")) car.position++,lap.value--;
            c.y = 0;
            } else if (c.y < 0) {
            //passing
            if (!c.classList.contains("hidden")) {
               car.position--;
               lap.value++;
            }
            cars.color(c);
            c.classList.remove("hidden");
            if (Math.random() > cars.easy) c.classList.add("hidden");
            c.y = h;
            cars.color(c);
         }
         c.style.left = parseInt(c.x) + "px";
         c.style.bottom = parseInt(c.y) + "px";
         //var o = 1 / (c.y * fog.value);
         //c.style.opacity = Math.min(o, 1);
      }
      if (
         !cars.oponents[j][0].classList.contains("hidden") &&
         !cars.oponents[j][1].classList.contains("hidden") &&
         !cars.oponents[j][2].classList.contains("hidden")
      ) {
         cars.oponents[j][parseInt(Math.random() * 3)].classList.add("hidden");
      }
   }
   car.st.innerHTML =
      "#cars .car {transform: rotateX(-56deg) scaleX(" + car.motor + ") }";
   car.style.left = parseInt(car.x) + "px";
};
//Función que crea los carros oponentes
cars.create = function (i, j) {
   var c = document.createElement("div");
   c.className = "car";
   cars.color(c);
   var d = road.width * 0.42,
      w = road.width - d - car.width;
   c.x = d / 2 + i * (w / 2);
   c.y = -car.height + j * car.height * 3;
   cars.appendChild(c);
   if (Math.random() > 0.1) c.classList.add("hidden");
   if ((i == 1 && j == 0) || (i == 1 && j == 1)) c.classList.add("hidden");
   return c;
};
//Función que cambia el tono y el brillo del color de los carros de manera aleatoria
cars.color = function (c) {
   var randomColor = Math.random() * 360;
   var randomLight = 2.5 + Math.random() * 2;
   c.style["filter"] =
      "hue-rotate(" + randomColor + "deg) brightness(" + randomLight + ")";
};
//ROAD
var road = document.getElementById("road");
road.init = function () {
   road.ctx = road.getContext("2d");
   road.width = road.offsetWidth;
   road.height = road.offsetHeight;
   road.state = 0;
   road.x = 0;
   road.offset = 40;
   road.lineWidth = 2.5;
   road.lineColor = "white"; //'rgba(255,255,255,0.7)';
   road.lineDashOffset = 0;
   road.P0 = { x: parseInt(road.width / 2), y: 0, xs: 0 };
   road.P1 = { x: road.offset, y: road.height };
   road.P2 = { x: road.width - road.offset, y: road.height };
   road.Pc = { x1: road.P1.x + 86, x2: road.P2.x - 86 };
   road.frame();
};
road.frame = function () {
   road.P0.x += road.P0.xs / 2;
   road.Pc.x1 -= road.P0.xs / 3;
   road.Pc.x2 -= road.P0.xs / 3;
   road.lineDashOffset -= car.speed;

   road.ctx.clearRect(0, 0, road.width, road.height);
   road.ctx.beginPath();

   road.ctx.moveTo(road.P1.x, road.P1.y);
   road.ctx.bezierCurveTo(
      road.Pc.x1,
      road.P1.y - road.height * 0.7,
      road.P0.x,
      road.P0.y,
      road.P0.x,
      road.P0.y
   );

   road.ctx.moveTo(road.P2.x, road.P2.y);
   road.ctx.bezierCurveTo(
      road.Pc.x2,
      road.P2.y - road.height * 0.7,
      road.P0.x,
      road.P0.y,
      road.P0.x,
      road.P0.y
   );

   //añadida
   road.ctx.moveTo(road.width / 2, road.P2.y);
   road.ctx.bezierCurveTo(
      road.Pc.x1 + 35,
      road.P2.y - road.height,
      road.P0.x,
      road.P0.y,
      road.P0.x,
      road.P0.y
   );

   road.ctx.strokeStyle = road.lineColor;
   road.ctx.lineWidth = road.lineWidth;
   road.ctx.setLineDash([road.lineWidth, road.lineWidth]);
   road.ctx.lineDashOffset = road.lineDashOffset * -0.2;
   road.ctx.stroke();
};
road.curve = function (side) {
   if (
      !(road.state == -1 && side == "left") &&
      !(road.state == 1 && side == "right")
   ) {
      if (road.state == 1 && side == "left") road.state = 0;
      else if (road.state == -1 && side == "right") road.state = 0;
      else if (road.state == 0 && side == "left") road.state = -1;
      else if (road.state == 0 && side == "right") road.state = 1;
      road.P0.xs = 1.5 * (side == "left" ? -1 : 1);
   }
   road.randomCurve();
   setTimeout(function () {
      road.P0.xs = 0;
   }, 1000);
};
road.randomCurve = function () {
   game.curveCount = setTimeout(function () {
      road.curve(Math.random() > 0.5 ? "left" : "right");
   }, 2000);
};
//MOUNTAINS
var mountains = document.getElementById("mountains");
mountains.frame = function () {
   var curve = (road.P0.x - road.width / 2) / 100;
   var left = mountains.offsetLeft;
   if (left < -4.5 * road.width) left = 1.5 * road.width;
   if (left > 1.5 * road.width) left = -4.5 * road.width;
   var d = curve + car.speed * curve * 0.5;
   mountains.style.left = parseInt(left - d) + "px";
};
//UI
var km = document.getElementById("km");
km.frame = function () {
   car.km += car.speed / 1000;
   var value = parseInt(car.km * 10).toString();
   while (value.length < km.childNodes.length) value = "0" + value;
   for (var i = 1; i < km.childNodes.length; i++) {
      var a = km.childNodes[i];
      a.innerText = value[i - 1];
   }
};
var position = document.getElementById("position");
position.init = function () {
   cars.total = 200;
   car.position = cars.total;
};
position.frame = function () {
   var value = parseInt(car.position).toString();
   for (var i = 0; i < position.childNodes.length - 1; i++) {
      var a = position.childNodes[i + 1];
      a.innerText = value[i];
   }
};
//GameTime
var lap = document.getElementById("lap");
lap.init = function () {
   lap.value = 0;
};
lap.frame = function () {
   /* if (car.position == 0) {
      lap.value++;
      car.easy += 0.5;
      cars.total = 50;
      car.position = cars.total;
   }
   lap.innerText = lap.value; */
   //modificado
};
//FRAME
var frame = function () {
   if (!frame.stop) {
      key.frame();
      car.frame();
      cars.frame();
      mountains.frame();
      road.frame();
      km.frame();
      position.frame();
      requestAnimationFrame(frame);
   }
};
//KEYBOARD
var key = {
   pressed: [],
   frame: function () {
      //añadido
      let velocidad = document.getElementById("velocidad");
      velocidad.innerHTML = (car.speed * 15).toFixed(0) + "km/h";
      if (!car.crashed) {
         car.sx = 0;
         if (car.x > road.width * 0.15) {
            if (
               key.pressed["left"] ||
               key.pressed[37] || // Key: Left arrow
               key.pressed[65]
            ) {
               // Key: 'A'
               car.sx = -2.5;
            }
         } else car.crash(0.2);
         if (car.x < road.width * 0.85 - car.width) {
            if (
               key.pressed["right"] ||
               key.pressed[39] || // Key: Right arrow
               key.pressed[68]
            ) {
               // Key: 'D'
               car.sx = 2.5;
            }
         } else car.crash(-0.2);
         if (
            key.pressed["up"] ||
            key.pressed[32] || // Key: Space
            key.pressed[38] || // Key: Up arrow
            key.pressed[87]
         ) {
            // Key: 'W'
            if (car.speed < car.maxSpeed) {
               car.speed += car.acc;
               game.audio.oscillator.frequency.value += car.acc * 10;
            }
         } else {
            if (car.speed > 0.2) {
               car.speed -= car.break;
               game.audio.oscillator.frequency.value -= car.break * 10;
            }
         }
      }
   }
};
window.addEventListener("keydown", function (event) {
   key.pressed[event.keyCode] = true;
});
window.addEventListener("keyup", function (event) {
   key.pressed[event.keyCode] = false;
   //añadido
   if (car.speed > 5) {
      let tecla = event.code;
      if (tecla == 'ArrowUp') {
         turbo();
      }
   }

});
//GAME
var game = document.getElementById("game");
game.init = function () {
   game.time = 0;
   car.init();
   cars.init();
   road.init();
   position.init();
   lap.init();
   //fog.init();
   cars.frame();
   lap.frame();
};
// BUTTONS
var buttons = ["left", "up", "right"];
buttons.forEach(function (id) {
   var button = document.getElementById(id);
   var press = function (event) {
      key.pressed[id] = true;
   };
   var release = function (event) {
      key.pressed[id] = false;
   };
   button.addEventListener("mousedown", press);
   button.addEventListener("mouseup", release);
   button.addEventListener("touchstart", press);
   button.addEventListener("touchend", release);
});
var clickstart = document.getElementById("click");
let tiempo = document.querySelector('.tiempo');
let tiempoF=null, tiempoR=120000, difTiempo=0;
clickstart.addEventListener("click", function () {
   if (!game.started) {
      let time = setInterval(()=>{
         lap.innerText = lap.value;
         win();
      },1);
      if (tiempoF){
         tiempoF = new Date (new Date().getTime() + difTiempo);
         difTiempo = 0;
      }else{
         tiempoF = new Date (new Date().getTime() + tiempoR);
      }
      let tiempoJuego = setInterval(()=>{
         tiempoR = tiempoF.getTime() - new Date().getTime();
         if (tiempoR <= 0){
            clearInterval(tiempoJuego);
            game.audio.oscillator.stop();
            alert('Perdiste! Se ha acabado el tiempo! Inténtalo de Nuevo!');
            location.reload();
         }else{
            tiempo.textContent = `${Math.trunc((tiempoR/1000)/60)}:${(((tiempoR/1000)%60)).toFixed(0)}`;
         }
         if (clickstart.innerText == "Reanudar!"){
            difTiempo = tiempoF.getTime() - new Date().getTime();
            clearInterval(tiempoJuego);
         }
      },50);
      clickstart.innerText = "Pausa!";
      game.time = 0;
      game.started = true;
      frame.stop = false;
      if (!cars.builded) cars.init();
      game.audio();
      game.curveCount = setTimeout(road.randomCurve, 5000);
      game.timeCount = setTimeout(game.changeTime, 30000);
      frame();
   } else {
      clickstart.innerText = "Reanudar!";
      game.started = false;
      frame.stop = true;
      clearTimeout(game.curveCount);
      clearTimeout(game.timeCount);
      game.audio.oscillator.stop();
   }
});
//AUDIO
//sonido de turbo al desacelerar 
function turbo() {
   game.audio.volume.gain.value = 0;
   let audio = new Audio('../juegoModificadoDWeb/audio/sonido_desaceleracion_final.mp3');//../juegoModificadoDWeb/audio/sonido_desaceleracion_final.mp3
   audio.play();
   game.audio.volume.gain.value = 3;
}
//sonido al chocar
function choque() {
   game.audio.volume.gain.value = 0;
   let audio = new Audio('../juegoModificadoDWeb/audio/sonido_choque.mp3');//../juegoModificadoDWeb/audio/sonido_choque.mp3
   audio.play();
   game.audio.volume.gain.value = 3;
}
game.audio = function () {
   if (game.audio.oscillator) {
      game.audio.oscillator.stop(game.audio.context.currentTime);
      game.audio.oscillator.disconnect(game.audio.volume);
      delete game.audio.oscillator;
   }
   game.audio.context = new AudioContext();
   game.audio.volume = game.audio.context.createGain();
   game.audio.volume.gain.value = 3;
   game.audio.volume.connect(game.audio.context.destination);
   var o = game.audio.context.createOscillator();
   o.frequency.value = 0;
   o.detune.value = 0;
   o.type = 'sine'; //'sawtooth';
   o.connect(game.audio.volume);
   o.frequency.value = 60;
   game.audio.oscillator = o;
   game.audio.oscillator.start(0);
};

//COLORS
game.colors = [
   //sky //terrain //mountains
   ["skyblue", "#333", 1], //day
   ["#0044d0", "#333", 0.5], //afternoon
   ["#1f104f", "#333", 0.2], //night
   ["#1f104f", "#333", 0.2], //fog
   ["#170b2a", "#333", 0.2], //night
   ["skyblue", "#333", 0.3], //morning
   ["skyblue", "#333", 0.2], //snow
];
var sky = document.getElementById("sky");
var terrain = document.getElementById("terrain");
game.changeTime = function () {
   if (!frame.stop) {
      game.time++;
      if (game.time >= game.colors.length) game.time = 0;
      sky.style.background = game.colors[game.time][0];
      terrain.style.background = game.colors[game.time][1];
      mountains.style.opacity = game.colors[game.time][2];
      /* if (game.time == 3 || game.time == 4) fog.toggle();
      if (game.time == 2 || game.time == 4) {
        cars.classList.add("night");
      } else {
        cars.classList.remove("night");
      } */
      game.timeCount = setTimeout(game.changeTime, 30000);
   }
};
//FOG
/*
var fog = document.getElementById('fog');
fog.init = function () {
  fog.value = 0.02;
  fog.status = false;  
};
fog.toggle = function () {
  fog.classList.toggle('hidden');  
  fog.status = !fog.status;
  fog.value = fog.status ? 0.1 : 0.02;  
};
*/

function win(){
   if (car.position <= 0) {
      game.audio.oscillator.stop();
      alert('Ganaste!');
      car.position = 200;
      location.reload();
   }
}

//INIT
game.init();