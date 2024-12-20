var draggedOff = false;

// Function to allow drop
function allowDrop(event) {
  draggedCourse.style.visibility = "hidden";
  if (placeholder === null && draggedOff) {
    placeholder = document.createElement("div");
    placeholder.className = "placeholder";
  }
  // Get the course-box or course parent element to make sure it's the correct target
  const target = event.target.closest(".course-box, .course");

  if (target) {
    event.preventDefault(); // Allow drop on valid target or its children
  } else {
    if (placeholder != null) {
      draggedOff = true;
    }
  }
}

var placeholder = null; // Placeholder element
var draggedCourse = null; // Reference to the currently dragged course

function checkSemesterPossible(semester, course) {
  var courseRes = course.getAttribute("restriction");
  if (
    courseRes === "Any" ||
    courseRes === semester.getAttribute("restriction") + " Only"
  ) {
    return true;
  } else {
    return false;
  }
}

// Function to handle the drop of the course
function drop(event) {
  event.preventDefault();

  // Find the closest course or course-box element
  const target = event.target.closest(".course-box, .course");

  if (!target) {
    draggedCourse.style.visibility = "visible";
    if (placeholder != null) {
      placeholder.remove;
      placeholder = null;
    }
    return; // If no valid target is found, exit the function
  }

  var draggedCourseId = event.dataTransfer.getData("text");
  draggedCourse = document.getElementById(draggedCourseId);

  if (placeholder && placeholder.parentNode) {
    placeholder.parentNode.replaceChild(draggedCourse, placeholder);
  }

  // Make the dragged course visible again after drop
  draggedCourse.style.visibility = "visible";
  if (placeholder != null) {
    placeholder.remove;
    placeholder = null;
  }
  // Clean up the placeholder
  // Check if the drop target is a course or a course-box
  if (event.target.classList.contains("course-box")) {
    if (checkSemesterPossible(event.target.parentNode, draggedCourse)) {
      event.target.appendChild(draggedCourse); // Append to the course-box
    } else {
      alert(
        "This course is a '" +
          draggedCourse.getAttribute("restriction") +
          "' when the semester is '" +
          event.target.parentNode.getAttribute("restriction") +
          "'!"
      );
    }
  } else if (event.target.classList.contains("course")) {
    if (
      checkSemesterPossible(event.target.parentNode.parentNode, draggedCourse)
    ) {
      // Insert the dragged course before or after the target course based on the cursor position
      const targetCourse = event.target;
      const targetRect = targetCourse.getBoundingClientRect();
      const dropPositionX = event.clientX;

      if (dropPositionX < targetRect.left + targetRect.width / 2) {
        targetCourse.parentNode.insertBefore(draggedCourse, targetCourse); // Place before the target course
      } else {
        targetCourse.parentNode.insertBefore(
          draggedCourse,
          targetCourse.nextSibling
        ); // Place after the target course
      }
    } else {
      alert(
        "This course is a '" +
          draggedCourse.getAttribute("restriction") +
          "' when the semester is '" +
          event.target.parentNode.parentNode.getAttribute("restriction") +
          "'!"
      );
    }
  }
}

// Function to handle if dragged course is not dropped or is canceled
function dragEnd(event) {
  if (draggedCourse) {
    draggedCourse.style.visibility = "visible"; // Ensure course reappears if dragging is canceled
  }

  removePlaceholdersFromCourseBox();
  placeholder = null;
}

// Function to handle the drag start
function drag(event) {
  draggedCourse = event.target;
  event.dataTransfer.setData("text", draggedCourse.id);
  // Hide the dragged course while it's being dragged
  setTimeout(() => {
    draggedCourse.style.visibility = "hidden";
  }, 1); // Set timeout to hide the course after drag starts

  // Create a placeholder when dragging starts
  placeholder = document.createElement("div");
  placeholder.className = "placeholder";
}

// Function to handle the drag over event
function dragOverCourse(event) {
  event.preventDefault();

  const targetCourse = event.target;
  if (!targetCourse.classList.contains("course")) {
    return;
  } // Ensure only "course" elements are targeted
  const targetRect = targetCourse.getBoundingClientRect();
  const dropPositionX = event.clientX;

  // Check whether to insert the placeholder before or after the target course
  const courseBox = targetCourse.parentNode;
  if (dropPositionX < targetRect.left + targetRect.width / 2) {
    if (courseBox.firstChild !== placeholder) {
      courseBox.insertBefore(placeholder, targetCourse);
    }
  } else {
    if (targetCourse.nextSibling !== placeholder) {
      courseBox.insertBefore(placeholder, targetCourse.nextSibling);
    }
  }
}

