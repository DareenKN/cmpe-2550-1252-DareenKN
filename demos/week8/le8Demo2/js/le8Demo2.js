let selectElement;

onload = () => {
    selectElement = document.querySelector("[name=LetterGrade]")
    selectElement.onchange = displayGradeMessage
    // selectElement.onchange = displayScholarshipMessage
    document.querySelector("#button1").onclick = displayScholarshipMessage
}


function displayGradeMessage() {
    let message;
    switch (this.value) {
        case 'A': message = 'Well Above Average';
            break;
        case 'B': message = 'Above Average';
            break;
        case 'C': message = 'Average';
            break;
        case 'D': message = 'Below Average';
            break;
        case 'F': message = 'Failing';
            break;
        default: message = 'Invalid Grade';
            break;
    }
    document.querySelector("[name=gradeMessage]").innerHTML = message;
}


function displayScholarshipMessage() {
    let message;
    switch (selectElement.value) {
        case 'A':
        case 'B': message = 'Scholarship Approved';
            break;
        case 'C': message = 'Application Requires Review';
            break;
        case 'D':
        case 'F': message = 'Scholarship Not Approved';
            break;
        default: message = 'Invalid Grade';
            break;
    }
    document.querySelector("[name=scholarshipMessage]").innerHTML = message;
}