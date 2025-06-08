function generateInputs() {
  const count = parseInt(document.getElementById("courseCount").value);
  const container = document.getElementById("courseInputs");
  container.innerHTML = "";
  const form = document.getElementById("gpaForm");
  form.style.display = "block";

  for (let i = 0; i < count; i++) {
    const label = document.createElement("label");
    label.textContent = `Course ${i + 1} grade:`;
    const select = document.createElement("select");
    select.className = "grade-select";
    const grades = {
      "A+": 4.33, "A": 4.00, "A-": 3.67,
      "B+": 3.33, "B": 3.00, "B-": 2.67,
      "C+": 2.33, "C": 2.00, "C-": 1.67,
      "D": 1.00, "F": 0.00
    };
    for (const [grade, value] of Object.entries(grades)) {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = grade;
      select.appendChild(option);
    }
    container.appendChild(label);
    container.appendChild(select);
    container.appendChild(document.createElement("br"));
  }

  form.onsubmit = function(e) {
    e.preventDefault();
    calculateGPA();
  };
}

function calculateGPA() {
  const selects = document.querySelectorAll(".grade-select");
  let total = 0;
  selects.forEach(sel => {
    total += parseFloat(sel.value);
  });
  const gpa = (total / selects.length).toFixed(2);
  let message = `Your GPA is ${gpa}`;
  if (parseFloat(gpa) >= 3.75) {
    message += " – Honor Roll!";
  }
  document.getElementById("result").textContent = message;
  sendGpaToGoogleSheet(gpa);
}

function sendGpaToGoogleSheet(gpaResult) {
  fetch("https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID_HERE/exec", {
    method: "POST",
    body: JSON.stringify({ gpa: gpaResult })
  })
  .then(res => res.text())
  .then(msg => console.log("Submitted to Google Sheet:", msg))
  .catch(err => console.error("Error:", err));
}
