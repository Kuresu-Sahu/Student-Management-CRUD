const API_URL = "https://student-management-b6l4.onrender.com";
let studentsData = [];

// Fetch & display students
async function fetchStudents() {
    const res = await fetch(`${API_URL}/getall`);
    const data = await res.json();
    studentsData = data.data;
    displayStudents(studentsData);
}

// Render students to table
function displayStudents(students) {
    const tableBody = document.getElementById("studentsTable");
    tableBody.innerHTML = "";
    students.forEach(student => {
        tableBody.innerHTML += `
            <tr>
                <td>${student.name}</td>
                <td>${student.roll_no}</td>
                <td>${student.fees}</td>
                <td>${student.standard}</td>
                <td>${student.medium}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="openEditModal(${student.id})">Edit</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteStudent(${student.id})">Delete</button>
                </td>
            </tr>
        `;
    });
}

// Search function
document.getElementById("searchInput").addEventListener("input", function() {
    const term = this.value.toLowerCase();
    const filtered = studentsData.filter(s => 
        s.name.toLowerCase().includes(term) || 
        s.roll_no.toString().includes(term)
    );
    displayStudents(filtered);
});

// Open Add Modal
function openAddModal() {
    document.getElementById("modalTitle").innerText = "Add Student";
    document.getElementById("studentForm").reset();
    document.getElementById("studentId").value = "";
}

// Open Edit Modal
async function openEditModal(id) {
    const res = await fetch(`${API_URL}/get/${id}`);
    const data = await res.json();
    const student = data.studentDetails[0];

    document.getElementById("modalTitle").innerText = "Edit Student";
    document.getElementById("studentId").value = student.id;
    document.getElementById("name").value = student.name;
    document.getElementById("roll_no").value = student.roll_no;
    document.getElementById("fees").value = student.fees;
    document.getElementById("standard").value = student.standard;
    document.getElementById("medium").value = student.medium;

    new bootstrap.Modal(document.getElementById('studentModal')).show();
}

// Save (Add/Update)
document.getElementById("studentForm").addEventListener("submit", async function(e) {
    e.preventDefault();
    const id = document.getElementById("studentId").value;
    const student = {
        name: document.getElementById("name").value,
        roll_no: document.getElementById("roll_no").value,
        fees: document.getElementById("fees").value,
        standard: document.getElementById("standard").value,
        medium: document.getElementById("medium").value
    };

    if (id) {
        await fetch(`${API_URL}/update/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(student)
        });
    } else {
        await fetch(`${API_URL}/create`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(student)
        });
    }

    bootstrap.Modal.getInstance(document.getElementById('studentModal')).hide();
    fetchStudents();
});

// Delete student
async function deleteStudent(id) {
    if (confirm("Are you sure you want to delete this student?")) {
        await fetch(`${API_URL}/delete/${id}`, { method: "DELETE" });
        fetchStudents();
    }
}

// Initial load
fetchStudents();