function removePlaceholdersFromCourseBox() {
  // Get all elements with class 'course-box'
  const courseBoxes = document.querySelectorAll(".course-box");

  // Loop through each course-box
  courseBoxes.forEach((courseBox) => {
    // Convert HTMLCollection (children) to an array for safe iteration
    Array.from(courseBox.children).forEach((child) => {
      // Check if the child has the class 'placeholder'
      if (child.classList.contains("placeholder")) {
        child.remove(); // Remove the child if it has the 'placeholder' class
      }
    });
  });
}
// Attach the dragEnd event to courses to handle when dragging ends
function attachDragEndListeners() {
  document.querySelectorAll(".course").forEach((course) => {
    course.addEventListener("dragend", dragEnd);
  });
}

// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //

// Add Course Section
let uniqueId = 0;

var courseOverlay = document.getElementById("course-overlay");
var newCourseButton = document.getElementById("new-course-button");
var closeCourseOverlayButton = document.getElementById("new-course-close");
var confirmCourseButton = document.getElementById("confirm-course-button");

newCourseButton.onclick = function () {
  courseOverlay.style.display = "flex";
  document.getElementById("new-course-name").value = ""; // Reset to empty
  document.getElementById("semester-restrictions").value = "Any"; // Reset to default
  updateColorPreview("course-color", "course-color-preview"); // Update preview
  document.getElementById("new-course-name").focus(); // Focus on the input field
};

closeCourseOverlayButton.onclick = function () {
  courseOverlay.style.display = "none";
};

confirmCourseButton.onclick = function () {
  if (document.querySelector(".course-box") == null) {
    alert("Please create a semester before adding courses.");
    return;
  }
  var courseName = document.getElementById("new-course-name").value;
  var semRestrictions = document.getElementById("semester-restrictions").value;
  var courseColor = document.getElementById("course-color").value;

  const courseNameError = document.getElementById("course-name-error");

  if (courseName === "" || (courseName != null && courseName.trim() == "")) {
    courseNameError.textContent = "A course name is required.";
    courseNameError.style.display = "block"; // Show Error
    return;
  }

  courseNameError.style.display = "none"; // Hide error

  // Only create a new semester if the user enters a valid name and selects a type
  if (
    courseName !== null &&
    courseName.trim() !== "" &&
    semRestrictions !== ""
  ) {
    var newCourse = document.createElement("div");
    newCourse.className = "course";
    newCourse.textContent = courseName;
    newCourse.style.backgroundColor = courseColor; // Set color

    if (semRestrictions !== "Any") {
      newCourse.innerHTML =
        "<h2>" + courseName + " (" + semRestrictions + ")</h2>";
    } else {
      newCourse.innerHTML = "<h2>" + courseName + "<h2>";
    }

    // Create a delete button for the course
    var deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.className = "delete-button";
    deleteButton.onclick = function () {
      newCourse.remove();
    };

    newCourse.setAttribute("draggable", true);
    var courseId = "course-" + uniqueId++; // Create a unique course ID
    newCourse.setAttribute("id", courseId);
    newCourse.setAttribute("restriction", semRestrictions);
    newCourse.setAttribute("ondragstart", "drag(event)");
    newCourse.appendChild(deleteButton);

    var found = false;
    const elements = document.getElementsByClassName("course-box");
    for (let i = 0; i < elements.length; i++) {
      const parentSemester = elements.item(i).parentNode;
      if (
        !parentSemester.classList.contains("locked") &&
        checkSemesterPossible(elements.item(i).parentNode, newCourse)
      ) {
        elements.item(i).appendChild(newCourse);
        attachDragEndListeners();
        found = true;
        break;
      }
    }

    if (!found) {
      alert("No available unlocked semester matches the course type.");
    }

    courseOverlay.style.display = "none";
  }
};

// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //
// Add semester Section

var semOverlay = document.getElementById("semester-overlay");
var newSemButton = document.getElementById("new-sem-button");
var closeSemOverlayButton = document.getElementById("new-sem-close");
var confirmSemButton = document.getElementById("confirm-sem-button");

newSemButton.onclick = function () {
  semOverlay.style.display = "flex";
  document.getElementById("new-semester-name").value = ""; // Reset to empty
  document.getElementById("semester-type").value = "Fall"; // Reset to default

  // Focus on the input field
  document.getElementById("new-semester-name").focus();
};

