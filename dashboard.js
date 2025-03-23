import { Client, Databases, Account, Storage, ID } from "https://esm.sh/appwrite";

const client = new Client();
client.setEndpoint("https://cloud.appwrite.io/v1").setProject("67def1fd000f20fb3cc7");

const databases = new Databases(client);
const account = new Account(client);

document.addEventListener("DOMContentLoaded", function () {
    checkLogin(); // Ensure user is logged in before fetching products
    fetchProducts(); // Fetch product details

    // Attach logout functionality after the DOM is fully loaded
    const logoutButton = document.getElementById("logoutButton");
    if (logoutButton) {
        logoutButton.addEventListener("click", async () => {
            try {
                await account.deleteSession("current");
                alert("Logged out successfully!");
                window.location.href = "login.html";
            } catch (error) {
                console.error("Logout error:", error);
                alert("Logout failed. Please try again.");
            }
        });
    } else {
        console.error("Logout button not found.");
    }
});

async function checkLogin() {
    try {
        const user = await account.get(); // Fetch logged-in user details
        const welcomeMessage = document.getElementById("welcomeMessage");
        if (welcomeMessage) {
            welcomeMessage.innerText = `Welcome, ${user.name}!`;
        }
    } catch (error) {
        console.error("User not logged in:", error);
        window.location.href = "login.html"; // Redirect to login page if not authenticated
    }
}

async function fetchProducts() {
    try {
        const productList = document.getElementById("productList");
        if (!productList) {
            console.error("Product list container not found.");
            return;
        }
        productList.innerHTML = "<p>Loading products...</p>";

        // Use the correct Database and Collection IDs
        const response = await databases.listDocuments("67def33a003639079812", "67def3f50018dacbe18d");
        productList.innerHTML = ""; // Clear loading message

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
            `;

            productDiv.onclick = () => {
                showDetails(product);
                highlightSelection(productDiv);
            };

            productList.appendChild(productDiv);
        });
    } catch (error) {
        console.error("Error fetching products:", error);
        const productList = document.getElementById("productList");
        if (productList) {
            productList.innerHTML = "<p>Error loading products.</p>";
        }
    }
}

function showDetails(product) {
    const details = document.getElementById("productDetails");
    if (!details) {
        console.error("Product details container not found.");
        return;
    }
    details.innerHTML = `
        <h2>${product.title}</h2>
        <p>${product.description}</p>
        <p><strong>Category:</strong> ${product.category} | <strong>Subcategory:</strong> ${product.subcategory}</p>
        <p><strong>Size:</strong> ${product.size} | <strong>Price:</strong> $${product.price}</p>
        <img src="${product.imageUrl || 'https://via.placeholder.com/200'}" width="200">
    `;
}

function highlightSelection(selectedDiv) {
    document.querySelectorAll(".product-item").forEach(div => {
        div.style.border = "none";
    });
    selectedDiv.style.border = "2px solid blue";
}
