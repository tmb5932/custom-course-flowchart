// Function to allow drop
function allowDrop(event) {
  // Get the course-box or course parent element to make sure it's the correct target
  const target = event.target.closest(".course-box, .course");

  if (target) {
    event.preventDefault(); // Allow drop on valid target or its children
  } else {
    if (draggedCourse != null) {
      draggedCourse.style.visibility = "visible";
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
    return; // If no valid target is found, exit the function
  } else {
    if (draggedCourse != null) {
      draggedCourse.style.visibility = "visible";
    }
  }

  var draggedCourseId = event.dataTransfer.getData("text");
  draggedCourse = document.getElementById(draggedCourseId);

  if (placeholder && placeholder.parentNode) {
    placeholder.parentNode.replaceChild(draggedCourse, placeholder);
  }

  // Make the dragged course visible again after drop
  draggedCourse.style.visibility = "visible";

  // Clean up the placeholder
  placeholder = null;

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
  if (placeholder && placeholder.parentNode) {
    placeholder.remove(); // Remove placeholder if drop is canceled
  }
  placeholder = null;
}

// Function to handle the drag start
function drag(event) {
  draggedCourse = event.target;
  event.dataTransfer.setData("text", draggedCourse.id);

  // Hide the dragged course while it's being dragged
  setTimeout(() => {
    draggedCourse.style.visibility = "hidden";
  }, 0); // Set timeout to hide the course after drag starts

  // Create a placeholder when dragging starts
  placeholder = document.createElement("div");
  placeholder.className = "placeholder";
}

// Function to handle the drag over event
function dragOverCourse(event) {
  event.preventDefault();

  const targetCourse = event.target;
  if (!targetCourse.classList.contains("course")) return; // Ensure only "course" elements are targeted

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

// Attach the dragEnd event to courses to handle when dragging ends
document.querySelectorAll(".course").forEach((course) => {
  course.addEventListener("dragend", dragEnd);
});
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
  if (document.querySelector(".course-box") == null) {
    alert("Please create a semester before adding courses.");
    return;
  }
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
    const elements = document.getElementsByClassName("course-box");
    for (let i = 0; i < elements.length; i++) {
      if (checkSemesterPossible(elements.item(i).parentNode, newCourse)) {
        elements.item(i).appendChild(newCourse);
        break;
      }
      if (i == elements.length - 1) {
        alert(
          "There are no semesters to match course type '" +
            semRestrictions +
            "'."
        );
      }
    }
    // document.querySelector(".course-box").appendChild(newCourse);

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

    // Create a delete button for the semester
    var deleteSemButton = document.createElement("button");
    deleteSemButton.textContent = "Delete Semester";
    deleteSemButton.className = "delete-button";
    deleteSemButton.onclick = function () {
      newSemester.remove();
    };

    newSemester.setAttribute("restriction", semesterType);

    newSemester.innerHTML =
      '<h2 contenteditable="true">' +
      semesterName +
      '</h2><div class="course-box" ondrop="drop(event)" ondragover="allowDrop(event); dragOverCourse(event)"></div>';

    newSemester.appendChild(deleteSemButton);
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
