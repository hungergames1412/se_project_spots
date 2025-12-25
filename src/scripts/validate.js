export const settings = {
  formSelector: ".modal__form",
  inputSelector: ".modal__input",
  submitButtonSelector: ".modal__submit-btn",
  inactiveButtonClass: "modal__button_disabled",
  inputErrorClass: "modal__input_type_error",
  errorClass: "modal__error_visible",
};

// Show input error
export const showInputError = (formEl, inputEl, errorMsg, settings) => {
  const errorMsgEl = formEl.querySelector(`#${inputEl.id}-error`);
  errorMsgEl.textContent = errorMsg;
  inputEl.classList.add(settings.inputErrorClass);
  errorMsgEl.classList.add(settings.errorClass);
};

// Hide input error
export const hideInputError = (formEl, inputEl, settings) => {
  const errorMsgEl = formEl.querySelector(`#${inputEl.id}-error`);
  errorMsgEl.textContent = "";
  inputEl.classList.remove(settings.inputErrorClass);
  errorMsgEl.classList.remove(settings.errorClass);
};

// Check input validity
export const checkInputValidity = (formEl, inputEl, settings) => {
  if (!inputEl.validity.valid) {
    showInputError(formEl, inputEl, inputEl.validationMessage, settings);
  } else {
    hideInputError(formEl, inputEl, settings);
  }
};

// Check for invalid inputs
export const hasInvalidInput = (inputList) =>
  inputList.some((input) => !input.validity.valid);

// Disable submit button
export const disableButton = (buttonEl, settings) => {
  buttonEl.disabled = true;
  buttonEl.classList.add(settings.inactiveButtonClass);
};

// Toggle button state
export const toggleButtonState = (inputList, buttonEl, settings) => {
  if (!buttonEl) return;

  if (hasInvalidInput(inputList)) {
    disableButton(buttonEl, settings);
  } else {
    buttonEl.disabled = false;
    buttonEl.classList.remove(settings.inactiveButtonClass);
  }
};

// ✅ Reset validation (ONLY 2 PARAMS — THIS FIXES YOUR BUG)
export const resetValidation = (formEl, settings) => {
  const inputList = Array.from(formEl.querySelectorAll(settings.inputSelector));
  const buttonEl = formEl.querySelector(settings.submitButtonSelector);

  inputList.forEach((input) => hideInputError(formEl, input, settings));

  toggleButtonState(inputList, buttonEl, settings);
};

// Set listeners
const setEventListeners = (formEl, settings) => {
  const inputList = Array.from(formEl.querySelectorAll(settings.inputSelector));
  const buttonEl = formEl.querySelector(settings.submitButtonSelector);

  toggleButtonState(inputList, buttonEl, settings);

  inputList.forEach((input) => {
    input.addEventListener("input", () => {
      checkInputValidity(formEl, input, settings);
      toggleButtonState(inputList, buttonEl, settings);
    });
  });
};

// Enable validation
export const enableValidation = (settings) => {
  const formList = Array.from(document.querySelectorAll(settings.formSelector));
  formList.forEach((formEl) => setEventListeners(formEl, settings));
};
