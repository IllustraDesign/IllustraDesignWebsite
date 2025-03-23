import { Client, Account, ID } from "https://esm.sh/appwrite";

const client = new Client();
client.setEndpoint("https://cloud.appwrite.io/v1").setProject("67def1fd000f20fb3cc7");

const account = new Account(client);

document.getElementById("signupForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    let phone = document.getElementById("phone").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (!name || !phone || !email || !password || !confirmPassword) {
        return alert("Please fill in all fields.");
    }

    if (password !== confirmPassword) {
        return alert("Passwords do not match!");
    }

    // Ensure phone number is in E.164 format (+CountryCode + Number)
    if (!/^\+\d{10,15}$/.test(phone)) {
        return alert("Phone number must start with '+' and be 10-15 digits long.");
    }

    try {
        // Create user
        const user = await account.create(ID.unique(), email, password, name);

        // Log in user (required for updating phone)
        await account.createEmailPasswordSession(email, password);

        // Update the official phone field (not just preferences)
        await account.updatePhone(phone, password);

        alert("Account created successfully! You can now log in.");
        window.location.href = "login.html"; 

    } catch (error) {
        console.error("Error:", error);
        alert("Error creating account: " + error.message);
    }
});
