const addToCartButtons = document.querySelectorAll(".add-btn");
const removeFromCartButtons = document.querySelectorAll(".delete-btn");
const purchaseCartButtons = document.querySelectorAll(".submit-btn");
const deleteProductButtons = document.querySelectorAll(".delete-product-btn");
const modifyUserButtons = document.querySelectorAll(".modify-user");
const removeUsersButtons = document.querySelectorAll(".remove-user");

const addToCart = async (e) => {
  const cid = e.target.attributes["data-cart-id"].value;
  const pid = e.target.attributes["data-product-id"].value;
  try {
    const res = await fetch(`/api/v1/carts/${cid}/products/${pid}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.ok) {
      location.reload();
    }
  } catch (err) {
    console.log(err);
  }
};

const removeFromCart = async (e) => {
  const cid = e.target.attributes["data-cart-id"].value;
  const pid = e.target.attributes["data-product-id"].value;
  try {
    const res = await fetch(`/api/v1/carts/${cid}/products/${pid}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.ok) {
      location.reload();
    }
  } catch (err) {
    console.log(err);
  }
};

const confirmPurchase = async (e) => {
  const cid = e.target.attributes["data-cart-id"].value;
  const email = { email: e.target.attributes["data-user"].value };
  try {
    const res = await fetch(`/api/v1/carts/${cid}/purchase`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(email),
    });

    if (res.ok) {
      location.reload();
    }
  } catch (err) {
    console.log(err);
  }
};

const deleteProduct = async (e) => {
  const pid = e.target.attributes["data-product-id"].value;
  try {
    const res = await fetch(`/api/v1/products/${pid}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.ok) {
      location.reload();
    }
  } catch (err) {
    console.log(err);
  }
};

const modifyUser = async (e) => {
  const uid = e.target.attributes["data-user-id"].value;
  try {
    const res = await fetch(`/api/v1/users/premium/${uid}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.ok) {
      location.reload();
    }
  } catch (err) {
    console.log(err);
  }
};

const removeUsers = async (e) => {
  try {
    const res = await fetch(`/api/v1/users`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.ok) {
      location.reload();
    }
  } catch (err) {
    console.log(err);
  }
};

addToCartButtons.forEach((button) => {
  button.addEventListener("click", addToCart);
});
removeFromCartButtons.forEach((button) => {
  button.addEventListener("click", removeFromCart);
});
purchaseCartButtons.forEach((button) => {
  button.addEventListener("click", confirmPurchase);
});
deleteProductButtons.forEach((button) => {
  button.addEventListener("click", deleteProduct);
});
modifyUserButtons.forEach((button) => {
  button.addEventListener("click", modifyUser);
});
removeUsersButtons.forEach((button) => {
  button.addEventListener("click", removeUsers);
});
