const togglePress = (element, option) => {
  element.classList.toggle('keyboard-key-pressed', option);
  if (element.textContent === 'Win') {
    setTimeout(() => {
      element.classList.toggle('keyboard-key-pressed', false);
    }, 100);
  }
};

const isUpper = (str) => {
  if (str === str.toUpperCase()) return true;
  return false;
};

const createInputValue = (firstPart, value, secondPart) => firstPart + value + secondPart;

class Keyboard {
  constructor() {
    this.elements = {
      main: null,
      textarea: null,
      keyboard: null,
      keysCountainer: null,
      keys: [],
    };

    this.properties = {
      valueInput: '',
      capsLock: false,
      shift: false,
      language: localStorage.getItem('lang'),
    };

    this.codes = [
      'Backquote', 'Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5', 'Digit6', 'Digit7', 'Digit8', 'Digit9', 'Digit0', 'Minus', 'Equal', 'Backspace',
      'Tab', 'KeyQ', 'KeyW', 'KeyE', 'KeyR', 'KeyT', 'KeyY', 'KeyU', 'KeyI', 'KeyO', 'KeyP', 'BracketLeft', 'BracketRight', 'Delete',
      'CapsLock', 'KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyG', 'KeyH', 'KeyJ', 'KeyK', 'KeyL', 'Semicolon', 'Quote', 'Enter',
      'ShiftLeft', 'KeyZ', 'KeyX', 'KeyC', 'KeyV', 'KeyB', 'KeyN', 'KeyM', 'Comma', 'Period', 'Slash', 'ArrowUp', 'ShiftRight',
      'ControlLeft', 'MetaLeft', 'AltLeft', 'Space', 'AltRight', 'ControlRight', 'Home', 'ArrowLeft', 'ArrowDown', 'ArrowRight', 'End',
    ];

    this.firstRowShift = ['~', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+'];
    this.firstRow = ['ё', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='];
    this.codesToChange = ['BracketLeft', 'BracketRight', 'Semicolon', 'Quote', 'Comma', 'Period', 'Slash'];
    this.specificButtons = ['Tab', 'CapsLock', 'ShiftLeft', 'ControlLeft', 'MetaLeft', 'AltLeft', 'Space', 'AltRight', 'ControlRight', 'Home', 'End', 'ShiftRight', 'Enter', 'Delete', 'Backspace'];

    this.pressed = new Set();

    this.init();
  }

  init() {
    document.body.innerHTML = `<div class="note">
                                <p>App for Windows</p>
                                <p>Changing the language to LeftShift + LeftAlt keys</p>
                              </div>`;
    this.elements.main = document.createElement('div');
    this.elements.textarea = document.createElement('textarea');
    this.elements.keyboard = document.createElement('div');
    this.elements.keysCountainer = document.createElement('div');

    this.elements.main.classList.add('main');
    this.elements.keyboard.setAttribute('id', 'keyboard');
    this.elements.keysCountainer.classList.add('keyboard-buttons');

    this.elements.keysCountainer.appendChild(this.createKeys());

    this.elements.keys = this.elements.keysCountainer.querySelectorAll('.keyboard-key');

    this.elements.keyboard.appendChild(this.elements.keysCountainer);
    this.elements.main.appendChild(this.elements.textarea);
    this.elements.main.appendChild(this.elements.keyboard);

    document.body.appendChild(this.elements.main);
  }

  createKeys() {
    const fragment = document.createDocumentFragment();

    const keysLayout = this.properties.language === 'ru' ? [
      'ё', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'backspace',
      'tab', 'й', 'ц', 'у', 'к', 'е', 'н', 'г', 'ш', 'щ', 'з', 'х', 'ъ', 'delete',
      'capslock', 'ф', 'ы', 'в', 'а', 'п', 'р', 'о', 'л', 'д', 'ж', 'э', 'enter',
      'shift', 'я', 'ч', 'с', 'м', 'и', 'т', 'ь', 'б', 'ю', '.', '↑', 'rshift',
      'ctrl', 'win', 'alt', 'space', 'alt', 'ctrl', 'home', '←', '↓', '→', 'end',
    ] : [
      '`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'backspace',
      'tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', 'delete',
      'capslock', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', '\'', 'enter',
      'shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', '↑', 'rshift',
      'ctrl', 'win', 'alt', 'space', 'alt', 'ctrl', 'home', '←', '↓', '→', 'end',
    ];

    keysLayout.forEach((key, i) => {
      const keyElement = document.createElement('button');

      keyElement.classList.add('keyboard-key');
      keyElement.setAttribute('type', 'button');

      keyElement.dataset.code = this.codes[keysLayout.indexOf(key, i)];

      const lineBreak = ['backspace', 'delete', 'enter', 'rshift', 'end'].includes(key);

      switch (key) {
        case 'backspace':
          keyElement.classList.add('keyboard-key-wide');
          keyElement.innerHTML = 'Backspace';

          keyElement.addEventListener('mousedown', (event) => {
            this.elements.textarea.focus();
            event.preventDefault();
            keyElement.classList.add('keyboard-key-pressed');

            if (this.elements.textarea.selectionStart !== 0) {
              if (this.elements.textarea.selectionEnd === this.elements.textarea.selectionStart) {
                this.properties.valueInput = createInputValue(this.properties.valueInput.substring(0, this.elements.textarea.selectionStart - 1), '', this.properties.valueInput.substring(this.elements.textarea.selectionStart, this.properties.valueInput.length));
                this.oninput(key, this.elements.textarea.selectionStart - 1);
              } else {
                this.properties.valueInput = createInputValue(this.properties.valueInput.substring(0, this.elements.textarea.selectionStart), '', this.properties.valueInput.substring(this.elements.textarea.selectionEnd, this.properties.valueInput.length));
                this.oninput(key, this.elements.textarea.selectionStart);
              }
            } else this.oninput(key, this.elements.textarea.selectionStart);
          });
          break;

        case 'delete':
          keyElement.classList.add('keyboard-key-wide');
          keyElement.innerHTML = 'Delete';

          keyElement.addEventListener('mousedown', (event) => {
            this.elements.textarea.focus();
            event.preventDefault();
            keyElement.classList.add('keyboard-key-pressed');

            if (this.elements.textarea.selectionEnd === this.elements.textarea.selectionStart) {
              this.properties.valueInput = createInputValue(this.properties.valueInput.substring(0, this.elements.textarea.selectionStart), '', this.properties.valueInput.substring(this.elements.textarea.selectionStart + 1, this.properties.valueInput.length));
            } else {
              this.properties.valueInput = createInputValue(this.properties.valueInput.substring(0, this.elements.textarea.selectionStart), '', this.properties.valueInput.substring(this.elements.textarea.selectionEnd, this.properties.valueInput.length));
            }
            this.oninput(key, this.elements.textarea.selectionStart);
          });
          break;

        case 'tab':
          keyElement.classList.add('keyboard-key-wide');
          keyElement.innerHTML = 'Tab';

          keyElement.addEventListener('mousedown', (event) => {
            this.elements.textarea.focus();
            event.preventDefault();
            keyElement.classList.add('keyboard-key-pressed');
            this.properties.valueInput = `${this.properties.valueInput.substring(0, this.elements.textarea.selectionStart)}\t${this.properties.valueInput.substring(this.elements.textarea.selectionStart, this.properties.valueInput.length)}`;
            this.oninput(key, this.elements.textarea.selectionStart + 1);
          });
          break;

        case 'capslock':
          keyElement.classList.add('keyboard-key-wide');
          keyElement.innerHTML = 'CapsLock';

          keyElement.addEventListener('mousedown', () => {
            this.toggleCapsLock();
            keyElement.classList.toggle('keyboard-key-pressed', this.properties.capsLock);
          });
          break;

        case 'enter':
          keyElement.classList.add('keyboard-key-wide');
          keyElement.innerHTML = 'Enter';

          keyElement.addEventListener('mousedown', (event) => {
            this.elements.textarea.focus();
            event.preventDefault();
            keyElement.classList.add('keyboard-key-pressed');
            this.properties.valueInput = `${this.properties.valueInput.substring(0, this.elements.textarea.selectionStart)}\n${this.properties.valueInput.substring(this.elements.textarea.selectionStart, this.properties.valueInput.length)}`;
            this.oninput(key, this.elements.textarea.selectionStart + 1);
          });
          break;

        case 'space':
          keyElement.classList.add('keyboard-key-extra-wide');

          keyElement.addEventListener('mousedown', (event) => {
            this.elements.textarea.focus();
            event.preventDefault();
            keyElement.classList.add('keyboard-key-pressed');
            this.properties.valueInput = `${this.properties.valueInput.substring(0, this.elements.textarea.selectionStart)} ${this.properties.valueInput.substring(this.elements.textarea.selectionStart, this.properties.valueInput.length)}`;
            this.oninput(key, this.elements.textarea.selectionStart + 1);
          });
          break;

        case 'shift':
          keyElement.classList.add('keyboard-key-wide');
          keyElement.innerHTML = 'Shift';

          keyElement.addEventListener('mousedown', () => {
            keyElement.classList.add('keyboard-key-pressed');
            this.pressedShift();
          });

          break;

        case 'rshift':
          keyElement.classList.add('keyboard-key-wide');
          keyElement.innerHTML = 'Shift';

          keyElement.addEventListener('mousedown', () => {
            keyElement.classList.add('keyboard-key-pressed');
            this.pressedShift();
          });

          break;

        case 'home':
          keyElement.innerHTML = 'Home';

          keyElement.addEventListener('mousedown', (event) => {
            this.elements.textarea.focus();
            event.preventDefault();
            keyElement.classList.add('keyboard-key-pressed');
            this.oninput(key, 0);
          });
          break;

        case 'end':
          keyElement.innerHTML = 'End';

          keyElement.addEventListener('mousedown', (event) => {
            this.elements.textarea.focus();
            event.preventDefault();
            keyElement.classList.add('keyboard-key-pressed');
            this.oninput(key, this.properties.valueInput.length);
          });
          break;

        case 'ctrl':
          keyElement.innerHTML = 'Ctrl';

          keyElement.addEventListener('mousedown', () => {
            keyElement.classList.add('keyboard-key-pressed');
          });
          break;

        case 'win':
          keyElement.innerHTML = 'Win';

          keyElement.addEventListener('mousedown', () => {
            keyElement.classList.add('keyboard-key-pressed');
          });
          break;

        case 'alt':
          keyElement.innerHTML = 'Alt';

          keyElement.addEventListener('mousedown', () => {
            keyElement.classList.add('keyboard-key-pressed');
          });
          break;

        default:
          keyElement.textContent = key.toLowerCase();

          keyElement.addEventListener('mousedown', (event) => {
            keyElement.classList.add('keyboard-key-pressed');
            const keySymbol = this.properties.capsLock ? key.toUpperCase() : key.toLowerCase();
            this.defaultOutput(event, keySymbol, key);
          });
          break;
      }

      fragment.appendChild(keyElement);

      if (lineBreak) {
        const breakk = document.createElement('div');
        breakk.classList.add('break');
        fragment.appendChild(breakk);
      }
    });
    return fragment;
  }

  oninput(handlerName, sS) {
    this.elements.textarea.value = this.properties.valueInput;

    this.elements.textarea.selectionStart = sS;
    this.elements.textarea.selectionEnd = sS;
  }

  toggleCapsLock() {
    this.properties.capsLock = !this.properties.capsLock;
    [...this.elements.keys].map((key1) => {
      const localKey = key1;
      if (key1.textContent.length === 1) {
        if (this.properties.capsLock) {
          localKey.textContent = key1.textContent.toUpperCase();
        } else {
          localKey.textContent = key1.textContent.toLowerCase();
        }
      }
      return localKey;
    });
  }

  pressedShift() {
    this.properties.shift = true;

    if (this.properties.language === 'en') {
      this.elements.keys[this.codes.indexOf('BracketLeft')].textContent = '{';
      this.elements.keys[this.codes.indexOf('BracketRight')].textContent = '}';
      this.elements.keys[this.codes.indexOf('Semicolon')].textContent = ':';
      this.elements.keys[this.codes.indexOf('Quote')].textContent = '"';
      this.elements.keys[this.codes.indexOf('Comma')].textContent = '<';
      this.elements.keys[this.codes.indexOf('Period')].textContent = '>';
      this.elements.keys[this.codes.indexOf('Slash')].textContent = '?';
    } else this.elements.keys[this.codes.indexOf('Slash')].textContent = ',';
    if (this.firstRowShift[0] === 'ё' && this.properties.language === 'en') {
      this.firstRowShift.shift();
      this.firstRowShift.unshift('~');
    } else if (this.firstRowShift[0] === '~' && this.properties.language === 'ru') {
      this.firstRowShift.shift();
      this.firstRowShift.unshift('ё');
    }
    for (let i = 0; i < 13; i += 1) {
      this.elements.keys[i].textContent = this.firstRowShift[i];
    }
    [...this.elements.keys].map((key1) => {
      const localKey = key1;
      if (key1.textContent.length === 1) {
        if (isUpper(key1.textContent)) {
          localKey.textContent = key1.textContent.toLowerCase();
        } else localKey.textContent = key1.textContent.toUpperCase();
      }
      return localKey;
    });

    if (this.properties.capsLock) {
      this.elements.keys[0].textContent = this.elements.keys[0].textContent.toLowerCase();
    } else {
      this.elements.keys[0].textContent = this.elements.keys[0].textContent.toUpperCase();
    }
  }

  unpressedShift() {
    this.properties.shift = false;
    if (this.properties.language === 'en') {
      this.elements.keys[this.codes.indexOf('BracketLeft')].textContent = '[';
      this.elements.keys[this.codes.indexOf('BracketRight')].textContent = ']';
      this.elements.keys[this.codes.indexOf('Semicolon')].textContent = ';';
      this.elements.keys[this.codes.indexOf('Quote')].textContent = '\'';
      this.elements.keys[this.codes.indexOf('Comma')].textContent = ',';
      this.elements.keys[this.codes.indexOf('Period')].textContent = '.';
      this.elements.keys[this.codes.indexOf('Slash')].textContent = '/';
    } else this.elements.keys[this.codes.indexOf('Slash')].textContent = '.';

    if (this.firstRow[0] === 'ё' && this.properties.language === 'en') {
      this.firstRow.shift();
      this.firstRow.unshift('`');
    } else if (this.firstRow[0] === '`' && this.properties.language === 'ru') {
      this.firstRow.shift();
      this.firstRow.unshift('Ё');
    }
    for (let i = 0; i < 13; i += 1) {
      this.elements.keys[i].textContent = this.firstRow[i];
    }
    [...this.elements.keys].map((key1) => {
      const localKey = key1;
      if (key1.textContent.length === 1) {
        if (isUpper(key1.textContent)) {
          localKey.textContent = key1.textContent.toLowerCase();
        } else localKey.textContent = key1.textContent.toUpperCase();
      }
      return localKey;
    });
    if (this.properties.capsLock) {
      this.elements.keys[0].textContent = this.elements.keys[0].textContent.toUpperCase();
    } else {
      this.elements.keys[0].textContent = this.elements.keys[0].textContent.toLowerCase();
    }
  }

  defaultOutput(event, keySymbol, key) {
    this.elements.textarea.focus();
    event.preventDefault();
    const value = this.properties.valueInput;
    const firstPart = value.substring(0, this.elements.textarea.selectionStart);
    const secondPart = value.substring(this.elements.textarea.selectionStart, value.length);
    this.properties.valueInput = createInputValue(firstPart, keySymbol, secondPart);
    this.oninput(key, this.elements.textarea.selectionStart + 1);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  const keyboard = new Keyboard();

  let keysArray = keyboard.elements.keys;

  document.addEventListener('mouseup', () => {
    [...keysArray].forEach((el) => {
      if (el.textContent === 'CapsLock') {
        if (keyboard.properties.capsLock) {
          el.classList.add('keyboard-key-pressed');
        } else {
          el.classList.remove('keyboard-key-pressed');
        }
      } else {
        el.classList.remove('keyboard-key-pressed');
      }
    });
    if (keyboard.properties.shift) {
      keyboard.unpressedShift();
    }
  });

  window.addEventListener('keydown', (event) => {
    const key = event.code;
    [...keysArray]
      .filter((el) => el.dataset.code === key)
      .forEach((el) => togglePress(el, true));
    const textareaElement = keyboard.elements.textarea;
    switch (key) {
      case 'Backspace':
        textareaElement.focus();
        event.preventDefault();
        if (textareaElement.selectionStart !== 0) {
          if (textareaElement.selectionEnd === textareaElement.selectionStart) {
            keyboard.properties.valueInput = createInputValue(keyboard.properties.valueInput.substring(0, textareaElement.selectionStart - 1), '', keyboard.properties.valueInput.substring(textareaElement.selectionStart, keyboard.properties.valueInput.length));
            keyboard.oninput(key, textareaElement.selectionStart - 1);
          } else {
            keyboard.properties.valueInput = createInputValue(keyboard.properties.valueInput.substring(0, textareaElement.selectionStart), '', keyboard.properties.valueInput.substring(textareaElement.selectionEnd, keyboard.properties.valueInput.length));
            keyboard.oninput(key, textareaElement.selectionStart);
          }
        } else keyboard.oninput(key, textareaElement.selectionStart);

        break;

      case 'Delete':
        textareaElement.focus();
        event.preventDefault();
        if (textareaElement.selectionEnd === textareaElement.selectionStart) keyboard.properties.valueInput = createInputValue(keyboard.properties.valueInput.substring(0, textareaElement.selectionStart), '', keyboard.properties.valueInput.substring(textareaElement.selectionStart + 1, keyboard.properties.valueInput.length));
        else keyboard.properties.valueInput = createInputValue(keyboard.properties.valueInput.substring(0, textareaElement.selectionStart), '', keyboard.properties.valueInput.substring(textareaElement.selectionEnd, keyboard.properties.valueInput.length));
        keyboard.oninput(key, textareaElement.selectionStart);

        break;

      case 'Tab':
        textareaElement.focus();
        event.preventDefault();
        keyboard.properties.valueInput = `${keyboard.properties.valueInput.substring(0, textareaElement.selectionStart)}\t${keyboard.properties.valueInput.substring(textareaElement.selectionStart, keyboard.properties.valueInput.length)}`;
        keyboard.oninput(key, textareaElement.selectionStart + 1);
        break;

      case 'CapsLock':
        keyboard.toggleCapsLock();
        [...keysArray].find((el) => el.textContent === event.key).classList.toggle('keyboard-key-pressed', keyboard.properties.capsLock);
        break;

      case 'Enter':
        textareaElement.focus();
        event.preventDefault();
        keyboard.properties.valueInput = `${keyboard.properties.valueInput.substring(0, textareaElement.selectionStart)}\n${keyboard.properties.valueInput.substring(textareaElement.selectionStart, keyboard.properties.valueInput.length)}`;
        keyboard.oninput(key, textareaElement.selectionStart + 1);

        break;

      case 'Space':
        textareaElement.focus();
        event.preventDefault();
        keyboard.properties.valueInput = `${keyboard.properties.valueInput.substring(0, textareaElement.selectionStart)} ${keyboard.properties.valueInput.substring(textareaElement.selectionStart, keyboard.properties.valueInput.length)}`;
        keyboard.oninput(key, textareaElement.selectionStart + 1);

        break;

      case 'ShiftLeft':
        if (!event.repeat && !keyboard.properties.shift) {
          keyboard.pressed.add(event.code);
          keyboard.pressedShift();
        }
        break;

      case 'ShiftRight':
        if (!event.repeat && !keyboard.properties.shift) {
          keyboard.pressedShift();
        }
        break;

      case 'Home':
        textareaElement.focus();
        event.preventDefault();
        keyboard.oninput(key, 0);
        break;

      case 'End':
        textareaElement.focus();
        event.preventDefault();
        keyboard.oninput(key, keyboard.properties.valueInput.length);
        break;

      case 'ControlLeft':
      case 'ControRight':
        break;

      case key.includes('Meta'):
        break;

      case 'AltRight':
        event.preventDefault();
        break;

      case 'AltLeft':
        event.preventDefault();
        keyboard.pressed.add(event.code);
        break;


      default:
        if (!keyboard.specificButtons.includes(key) && keyboard.codes.includes(key)) {
          let keySymbol;
          const isUpperVar = isUpper(keysArray[keyboard.codes.indexOf(key)].textContent);
          if (keyboard.properties.capsLock && keyboard.properties.shift) {
            keySymbol = keysArray[keyboard.codes.indexOf(key)].textContent.toLowerCase();
          } else if (isUpperVar && keyboard.properties.shift) {
            if (!keyboard.properties.capsLock) {
              keySymbol = keysArray[keyboard.codes.indexOf(key)].textContent.toUpperCase();
            } else {
              keySymbol = keysArray[keyboard.codes.indexOf(key)].textContent.toLowerCase();
            }
          } else if (keyboard.properties.capsLock) {
            keySymbol = keysArray[keyboard.codes.indexOf(key)].textContent.toUpperCase();
          } else {
            keySymbol = keysArray[keyboard.codes.indexOf(key)].textContent.toLowerCase();
          }
          keyboard.defaultOutput(event, keySymbol, key);
        }

        break;
    }
  });

  window.addEventListener('keyup', (event) => {
    if (event.key === 'Shift') {
      keyboard.unpressedShift();
      [...keysArray].filter((el) => el.dataset.code.includes('Shift')).forEach((el) => togglePress(el, false));
    }
    if (event.key !== 'CapsLock') {
      [...keysArray]
        .filter((el) => el.dataset.code === event.code)
        .forEach((el) => togglePress(el, false));
    }
    if (keyboard.pressed.size === 2) {
      keyboard.properties.language = keyboard.properties.language === 'ru' ? 'en' : 'ru';
      localStorage.setItem('lang', keyboard.properties.language);
      [...keyboard.elements.keysCountainer.children].forEach((el) => el.remove());
      keyboard.elements.keysCountainer.appendChild(keyboard.createKeys());
      keyboard.elements.keys = keyboard.elements.keysCountainer.querySelectorAll('.keyboard-key');
      if (keyboard.properties.capsLock) {
        keyboard.properties.capsLock = false;
      }
      keysArray = keyboard.elements.keys;
    }
    keyboard.pressed.delete(event.code);
  });
});
