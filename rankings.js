const rankingTable = document.getElementById("ranking-table");

// Function to update the table with fetched data
function updateTable(jsonResponse) {
  rankingTable.innerHTML = ""; // Clear the existing table content

  // Add table header
  const header = rankingTable.createTHead();
  const headerRow = header.insertRow(0);
  const headerName = headerRow.insertCell(0);
  const headerScore = headerRow.insertCell(1);
  const headerQuestions = headerRow.insertCell(2);
  headerName.innerHTML = "TEAM NAME";
  headerScore.innerHTML = "SCORE";
  headerQuestions.innerHTML = "ANSWERED QUESTIONS";

  const sortedTeams = jsonResponse.teams.sort((a, b) => b[2] - a[2]);

  sortedTeams.forEach(team => {
    const row = rankingTable.insertRow(-1);
    row.style.backgroundColor = team[4]; // Set the row background color based on the team color
    row.style.color = 'black'; // Set the row text color to black

    const nameCell = row.insertCell(0);
    nameCell.textContent = team[0];

    const scoreCell = row.insertCell(1);
    scoreCell.textContent = team[2];

    const questionsCell = row.insertCell(2);
    questionsCell.textContent = team[3];
  });
}

// Function to fetch data from the API and update the table
async function fetchDataAndUpdateTable() {
  try {
    const apiUrl = "https://vccfinal.online/get_teams_table";
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Accept": "application/json"
      }
    });
    const data = await response.json();
    console.log(data)
    updateTable(data);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

function updateCurrentTeamName() {
  const currentTeam = localStorage.getItem("currentTeam");
  const teamNameDisplay = document.getElementById("team-name-display");
  if (currentTeam) {
    teamNameDisplay.textContent = `Team: ${currentTeam}`;
  } else {
    teamNameDisplay.textContent = "No team selected";
  }
}



// Fetch data and update table every second
setInterval(() => {
  fetchDataAndUpdateTable();
  updateCurrentTeamName();
}, 1000);