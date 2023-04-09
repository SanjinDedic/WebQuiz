// Initialize variables
let questions = [];
let currentQuestionIndex = 0;
let score = 0;

// Fetch questions from the local JSON file
function fetchQuestions() {
  return fetch('questions.json')
    .then((response) => response.json())
    .then((data) => {
      questions = data;
      displayQuestion();
      updateScoreDisplay();
    })
    .catch((error) => {
      console.error('Error fetching questions:', error);
    });
}

// Display the current question and its options or input field
function displayQuestion() {
  // If all questions are answered, show the result
  if (currentQuestionIndex >= questions.length) {
    showResult();
    return;
  }

  const question = questions[currentQuestionIndex];
  document.getElementById("question").innerText = question.question;

  // Show the question image if available
  const questionImage = document.getElementById("question-image");
  if (question.image_link) {
    questionImage.src = question.image_link;
    questionImage.style.display = "block";
  } else {
    questionImage.style.display = "none";
  }

  // Display multiple-choice options or short answer input based on question type
  if (question.type === 'multiple_choice') {
    document.getElementById("multiple_choice_options").classList.remove('hidden');
    document.getElementById("short_answer_input").classList.add('hidden');
    document.getElementById("option-a").innerText = question.options[0];
    document.getElementById("option-b").innerText = question.options[1];
    document.getElementById("option-c").innerText = question.options[2];
    document.getElementById("option-d").innerText = question.options[3];
  } else if (question.type === 'short_answer') {
    document.getElementById("multiple_choice_options").classList.add('hidden');
    document.getElementById("short_answer_input").classList.remove('hidden');
    document.getElementById("short_answer").value = "";
  }
}

// Check the submitted answer and update the score
async function submitAnswer() {
  const teamName = document.getElementById('team_name').value;
  const id = (currentQuestionIndex+1).toString(10);
  let answer;

  if (questions[currentQuestionIndex].type === 'multiple_choice') {
    const selectedOption = document.querySelector('input[name="option"]:checked');
    if (!selectedOption) return;
    answer = selectedOption.value;
  } else if (questions[currentQuestionIndex].type === 'short_answer') {
    answer = document.getElementById("short_answer").value.trim();
  }

  const response = await fetch('https://vccfinal.online/submit_answer', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem("access_token"),
    },
    body: JSON.stringify({ "id": id, "answer": answer, "team_name": teamName, "table": "teams" }),
  });

  const responseData = await response.json();
  console.log("Response data:", responseData);

  if (responseData.message && responseData.message.includes("Correct")) {
    console.log("Answer is correct");
    score++;
    updateScoreDisplay();
  } else {
    console.log("Answer is incorrect");
  }
  currentQuestionIndex++;
  displayQuestion();
}

// Show the final result
function showResult() {
  document.querySelector('.question-container').classList.add('hidden');
  document.getElementById("result").innerText = `Your score: ${score}/${questions.length}`;
  document.getElementById("result").classList.remove('hidden');

  setTimeout(() => {
    window.location.href = "/pages/rankings.html";
  }, 8000); // 5000ms (5 seconds) delay before redirecting
}

// Update the displayed score
function updateScoreDisplay() {
  document.getElementById("score-display").innerText = `Score: ${score}`;
}


function showQuizContainer() {
  document.getElementById("login-container").classList.add("hidden");
  document.getElementById("quiz-container").classList.remove("hidden");
  document.getElementById("team-name-display").innerText = document.getElementById("team_name").value;
}



// Login function to authenticate the user
async function login() {
  const teamName = document.getElementById("team_name").value;
  const password = document.getElementById("password").value;

  const response = await fetch("https://vccfinal.online/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ team_name: teamName, password: password }),
  });

  const responseData = await response.json();
  if (response.status === 401) {
    console.log("Login failed");
    return;
  }

  // Store the access token
  localStorage.setItem("access_token", responseData.access_token);
  console.log("Login successful");

    showQuizContainer();
}



// Fetch questions when the script is loaded
fetchQuestions();




