window.onload = function () {
  init();
}

function init() {
  let opTracking = {
    savedOperand: 0,
    operation: "",
    lastBtnPressed: "op",
    erasedCalc: ""
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
      case "/":
      case "÷":
        return divide(op1, op2);
    }
  }


  /**
   * handleNumberInput()
   * Handler for number buttons that will update the results
   * display. Updates with:
   * 
   * -- value of the first operand if no operator has
   *    been entered.
   * 
   * -- value of the second operand if an operator has been entered.
   *
   */
  function handleNumberInput(event) {
    const calcDisplay = document.querySelector("#calc-display");
    const numDisplay = document.querySelector("#result-display");
    const inputNum = getInputValue(event, this.textContent);
    const OP_REGEX = /[+\-*/]/;

    // if the input won't add leading zeroes
    if (inputNum !== "0" || numDisplay.textContent !== "0") {
      //if user already performed a calculation
      if(opTracking.lastBtnPressed === "eq" && 
      calcDisplay.textContent.match(OP_REGEX) !== null) {
        calcDisplay.textContent = "";
        numDisplay.textContent = inputNum;
      }
      else if (opTracking.lastBtnPressed != "num" ||
        (opTracking.operation === "÷" && 
        numDisplay.textContent === "0")) {
        numDisplay.textContent = inputNum;
      }
      else {
        numDisplay.textContent += inputNum;
      }
    }
    opTracking.lastBtnPressed = "num";
  }

  /**
   * HandleOpInput()
   * Handler for operation buttons that will result the calculation display
   * with the operation input, and the result display if operations are
   * chained.
   */
  function handleOpInput(event) {
    const calcDisplay = document.querySelector("#calc-display");
    const numDisplay = document.querySelector("#result-display");
    const opInput = getInputValue(event, this.textContent);

    //remove trailing zeros from operand if they exist
    numDisplay.textContent = parseFloat(numDisplay.textContent);

    //if there are enough operands to do a calculation when operator
    //is pressed
    if (opTracking.lastBtnPressed === "num" && calcDisplay.textContent !== "") {
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
    const calcDisplay = document.querySelector("#calc-display");
    const numDisplay = document.querySelector("#result-display");

    //remove trailing decimals from display if they exist
    numDisplay.textContent = parseFloat(numDisplay.textContent);

    if (opTracking.operation === "÷" && 
        numDisplay.textContent === 0) {
      alert("Nice try, no cataclysm for you today.");
    }
    else {
      let result;
      //saved operand is second only if eq/op chained
      if (opTracking.lastBtnPressed === "eq") {
        result = operate(opTracking.operation, numDisplay.textContent,
          opTracking.savedOperand);
      }
      //else saved operand is first operand
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
    const calcDisplay = document.querySelector("#calc-display");
    const numDisplay = document.querySelector("#result-display");

    if (opTracking.lastBtnPressed === "eq" || 
        calcDisplay.textContent === "") {
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
    const numDisplay = document.querySelector("#result-display");
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
    const calcDisplay = document.querySelector("#calc-display");
    const numDisplay = document.querySelector("#result-display");
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
      const calcDisplay = document.querySelector("#calc-display");
      calcDisplay.textContent = "";
    }
  }

  function deleteDigit() {
    const numDisplay = document.querySelector("#result-display");
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
    const numDisplay = document.querySelector("#result-display");
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
    const keyPressed = event.key;
    const NUM_REGEX = /[0-9]/;
    const OP_REGEX = /[+\-*/]/;
    if (NUM_REGEX.test(keyPressed)) {
      handleNumberInput(event);
    }
    else if (OP_REGEX.test(keyPressed)) {
      handleOpInput(event);
    }
    else if (keyPressed === ".") {
      handleDecimalInput();
    }
    else if (keyPressed === "Enter" || keyPressed === "=") {
      handleEqualInput();
    }
    else if (keyPressed === "Backspace") {
      handleDelete();
    }
  }
}