closeSemOverlayButton.onclick = function () {
  semOverlay.style.display = "none";
};

confirmSemButton.onclick = function () {
  var semesterName = document.getElementById("new-semester-name").value;
  var semesterType = document.getElementById("semester-type").value;
  const semesterNameError = document.getElementById("semester-name-error");

  if (
    semesterName === "" ||
    (semesterName != null && semesterName.trim() == "")
  ) {
    semesterNameError.textContent = "A semester name is required.";
    semesterNameError.style.display = "block"; // Show error
    return;
  }

  semesterNameError.style.display = "none"; // Hide error

  // Only create a new semester if the user enters a valid name and selects a type
  if (
    semesterName !== null &&
    semesterName.trim() !== "" &&
    semesterType !== ""
  ) {
    var newSemester = document.createElement("div");
    newSemester.className = "semester-box";

    newSemester.setAttribute("restriction", semesterType);

    if (semesterType === "Coop") {
      newSemester.classList.add("coop-semester"); // Add class for special Coop styling
      newSemester.innerHTML = `<h2 contenteditable="true">${semesterName}</h2>`;
    } else {
      newSemester.innerHTML =
        '<h2 contenteditable="true">' +
        semesterName +
        '</h2><div class="course-box" ondrop="drop(event)" ondragover="allowDrop(event); dragOverCourse(event)"></div>';
    }

    // Create a delete button for the semester
    var deleteSemButton = document.createElement("button");
    deleteSemButton.textContent = "Delete Semester";
    deleteSemButton.className = "delete-button";
    deleteSemButton.onclick = function () {
      newSemester.remove();
    };

    var lockSemButton = document.createElement("button");
    lockSemButton.textContent = "Lock";
    lockSemButton.className = "lock-button";
    lockSemButton.onclick = function () {
      lockSemester(this);
    };

    newSemester.appendChild(deleteSemButton);
    newSemester.appendChild(lockSemButton);
    document.getElementById("schedule-container").appendChild(newSemester);

    semOverlay.style.display = "none";
  }
};

function updateColorPreview(colorSelectorId, previewId) {
  const colorValue = document.getElementById(colorSelectorId).value;
  const previewElement = document.getElementById(previewId);
  previewElement.style.backgroundColor = colorValue;
}

document
  .getElementById("download-pdf-button")
  .addEventListener("click", function () {
    // Hide delete buttons
    document
      .querySelectorAll(".delete-button")
      .forEach((btn) => btn.classList.add("hidden-in-pdf"));
    document
      .querySelectorAll(".lock-button")
      .forEach((btn) => btn.classList.add("hidden-in-pdf"));

    const container = document.getElementById("schedule-container");

    html2canvas(container, {
      scale: 2,
    }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jspdf.jsPDF("p", "mm", "a4");

      // PDF dimensions
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const imgWidth = pdfWidth - 20; // Add padding of 10mm on both sides
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Scale content to fit within the first page height if it's larger
      const scaledImgHeight =
        imgHeight > pdfHeight - 40 ? pdfHeight - 40 : imgHeight;

      // Add title and date
      const title = "Custom Flow Chart";
      const date = new Date().toLocaleDateString();
      pdf.setFontSize(16);
      pdf.text(title, pdfWidth / 2, 10, { align: "center" });
      pdf.setFontSize(12);
      pdf.text(`Date: ${date}`, pdfWidth / 2, 18, { align: "center" });

      pdf.addImage(imgData, "PNG", 10, 25, imgWidth, scaledImgHeight);

      // Open the PDF in a new tab
      const pdfBlob = pdf.output("blob");
      const pdfUrl = URL.createObjectURL(pdfBlob);
      window.open(pdfUrl, "_blank");

      // Insta save, no open
      // pdf.save("Custom-Course-Flowchart.pdf");

      // Re-show buttons
      document
        .querySelectorAll(".delete-button")
        .forEach((btn) => btn.classList.remove("hidden-in-pdf"));

      document
        .querySelectorAll(".lock-button")
        .forEach((btn) => btn.classList.remove("hidden-in-pdf"));
    });
  });

