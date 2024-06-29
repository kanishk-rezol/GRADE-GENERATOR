let subjectsArray = [];
let marksArray = [];
let totalMarks = 0;
let averageMarks = 0;
let grade = '';

function createInputBoxes() {
    const number = parseInt(document.getElementById("subjects").value, 10);

    if (isNaN(number) || number <= 0) {
        alert("Please enter a valid number of subjects.");
        return;
    }

    if (number > 9) {
        alert("You can only enter up to 9 subjects.");
        return;
    }

    const container = document.getElementById("newinput");
    container.innerHTML = "";

    for (let i = 0; i < number; i++) {
        const inputDiv = document.createElement("div");
        inputDiv.className = "input-box";

        const inputBox = document.createElement("input");
        inputBox.type = "text";
        inputBox.placeholder = `Enter subject ${i + 1}`;
        inputBox.className = "subject-input";

        inputDiv.appendChild(inputBox);
        container.appendChild(inputDiv);
    }

    const storeButton = document.createElement("button");
    storeButton.textContent = "Enter Subject";
    storeButton.className = "store-button";
    storeButton.type = "button";
    storeButton.onclick = storeSubjects;

    container.appendChild(storeButton);

    document.getElementById("subjects").style.display = "none";
    document.getElementById("enter").style.display = "none";
}

function storeSubjects() {
    const inputs = document.getElementsByClassName("subject-input");

    for (let i = 0; i < inputs.length; i++) {
        if (inputs[i].value.trim() === "") {
            alert("Please enter all subjects.");
            return;
        }
    }

    subjectsArray = [];
    for (let i = 0; i < inputs.length; i++) {
        subjectsArray.push(inputs[i].value.toUpperCase());
    }

    displayStoredSubjects();
    document.getElementById("newinput").style.display = "none";
}

function displayStoredSubjects() {
    const displayContainer = document.getElementById("marks");
    displayContainer.innerHTML = "";

    for (let i = 0; i < subjectsArray.length; i++) {
        const subjectWrapper = document.createElement("div");
        subjectWrapper.className = "subject-wrapper";

        const subjectLabel = document.createElement("label");
        subjectLabel.textContent = `${subjectsArray[i]}`;
        subjectLabel.className = "subject-label";

        const subjectInput = document.createElement("input");
        subjectInput.type = "number";
        subjectInput.className = "stored-input";
        subjectInput.placeholder = "Enter marks";
        subjectInput.min = 0;
        subjectInput.max = 100;

        subjectWrapper.appendChild(subjectLabel);
        subjectWrapper.appendChild(subjectInput);
        displayContainer.appendChild(subjectWrapper);
    }

    const submitButton = document.createElement("button");
    submitButton.textContent = "Submit Marks";
    submitButton.className = "submit-button";
    submitButton.type = "button";
    submitButton.onclick = submitMarks;

    displayContainer.appendChild(submitButton);
}

function submitMarks() {
    const marksInputs = document.getElementsByClassName("stored-input");
    marksArray = [];
    totalMarks = 0;

    for (let i = 0; i < marksInputs.length; i++) {
        const mark = parseFloat(marksInputs[i].value);

        if (isNaN(mark) || mark < 0 || mark > 100) {
            alert("Please enter valid marks between 0 and 100 for all subjects.");
            return;
        }

        marksArray.push(mark);
        totalMarks += mark;
    }

    averageMarks = totalMarks / marksArray.length;

    displayResults(totalMarks, averageMarks);
}

function displayResults(total, average) {
    if (average >= 90) {
        grade = 'O';
    } else if (average >= 80) {
        grade = 'A+';
    } else if (average >= 70) {
        grade = 'A';
    } else if (average >= 60) {
        grade = 'B+';
    } else if (average >= 50) {
        grade = 'B';
    } else if (average >= 45) {
        grade = 'C';
    } else {
        grade = 'F';
    }

    const resultContainer = document.getElementById("results");
    resultContainer.innerHTML = `
        <h2>Results Summary</h2>
        <p>Total Marks: ${total}</p>
        <p>Average Marks: ${average.toFixed(2)} %</p>
        <p>Grade: ${grade} </p>
        <input type="text" id="student-name" placeholder="Enter student's name">
        <button onclick="saveResults(${total}, ${average}, '${grade}')" id="save-button">Save</button>
    `;
}

function saveResults(totalMarks, averageMarks, grade) {
    const studentName = document.getElementById("student-name").value.trim();
    if (studentName === "") {
        alert("Please enter the student's name.");
        return;
    }

    const resultData = {
        studentName,
        subjects: subjectsArray,
        marks: marksArray,
        totalMarks,
        averageMarks,
        grade
    };

    try {
        let savedData = localStorage.getItem('allResults');
        let allResults = savedData ? JSON.parse(savedData) : [];

        allResults.push(resultData);

        localStorage.setItem('allResults', JSON.stringify(allResults));

        console.log('Saved results to local storage:', resultData);
        alert("Results saved successfully!");

        document.getElementById("student-name").value = "";
        document.querySelectorAll(".stored-input").forEach(input => input.value = "");

        displayAllResults();
    } catch (error) {
        console.error('Error saving results:', error);
        alert("Failed to save results. Please try again.");
    }
}

function displayAllResults() {
    const savedData = localStorage.getItem('allResults');
    if (savedData) {
        const allResults = JSON.parse(savedData);
        const resultContainer = document.getElementById("saved-result");

        resultContainer.innerHTML = ""; 
        allResults.forEach(result => {
            const resultDiv = document.createElement("div");
            resultDiv.className = "saved-result-item";

            resultDiv.innerHTML = `
                <h3>Student Name: ${result.studentName}</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Subject Name</th>
                            <th>Marks</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${result.subjects.map((subject, index) => `
                            <tr>
                                <td>${subject}</td>
                                <td>${result.marks[index]}</td>
                            </tr>
                        `).join('')}
                        <tr>
                            <td><strong>Total Marks:</strong></td>
                            <td>${result.totalMarks}</td>
                        </tr>
                        <tr>
                            <td><strong>Average Marks:</strong></td>
                            <td>${result.averageMarks.toFixed(2)} %</td>
                        </tr>
                        <tr>
                            <td><strong>Grade:</strong></td>
                            <td>${result.grade}</td>
                        </tr>
                    </tbody>
                </table>
            `;

            resultContainer.appendChild(resultDiv);
        });
    } else {
        alert("No saved results found.");
    }
}

document.getElementById("subjects").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        createInputBoxes();
    }
});

document.getElementById("details").addEventListener("click", function() {
    const outer = document.getElementById("outer");
    const savedResult = document.getElementById("saved-result");

    outer.style.display = "none";
    savedResult.style.display = "block";

    displayAllResults();
});

document.getElementById("home").addEventListener("click", function() {
    const outer = document.getElementById("outer");
    const savedResult = document.getElementById("saved-result");

    outer.style.display = "block";
    savedResult.style.display = "none";
});

document.getElementById("delete").addEventListener("click", function() {
    localStorage.removeItem('allResults');
    const resultContainer = document.getElementById("saved-result");
    resultContainer.innerHTML = ""; 
    alert("All saved data deleted from local storage.");
});
