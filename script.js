// ================================
// AKSHAT STUDY TRACKER
// ================================

const subjects = [
    "Maths",
    "Science",
    "English",
    "Hindi",
    "SST"
];

let data = JSON.parse(localStorage.getItem("akshatTracker")) || {
    className: "9",
    tasks: [],
    studyDates: [],
    longestStreak: 0,
    darkMode: false
};


// ================================
// ELEMENTS
// ================================

const classSelect = document.getElementById("classSelect");
const taskList = document.getElementById("taskList");
const addTaskBtn = document.getElementById("addTaskBtn");

const taskModal = document.getElementById("taskModal");
const taskInput = document.getElementById("taskInput");
const subjectInput = document.getElementById("subjectInput");

const saveTask = document.getElementById("saveTask");
const closeModal = document.getElementById("closeModal");

const currentStreakEl = document.getElementById("currentStreak");
const longestStreakEl = document.getElementById("longestStreak");
const studyDaysEl = document.getElementById("studyDays");
const overallProgressEl = document.getElementById("overallProgress");

const completedCountEl = document.getElementById("completedCount");
const totalCountEl = document.getElementById("totalCount");

const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");

const subjectProgress = document.getElementById("subjectProgress");
const calendar = document.getElementById("calendar");

const todayDate = document.getElementById("todayDate");
const themeBtn = document.getElementById("themeBtn");


// ================================
// DATE FUNCTIONS
// ================================

function getToday() {
    const date = new Date();

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}


function formatDate(dateString) {
    const date = new Date(dateString + "T00:00:00");

    return date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric"
    });
}


// ================================
// SAVE DATA
// ================================

function saveData() {
    localStorage.setItem(
        "akshatTracker",
        JSON.stringify(data)
    );
}


// ================================
// CLASS
// ================================

classSelect.value = data.className;

classSelect.addEventListener("change", function () {

    data.className = this.value;

    saveData();

    renderAll();
});


// ================================
// TODAY DATE
// ================================

todayDate.textContent = formatDate(getToday());


// ================================
// TASK MODAL
// ================================

addTaskBtn.addEventListener("click", function () {

    taskInput.value = "";

    taskModal.style.display = "flex";

    taskInput.focus();
});


closeModal.addEventListener("click", function () {

    taskModal.style.display = "none";
});


taskModal.addEventListener("click", function (event) {

    if (event.target === taskModal) {
        taskModal.style.display = "none";
    }
});


// ================================
// ADD TASK
// ================================

saveTask.addEventListener("click", function () {

    const text = taskInput.value.trim();

    if (text === "") {
        alert("Please enter a study task.");
        return;
    }

    const task = {
        id: Date.now(),
        date: getToday(),
        text: text,
        subject: subjectInput.value,
        completed: false
    };

    data.tasks.push(task);

    saveData();

    taskModal.style.display = "none";

    renderAll();
});


// ================================
// RENDER TASKS
// ================================

function renderTasks() {

    taskList.innerHTML = "";

    const today = getToday();

    const todayTasks = data.tasks.filter(
        task => task.date === today
    );

    if (todayTasks.length === 0) {

        taskList.innerHTML = `
            <div style="
                text-align:center;
                padding:25px;
                color:#697386;
            ">
                📚 No tasks for today.<br>
                Add your first study task!
            </div>
        `;

        updateCounts();

        return;
    }


    todayTasks.forEach(task => {

        const div = document.createElement("div");

        div.className =
            task.completed
                ? "task completed"
                : "task";


        div.innerHTML = `
            <input
                type="checkbox"
                ${task.completed ? "checked" : ""}
                data-id="${task.id}"
            >

            <div class="taskText">

                <strong>${escapeHTML(task.text)}</strong>

                <small>
                    ${escapeHTML(task.subject)}
                </small>

            </div>

            <button
                class="deleteTask"
                data-id="${task.id}"
                style="
                    border:0;
                    background:none;
                    font-size:18px;
                    cursor:pointer;
                "
            >
                🗑️
            </button>
        `;


        const checkbox =
            div.querySelector("input");

        checkbox.addEventListener(
            "change",
            function () {

                toggleTask(task.id);
            }
        );


        const deleteButton =
            div.querySelector(".deleteTask");

        deleteButton.addEventListener(
            "click",
            function () {

                deleteTask(task.id);
            }
        );


        taskList.appendChild(div);
    });


    updateCounts();
}


// ================================
// ESCAPE HTML
// ================================

function escapeHTML(text) {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}


// ================================
// TOGGLE TASK
// ================================

function toggleTask(id) {

    const task = data.tasks.find(
        task => task.id === id
    );

    if (!task) return;

    task.completed = !task.completed;

    updateStudyDate();

    saveData();

    renderAll();
}


// ================================
// DELETE TASK
// ================================

function deleteTask(id) {

    data.tasks = data.tasks.filter(
        task => task.id !== id
    );

    updateStudyDate();

    saveData();

    renderAll();
}


// ================================
// UPDATE COUNTS
// ================================

function updateCounts() {

    const today = getToday();

    const todayTasks =
        data.tasks.filter(
            task => task.date === today
        );

    const completed =
        todayTasks.filter(
            task => task.completed
        ).length;


    completedCountEl.textContent = completed;

    totalCountEl.textContent =
        todayTasks.length;
}


// ================================
// STUDY DATE
// ================================

