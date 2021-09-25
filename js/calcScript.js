let opTracking = {
  displayValue: 0,
  operation: "",
  lastBtnPressed: "op"
};

window.onload = function() {
  addNumberListeners();
  addOperatorListeners();
  addEqualListener();
  addClearListener();
}

function add(op1, op2) {
  op1 = Number(op1);
  op2 = Number(op2);
  return roundPrecision(op1 + op2);
}

function subtract(op1, op2) {
  return roundPrecision(op1 - op2);
}

function multiply(op1, op2) {
  return roundPrecision(op1 * op2);
}

function divide(op1, op2) {
  return roundPrecision(op1/op2);
}

/**
 * roundPrecision
 * @param {number} num 
 * @returns num, unchanged if precision is <= 4 decimal places.
 *               changed to exactly precision of 4 if > 4 decimal places.
 */
function roundPrecision(num) {
  let numString = num + "";
  if(!numString.includes(".")) {
    return num;
  }
  let precision = numString.split(".")[1].length;
  if(precision > 4) {
    //parse back to float, toFixed is called on a Number
    return Number.parseFloat(numString).toFixed(4);
  }
  else {
    return num;
  }
}

function operate (operator, op1, op2) {
  switch(operator) {
    case "+":
      return add(op1, op2);
    case "-":
      return subtract(op1, op2);
    case "*":
      return multiply(op1, op2);
    case "÷": 
      return divide(op1, op2);
  }
}


/**
 * addNumberListeners()
 * Listeners for number buttons that will update the results
 * display. Affects the result display, in order to show:
 * 
 * -- value of the first operand if no operator has
 *    been entered.
 * 
 * -- value of the second operand if an operator has been entered.
 * 
 * Value of the first operand is stored in the global
 * opTracking object if an operator button is presed.
 */
function addNumberListeners() {
  let numButtons = document.querySelectorAll(".number-button");
  let numDisplay = document.querySelector("#result-display");

  numButtons.forEach((numButton) => {
    numButton.addEventListener("click", () => {
      //don't add 0's to display if it already shows 0
      if(numButton.textContent !== "0" || numDisplay.textContent !== "0") {
        if(opTracking.lastBtnPressed != "num") {
          numDisplay.textContent = numButton.textContent;
        }
        else {
          numDisplay.textContent += numButton.textContent;
        }
        opTracking.lastBtnPressed = "num";
      }
    });
  });  
}

/**
 * AddOperatorListeners()
 * Listeners for operator buttons that will update the calculation
 * display. Affects the calculation display, in order to show:
 * 
 * -- value of the first operand, then the operator pressed
 */
function addOperatorListeners() {
  let opButtons = document.querySelectorAll(".op-button");
  let calcDisplay = document.querySelector("#calc-display");
  let numDisplay = document.querySelector("#result-display");
  opButtons.forEach((opButton) => {
    opButton.addEventListener("click", () => {
      //if there are enough operands to do a calculation when operator
      //is pressed
      if(opTracking.lastBtnPressed == "num" && opTracking.operation != "") {
        let result = operate(opTracking.operation, opTracking.displayValue,
          numDisplay.textContent);
        numDisplay.textContent = result;
        calcDisplay.textContent = `${result} ${opButton.textContent}`;
        opTracking.displayValue = result;
      }
      else {
        //store value of first operand
        opTracking.displayValue = numDisplay.textContent;
        calcDisplay.textContent = `${opTracking.displayValue} 
        ${opButton.textContent}`;
      }

      opTracking.lastBtnPressed = "op";
      opTracking.operation = opButton.textContent;
    });
  });
}

/**
 * addEqualListener()
 * Listener for equal button updates the calculation display with the
 * calculation, and the results display with the result.
 * 
 * Pressing Equals repeatedly intentionally results in the last operation
 * pressed being repeated on the previous first operand and the result of
 * the last calculation.
 */
function addEqualListener() {
  let equalButton = document.querySelector("#equal-button");
  let calcDisplay = document.querySelector("#calc-display");
  let numDisplay = document.querySelector("#result-display");
  equalButton.addEventListener("click", () => {
    let result = operate(opTracking.operation, opTracking.displayValue, 
      numDisplay.textContent);

    //undefined at start when no operations entered
    if(result == undefined) {
      calcDisplay.textContent = `${numDisplay.textContent} =`
    }
    //if last operation was equal, use previous result in display for
    //calculation with prior result/operator and saved operand.
    else {
      if(opTracking.lastBtnPressed === "eq") {
        calcDisplay.textContent = `${numDisplay.textContent} 
        ${opTracking.operation} ${opTracking.displayValue} = `
        //console.log(`display Value: ${opTracking.displayValue}`);
      }
      //add second operator and equals sign to calculation display
      else {
        calcDisplay.textContent += ` ${numDisplay.textContent} =`;
        opTracking.displayValue = numDisplay.textContent;
      }
      numDisplay.textContent = result;
    }
    opTracking.lastBtnPressed = "eq";
  });
}

function addClearListener() {
  let clearButton = document.querySelector("#clear-button");
  let calcDisplay = document.querySelector("#calc-display");
  let numDisplay = document.querySelector("#result-display")
  clearButton.addEventListener("click", () => {
    opTracking = {
      displayValue: 0,
      operation: "",
      lastBtnPressed: "op"
    };
    calcDisplay.textContent = "";
    numDisplay.textContent = 0;
  })
}