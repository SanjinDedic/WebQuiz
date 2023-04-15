const questions = [];

document.getElementById("type").addEventListener("change", () => {
  const type = document.getElementById("type").value;
  const optionsContainer = document.getElementById("options-container");
  if (type === "multiple_choice") {
    optionsContainer.style.display = "block";
  } else {
    optionsContainer.style.display = "none";
  }
});

document.getElementById("add-question").addEventListener("click", () => {
  const id = questions.length + 1;
  const type = document.getElementById("type").value;
  const question = document.getElementById("question").value;
  const options = type === "multiple_choice" ? document.getElementById("options").value.split(",").map(option => option.trim()) : [];
  const answer = document.getElementById("answer").value;
  const points = parseInt(document.getElementById("points").value);
  const image_link = document.getElementById("image_link").value;

  questions.push({
    id,
    type,
    question,
    options,
    answer,
    points,
    image_link
  });

  updateJsonDisplay();
});

document.getElementById("download-json").addEventListener("click", () => {
  const filename = document.getElementById("filename").value || "questions.json";
  const json = JSON.stringify(questions, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
});

document.getElementById("save-json-to-cloud").addEventListener("click", saveJsonToCloud);

async function saveJsonToCloud() {
  const filename = document.getElementById("filename").value || "questions";
  const json = JSON.stringify(questions, null, 2);

  try {
    const response = await fetch("https://vccfinal.online/save_json", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        quiz_data: JSON.parse(json), // <-- Parse the JSON string before sending it
        filename: filename,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      alert(data.message);
    } else {
      const error = await response.json();
      alert(`Error: ${error.detail[0].msg}`);
    }
  } catch (error) {
    alert(`Error: ${error.message}`);
  }
}

function updateJsonDisplay() {
  const jsonDisplay = document.getElementById("json-display");
  const json = JSON.stringify(questions, null, 2);
  jsonDisplay.value = json;
}