function updateStudyDate() {

    const today = getToday();

    const todayTasks =
        data.tasks.filter(
            task => task.date === today
        );

    const completed =
        todayTasks.some(
            task => task.completed
        );


    if (completed) {

        if (!data.studyDates.includes(today)) {

            data.studyDates.push(today);
        }

    } else {

        data.studyDates =
            data.studyDates.filter(
                date => date !== today
            );
    }
}


// ================================
// PROGRESS
// ================================

function calculateProgress() {

    const total = data.tasks.length;

    const completed =
        data.tasks.filter(
            task => task.completed
        ).length;


    if (total === 0) return 0;

    return Math.round(
        (completed / total) * 100
    );
}


function renderProgress() {

    const progress =
        calculateProgress();


    progressFill.style.width =
        progress + "%";

    progressText.textContent =
        progress + "%";

    overallProgressEl.textContent =
        progress + "%";
}


// ================================
// STREAK SYSTEM
// ================================

function calculateCurrentStreak() {

    const dates =
        [...new Set(data.studyDates)]
        .sort()
        .reverse();


    if (dates.length === 0) {
        return 0;
    }


    const today = new Date(
        getToday() + "T00:00:00"
    );


    const latest =
        new Date(
            dates[0] + "T00:00:00"
        );


    const difference =
        Math.round(
            (today - latest) /
            (1000 * 60 * 60 * 24)
        );


    // If the latest study was more
    // than one day ago, streak is broken.

    if (difference > 1) {
        return 0;
    }


    let streak = 1;


    for (let i = 0; i < dates.length - 1; i++) {

        const current =
            new Date(
                dates[i] + "T00:00:00"
            );

        const previous =
            new Date(
                dates[i + 1] + "T00:00:00"
            );


        const gap =
            Math.round(
                (current - previous) /
                (1000 * 60 * 60 * 24)
            );


        if (gap === 1) {

            streak++;

        } else {

            break;
        }
    }


    return streak;
}


function calculateLongestStreak() {

    const dates =
        [...new Set(data.studyDates)]
        .sort();


    if (dates.length === 0) {
        return 0;
    }


    let longest = 1;
    let current = 1;


    for (let i = 1; i < dates.length; i++) {

        const currentDate =
            new Date(
                dates[i] + "T00:00:00"
            );

        const previousDate =
            new Date(
                dates[i - 1] + "T00:00:00"
            );


        const gap =
            Math.round(
                (currentDate - previousDate) /
                (1000 * 60 * 60 * 24)
            );


        if (gap === 1) {

            current++;

        } else {

            current = 1;
        }


        if (current > longest) {
            longest = current;
        }
    }


    return longest;
}


function renderStreak() {

    const current =
        calculateCurrentStreak();

    const longest =
        calculateLongestStreak();


    if (longest > data.longestStreak) {

        data.longestStreak = longest;

        saveData();
    }


    currentStreakEl.textContent =
        current;

    longestStreakEl.textContent =
        data.longestStreak;

    studyDaysEl.textContent =
        data.studyDates.length;
}


// ================================
// SUBJECT PROGRESS
// ================================

function renderSubjectProgress() {

    subjectProgress.innerHTML = "";


    subjects.forEach(subject => {

        const subjectTasks =
            data.tasks.filter(
                task => task.subject === subject
            );


        const completed =
            subjectTasks.filter(
                task => task.completed
            ).length;


        const total =
            subjectTasks.length;


        const percent =
            total === 0
                ? 0
                : Math.round(
                    (completed / total) * 100
                );


        const div =
            document.createElement("div");


        div.innerHTML = `

            <div class="subjectHeader">

                <strong>
                    ${subject}
                </strong>

                <span>
                    ${percent}%
                </span>

            </div>

            <div class="subjectBar">

                <div
                    class="subjectFill"
                    style="width:${percent}%"
                ></div>

            </div>

        `;


        subjectProgress.appendChild(div);
    });
}


// ================================
// CALENDAR
// ================================

function renderCalendar() {

    calendar.innerHTML = "";


    const now = new Date();

    const year = now.getFullYear();

    const month = now.getMonth();


    const firstDay =
        new Date(
            year,
            month,
            1
        ).getDay();


    const daysInMonth =
        new Date(
            year,
            month + 1,
            0
        ).getDate();


    // Empty spaces

    for (
        let i = 0;
        i < firstDay;
        i++
    ) {

        const empty =
            document.createElement("div");

        empty.className = "day";

        empty.style.visibility =
            "hidden";

        calendar.appendChild(empty);
    }


    // Days

    for (
        let day = 1;
        day <= daysInMonth;
        day++
    ) {

        const date =
            `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;


        const div =
            document.createElement("div");

        div.className = "day";

        div.textContent = day;


        if (
            data.studyDates.includes(date)
        ) {

            div.classList.add("active");
        }


        if (
            date === getToday()
        ) {

            div.classList.add("today");
        }


        calendar.appendChild(div);
    }
}


// ================================
// DARK MODE
// ================================

function applyTheme() {

    if (data.darkMode) {

        document.body.classList.add("dark");

        themeBtn.textContent = "☀️";

    } else {

        document.body.classList.remove("dark");

        themeBtn.textContent = "🌙";
    }
}


themeBtn.addEventListener(
    "click",
    function () {

        data.darkMode =
            !data.darkMode;

        saveData();

        applyTheme();
    }
);


// ================================
// RENDER EVERYTHING
// ================================

function renderAll() {

    renderTasks();

    renderProgress();

    renderStreak();

    renderSubjectProgress();

    renderCalendar();

    applyTheme();
}


// ================================
// START
// ================================

renderAll();
