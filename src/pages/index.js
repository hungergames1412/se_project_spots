// Import main CSS
import "./index.css";

// Import validation module
import {
  enableValidation,
  settings,
  resetValidation,
} from "../scripts/validation.js";

// Import images used in JS
import logo from "../images/logo.svg";
import avatar from "../images/avatar.jpg";
import pencil from "../images/pencil.svg";
import plus from "../images/plus.svg";
import deleteIcon from "../images/delete-icon.svg";
import likeInactive from "../images/like-icon.svg";
import likeActive from "../images/like-icon-filled.svg";
import close from "../images/close.svg";

// Assign static images to DOM elements
document.querySelector(".header__logo").src = logo;
document.querySelector(".profile__avatar").src = avatar;
document.querySelector(".profile__edit-btn img").src = pencil;
document.querySelector(".profile__add-btn img").src = plus;

// Initial cards data
const initialCards = [
  {
    name: "Golden Gate Bridge",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/7-photo-by-griffin-wooldridge-from-pexels.jpg",
  },
  {
    name: "Val Thorens",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
  },
  {
    name: "Restaurant terrace",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
  },
  {
    name: "An outdoor cafe",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
  },
  {
    name: "A very long bridge, over the forest and through the trees",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
  },
  {
    name: "Tunnel with morning light",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
  },
  {
    name: "Mountain house",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
  },
];

// DOM elements
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

// Open modal
function openModal(modal) {
  modal.classList.add("modal_is-opened");
  document.addEventListener("keydown", handleEscClose);
}

// Close modal
function closeModal(modal) {
  modal.classList.remove("modal_is-opened");
  document.removeEventListener("keydown", handleEscClose);
}

// Close modal on "Escape" key
function handleEscClose(evt) {
  if (evt.key === "Escape") {
    const openedModal = document.querySelector(".modal_is-opened");
    if (openedModal) closeModal(openedModal);
  }
}

// Close modal on background click & reset validation
document.querySelectorAll(".modal").forEach((modal) => {
  modal.addEventListener("mousedown", (evt) => {
    if (evt.target.classList.contains("modal")) {
      closeModal(modal);
      const form = modal.querySelector(".modal__form");
      if (form) resetValidation(form, settings);
    }
  });
});

// Profile Edit Modal
editProfileBtn.addEventListener("click", () => {
  nameInput.value = document.querySelector(".profile__name").textContent;
  jobInput.value = document.querySelector(".profile__description").textContent;
  openModal(editProfileModal);
});

editProfileCloseBtn.addEventListener("click", () => {
  closeModal(editProfileModal);
  resetValidation(profileForm, settings);
});

profileForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  document.querySelector(".profile__name").textContent = nameInput.value;
  document.querySelector(".profile__description").textContent = jobInput.value;
  closeModal(editProfileModal);
  resetValidation(profileForm, settings);
});

// New Post Modal
newPostBtn.addEventListener("click", () => openModal(newPostModal));

newPostCloseBtn.addEventListener("click", () => {
  closeModal(newPostModal);
  resetValidation(newPostForm, settings);
});

newPostForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  const newCardData = { name: captionInput.value, link: linkInput.value };
  const cardElement = getCardElement(newCardData);
  cardsList.prepend(cardElement);
  newPostForm.reset();
  closeModal(newPostModal);
  resetValidation(newPostForm, settings);
});

// Image preview modal
imagePreviewCloseBtn.addEventListener("click", () =>
  closeModal(imagePreviewModal)
);

// Create card element
function getCardElement(data) {
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
  likeButton.addEventListener("click", () => {
    likeButton.classList.toggle("card__like-button_active");
  });

  deleteButton.style.backgroundImage = `url(${deleteIcon})`;
  deleteButton.addEventListener("click", () => cardElement.remove());

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

// Render initial cards
initialCards.forEach((item) => {
  const cardElement = getCardElement(item);
  cardsList.append(cardElement);
});

// Enable form validation
enableValidation(settings);
