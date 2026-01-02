class Api {
  constructor({ baseUrl, headers }) {
    this._baseUrl = baseUrl;
    this._headers = headers;
  }

  getAppInfo() {
    return Promise.all([this.getUserInfo(), this.getInitialCards()]).then(
      ([user, cards]) => {
        return { user, cards };
      }
    );
  }

  _request(endpoint, options = {}) {
    const finalOptions = {
      headers: this._headers,
      ...options,
    };
    const url = `${this._baseUrl}${endpoint}`;
    return fetch(url, finalOptions).then(this._handleServerResponse);
  }

  getInitialCards() {
    return this._request("/cards");
  }

  getUserInfo() {
    return this._request("/users/me");
  }

  editUserInfo({ name, about }) {
    return this._request("/users/me", {
      method: "PATCH",
      body: JSON.stringify({
        name,
        about,
      }),
    });
  }

  editAvatarInfo(avatar) {
    return this._request("/users/me/avatar", {
      method: "PATCH",
      body: JSON.stringify({
        avatar,
      }),
    });
  }

  addNewCard({ name, link }) {
    return this._request("/cards", {
      method: "POST",
      body: JSON.stringify({ name, link }),
    });
  }

  deleteCard(id) {
    return this._request(`/cards/${id}`, {
      method: "DELETE",
    });
  }

  cardLikeStatus(id, isLiked) {
    return this._request(`/cards/${id}/likes`, {
      method: isLiked ? "DELETE" : "PUT",
    });
  }

  _handleServerResponse(res) {
    if (res.ok) {
      return res.json();
    }
  }
}

export default Api;
