import { Client, Databases, Account, Query } from "https://esm.sh/appwrite";

const client = new Client();
client.setEndpoint("https://cloud.appwrite.io/v1").setProject("67def1fd000f20fb3cc7");

const databases = new Databases(client);
const account = new Account(client);

document.addEventListener("DOMContentLoaded", async function () {
    loadCart();
});

async function loadCart() {
    const cartItemsDiv = document.getElementById("cartItems");
    const totalPriceSpan = document.getElementById("totalPrice");

    if (!cartItemsDiv || !totalPriceSpan) {
        console.error("Cart container or total price element not found!");
        return;
    }

    try {
        const user = await account.get();
        const userId = user.$id;

        const cartCollectionId = "67e0002f000461e95c83"; // Ensure this is correct
        const response = await databases.listDocuments("67def33a003639079812", cartCollectionId, [
            Query.equal("userId", userId)
        ]);

        cartItemsDiv.innerHTML = "";
        let total = 0;

        if (response.documents.length === 0) {
            cartItemsDiv.innerHTML = "<p>Your cart is empty.</p>";
            totalPriceSpan.innerText = "0";
            return;
        }

        response.documents.forEach((item) => {
            total += item.price * item.quantity;

            const itemDiv = document.createElement("div");
            itemDiv.classList.add("cart-item");
            itemDiv.innerHTML = `
                <h3>${item.title} - $${item.price} (x${item.quantity})</h3>
                <img src="${item.imageUrl || 'https://via.placeholder.com/100'}" width="100">
                <button onclick="removeFromCart('${item.$id}')">Remove</button>
            `;
            cartItemsDiv.appendChild(itemDiv);
        });

        totalPriceSpan.innerText = total.toFixed(2);

    } catch (error) {
        console.error("Error loading cart:", error);
    }
}

async function removeFromCart(cartItemId) {
    try {
        const cartCollectionId = "67e0002f000461e95c83"; // Ensure this is correct
        await databases.deleteDocument("67def33a003639079812", cartCollectionId, cartItemId);
        alert("Item removed from cart!");
        loadCart(); // Refresh cart
    } catch (error) {
        console.error("Error removing item:", error);
    }
}

// ✅ Expose function globally to fix "removeFromCart is not defined" error
window.removeFromCart = removeFromCart;
