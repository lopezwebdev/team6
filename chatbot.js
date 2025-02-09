const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

const responses = {
  "hello": "Hi there! How can I help you?",
  "how are you": "Where would you like to travel today?",
  "got it": "I can help you with that!",
  "bye": "Goodbye! Have a great day!"
};

sendBtn.addEventListener("click", () => {
  let input = userInput.value.toLowerCase().trim();
  displayMessage(`You: ${input}`, true);  // Display user input

  if (input.startsWith("calculate budget")) {
    let details = input.replace("calculate budget", "").trim();
    calculateBudget(details);
  } else if (input.startsWith("book destination")) {
    let location = input.replace("book destination", "").trim();
    bookDestination(location);
  } else if (input.startsWith("book hotel")) {
    let location = input.replace("book hotel", "").trim();
    bookHotel(location);
  } else {
    let response = responses[input] || "I don't understand that.";
    setTimeout(() => displayMessage(`Bot: ${response}`, false), 500);  // Display bot response
  }

  userInput.value = "";
});

function displayMessage(message, isUser) {
  let p = document.createElement("p");
  p.textContent = message;
  p.classList.add(isUser ? "user-message" : "bot-message");  // Add classes for styling
  chatBox.appendChild(p);
  chatBox.scrollTop = chatBox.scrollHeight;  // Scroll to the latest message
}

function bookDestination(location) {
  displayMessage(`Bot: Searching for ${location} in Japan on Google Maps...`, false);
  let mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location + ', Japan')}`;
  setTimeout(() => {
    displayMessage(`Bot: <a href='${mapUrl}' target='_blank'>Click here to book your destination in Japan</a>`, true);
  }, 1000);
}

function bookHotel(location) {
  displayMessage(`Bot: Searching for hotels in ${location}, Japan...`, false);
  let hotelUrl = `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(location + ', Japan')}`;
  setTimeout(() => {
    displayMessage(`Bot: <a href='${hotelUrl}' target='_blank'>Click here to book a hotel in ${location}, Japan</a>`, false);
  }, 1000);
}

function calculateBudget(details) {
  // Assuming the API requires location, number of people, and days as parameters.
  let [location, people, days] = details.split(",").map(detail => detail.trim());

  // Example API endpoint for a budget calculator (replace this with the actual API you want to use)
  const apiUrl = `https://api.example.com/budget?location=${encodeURIComponent(location)}&people=${people}&days=${days}`;

  // Call the budget calculator API
  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      // Assuming the API returns an estimated budget
      if (data && data.budget) {
        displayMessage(`Bot: Your estimated budget for a ${days}-day trip to ${location} for ${people} people is $${data.budget}.`, false);
      } else {
        displayMessage("Bot: Sorry, I couldn't calculate the budget. Please try again.", false);
      }
    })
    .catch(error => {
      console.error('Error fetching budget:', error);
      displayMessage("Bot: Something went wrong while calculating the budget. Please try again later.", false);
    });
}
