const background_height = 22000 // смещение фона
const rocket_translate_y = 260 // позиция ракеты
const time_update = 0.01; // время обновления кадра

document.addEventListener("DOMContentLoaded", onPageLoad); // событие при загрузке страницы
document.onkeydown = checkKey; // увеличение и уменьшение сгорания топлива
document.querySelector("#start").addEventListener("click", onStart); // событие по нажатию старт

let rocketMass = 5000; // Сухая масса ракеты (без топлива)
let fuelMass = 3000; // Масса топлива (текущая)
let fuelAndRocketMass = 0; // Общая масса
let fuelCombustionSpeed = 0; // Скорость сгорания топлива
let reactiveJetVelocity = 1200; // Скорость реактивной струи
let currentSpeed = 0; // Текущая скорость ракеты
let reactiveThrust = 0; // Реактивная тяга
let acceleration = 0; // Ускорение ракеты
let gravityAcceleration = 9.81; // Ускорение свободного падения

let timerId; // таймер
let _offsetBackground = 0; // Сдвиг фона
let _nowBackgroundPos; // текущая позиция заднего фона

function getCleanNowPos(str) { // получение смещения из свойства CSS
    str = str.substring(0, str.length - 11);
    str = str.substring(6, str.length);
    return Number(str);
}

function onPageLoad() {
    window.scrollTo(0,0); // скролл вверх страницы
    fillFields(); // заполнение полей
    document.querySelector("main").style.backgroundPositionY = `calc(${background_height * -1}px + 100vh)`; // установление позиции фона
}

function onChangeFrame() {

    _nowBackgroundPos = getCleanNowPos(document.querySelector("main").style.backgroundPositionY); // получаем позицию фона

    if (fuelMass > 0) { // если масса топлива больше 0
        fuelMass -= fuelCombustionSpeed * time_update; // убавляем ее
    }
    else {
        fuelCombustionSpeed = 0; // если меньше, то обнуляем массу топлива и скорость сгорания
        fuelMass = 0;
    }

    reactiveThrust = reactiveJetVelocity * fuelCombustionSpeed; // формула тяги (v реак. струи * v сгорания топлива)
    fuelAndRocketMass = rocketMass + fuelMass; // общая масса ракеты и топлива
    acceleration = reactiveThrust / fuelAndRocketMass - gravityAcceleration; // формула ускорения
    currentSpeed += acceleration * time_update; // изменение скорости

    if (_nowBackgroundPos >= background_height && currentSpeed < 0) { // если позиция фона ниже стандартного, и скорость меньше 0
        _nowBackgroundPos = background_height;
        _offsetBackground = 0;
        currentSpeed = 0; // обнуляем скорость
        document.querySelector("main").style.backgroundPositionY = `calc(${background_height * -1}px + 100vh)`; // установление позиции фона
    }
    else {
        _offsetBackground += (currentSpeed / 1000 * time_update) * 1000; // изменяем смещение фона для движения ракеты
    }
    
    document.querySelector("main").style.backgroundPositionY = `calc(${(background_height * -1) + _offsetBackground}px + 100vh)`;

    document.querySelector("#fuelMass").value = fuelMass.toFixed(2); // изменение значения полей
    document.querySelector("#fuelCombustionSpeed").value = fuelCombustionSpeed.toFixed(0);
    document.querySelector("#fuelAndRocketMass").value = fuelAndRocketMass.toFixed(2);
    document.querySelector("#reactiveThrust").value = (reactiveThrust / 1000).toFixed(1);
    document.querySelector("#reactiveJetVelocity").value = reactiveJetVelocity;
    document.querySelector("#gravityAcceleration").value = gravityAcceleration.toFixed(2);
    document.querySelector("#acceleration").value = acceleration.toFixed(2);
    document.querySelector("#weight").value = (fuelAndRocketMass * gravityAcceleration / 1000).toFixed(4);
    document.querySelector("#speed").value = currentSpeed.toFixed(4);
    document.querySelector("#distance").value = (background_height - _nowBackgroundPos).toFixed(1);
    
    
}

function onStart() { // когда нажимаем кнопку старт
    timerId = setInterval(onChangeFrame, time_update * 1000);
}

function fillFields() { // заполнение полей
    document.querySelector("#rocketMass").value = rocketMass;
    document.querySelector("#fuelMass").value = fuelMass;
    document.querySelector("#reactiveJetVelocity").value = reactiveJetVelocity;
    document.querySelector("#gravityAcceleration").value = gravityAcceleration;
    document.querySelector("#fuelAndRocketMass").value = fuelAndRocketMass;
}
 
function checkKey(e) { // нажатие клавиш больше, меньше
    e = e || window.event;
    if (e.keyCode == '87') { // W
        fuelCombustionSpeed++
    }
    else if (e.keyCode == '83') { // S
        if (fuelCombustionSpeed > 0) {
            fuelCombustionSpeed--
        }
    }
    document.querySelector("#fuelCombustionSpeed").value = fuelCombustionSpeed; // установить скорость сгорания топлива
}