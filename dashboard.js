import { Client, Databases, Storage, ID } from "https://esm.sh/appwrite";

const client = new Client();
client.setEndpoint("https://cloud.appwrite.io/v1").setProject("67def1fd000f20fb3cc7");

const databases = new Databases(client);

async function fetchProducts() {
    try {
        // Use the correct Database and Collection IDs
        const response = await databases.listDocuments("67def33a003639079812", "67def3f50018dacbe18d");
        const productList = document.getElementById("productList");
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
            `;

            productDiv.onclick = () => {
                showDetails(product);
                highlightSelection(productDiv);
            };

            productList.appendChild(productDiv);
        });
    } catch (error) {
        console.error("Error fetching products:", error);
        document.getElementById("productList").innerHTML = "<p>Error loading products.</p>";
    }
}

function showDetails(product) {
    const details = document.getElementById("productDetails");
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

fetchProducts();
