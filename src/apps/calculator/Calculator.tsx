/**
 * Calculator App
 * Basic arithmetic calculator with keyboard support
 */

import { useState, useEffect } from 'react';
import './Calculator.css';

interface CalculatorProps {
  windowId: string;
  nodeId?: string;
}

export default function Calculator({ windowId }: CalculatorProps) {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  // Handle number input
  const inputDigit = (digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  // Handle decimal point
  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  // Clear display
  const clear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  // Perform operation
  const performOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      let newValue = currentValue;

      switch (operation) {
        case '+':
          newValue = currentValue + inputValue;
          break;
        case '-':
          newValue = currentValue - inputValue;
          break;
        case '×':
          newValue = currentValue * inputValue;
          break;
        case '÷':
          newValue = inputValue !== 0 ? currentValue / inputValue : 0;
          break;
        case '%':
          newValue = currentValue % inputValue;
          break;
        default:
          break;
      }

      setDisplay(String(newValue));
      setPreviousValue(newValue);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  // Square root
  const squareRoot = () => {
    const inputValue = parseFloat(display);
    const result = Math.sqrt(inputValue);
    setDisplay(String(result));
    setWaitingForOperand(true);
  };

  // Toggle sign
  const toggleSign = () => {
    const value = parseFloat(display);
    setDisplay(String(value * -1));
  };

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Numbers
      if (e.key >= '0' && e.key <= '9') {
        inputDigit(e.key);
      }
      // Decimal
      else if (e.key === '.') {
        inputDecimal();
      }
      // Operations
      else if (e.key === '+') {
        performOperation('+');
      } else if (e.key === '-') {
        performOperation('-');
      } else if (e.key === '*') {
        performOperation('×');
      } else if (e.key === '/') {
        e.preventDefault();
        performOperation('÷');
      } else if (e.key === '%') {
        performOperation('%');
      }
      // Equals
      else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        performOperation('=');
      }
      // Clear
      else if (e.key === 'Escape' || e.key === 'c' || e.key === 'C') {
        clear();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [display, previousValue, operation, waitingForOperand]);

  return (
    <div className="calculator-app">
      {/* Display */}
      <div className="calculator-app__display">
        {display}
      </div>

      {/* Buttons Grid */}
      <div className="calculator-app__buttons">
        {/* Row 1 */}
        <button onClick={clear} className="calculator-app__button calculator-app__button--function">
          C
        </button>
        <button onClick={toggleSign} className="calculator-app__button calculator-app__button--function">
          ±
        </button>
        <button onClick={() => performOperation('%')} className="calculator-app__button calculator-app__button--function">
          %
        </button>
        <button onClick={() => performOperation('÷')} className="calculator-app__button calculator-app__button--operator">
          ÷
        </button>

        {/* Row 2 */}
        <button onClick={() => inputDigit('7')} className="calculator-app__button">
          7
        </button>
        <button onClick={() => inputDigit('8')} className="calculator-app__button">
          8
        </button>
        <button onClick={() => inputDigit('9')} className="calculator-app__button">
          9
        </button>
        <button onClick={() => performOperation('×')} className="calculator-app__button calculator-app__button--operator">
          ×
        </button>

        {/* Row 3 */}
        <button onClick={() => inputDigit('4')} className="calculator-app__button">
          4
        </button>
        <button onClick={() => inputDigit('5')} className="calculator-app__button">
          5
        </button>
        <button onClick={() => inputDigit('6')} className="calculator-app__button">
          6
        </button>
        <button onClick={() => performOperation('-')} className="calculator-app__button calculator-app__button--operator">
          -
        </button>

        {/* Row 4 */}
        <button onClick={() => inputDigit('1')} className="calculator-app__button">
          1
        </button>
        <button onClick={() => inputDigit('2')} className="calculator-app__button">
          2
        </button>
        <button onClick={() => inputDigit('3')} className="calculator-app__button">
          3
        </button>
        <button onClick={() => performOperation('+')} className="calculator-app__button calculator-app__button--operator">
          +
        </button>

        {/* Row 5 */}
        <button onClick={() => inputDigit('0')} className="calculator-app__button calculator-app__button--zero">
          0
        </button>
        <button onClick={inputDecimal} className="calculator-app__button">
          .
        </button>
        <button onClick={() => performOperation('=')} className="calculator-app__button calculator-app__button--equals">
          =
        </button>
      </div>
    </div>
  );
}
