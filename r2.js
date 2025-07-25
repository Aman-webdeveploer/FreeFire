function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
}

let hasJoined = localStorage.getItem("hasJoined") === "true";
let currentTeam = { leader: null, teammates: [] };

// ---- index.html logic ----
function registerLeader() {
  const teamName = document.getElementById('teamName').value.trim();
  const leaderName = document.getElementById('leaderName').value.trim();
  const leaderUID = document.getElementById('leaderUID').value.trim();

  if (!teamName || !leaderName || !leaderUID) {
    alert("Please fill all fields");
    return;
  }

  const teamData = {
    leader: { name: leaderName, uid: leaderUID, teamName },
    teammates: [],
  };

  localStorage.setItem("team_" + teamName, JSON.stringify(teamData));

  const link = `${window.location.origin}/team.html?team=${encodeURIComponent(teamName)}`;
  document.getElementById("referralLink").value = link;
  document.getElementById("referralSection").style.display = "block";
}

// ---- team.html logic ----
if (window.location.pathname.includes("team.html")) {
  const params = new URLSearchParams(window.location.search);
  const teamName = params.get("team");

  if (teamName) {
    const stored = localStorage.getItem("team_" + teamName);
    if (stored) {
      currentTeam = JSON.parse(stored);
      displayTeamInfo();
      updateMemberList();
      checkTeamStatus();
    } else {
      document.getElementById("teamInfo").innerHTML = `<p style="color:red;">Team not found.</p>`;
      document.getElementById("joinSection").style.display = "none";
    }
  }

  function displayTeamInfo() {
    const infoDiv = document.getElementById("teamInfo");
    infoDiv.innerHTML = `
      <p><strong>Team Name:</strong> ${currentTeam.leader.teamName}</p>
      <p><strong>Leader:</strong> ${currentTeam.leader.name} (${currentTeam.leader.uid})</p>
    `;
  }

  function updateMemberList() {
    const list = document.getElementById("memberList");
    list.innerHTML = "";
    list.innerHTML += `<li>👑 ${currentTeam.leader.name} (Leader)</li>`;
    currentTeam.teammates.forEach((mate, index) => {
      list.innerHTML += `<li>🎮 ${mate.name} (${mate.uid})</li>`;
    });
  }

  function joinTeam() {
    if (hasJoined) {
      alert("You have already joined this team.");
      return;
    }

    if (currentTeam.teammates.length >= 3) {
      alert("Team is already full.");
      return;
    }

    const name = document.getElementById("mateName").value.trim();
    const uid = document.getElementById("mateUID").value.trim();

    if (!name || !uid) {
      alert("Enter name and UID.");
      return;
    }

    if (currentTeam.teammates.some(m => m.uid === uid)) {
      alert("This UID has already joined.");
      return;
    }

    currentTeam.teammates.push({ name, uid });
    localStorage.setItem("team_" + teamName, JSON.stringify(currentTeam));
    localStorage.setItem("hasJoined", "true");
    hasJoined = true;

    alert("You joined the team!");
    document.getElementById("joinSection").style.display = "none";
    updateMemberList();
    checkTeamStatus();
  }

  function checkTeamStatus() {
    if (currentTeam.teammates.length === 3) {
      const now = new Date();
      const time = now.toLocaleTimeString();
      const date = now.toLocaleDateString();
      document.getElementById("completedMsg").style.display = "block";
      document.getElementById("successMessage").textContent =
        `Team Completed Successfully on ${date} at ${time}`;
    }
  }
}
