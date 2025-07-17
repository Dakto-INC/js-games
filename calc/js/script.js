const calculator = document.getElementById("calculator");
const display = document.getElementById("display");
const buttonsDiv = document.getElementById("buttons");

let eggmodeA = 0;
let eggmodeB = 0;
let eggmodeC = 0;
let eggmodeD = 0;
let expr = "";
let memVal = null;
let snipHist = [];

// gonna add more buttons soon
const buttons = [
  "7", "8", "9", "+", "-", "C",
  "4", "5", "6", "*", "/", "^",
  "1", "2", "3", "(", ")", "=",
  "0", ".", "π", "e", "√", "log",
  "sin", "cos", "tan", "ln", "Frac", "Frac-Dec",
  "M+", "MR", "MC", "H"
];

// imagine it is C and it has a main void
function main() {

display.value = "";
buttons.forEach(label => {
  const btn = document.createElement("button");
  btn.textContent = label;
  btn.onclick = function() {
    handleBtn(label);
  };
  buttonsDiv.appendChild(btn);
});

}
// Handles all button presses
function handleBtn(label) {
  if (label === "C") {
    expr = "";
    display.value = "";
	  eggmodeA+=1;
  } 
  
  else if (label === "=") {
    calculate();
  } 
  
  else if (label === "Frac-Dec") {
    convertToFraction();
  } 
  
  else if (label === "M+") {
    memVal = safeEval(expr);
    display.value = `Saved: ${memVal}`;
  } 
  
  else if (label === "MR") {
    if (memVal !== null) {
      expr += memVal;
      display.value = expr;
    }
  } 
  
  else if (label === "MC") {
    memVal = null;
    display.value = "Memory cleared";
  } 
  
  else if (label === "H") {
    display.value = snipHist.slice(-3).join(" | ") || "No history";
  } 
  
  else if (label === "π") {
	  eggmodeD+=1;
    expr += Math.PI;
    display.value = expr;
  } 
  
  else if (label === "e") {
    expr += Math.E;
    display.value = expr;
  } 
  
  else if (label === "√") {
	  eggmodeC+=1;
    expr += "Math.sqrt(";
    display.value = expr;
  } 
  
  else if (label === "log") {
	  eggmodeB+=1;
    expr += "Math.log10(";
    display.value = expr;
  } 
  
  else if (label === "ln") {
    expr += "Math.log(";
    display.value = expr;
  } 
  
  else if (["sin", "cos", "tan"].includes(label)) {
    expr += `Math.${label}(`;
    display.value = expr;
  } 
  
  else if (label === "^") {
    expr += "**";  
    display.value = expr;
  } 
  
  else if (label === "Frac") {
    expr += "frac("; 
    display.value = expr;
  } 
  
  else {
    expr += label;
    display.value = expr;
  }
}

// Main calc function
function calculate() {
let sanitisexpr = expr.replace(/\s/g, "") ;
let trigged = (eggmodeA >= 4 && eggmodeB >= 8 && eggmodeC >= 10 && eggmodeD >= 20 ) ;
  if ( trigged && ( sanitisexpr === "28/08" ||sanitisexpr === "288" || sanitisexpr === "2011/08/28" || sanitisexpr === "11828") ) {
//Fr why u copied me
//Nuh uh
 qwqwashere("Dakto was here :3","dak.png"); 

  } else if ( trigged && ( sanitisexpr === "08/12" || sanitisexpr === "812" || sanitisexpr === "2006/12/08" || sanitisexpr === "6128") ) {

 qwqwashere("QwQ was here :3","qwq.png"); 

  } else if ( trigged && ( sanitisexpr === "8964" || sanitisexpr === "1989/06/04" || sanitisexpr === "06/04" || sanitisexpr === "64")) {

 qwqwashere("Tiananmen","tank.png"); 

  } else if ( trigged && ( sanitisexpr === "31/03" || sanitisexpr === "31/3") ) {

 qwqwashere("Happy Transgender Day of Visibility !!!","trans.png"); 

  
  } else if  (trigged && ( sanitisexpr === "20/11" )) {

 qwqwashere("Happy Transgender Day of Remembrance !!!","trans.png");
 } else if  (trigged && ( sanitisexpr === "09/11" | sanitisexpr === "9/11" )) {

 qwqwashere("Happy International Day Against Fascism and Antisemitism !!! Fuck off  Fascist and Antisemitist like wdxvvy !!! ","https://games.daktoinc.co.uk/calc/fkwdx.png");


  }	else {



  try {
    const res = safeEval(expr); // eval ftw
    display.value = res;
    snipHist.push(`${expr} = ${res}`);
    expr = res.toString();
  } catch (err) {
    display.value = "Error";
    expr = "";
  }
}
}

// decimal to fraction function
function convertToFraction() {
  try {
    const val = safeEval(expr);
    const f = toFraction(val);
    display.value = f;
    expr = f;
  } catch (oops) {
    display.value = "Error";
  }
}

// Fraction conversion
function toFraction(decimal) {
  let tolerance = 1.0e-6;
  let h1 = 1, h2 = 0, k1 = 0, k2 = 1;
  let b = decimal;

  do {
    let a = Math.floor(b);
    let temp = h1;
    h1 = a * h1 + h2;
    h2 = temp;

    temp = k1;
    k1 = a * k1 + k2;
    k2 = temp;

    b = 1 / (b - a);
  } while (Math.abs(decimal - h1 / k1) > decimal * tolerance);

  return h1 + "/" + k1;
}

// just a quick wrapper
function safeEval(expression) {
  return Function('"use strict"; return (' + expression + ')')();
}

function qwqwashere(a,b) {
  display.value = a;
    expr = "";
    var css = document.createElement('link');
    css.setAttribute("rel", "stylesheet");
    css.setAttribute("href", "css/egg.css");
	    (document.head || document.body).appendChild(css);

    var img = document.createElement('img');
    img.setAttribute("id", "eggimg");
    img.setAttribute("onClick", "window.location.reload()");
    img.src = "img/egg/"+ b;
      calculator.appendChild(img);
 
}

// imagine it is C and it has a main void
main();
