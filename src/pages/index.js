import "../pages/index.css";
import {
  enableValidation,
  settings,
  resetValidation,
  disableButton,
} from "../scripts/validate.js";
import Api from "../utils/Api.js";
import { setButtonText } from "../utils/helpers.js";

// Profile elements
const editProfileButton = document.querySelector(".profile__edit-btn");
const editProfileModal = document.querySelector("#edit-profile-modal");
const profileFormElement = document.forms["edit-profile-form"];
const profileNameElement = document.querySelector(".profile__name");
const profileDescriptionElement = document.querySelector(
  ".profile__description"
);
const profileAvatarElement = document.querySelector(".profile__avatar");
const profileAvatarBtn = document.querySelector(".profile__avatar-btn");
const editProfileNameInput = profileFormElement.querySelector(
  "#profile-name-input"
);
const editProfileDescriptionInput = profileFormElement.querySelector(
  "#profile-description-input"
);

// Avatar form element
const avatarModal = document.querySelector("#edit-avatar-modal");
const avatarFormElement = document.forms["edit-avatar-form"];
const avatarImageInput = avatarFormElement.querySelector(
  "#profile-avatar-input"
);

// Delete form elements
const deleteModal = document.querySelector("#delete-modal");
const deleteForm = document.forms["delete-form"];
const deleteCancelBtn = deleteModal.querySelector(
  ".modal__submit-btn--cancel-btn"
);

//Card form elements
const newPostAddButton = document.querySelector(".profile__add-btn");
const newPostModal = document.querySelector("#new-post-modal");
const addCardFormElement = document.forms["new-post-form"];
const cardImageInput = addCardFormElement.querySelector("#card-image-input");
const cardCaptionInput = addCardFormElement.querySelector(
  "#card-caption-input"
);
const cardTemplate = document
  .querySelector("#card-template")
  .content.querySelector(".card");
const cardsList = document.querySelector(".cards__list");
const previewModal = document.querySelector("#preview-modal");
const previewCloseBtn = previewModal.querySelector(
  ".modal__close-btn_type_preview"
);
const previewImage = previewModal.querySelector(".modal__image");
const previewCaption = previewModal.querySelector(".modal__caption");
const closeButtons = document.querySelectorAll(".modal__close-btn");
const newPostSaveBtn = newPostModal.querySelector(".modal__submit-btn");

//Instantiate API
const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "d0ca4ba2-4613-4601-b02f-32fe10bc186f",
    "Content-Type": "application/json",
  },
});

let selectedCard;
let selectedCardId;
let currentUserId;

//Fetch initial data
api
  .getAppInfo()
  .then(({ user, cards }) => {
    currentUserId = user._id;

    profileNameElement.textContent = user.name;
    profileDescriptionElement.textContent = user.about;

    if (profileAvatarElement) {
      profileAvatarElement.src = user.avatar;
      profileAvatarElement.alt = user.name;
      closeModal(editProfileModal);
    }

    cards.forEach((cardData) => {
      const card = getCardElement(cardData);
      cardsList.appendChild(card);
    });
  })
  .catch(console.error);

function getCardElement(data) {
  if (!Array.isArray(data.likes)) {
    data.likes = [];
  }

  let cardElement = cardTemplate.cloneNode(true);

  const cardTitleEl = cardElement.querySelector(".card__title");
  cardTitleEl.textContent = data.name;
  const cardImageEl = cardElement.querySelector(".card__image");
  cardImageEl.src = data.link;
  cardImageEl.alt = data.name;

  const cardLikeBtnEl = cardElement.querySelector(".card__like-btn");

  if (data.isLiked) {
    cardLikeBtnEl.classList.add("card__like-btn_active");
  }

  cardLikeBtnEl.addEventListener("click", (evt) => {
    handleLike(evt, data._id);
  });

  const cardDeleteBtnEl = cardElement.querySelector(".card__delete-btn");
  cardDeleteBtnEl.addEventListener("click", () =>
    handleDeleteCard(cardElement, data._id)
  );

  cardImageEl.addEventListener("click", function () {
    openModal(previewModal);
    previewImage.src = data.link;
    previewImage.alt = data.name;
    previewCaption.textContent = data.name;
  });

  return cardElement;
}

