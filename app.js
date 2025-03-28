import { Client, Databases, Storage, ID } from "https://esm.sh/appwrite";

const client = new Client();
client.setEndpoint("https://cloud.appwrite.io/v1").setProject("67def1fd000f20fb3cc7");

const databases = new Databases(client);
const storage = new Storage(client);

document.getElementById("productForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const Title = document.getElementById("title").value.trim();
    const description = document.getElementById("description").value.trim();
    const category = document.getElementById("category").value.trim();
    const subcategory = document.getElementById("subcategory").value.trim();
    const size = document.getElementById("size").value.trim();
    const price = parseInt(document.getElementById("price").value, 10); 
    const imageFile = document.getElementById("image").files[0];

    if (!imageFile) return alert("Please select an image");
    if (!Title || !description || !category || !subcategory || !size || isNaN(price) || price <= 0) {
        return alert("Please fill all fields correctly");
    }

    try {
        // Upload image to Appwrite Storage (Use correct bucket ID)
        const imageUpload = await storage.createFile("67def576003bbab396a8", ID.unique(), imageFile);

        // Generate the correct image URL
        const imageUrl = `https://cloud.appwrite.io/v1/storage/buckets/67def576003bbab396a8/files/${imageUpload.$id}/view?project=67def1fd000f20fb3cc7`;

        // Store product in Appwrite Database (Ensure correct Database & Collection ID)
        console.log({
            Title, description, category, subcategory, size, price, imageUrl
          });
          
        await databases.createDocument("67def33a003639079812", "67def3f50018dacbe18d", ID.unique(), {
            Title, description, category, subcategory, size, price, imageUrl
        });

        alert("Product added successfully!");
        document.getElementById("productForm").reset();
    } catch (error) {
        console.error("Error:", error);
        alert("Error adding product");
    }
});