// Saves the current flowchart to local storage
function saveFlowchart() {
  const semesters = [];
  document.querySelectorAll(".semester-box").forEach((semester) => {
    const semesterName = semester.querySelector("h2").textContent.trim();
    const semesterType = semester.getAttribute("restriction");
    const isLocked = semester.classList.contains("locked");
    const courses = [];

    if (semesterType !== "Coop") {
      semester.querySelectorAll(".course").forEach((course) => {
        courses.push({
          name: course.querySelector("h2").textContent.trim(),
          restriction: course.getAttribute("restriction"),
          color: course.style.backgroundColor,
        });
      });
    }

    semesters.push({
      name: semesterName,
      type: semesterType,
      isLocked: isLocked,
      courses,
    });
  });

  localStorage.setItem("flowchartData", JSON.stringify(semesters));
  alert("Flowchart saved successfully!");
}

// Loads saved flowchart from local storage
function loadFlowchart() {
  const savedData = localStorage.getItem("flowchartData");
  if (!savedData) {
    alert("No saved flowchart found!");
    return;
  }

  const semesters = JSON.parse(savedData);
  const scheduleContainer = document.getElementById("schedule-container");
  scheduleContainer.innerHTML = ""; // Clears current schedule

  this.uniqueId = 0;
  semesters.forEach((semesterData) => {
    const newSemester = document.createElement("div");
    newSemester.className = "semester-box";
    newSemester.setAttribute("restriction", semesterData.type);

    newSemester.innerHTML =
      `<h2 contenteditable="true">${semesterData.name}</h2>` +
      `<div class="course-box" ondrop="drop(event)" ondragover="allowDrop(event); dragOverCourse(event)"></div>`;

    const courseBox = newSemester.querySelector(".course-box");

    semesterData.courses.forEach((courseData) => {
      const newCourse = document.createElement("div");
      newCourse.className = "course";
      newCourse.innerHTML = `<h2>${courseData.name}</h2>`;
      newCourse.style.backgroundColor = courseData.color;
      newCourse.setAttribute("restriction", courseData.restriction);
      newCourse.setAttribute("draggable", true);
      newCourse.setAttribute("id", "course-" + uniqueId++);
      newCourse.setAttribute("ondragstart", "drag(event)");

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.className = "delete-button";
      deleteButton.onclick = function () {
        newCourse.remove();
      };

      newCourse.appendChild(deleteButton);
      courseBox.appendChild(newCourse);
    });

    const deleteSemButton = document.createElement("button");
    deleteSemButton.textContent = "Delete Semester";
    deleteSemButton.className = "delete-button";
    deleteSemButton.onclick = function () {
      newSemester.remove();
    };

    var lockSemButton = document.createElement("button");
    lockSemButton.textContent = semesterData.isLocked ? "Unlock" : "Lock";
    lockSemButton.className = "lock-button";

    if (semesterData.isLocked) {
      newSemester.classList.add("locked");
      lockSemButton.setAttribute("onclick", "unlockSemester(this)");
    } else {
      lockSemButton.setAttribute("onclick", "lockSemester(this)");
    }

    newSemester.appendChild(deleteSemButton);
    newSemester.appendChild(lockSemButton);
    scheduleContainer.appendChild(newSemester);
  });

  alert("Flowchart loaded successfully!");
}

function lockSemester(button) {
  const semesterBox = button.parentNode;
  semesterBox.classList.add("locked");
  button.textContent = "Unlock";
  button.color = "75, 75, 75, 0.5";
  button.setAttribute("onclick", "unlockSemester(this)");
}

function unlockSemester(button) {
  const semesterBox = button.parentNode;
  semesterBox.classList.remove("locked");
  button.textContent = "Lock";
  button.color = "grey";
  button.setAttribute("onclick", "lockSemester(this)");
}

// Help Modal
var helpOverlay = document.getElementById("help-overlay");
var helpButton = document.getElementById("help-button");
var helpCloseButton = document.getElementById("help-close");
var closeHelpButton = document.getElementById("close-help-button");

// Open the Help Modal
helpButton.onclick = function () {
  helpOverlay.style.display = "flex";
};

// Close the Help Modal
helpCloseButton.onclick = function () {
  helpOverlay.style.display = "none";
};

closeHelpButton.onclick = function () {
  helpOverlay.style.display = "none";
};

// Close any modal if the user clicks off it
window.onclick = function (event) {
  switch (event.target) {
    case semOverlay: {
      semOverlay.style.display = "none";
    }
    case courseOverlay: {
      courseOverlay.style.display = "none";
    }
    case helpOverlay: {
      helpOverlay.style.display = "none";
    }
  }
};