function handleLike(evt, id) {
  const likeButton = evt.target;
  const isLiked = likeButton.classList.contains("card__like-btn_active");

  api
    .cardLikeStatus(id, isLiked)
    .then(() => {
      likeButton.classList.toggle("card__like-btn_active", !isLiked);
    })
    .catch((err) => {
      console.log("Error updating like status:", err);
    });
}

editProfileButton.addEventListener("click", function () {
  editProfileNameInput.value = profileNameElement.textContent;
  editProfileDescriptionInput.value = profileDescriptionElement.textContent;
  resetValidation(
    profileFormElement,
    [editProfileNameInput, editProfileDescriptionInput],
    settings
  );
  openModal(editProfileModal);
});

newPostAddButton.addEventListener("click", function () {
  openModal(newPostModal);
});

profileAvatarBtn.addEventListener("click", function () {
  openModal(avatarModal);
});

function handleProfileFormSubmit(evt) {
  evt.preventDefault();
  const submitBtn = evt.submitter;
  setButtonText(submitBtn, true);

  api
    .editUserInfo({
      name: editProfileNameInput.value,
      about: editProfileDescriptionInput.value,
    })
    .then((data) => {
      console.log(data);
      profileNameElement.textContent = data.name;
      profileDescriptionElement.textContent = data.about;
      closeModal(editProfileModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitBtn, false);
    });
}

function handleAddCardSubmit(evt) {
  evt.preventDefault();
  const submitBtn = evt.submitter;
  setButtonText(submitBtn, true);
  const inputValues = {
    name: cardCaptionInput.value,
    link: cardImageInput.value,
  };

  api
    .addNewCard(inputValues)
    .then((newCardData) => {
      renderCard(newCardData, "prepend");
      addCardFormElement.reset();
      disableButton(newPostSaveBtn, settings);
      closeModal(newPostModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitBtn, false);
    });
}

function handleAvatarSubmit(evt) {
  evt.preventDefault();
  const submitBtn = evt.submitter;
  setButtonText(submitBtn, true);

  api
    .editAvatarInfo(avatarImageInput.value)
    .then((data) => {
      profileAvatarElement.src = data.avatar;
      avatarFormElement.reset();
      disableButton(submitBtn, settings);
      closeModal(avatarModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitBtn, false);
    });
}

function handleDeleteSubmit(evt) {
  evt.preventDefault();
  const submitBtn = evt.submitter;
  setButtonText(submitBtn, true, "Delete", "Deleting...");

  api
    .deleteCard(selectedCardId)
    .then(() => {
      selectedCard.remove();
      closeModal(deleteModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitBtn, false, "Delete", "Deleting...");
    });
}

function handleDeleteCard(cardElement, cardId) {
  selectedCard = cardElement;
  selectedCardId = cardId;
  openModal(deleteModal);
}

deleteForm.addEventListener("submit", handleDeleteSubmit);

function openModal(modal) {
  modal.classList.add("modal_is-opened");
  modal.addEventListener("click", closeModalOnOverlay);
  document.addEventListener("keydown", handleEscape);
}

function closeModal(modal) {
  modal.classList.remove("modal_is-opened");
  modal.removeEventListener("click", closeModalOnOverlay);
  document.removeEventListener("keydown", handleEscape);
}

profileFormElement.addEventListener("submit", handleProfileFormSubmit);
addCardFormElement.addEventListener("submit", handleAddCardSubmit);
avatarFormElement.addEventListener("submit", handleAvatarSubmit);

function renderCard(item, method = "append") {
  const cardElement = getCardElement(item);
  cardsList[method](cardElement);
}

deleteCancelBtn.addEventListener("click", () => {
  closeModal(deleteModal);
  selectedCard = null;
  selectedCardId = null;
});

closeButtons.forEach((button) => {
  const popup = button.closest(".modal");
  button.addEventListener("click", () => closeModal(popup));
});

function closeModalOnOverlay(evt) {
  if (!evt.target.classList.contains(".modal")) {
    closeModal(evt.target);
  }
}

function handleEscape(evt) {
  if (evt.key === "Escape") {
    const openedPopup = document.querySelector(".modal_is-opened");
    closeModal(openedPopup);
  }
}

enableValidation(settings);
