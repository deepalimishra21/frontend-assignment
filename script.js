const apiUrl =
  "https://raw.githubusercontent.com/saaslabsco/frontend-assignment/refs/heads/master/frontend-assignment.json";

const itemsPerPage = 5;
let currentPage = 1;
let projects = [];

// fallback UI
function showFallbackUI(rows = 5) {
  const tableBody = document.querySelector("#projects-body");
  tableBody.innerHTML = "";

  for (let i = 0; i < rows; i++) {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td><div class="placeholder"></div></td>
      <td><div class="placeholder"></div></td>
      <td><div class="placeholder"></div></td>
    `;
    tableBody.appendChild(row);
  }
}

async function fetchProjects() {
  showFallbackUI();
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error("Failed to fetch data");
    projects = await response.json();
    renderTable();
    renderPagination();
  } catch (error) {
    console.error(error);
    document.querySelector(".container").innerHTML =
      "<p>Error loading data. Please try again later.</p>";
  }
}

function renderTable() {
  const tableBody = document.querySelector("#projects-body");
  tableBody.innerHTML = "";

  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const currentItems = projects.slice(start, end);

  currentItems.forEach((project, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${start + index + 1}</td>
      <td>${project["percentage.funded"] || "N/A"}</td>
      <td>${project["amt.pledged"] || "N/A"}</td>
    `;
    tableBody.appendChild(row);
  });
  const remainingRows = itemsPerPage - currentItems.length;
  for (let i = 0; i < remainingRows; i++) {
    const emptyRow = document.createElement("tr");
    emptyRow.innerHTML = `
      <td style="height: 40px;"></td>
      <td style="height: 40px;"></td>
      <td style="height: 40px;"></td>
    `;
    tableBody.appendChild(emptyRow);
  }
}

// Keyboard shortcuts for pagination
document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight") {
    // Right Arrow → Next Page
    if (currentPage < Math.ceil(projects.length / itemsPerPage)) {
      currentPage++;
      renderTable();
      renderPagination();
    }
  } else if (event.key === "ArrowLeft") {
    // Left Arrow → Previous Page
    if (currentPage > 1) {
      currentPage--;
      renderTable();
      renderPagination();
    }
  }
});

// Render pagination controls
function renderPagination() {
  const paginationDiv = document.querySelector("#pagination");
  paginationDiv.innerHTML = ""; // Clear pagination

  const totalPages = Math.ceil(projects.length / itemsPerPage);

  // Button creation
  const createButton = (text, isDisabled, isActive, onClick) => {
    const button = document.createElement("button");
    button.textContent = text;
    if (isDisabled) button.disabled = true;
    if (isActive) button.classList.add("active");
    button.addEventListener("click", onClick);
    return button;
  };

  // Previous button
  paginationDiv.appendChild(
    createButton("Previous", currentPage === 1, false, () => {
      currentPage--;
      renderTable();
      renderPagination();
    })
  );

  // Page buttons with ellipsis
  if (totalPages <= 5) {
    // Show all pages if <= 5
    for (let i = 1; i <= totalPages; i++) {
      paginationDiv.appendChild(
        createButton(i, false, currentPage === i, () => {
          currentPage = i;
          renderTable();
          renderPagination();
        })
      );
    }
  } else {
    // Show limited pages with ellipsis
    if (currentPage > 2) {
      paginationDiv.appendChild(
        createButton(1, false, false, () => {
          currentPage = 1;
          renderTable();
          renderPagination();
        })
      );
      if (currentPage > 3) {
        const dots = document.createElement("button");
        dots.classList.add("dots");
        dots.textContent = "...";
        paginationDiv.appendChild(dots);
      }
    }

    for (
      let i = Math.max(1, currentPage - 1);
      i <= Math.min(totalPages, currentPage + 1);
      i++
    ) {
      paginationDiv.appendChild(
        createButton(i, false, currentPage === i, () => {
          currentPage = i;
          renderTable();
          renderPagination();
        })
      );
    }

    if (currentPage < totalPages - 1) {
      if (currentPage < totalPages - 2) {
        const dots = document.createElement("button");
        dots.classList.add("dots");
        dots.textContent = "...";
        paginationDiv.appendChild(dots);
      }
      paginationDiv.appendChild(
        createButton(totalPages, false, false, () => {
          currentPage = totalPages;
          renderTable();
          renderPagination();
        })
      );
    }
  }

  // Next button
  paginationDiv.appendChild(
    createButton("Next", currentPage === totalPages, false, () => {
      currentPage++;
      renderTable();
      renderPagination();
    })
  );
}

// Initial call
fetchProjects();
