document.addEventListener("DOMContentLoaded", function () {
  const searchButton = document.getElementById("search-button");
  const usernameInput = document.getElementById("user-input");

  const statsContainer = document.querySelector(".stats-container");
  const cardStatsContainer = document.querySelector(".stats-cards");

  function validateUsername(username) {
    if (username.trim() === "") {
      alert("Username should not be empty");
      return false;
    }
    const regex = /^[a-zA-Z0-9_]{3,15}$/;
    const isMatching = regex.test(username);
    if (!isMatching) {
      alert("Invalid username");
    }
    return isMatching;
  }

  async function fetchUserDetails(username) {
    const url = `https://leetcode-stats-api.herokuapp.com/${username}`;
    try {
      console.log("Fetching data for:", username);
      searchButton.textContent = "Searching...";
      searchButton.disabled = true;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Unable to fetch User Details");
      }
      const data = await response.json();
      console.log("Logging Data:", data);
      displayUserData(data);
    } catch (error) {
      console.error(error.message);
      statsContainer.innerHTML = "<p>No data found!</p>";
    } finally {
      searchButton.textContent = "Analyze";
      searchButton.disabled = false;
    }
  }

  // Helper: sector path
  function describeSector(cx, cy, r, startAngle, endAngle) {
    const start = {
      x: cx + r * Math.cos((Math.PI / 180) * startAngle),
      y: cy + r * Math.sin((Math.PI / 180) * startAngle),
    };
    const end = {
      x: cx + r * Math.cos((Math.PI / 180) * endAngle),
      y: cy + r * Math.sin((Math.PI / 180) * endAngle),
    };

    const largeArc = endAngle - startAngle <= 180 ? 0 : 1;

    return [
      "M",
      cx,
      cy,
      "L",
      start.x,
      start.y,
      "A",
      r,
      r,
      0,
      largeArc,
      1,
      end.x,
      end.y,
      "Z",
    ].join(" ");
  }

  // Display Data
  function displayUserData(data) {
    const totalAll = data.totalQuestions;
    const solvedAll = data.totalSolved;

    const solvedEasy = data.easySolved;
    const solvedMedium = data.mediumSolved;
    const solvedHard = data.hardSolved;

    const totalEasy = data.totalEasy;
    const totalMedium = data.totalMedium;
    const totalHard = data.totalHard;

    // Percentages mapped into 33.333 slice each
    const easyPercent = (solvedEasy / totalEasy) * 33.333 || 0;
    const mediumPercent = (solvedMedium / totalMedium) * 33.333 || 0;
    const hardPercent = (solvedHard / totalHard) * 33.333 || 0;

    // update arcs
    document
      .getElementById("easy-arc")
      .setAttribute("stroke-dasharray", `${easyPercent},100`);
    document
      .getElementById("medium-arc")
      .setAttribute("stroke-dasharray", `${mediumPercent},100`);
    document
      .getElementById("hard-arc")
      .setAttribute("stroke-dasharray", `${hardPercent},100`);

    // center label
    document.getElementById(
      "overall-label"
    ).textContent = `${solvedAll} / ${totalAll}`;

    // side labels
    document.getElementById(
      "easy-label"
    ).textContent = `${solvedEasy}/${totalEasy}`;
    document.getElementById(
      "medium-label"
    ).textContent = `${solvedMedium}/${totalMedium}`;
    document.getElementById(
      "hard-label"
    ).textContent = `${solvedHard}/${totalHard}`;

    statsContainer.style.display = "block";

    // 🔹 Add back cards rendering
    const cardsData = [
      { label: "Overall Submissions", value: data.totalSolved },
      { label: "Acceptance Rate", value: data.acceptanceRate },
      { label: "Points Earned", value: data.contributionPoints },
      { label: "Ranking", value: data.ranking },
    ];

    cardStatsContainer.innerHTML = cardsData
      .map(
        (item) => `
      <div class="card">
        <h3>${item.label}</h3>
        <p>${item.value}</p>
      </div>
    `
      )
      .join("");
  }

  // Button listener
  searchButton.addEventListener("click", function () {
    const username = usernameInput.value;
    console.log("Login username:", username);
    if (validateUsername(username)) {
      fetchUserDetails(username);
    }
  });
});
