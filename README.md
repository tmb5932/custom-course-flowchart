# Custom Course Flowchart
Website that lets you plan which semesters to take your future courses needed to finish your degree.
Made using HTML, CSS, and JavaScript frontend, and Python Flask and SQLite backend.

## Features
#### Drag-and-Drop Functionality
-	Intuitive drag-and-drop interface for rearranging courses within semesters or moving them between semesters.
-	Visual placeholders indicate valid drop locations for a smooth user experience.
#### Course Management
-	Add new courses with customizable attributes, including:
    -	Course name.
    -	Semester restrictions (e.g., Fall Only, Spring Only).
    -	Color coding for easy identification.
-	Delete courses with a single click.
#### Dynamic Semester Creation
-	Add new semesters with custom names and types (e.g., Fall, Spring, Winter, Summer).
-	Lock or unlock semesters to prevent or allow auto placement of new courses.
#### Save and Load Flowcharts
-	Save your custom course flowchart to SQLite database for later access.
-	Reload saved flowcharts with all semesters, courses, and configurations intact.
#### PDF Export
-	Generate a high-quality PDF of your flowchart for printing or sharing.
-	Automatically hides unnecessary buttons (e.g., delete and lock) during PDF generation.
#### Help Overlay
-	An easy-to-understand help guide to assist new users in navigating and using the application.
-	Includes detailed instructions for all major features.
#### Error Handling
-	Alerts users if they attempt invalid actions, such as adding courses without semesters or moving courses to incompatible semesters.
#### Data Validation
-	Ensures all required fields (e.g., course name, semester name) are completed before adding new items.

## Authors Note
I had the idea for this web application from the PDF course flowcharts given by RIT. 
The problem was that I transferred in certain courses, which meant that I couldn't follow the given flowchart exactly. This led to me having to simply not use it when it when I went to plan my courses, saving a text file that I needed to retype every time I decided on a different plan. This is my solution to my problem. 

Made by Travis Brown
