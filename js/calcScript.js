window.onload = function () {
  init();
}

function init() {
  let opTracking = {
    savedOperand: 0,
    operation: "",
    lastBtnPressed: "op"
  };

  const MAX_PRECISION = 4;

  const opButtons = document.querySelectorAll(".op-button");
  const numButtons = document.querySelectorAll(".number-button");
  const equalButton = document.querySelector("#equal-button");
  const decimalButton = document.querySelector("#decimal-button");
  const clearButton = document.querySelector("#clear-button");
  const deleteButton = document.querySelector("#delete-button");
  const signButton = document.querySelector("#sign-button");


  numButtons.forEach((numButton) => {
    numButton.addEventListener("click", handleNumberInput);
  });
  opButtons.forEach((opButton) => {
    opButton.addEventListener("click", handleOpInput);
  });
  equalButton.addEventListener("click", handleEqualInput);
  decimalButton.addEventListener("click", handleDecimalInput);
  deleteButton.addEventListener("click", handleDelete);
  clearButton.addEventListener("click", handleClear);
  signButton.addEventListener("click", handleSignInput);

  document.addEventListener("keydown", parseKeyInput);


  function add(op1, op2) {
    //prevent string concatenation
    op1 = Number(op1);
    op2 = Number(op2);
    return roundPrecision(op1 + op2, MAX_PRECISION);
  }

  function subtract(op1, op2) {
    return roundPrecision(op1 - op2, MAX_PRECISION);
  }

  function multiply(op1, op2) {
    return roundPrecision(op1 * op2, MAX_PRECISION);
  }

  function divide(op1, op2) {
    return roundPrecision(op1 / op2, MAX_PRECISION);
  }

  /**
   * roundPrecision
   * @param {number} num 
   * @returns num, unchanged if precision is <=precision decimal places.
   *               changed to precision if >precision decimal places.
   */
  function roundPrecision(num, precision) {
    const numString = num + "";
    if (!numString.includes(".")) {
      return num;
    }
    const precisionOfNum = numString.split(".")[1].length;
    if (precisionOfNum > precision) {
      //outer parseFloat to remove insignificant trailing zeroes
      return parseFloat(parseFloat(numString).toFixed(4));
    }
    else {
      return num;
    }
  }


  function operate(operator, op1, op2) {
    switch (operator) {
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
   * handleNumberInput()
   * Handler for number buttons that will update the results
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
  function handleNumberInput(event) {
    let numDisplay = document.querySelector("#result-display");
    let inputNum = getInputValue(event, this.textContent);
    if (inputNum !== "0" || numDisplay.textContent !== "0") {
      if (opTracking.lastBtnPressed != "num" ||
        (opTracking.operation === "÷" && numDisplay.textContent === "0")) {
        numDisplay.textContent = inputNum;
      }
      else {
        numDisplay.textContent += inputNum;
      }
      opTracking.lastBtnPressed = "num";
    }
  }
  /**
   * HandleOpInput()
   * Handler for operation buttons that will result the calculation display
   * with the operation input, and the result display if operations are
   * chained.
   */
  function handleOpInput(event) {
    let calcDisplay = document.querySelector("#calc-display");
    let numDisplay = document.querySelector("#result-display");
    let opInput = getInputValue(event, this.textContent);

    //remove trailing zeros from operand if they exist
    numDisplay.textContent = parseFloat(numDisplay.textContent);

    //if there are enough operands to do a calculation when operator
    //is pressed
    if (opTracking.lastBtnPressed == "num" && opTracking.operation != "") {
      if (opTracking.operation === "÷" && numDisplay.textContent === "0") {
        alert("Nice try, no cataclysm for you today.");
      }
      else {
        let result = operate(opTracking.operation, opTracking.savedOperand,
          numDisplay.textContent);

        numDisplay.textContent = result;
        calcDisplay.textContent = `${result} ${opInput}`;
        opTracking.savedOperand = result;
        opTracking.lastBtnPressed = "op";
        opTracking.operation = opInput;
      }
    }
    else {
      opTracking.savedOperand = numDisplay.textContent;
      calcDisplay.textContent = `${opTracking.savedOperand} ${opInput}`;
      opTracking.lastBtnPressed = "op";
      opTracking.operation = opInput;
    }
  }


  /**
   * handleEqualInput()
   * Handler for equal button updates the calculation display with the
   * calculation, and the results display with the result.
   * 
   * Pressing Equals repeatedly intentionally results in the last operation
   * pressed being repeated on the new result.
   */
  function handleEqualInput() {
    let calcDisplay = document.querySelector("#calc-display");
    let numDisplay = document.querySelector("#result-display");
    if (opTracking.operation === "÷" && numDisplay.textContent === "0") {
      alert("Nice try, no cataclysm for you today.");
    }
    else {
      let result;
      //saved operand is second only if operator/eq are chained
      if (opTracking.lastBtnPressed === "eq") {
        result = operate(opTracking.operation, numDisplay.textContent,
          opTracking.savedOperand);
      }
      else {
        result = operate(opTracking.operation, opTracking.savedOperand,
          numDisplay.textContent);
      }
      //undefined at start when no operations entered
      if (result == undefined) {
        calcDisplay.textContent = `${numDisplay.textContent} =`
      }
      else {
        displayResultAfterEq(result);
      }
      opTracking.lastBtnPressed = "eq";
    }
  }

  function displayResultAfterEq(result) {
    let calcDisplay = document.querySelector("#calc-display");
    let numDisplay = document.querySelector("#result-display");
    if (opTracking.lastBtnPressed === "eq") {
      calcDisplay.textContent = `${numDisplay.textContent} 
      ${opTracking.operation} ${opTracking.savedOperand} = `
    }
    //add second operand and equal sign to calculation display
    else {
      calcDisplay.textContent += ` ${numDisplay.textContent} =`;
      opTracking.savedOperand = numDisplay.textContent;
    }
    numDisplay.textContent = result;
  }


  function handleDecimalInput() {
    let numDisplay = document.querySelector("#result-display");
    if (opTracking.lastBtnPressed === "op" ||
      opTracking.lastBtnPressed === "eq") {
      numDisplay.textContent = "0.";
    }
    else if (!numDisplay.textContent.includes(".")) {
      numDisplay.textContent += ".";
    }
    opTracking.lastBtnPressed = "num";
  }


  function handleClear() {
    let calcDisplay = document.querySelector("#calc-display");
    let numDisplay = document.querySelector("#result-display");
    opTracking = {
      displayValue: 0,
      operation: "",
      lastBtnPressed: "op"
    };
    calcDisplay.textContent = "";
    numDisplay.textContent = 0;
  }


  function handleDelete() {
    if (opTracking.lastBtnPressed === "num") {
      deleteDigit();
    }
    else if (opTracking.lastBtnPressed === "eq") {
      let calcDisplay = document.querySelector("#calc-display");
      calcDisplay.textContent = "";
    }
  }

  function deleteDigit() {
    let numDisplay = document.querySelector("#result-display");
    if (numDisplay.textContent.length === 1) {
      numDisplay.textContent = "0";

      //last button pressed is undone due to delete
      opTracking.lastBtnPressed = "op";
    }
    else {
      numDisplay.textContent =
        numDisplay.textContent.slice(0, numDisplay.textContent.length - 1);
    }
  }

  function handleSignInput() {
    let numDisplay = document.querySelector("#result-display");
    if (numDisplay.textContent !== "0") {
      if (numDisplay.textContent.charAt(0) === "-") {
        numDisplay.textContent = numDisplay.textContent.slice(1);
      }
      else {
        numDisplay.textContent = `-${numDisplay.textContent}`;
      }
    }
  }

  function getInputValue(event, altInput) {
    if (event.key !== undefined) {
      return event.key;
    }
    else {
      return altInput;
    }
  }

  function parseKeyInput(event) {
    let keyPressed = event.key;
    const numRegex = /[0-9]/;
    const opRegex = /[+\-*/]/;
    if (numRegex.test(keyPressed)) {
      handleNumberInput(event);
    }
    else if (opRegex.test(keyPressed)) {
      handleOpInput(event);
    }
    else if (keyPressed === ".") {
      handleDecimalInput();
    }
    else if (keyPressed === "Enter") {
      handleEqualInput();
    }
    else if (keyPressed === "Backspace") {
      handleDelete();
    }
  }
}