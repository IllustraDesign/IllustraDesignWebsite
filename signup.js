import { Client, Account, ID } from "https://esm.sh/appwrite";

// Initialize Appwrite Client
const client = new Client();
client
    .setEndpoint("https://cloud.appwrite.io/v1") // API endpoint
    .setProject("67def1fd000f20fb3cc7"); // Your project ID

// Initialize Account object
const account = new Account(client);

// Logout any existing session before signup
async function logoutExistingSession() {
    try {
        await account.deleteSessions();
        console.log("✅ Existing session logged out");
    } catch (error) {
        console.warn("⚠️ No active session to log out.");
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    await logoutExistingSession(); // Ensure fresh session

    const phoneInput = document.getElementById("phone");
    if (phoneInput) {
        phoneInput.value = "+91"; // Auto-add +91 at the start
        phoneInput.setSelectionRange(phoneInput.value.length, phoneInput.value.length); // Move cursor to end

        // Prevent users from removing +91
        phoneInput.addEventListener("keydown", (event) => {
            if (phoneInput.selectionStart < 3 && (event.key === "Backspace" || event.key === "Delete")) {
                event.preventDefault();
            }
        });

        // Automatically format phone input
        phoneInput.addEventListener("input", () => enforcePhoneNumberFormat(phoneInput));
    }
});

// Function to enforce correct phone number format
function enforcePhoneNumberFormat(input) {
    input.value = "+91" + input.value.replace(/\D/g, "").slice(2);
    if (input.value.length > 13) input.value = input.value.slice(0, 13); // Ensure max length
}

document.getElementById("signupForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    let phone = document.getElementById("phone").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (!name || !phone || !email || !password || !confirmPassword) {
        return alert("❌ Please fill in all fields.");
    }

    if (password.length < 6) {
        return alert("❌ Password must be at least 6 characters long.");
    }

    if (password !== confirmPassword) {
        return alert("❌ Passwords do not match!");
    }

    // Ensure phone number contains exactly 10 digits after "+91"
    const phoneDigits = phone.replace("+91", "").trim();
    if (!/^\d{10}$/.test(phoneDigits)) {
        return alert("❌ Phone number must have exactly 10 digits.");
    }

    phone = `+91${phoneDigits}`; // Format phone correctly

    try {
        await logoutExistingSession(); // Ensure no active session

        // Create user
        const user = await account.create(ID.unique(), email, password, name);

        // Log in user
        await account.createEmailPasswordSession(email, password);

        // Update phone number
        await account.updatePhone(phone, password);

        alert("✅ Account created successfully! You can now log in.");
        window.location.href = "login.html"; // Redirect to login page

    } catch (error) {
        console.error("❌ Error:", error);
        alert(`❌ Error creating account: ${error.message}`);
    }
});

document.getElementById("signupForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent default form submission

    let loader = document.getElementById("loader");
    let button = document.querySelector("button");

    // Show loader & disable button
    loader.style.display = "block";
    button.disabled = true;
    button.style.opacity = "0.5";

    // Simulate a loading process (e.g., 2 seconds delay)
    setTimeout(function() {
        loader.style.display = "none"; // Hide loader
        button.disabled = false;
        button.style.opacity = "1";
    }, 2000); // Simulated delay (adjust as needed)
});

