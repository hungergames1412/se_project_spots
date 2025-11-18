import "../index.css";
import {
  enableValidation,
  settings,
  resetValidation,
} from "./scripts/validation.js";
import Api from "../utils/api.js";
import logo from "../images/logo.svg";
import avatarPlaceholder from "../images/avatar.jpg";
import pencil from "../images/pencil.svg";
import plus from "../images/plus.svg";
import deleteIcon from "../images/delete-icon.svg";
import likeInactive from "../images/like-icon.svg";
import likeActive from "../images/like-icon-filled.svg";
import closeIcon from "../images/close.svg";

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "38759948-90c1-4207-8829-fa0727e93c8f",
    "Content-Type": "application/json",
  },
});

const cardsList = document.querySelector(".cards__list");
const cardTemplate = document.querySelector("#card-template");
const editProfileModal = document.querySelector("#edit-profile-modal");
const newPostModal = document.querySelector("#new-post-modal");
const imagePreviewModal = document.querySelector("#preview-modal");
const editProfileBtn = document.querySelector(".profile__edit-btn");
const editProfileCloseBtn = editProfileModal.querySelector(".modal__close-btn");
const profileForm = editProfileModal.querySelector(".modal__form");
const nameInput = editProfileModal.querySelector("#profile-name-input");
const jobInput = editProfileModal.querySelector("#profile-description-input");
const newPostBtn = document.querySelector(".profile__add-btn");
const newPostCloseBtn = newPostModal.querySelector(".modal__close-btn");
const newPostForm = newPostModal.querySelector(".modal__form");
const linkInput = newPostModal.querySelector("#new-post-link");
const captionInput = newPostModal.querySelector("#new-post-caption");
const imagePreviewCloseBtn = imagePreviewModal.querySelector(
  ".modal__close-btn_type_preview"
);
const profileNameEl = document.querySelector(".profile__name");
const profileDescriptionEl = document.querySelector(".profile__description");
const profileAvatarEl = document.querySelector(".profile__avatar");

document.querySelector(".header__logo").src = logo;
profileAvatarEl.src = avatarPlaceholder;
editProfileBtn.querySelector("img").src = pencil;
newPostBtn.querySelector("img").src = plus;

let selectedCard = null;
let selectedCardId = null;

function openModal(modal) {
  modal.classList.add("modal_is-opened");
  document.addEventListener("keydown", handleEscClose);
}

function closeModal(modal) {
  modal.classList.remove("modal_is-opened");
  document.removeEventListener("keydown", handleEscClose);
}

function handleEscClose(evt) {
  if (evt.key === "Escape") {
    const openedModal = document.querySelector(".modal_is-opened");
    if (openedModal) closeModal(openedModal);
  }
}

document.querySelectorAll(".modal").forEach((modal) => {
  modal.addEventListener("mousedown", (evt) => {
    if (evt.target.classList.contains("modal")) {
      closeModal(modal);
      const form = modal.querySelector(".modal__form");
      if (form) resetValidation(form, settings);
    }
  });
});

function createCardElement(data) {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);
  const cardImage = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");
  const likeButton = cardElement.querySelector(".card__like-button");
  const deleteButton = cardElement.querySelector(".card__delete-button");

  cardImage.src = data.link;
  cardImage.alt = data.name;
  cardTitle.textContent = data.name;

  likeButton.style.backgroundImage = `url(${likeInactive})`;
  if (data.isLiked) likeButton.classList.add("card__like-button_active");

  likeButton.addEventListener("click", () => {
    if (likeButton.classList.contains("card__like-button_active")) {
      api
        .dislikeCard(data._id)
        .then(() => {
          likeButton.classList.remove("card__like-button_active");
        })
        .catch(console.error);
    } else {
      api
        .likeCard(data._id)
        .then(() => {
          likeButton.classList.add("card__like-button_active");
        })
        .catch(console.error);
    }
  });

  deleteButton.style.backgroundImage = `url(${deleteIcon})`;
  deleteButton.addEventListener("click", () => {
    selectedCard = cardElement;
    selectedCardId = data._id;
    handleDeleteSubmit();
  });

  cardImage.addEventListener("click", () => {
    const modalImage = imagePreviewModal.querySelector(".modal__image");
    const modalCaption = imagePreviewModal.querySelector(".modal__caption");
    modalImage.src = data.link;
    modalImage.alt = data.name;
    modalCaption.textContent = data.name;
    openModal(imagePreviewModal);
  });

  return cardElement;
}

function handleDeleteSubmit() {
  if (!selectedCard || !selectedCardId) return;
  api
    .removeCard(selectedCardId)
    .then(() => {
      selectedCard.remove();
      selectedCard = null;
      selectedCardId = null;
    })
    .catch(console.error);
}

// Profile modal
editProfileBtn.addEventListener("click", () => {
  nameInput.value = profileNameEl.textContent;
  jobInput.value = profileDescriptionEl.textContent;
  openModal(editProfileModal);
});

editProfileCloseBtn.addEventListener("click", () => {
  closeModal(editProfileModal);
  resetValidation(profileForm, settings);
});

profileForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  const name = nameInput.value;
  const about = jobInput.value;
  profileNameEl.textContent = name;
  profileDescriptionEl.textContent = about;
  api.editUserInfo({ name, about }).catch(console.error);
  closeModal(editProfileModal);
  resetValidation(profileForm, settings);
});

// New post modal
newPostBtn.addEventListener("click", () => openModal(newPostModal));
newPostCloseBtn.addEventListener("click", () => {
  closeModal(newPostModal);
  resetValidation(newPostForm, settings);
});

newPostForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  const newCardData = { name: captionInput.value, link: linkInput.value };
  api
    .addCard(newCardData)
    .then((card) => {
      const cardEl = createCardElement(card);
      cardsList.prepend(cardEl);
    })
    .catch(console.error);
  newPostForm.reset();
  closeModal(newPostModal);
  resetValidation(newPostForm, settings);
});

imagePreviewCloseBtn.addEventListener("click", () =>
  closeModal(imagePreviewModal)
);

// Initialize user info and cards
Promise.all([api.getUserInfo(), api.getInitialCards()])
  .then(([userData, cards]) => {
    profileNameEl.textContent = userData.name;
    profileDescriptionEl.textContent = userData.about;
    profileAvatarEl.src = userData.avatar;
    cards.forEach((card) => {
      const cardEl = createCardElement(card);
      cardsList.append(cardEl);
    });
  })
  .catch(console.error);

// Enable form validation
enableValidation(settings);
