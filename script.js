// Function to allow drop
function allowDrop(event) {
  if (
    event.target.classList.contains("course-box") ||
    event.target.classList.contains("course")
  ) {
    event.preventDefault(); // Only allow drop if it's a valid dropzone
  }
}

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
  var draggedCourseId = event.dataTransfer.getData("text");
  var draggedCourse = document.getElementById(draggedCourseId);

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

function drag(event) {
  event.dataTransfer.setData("text", event.target.id);
}

// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //

// Add Course Section
var uniqueId = 0;

var courseOverlay = document.getElementById("course-overlay");
var newCourseButton = document.getElementById("new-course-button");
var closeCourseOverlayButton = document.getElementById("new-course-close");
var confirmCourseButton = document.getElementById("confirm-course-button");

newCourseButton.onclick = function () {
  courseOverlay.style.display = "flex";
  document.getElementById("new-course-name").value = ""; // Reset to empty
  document.getElementById("semester-restrictions").value = "Any"; // Reset to default
};

closeCourseOverlayButton.onclick = function () {
  courseOverlay.style.display = "none";
};

confirmCourseButton.onclick = function () {
  var courseName = document.getElementById("new-course-name").value;
  var semRestrictions = document.getElementById("semester-restrictions").value;

  // Only create a new semester if the user enters a valid name and selects a type
  if (
    courseName !== null &&
    courseName.trim() !== "" &&
    semRestrictions !== ""
  ) {
    var newCourse = document.createElement("div");
    newCourse.className = "course";
    newCourse.textContent = courseName;

    if (semRestrictions !== "Any") {
      newCourse.innerHTML =
        "<h2>" + courseName + " (" + semRestrictions + ")</h2>";
    } else {
      newCourse.innerHTML = "<h2>" + courseName + "<h2>";
    }

    newCourse.setAttribute("draggable", true);
    var courseId = "course-" + uniqueId++; // Create a unique course ID
    newCourse.setAttribute("id", courseId);
    newCourse.setAttribute("restriction", semRestrictions);
    newCourse.setAttribute("ondragstart", "drag(event)");

    document.querySelector(".course-box").appendChild(newCourse);

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
};

closeSemOverlayButton.onclick = function () {
  semOverlay.style.display = "none";
};

confirmSemButton.onclick = function () {
  var semesterName = document.getElementById("new-semester-name").value;
  var semesterType = document.getElementById("semester-type").value;

  // Only create a new semester if the user enters a valid name and selects a type
  if (
    semesterName !== null &&
    semesterName.trim() !== "" &&
    semesterType !== ""
  ) {
    var newSemester = document.createElement("div");
    newSemester.className = "semester-box";

    newSemester.setAttribute("restriction", semesterType);

    newSemester.innerHTML =
      '<h2 contenteditable="true">' +
      semesterName +
      " (" +
      semesterType +
      ')</h2><div class="course-box" ondrop="drop(event)" ondragover="allowDrop(event)"></div>';

    document.getElementById("schedule-container").appendChild(newSemester);

    semOverlay.style.display = "none";
  }
};

// Close either overlay if the user clicks off it
window.onclick = function (event) {
  if (event.target === semOverlay) {
    semOverlay.style.display = "none";
  } else if (event.target === courseOverlay) {
    courseOverlay.style.display = "none";
  }
};
