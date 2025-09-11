const editProfileBtn = document.querySelector(".profile__edit-btn");
const editProfileModal = document.querySelector("#edit-profile-modal");
const editProfileCloseBtn = editProfileModal.querySelector(".modal__close-btn");
const profileNameElement = document.querySelector(".profile__name");
const profileJobElement = document.querySelector(".profile__description");
const profileFormElement = editProfileModal.querySelector(".modal__form");
const nameInput = editProfileModal.querySelector("#profile-name-input");
const jobInput = editProfileModal.querySelector("#profile-description-input");
const newPostBtn = document.querySelector(".profile__add-btn");
const newPostModal = document.querySelector("#new-post-modal");
const newPostCloseBtn = newPostModal.querySelector(".modal__close-btn");
const addCardFormElement = newPostModal.querySelector(".modal__form");
const descriptionInput = newPostModal.querySelector("#new-post-caption");
const linkInput = newPostModal.querySelector("#new-post-link");

// --- Modal helpers ---
function openModal(modal) {
  modal.classList.add("modal_is-opened");
}

function closeModal(modal) {
  modal.classList.remove("modal_is-opened");
}

// --- Edit profile modal ---
editProfileBtn.addEventListener("click", function () {
  // preload values into the form
  nameInput.value = profileNameElement.textContent;
  jobInput.value = profileJobElement.textContent;
  openModal(editProfileModal);
});

editProfileCloseBtn.addEventListener("click", function () {
  closeModal(editProfileModal);
});

function handleProfileFormSubmit(evt) {
  evt.preventDefault();
  profileNameElement.textContent = nameInput.value;
  profileJobElement.textContent = jobInput.value;
  closeModal(editProfileModal);
}

profileFormElement.addEventListener("submit", handleProfileFormSubmit);


newPostBtn.addEventListener("click", function () {
  openModal(newPostModal);
});

newPostCloseBtn.addEventListener("click", function () {
  closeModal(newPostModal);
});

function handleAddCardSubmit(evt) {
  evt.preventDefault();

  console.log("Description:", descriptionInput.value);
  console.log("Link:", linkInput.value);

  closeModal(newPostModal);
  evt.target.reset();
}

addCardFormElement.addEventListener("submit", handleAddCardSubmit);
