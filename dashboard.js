import { Client, Databases, Account, ID, Query } from "https://esm.sh/appwrite";

const client = new Client();
client.setEndpoint("https://cloud.appwrite.io/v1").setProject("67def1fd000f20fb3cc7");

const databases = new Databases(client);
const account = new Account(client);

document.addEventListener("DOMContentLoaded", async function () {
    await checkLogin();
    await fetchProducts();
    await updateCartCount();

    document.getElementById("cartBtn")?.addEventListener("click", () => {
        window.location.href = "cart.html";
    });

    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", async () => {
            try {
                await account.deleteSession("current");
                alert("Logged out successfully!");
                window.location.href = "login.html";
            } catch (error) {
                console.error("Logout error:", error);
                alert("Logout failed. Please try again.");
            }
        });
    }
});

async function checkLogin() {
    try {
        const user = await account.get();
        document.getElementById("userName").innerText = user.name;
        localStorage.setItem("userId", user.$id);
    } catch (error) {
        console.error("User not logged in:", error);
        window.location.href = "login.html";
    }
}

async function fetchProducts() {
    try {
        const productList = document.getElementById("productList");
        productList.innerHTML = "<p>Loading products...</p>";

        const response = await databases.listDocuments("67def33a003639079812", "67def3f50018dacbe18d");
        productList.innerHTML = "";

        if (!response.documents.length) {
            productList.innerHTML = "<p>No products available.</p>";
            return;
        }

        response.documents.forEach(product => {
            const productDiv = document.createElement("div");
            productDiv.classList.add("product-item");
            productDiv.innerHTML = `
                <h3>${product.title} - $${product.price}</h3>
                <img src="${product.imageUrl || 'https://via.placeholder.com/100'}" width="100">
                <button class="addToCart" data-id="${product.$id}" data-title="${product.title}" 
                        data-price="${product.price}" data-image="${product.imageUrl || ''}">Add to Cart</button>
            `;
            productList.appendChild(productDiv);

            productDiv.addEventListener("click", () => displayProductDetails(product));
        });

        document.querySelectorAll(".addToCart").forEach(button => {
            button.addEventListener("click", (event) => {
                event.stopPropagation();
                const target = event.target;
                addToCart(
                    target.getAttribute("data-id"),
                    target.getAttribute("data-title"),
                    parseFloat(target.getAttribute("data-price")),
                    target.getAttribute("data-image")
                );
            });
        });
    } catch (error) {
        console.error("Error fetching products:", error);
        document.getElementById("productList").innerHTML = "<p>Error loading products.</p>";
    }
}

function displayProductDetails(product) {
    const productDetails = document.getElementById("productDetails");
    if (!productDetails) {
        console.error("Product details container not found.");
        return;
    }

    productDetails.innerHTML = `
        <h2>${product.title}</h2>
        <img src="${product.imageUrl || 'https://via.placeholder.com/200'}" width="200">
        <p>Price: $${product.price}</p>
        <p>Description: ${product.description || 'No description available.'}</p>
        <button class="addToCart" data-id="${product.$id}" data-title="${product.title}" 
                data-price="${product.price}" data-image="${product.imageUrl || ''}">Add to Cart</button>
    `;
    
    document.querySelector("#productDetails .addToCart").addEventListener("click", (event) => {
        event.stopPropagation();
        addToCart(product.$id, product.title, product.price, product.imageUrl || '');
    });
}

async function addToCart(productId, title, price, imageUrl) {
    try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
            alert("User not logged in. Please log in first.");
            return;
        }

        const cartResponse = await databases.listDocuments("67def33a003639079812", "67e0002f000461e95c83", [
            Query.equal("userId", userId),
            Query.equal("productId", productId)
        ]);

        if (cartResponse.documents.length > 0) {
            const cartItem = cartResponse.documents[0];
            await databases.updateDocument("67def33a003639079812", "67e0002f000461e95c83", cartItem.$id, {
                quantity: cartItem.quantity + 1
            });
        } else {
            await databases.createDocument("67def33a003639079812", "67e0002f000461e95c83", ID.unique(), {
                userId,
                productId,
                title,
                price,
                imageUrl,
                quantity: 1
            });
        }

        alert("Product added to cart!");
        updateCartCount();
    } catch (error) {
        console.error("Error adding to cart:", error);
        alert("Failed to add to cart.");
    }
}

async function updateCartCount() {
    try {
        const userId = localStorage.getItem("userId");
        if (!userId) return;

        const response = await databases.listDocuments("67def33a003639079812", "67e0002f000461e95c83", [
            Query.equal("userId", userId)
        ]);

        const cartCount = response.documents.length;
        const cartIcon = document.getElementById("cartCount");
        if (cartIcon) {
            cartIcon.innerText = cartCount;
        }
    } catch (error) {
        console.error("Error fetching cart count:", error);
    }
}

document.addEventListener("DOMContentLoaded", updateCartCount);