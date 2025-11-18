// Validation settings
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
export const hasInvalidInput = (inputList) => {
  return inputList.some((input) => !input.validity.valid);
};

// Disable submit button
export const disableButton = (buttonEl, settings) => {
  buttonEl.disabled = true;
  buttonEl.classList.add(settings.inactiveButtonClass);
};

// Enable submit button
export const enableButton = (buttonEl, settings) => {
  buttonEl.disabled = false;
  buttonEl.classList.remove(settings.inactiveButtonClass);
};

// Toggle button state (enable/disable)
export const toggleButtonState = (inputList, buttonEl, settings) => {
  if (hasInvalidInput(inputList)) {
    disableButton(buttonEl, settings);
  } else {
    enableButton(buttonEl, settings);
  }
};

// Reset validation (clear errors and disable button)
export const resetValidation = (formEl, settings) => {
  const inputList = Array.from(formEl.querySelectorAll(settings.inputSelector));
  const buttonElement = formEl.querySelector(settings.submitButtonSelector);
  inputList.forEach((input) => hideInputError(formEl, input, set
