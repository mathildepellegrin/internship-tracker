const form = document.getElementById('internship-form');
const tableBody = document.querySelector('#application-table tbody');
let applications = JSON.parse(localStorage.getItem('applications')) || [];

let sortKey = null;
let sortAsc = true;

function saveApplications() {
  localStorage.setItem('applications', JSON.stringify(applications));
}

function renderTable() {
  tableBody.innerHTML = '';
  applications.forEach((app, index) => {
    const row = document.createElement('tr');

    // Regular display mode
    if (!app.isEditing) {
      row.innerHTML = `
        <td>${app.company}</td>
        <td>${app.role}</td>
        <td>${app.date}</td>
        <td>${app.status}</td>
        <td>${app.notes}</td>
        <td>
          <button onclick="editApp(${index})">Edit</button>
          <button onclick="deleteApp(${index})">Delete</button>
        </td>
      `;
    } else {
      // Editable fields mode
      row.innerHTML = `
        <td><input type="text" id="edit-company-${index}" value="${app.company}"></td>
        <td><input type="text" id="edit-role-${index}" value="${app.role}"></td>
        <td><input type="date" id="edit-date-${index}" value="${app.date}"></td>
        <td>
          <select id="edit-status-${index}">
            <option value="Applied" ${app.status === "Applied" ? "selected" : ""}>Applied</option>
            <option value="Interviewing" ${app.status === "Interviewing" ? "selected" : ""}>Interviewing</option>
            <option value="Rejected" ${app.status === "Rejected" ? "selected" : ""}>Rejected</option>
            <option value="Offer" ${app.status === "Offer" ? "selected" : ""}>Offer</option>
          </select>
        </td>
        <td><input type="text" id="edit-notes-${index}" value="${app.notes}"></td>
        <td>
          <button onclick="saveEdit(${index})">Save</button>
          <button onclick="cancelEdit(${index})">Cancel</button>
        </td>
      `;
    }

    tableBody.appendChild(row);
  });
}

function editApp(index) {
  applications[index].isEditing = true;
  renderTable();
}

function cancelEdit(index) {
  delete applications[index].isEditing;
  renderTable();
}

function saveEdit(index) {
  const updated = {
    company: document.getElementById(`edit-company-${index}`).value,
    role: document.getElementById(`edit-role-${index}`).value,
    date: document.getElementById(`edit-date-${index}`).value,
    status: document.getElementById(`edit-status-${index}`).value,
    notes: document.getElementById(`edit-notes-${index}`).value
  };

  applications[index] = updated;
  saveApplications();
  renderTable();
}

function deleteApp(index) {
  applications.splice(index, 1);
  saveApplications();
  renderTable();
}
function sortBy(key) {
  if (sortKey === key) {
    sortAsc = !sortAsc; // toggle sort direction
  } else {
    sortKey = key;
    sortAsc = true;
  }

  applications.sort((a, b) => {
    let valA = a[key].toLowerCase ? a[key].toLowerCase() : a[key];
    let valB = b[key].toLowerCase ? b[key].toLowerCase() : b[key];

    if (valA < valB) return sortAsc ? -1 : 1;
    if (valA > valB) return sortAsc ? 1 : -1;
    return 0;
  });

  renderTable();
}

form.addEventListener('submit', function (e) {
  e.preventDefault();
  const app = {
    company: document.getElementById('company').value,
    role: document.getElementById('role').value,
    date: document.getElementById('dateApplied').value,
    status: document.getElementById('status').value,
    notes: document.getElementById('notes').value
  };
  applications.push(app);
  saveApplications();
  form.reset();
  renderTable();
});

renderTable();
