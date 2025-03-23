import { Client, Account } from "https://esm.sh/appwrite";

const client = new Client();
client.setEndpoint("https://cloud.appwrite.io/v1").setProject("67def1fd000f20fb3cc7");

const account = new Account(client);

document.addEventListener("DOMContentLoaded", () => {
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
    } else {
        console.error("Logout button not found.");
    }
});
