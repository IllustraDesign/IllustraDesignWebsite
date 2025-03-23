import { Client, Account } from "https://esm.sh/appwrite";

const client = new Client();
client.setEndpoint("https://cloud.appwrite.io/v1").setProject("67def1fd000f20fb3cc7");

const account = new Account(client);

document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (!email || !password) {
        return alert("Please fill in all fields.");
    }

    try {
        // Check if there is an active session
        let session;
        try {
            session = await account.getSession("current");
        } catch {
            session = null; // No active session
        }

        if (!session) {
            // Log in the user if no active session
            await account.createEmailPasswordSession(email, password);
        }

        // Get user details (Check email verification, but proceed anyway)
        const user = await account.get();

        // if (!user.emailVerification) {
        //     alert("Your email is not verified, but you can still log in.");
        // }

        alert("Login successful!");
        window.location.href = "dashboard.html"; // Redirect to dashboard

    } catch (error) {
        console.error("Login error:", error);

        if (error.code === 400) {
            alert("Invalid email or password format.");
        } else if (error.code === 401) {
            alert("Incorrect email or password.");
        } else if (error.code === 403) {
            alert("Your account is not verified, but you can still log in.");
            window.location.href = "dashboard.html"; 
        } else {
            alert("Error logging in: " + error.message);
        }
    }
});
