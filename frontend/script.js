let applications = [];

const jobList = document.getElementById("jobList");
const addJobButton = document.getElementById("addJobButton");
const applicationForm = document.getElementById("applicationForm");
const saveApplication = document.getElementById("saveApplication");

const companyInput = document.getElementById("companyInput");
const roleInput = document.getElementById("roleInput");
const statusInput = document.getElementById("statusInput");
const dateInput = document.getElementById("dateInput");

const searchInput = document.getElementById("searchInput");

let editIndex = null;


// DISPLAY APPLICATIONS
function displayApplications(list = applications) {

    jobList.innerHTML = "";

    list.forEach((application) => {

        const index = applications.indexOf(application);

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${application.company}</td>
            <td>${application.role}</td>
            <td>${application.status}</td>
            <td>${application.date}</td>

            <td>
                <button onclick="editApplication(${index})">
                    Edit
                </button>

                <button onclick="deleteApplication(${index})">
                    Delete
                </button>
            </td>
        `;

        jobList.appendChild(row);
    });

    updateStats();
}


// UPDATE DASHBOARD NUMBERS
function updateStats() {

    document.getElementById("totalApplications").textContent =
        applications.length;

    document.getElementById("interviews").textContent =
        applications.filter(app => app.status === "Interview").length;

    document.getElementById("offers").textContent =
        applications.filter(app => app.status === "Offer").length;

    document.getElementById("rejected").textContent =
        applications.filter(app => app.status === "Rejected").length;
}


// ADD APPLICATION BUTTON
addJobButton.addEventListener("click", () => {

    editIndex = null;

    companyInput.value = "";
    roleInput.value = "";
    statusInput.value = "Applied";
    dateInput.value = "";

    applicationForm.style.display = "block";
});


// SAVE APPLICATION
saveApplication.addEventListener("click", async () => {

    const company = companyInput.value.trim();
    const role = roleInput.value.trim();
    const status = statusInput.value;
    const date = dateInput.value;

    if (!company || !role || !date) {

        alert("Please fill all fields");

        return;
    }


    // ADD NEW APPLICATION
    if (editIndex === null) {

        const response = await fetch(
            "http://localhost:5000/api/applications",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    company: company,
                    role: role,
                    status: status,
                    date: date
                })
            }
        );

        const newApplication = await response.json();

        applications.push(newApplication);

    }

    // EDIT APPLICATION
    else {

        applications[editIndex].company = company;
        applications[editIndex].role = role;
        applications[editIndex].status = status;
        applications[editIndex].date = date;
    }


    displayApplications();


    companyInput.value = "";
    roleInput.value = "";
    statusInput.value = "Applied";
    dateInput.value = "";

    applicationForm.style.display = "none";

    editIndex = null;
});


// EDIT APPLICATION
function editApplication(index) {

    const application = applications[index];

    editIndex = index;

    companyInput.value = application.company;
    roleInput.value = application.role;
    statusInput.value = application.status;
    dateInput.value = application.date;

    applicationForm.style.display = "block";
}


// DELETE APPLICATION
function deleteApplication(index) {

    applications.splice(index, 1);

    displayApplications();
}


// SEARCH
searchInput.addEventListener("input", () => {

    const searchText = searchInput.value.toLowerCase().trim();

    const filteredApplications = applications.filter(application =>

        application.company.toLowerCase().includes(searchText) ||

        application.role.toLowerCase().includes(searchText) ||

        application.status.toLowerCase().includes(searchText)

    );

    displayApplications(filteredApplications);
});


// LOAD APPLICATIONS FROM BACKEND
async function loadApplications() {

    try {

        const response = await fetch(
            "http://localhost:5000/api/applications"
        );

        applications = await response.json();

        displayApplications();

    } catch (error) {

        console.error("Could not connect to backend:", error);

        alert("Backend is not running. Please start the backend.");
    }
}


// START APPLICATION
loadApplications();


function filterApplications(status) {

    if (status === "All") {
        displayApplications(applications);
        return;
    }

    const filteredApplications = applications.filter(
        application => application.status === status
    );

    displayApplications(filteredApplications);
}