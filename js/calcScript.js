let opTracking = {
  displayValue: 0,
  operation: "=",
  lastBtnPressed: "op"
};

window.onload = function() {
  addNumberListeners();
  addOperatorListeners();
  addEqualListener();
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
      if(opTracking.lastBtnPressed === "op") {
        numDisplay.textContent = numButton.textContent;
      }
      else {
        numDisplay.textContent += numButton.textContent;
      }
      opTracking.lastBtnPressed = "number";
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
      //store value of first operand
      opTracking.displayValue = numDisplay.textContent;

      calcDisplay.textContent = `${opTracking.displayValue} 
      ${opButton.textContent}`;
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
  let numDisplay = document.querySelector("#result-display")
  equalButton.addEventListener("click", () => {
    let result = operate(opTracking.operation, opTracking.displayValue, 
      numDisplay.textContent);

    //add second operator and equals sign to calculation display
    calcDisplay.textContent += ` ${numDisplay.textContent} =`;
    numDisplay.textContent = result;
    opTracking.lastBtnPressed = "eq";
  });
}