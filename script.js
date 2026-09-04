// ============================================================
// STUDENT TOOLKIT
// COMPLETE SCRIPT.JS
// Fancy Alerts + Supabase Auth + Dark Mode
// ============================================================


// ============================================================
// DARK MODE
// ============================================================

function getSavedTheme() {
    return localStorage.getItem("studentToolkitTheme");
}

function getSystemTheme() {
    return window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
}

function applyTheme(theme) {
    if (theme === "dark") {
        document.body.classList.add("dark-mode");
    } else {
        document.body.classList.remove("dark-mode");
    }

    updateThemeButton(theme);
}

function updateThemeButton(theme) {
    const button =
        document.getElementById("themeToggle");

    if (!button) return;

    if (theme === "dark") {
        button.textContent = "☀️ Light Mode";
        button.setAttribute("aria-label", "Switch to light mode");
    } else {
        button.textContent = "🌙 Dark Mode";
        button.setAttribute("aria-label", "Switch to dark mode");
    }
}

function initializeTheme() {
    const savedTheme =
        getSavedTheme();

    const theme =
        savedTheme || getSystemTheme();

    applyTheme(theme);
}

function toggleDarkMode() {
    const isDark =
        document.body.classList.contains("dark-mode");

    const newTheme =
        isDark ? "light" : "dark";

    applyTheme(newTheme);

    localStorage.setItem(
        "studentToolkitTheme",
        newTheme
    );
}


// ============================================================
// SUPABASE
// ============================================================

const SUPABASE_URL =
    "https://vfvghqnokipcqycfiznf.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_SbJXqQdFQtJnQliCwk1eDg_znXLy9cL";

let supabaseClient = null;
let supabaseReady = false;

function loadSupabase() {
    return new Promise((resolve, reject) => {

        if (window.supabase) {

            supabaseClient =
                window.supabase.createClient(
                    SUPABASE_URL,
                    SUPABASE_PUBLISHABLE_KEY
                );

            supabaseReady = true;

            resolve(
                supabaseClient
            );

            return;
        }

        const script =
            document.createElement("script");

        script.src =
            "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";

        script.onload = () => {

            if (!window.supabase) {
                reject(
                    new Error(
                        "Supabase library failed to load."
                    )
                );

                return;
            }

            supabaseClient =
                window.supabase.createClient(
                    SUPABASE_URL,
                    SUPABASE_PUBLISHABLE_KEY
                );

            supabaseReady = true;

            resolve(
                supabaseClient
            );
        };

        script.onerror = () => {
            reject(
                new Error(
                    "Could not load Supabase."
                )
            );
        };

        document.head.appendChild(
            script
        );
    });
}


// ============================================================
// FANCY ALERT
// ============================================================

function showFancyAlert(
    message,
    title = "Notice",
    icon = "✨",
    buttonText = "Got It ✨"
) {

    const overlay =
        document.getElementById(
            "fancyAlert"
        );

    if (!overlay) {
        alert(message);
        return;
    }

    const titleElement =
        document.getElementById(
            "fancyAlertTitle"
        );

    const messageElement =
        document.getElementById(
            "fancyAlertMessage"
        );

    const iconElement =
        document.getElementById(
            "fancyAlertIcon"
        );

    const buttonElement =
        document.querySelector(
            ".fancy-alert-button"
        );

    if (titleElement) {
        titleElement.textContent =
            title;
    }

    if (messageElement) {
        messageElement.textContent =
            message;
    }

    if (iconElement) {
        iconElement.textContent =
            icon;
    }

    if (buttonElement) {
        buttonElement.textContent =
            buttonText;
    }

    overlay.classList.add("show");

    overlay.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.classList.add(
        "modal-open"
    );
}

function closeFancyAlert() {

    const overlay =
        document.getElementById(
            "fancyAlert"
        );

    if (!overlay) return;

    overlay.classList.remove(
        "show"
    );

    overlay.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.classList.remove(
        "modal-open"
    );
}


// Close popup by clicking outside

document.addEventListener(
    "click",
    event => {

        const overlay =
            document.getElementById(
                "fancyAlert"
            );

        if (!overlay) return;

        if (
            event.target === overlay &&
            overlay.classList.contains("show")
        ) {
            closeFancyAlert();
        }
    }
);


// Escape key

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape"
        ) {
            closeFancyAlert();
        }
    }
);


// ============================================================
// NAVIGATION
// ============================================================

function hideAllTools() {

    const toolIds = [
        "authTool",
        "percentageTool",
        "marksTool",
        "cgpaTool",
        "timerTool",
        "timetableTool",
        "converterTool"
    ];

    toolIds.forEach(
        id => {

            const element =
                document.getElementById(
                    id
                );

            if (element) {
                element.style.display =
                    "none";
            }
        }
    );
}

function showMenu() {

    hideAllTools();

    const menu =
        document.getElementById(
            "toolsMenu"
        );

    if (menu) {
        menu.style.display =
            "grid";
    }
}


// ============================================================
// AUTHENTICATION
// ============================================================

let authMode = "login";

function openAuth() {

    hideAllTools();

    const authTool =
        document.getElementById(
            "authTool"
        );

    if (authTool) {
        authTool.style.display =
            "block";
    }

    setAuthMode(
        "login"
    );
}

function closeAuth() {

    const authTool =
        document.getElementById(
            "authTool"
        );

    if (authTool) {
        authTool.style.display =
            "none";
    }

    clearAuthForm();

    showMenu();
}

function setAuthMode(
    mode
) {

    authMode =
        mode === "signup"
            ? "signup"
            : "login";

    const title =
        document.getElementById(
            "authTitle"
        );

    const description =
        document.getElementById(
            "authDescription"
        );

    const nameField =
        document.getElementById(
            "nameField"
        );

    const submitButton =
        document.getElementById(
            "authSubmitButton"
        );

    const switchButton =
        document.getElementById(
            "authSwitchButton"
        );

    const password =
        document.getElementById(
            "authPassword"
        );

    if (
        authMode === "signup"
    ) {

        if (title) {
            title.textContent =
                "📝 Create Account";
        }

        if (description) {
            description.textContent =
                "Create your Student Toolkit account.";
        }

        if (nameField) {

            nameField.classList.remove(
                "hidden"
            );

            nameField.style.display =
                "block";
        }

        if (submitButton) {
            submitButton.textContent =
                "📝 Sign Up";
        }

        if (switchButton) {
            switchButton.textContent =
                "Already have an account? Login";
        }

        if (password) {
            password.autocomplete =
                "new-password";
        }

    } else {

        if (title) {
            title.textContent =
                "🔐 Login";
        }

        if (description) {
            description.textContent =
                "Login to your Student Toolkit account.";
        }

        if (nameField) {

            nameField.classList.add(
                "hidden"
            );

            nameField.style.display =
                "none";
        }

        if (submitButton) {
            submitButton.textContent =
                "🔐 Login";
        }

        if (switchButton) {
            switchButton.textContent =
                "Don't have an account? Sign Up";
        }

        if (password) {
            password.autocomplete =
                "current-password";
        }
    }

    const message =
        document.getElementById(
            "authMessage"
        );

    if (message) {
        message.textContent =
            "";

        message.style.display =
            "none";
    }
}

function toggleAuthMode() {

    setAuthMode(
        authMode === "login"
            ? "signup"
            : "login"
    );
}

function clearAuthForm() {

    const name =
        document.getElementById(
            "authName"
        );

    const email =
        document.getElementById(
            "authEmail"
        );

    const password =
        document.getElementById(
            "authPassword"
        );

    const message =
        document.getElementById(
            "authMessage"
        );

    if (name) {
        name.value = "";
    }

    if (email) {
        email.value = "";
    }

    if (password) {
        password.value = "";
    }

    if (message) {
        message.textContent =
            "";

        message.style.display =
            "none";
    }
}

function showAuthMessage(
    message,
    isError = false
) {

    const element =
        document.getElementById(
            "authMessage"
        );

    if (!element) return;

    element.textContent =
        message;

    element.style.display =
        message
            ? "block"
            : "none";

    element.classList.toggle(
        "error",
        isError
    );
}

async function signUpUser(
    email,
    password,
    name
) {

    if (!supabaseReady) {

        showAuthMessage(
            "Supabase is still loading. Please try again.",
            true
        );

        return false;
    }

    if (!name.trim()) {

        showAuthMessage(
            "Please enter your name.",
            true
        );

        document
            .getElementById(
                "authName"
            )
            ?.focus();

        return false;
    }

    if (!email.trim()) {

        showAuthMessage(
            "Please enter your email.",
            true
        );

        document
            .getElementById(
                "authEmail"
            )
            ?.focus();

        return false;
    }

    if (!password) {

        showAuthMessage(
            "Please enter a password.",
            true
        );

        document
            .getElementById(
                "authPassword"
            )
            ?.focus();

        return false;
    }

    if (
        password.length < 6
    ) {

        showAuthMessage(
            "Password must be at least 6 characters.",
            true
        );

        return false;
    }

    try {

        const {
            data,
            error
        } =
            await supabaseClient.auth.signUp({
                email:
                    email.trim(),

                password:
                    password,

                options: {
                    data: {
                        full_name:
                            name.trim()
                    },

                    emailRedirectTo:
                        window.location.href
                }
            });

        if (error) {

            showAuthMessage(
                error.message,
                true
            );

            return false;
        }

        if (
            data.user &&
            !data.session
        ) {

            showAuthMessage(
                "Account created! 📧 Check your email and confirm your account before logging in."
            );

        } else {

            showAuthMessage(
                "Account created successfully! 🎉"
            );
        }

        return true;

    } catch (error) {

        console.error(
            "Signup error:",
            error
        );

        showAuthMessage(
            "Something went wrong while creating your account.",
            true
        );

        return false;
    }
}

async function loginUser(
    email,
    password
) {

    if (!supabaseReady) {

        showAuthMessage(
            "Supabase is still loading. Please try again.",
            true
        );

        return false;
    }

    if (!email.trim()) {

        showAuthMessage(
            "Please enter your email.",
            true
        );

        return false;
    }

    if (!password) {

        showAuthMessage(
            "Please enter your password.",
            true
        );

        return false;
    }

    try {

        const {
            data,
            error
        } =
            await supabaseClient.auth.signInWithPassword({
                email:
                    email.trim(),

                password:
                    password
            });

        if (error) {

            showAuthMessage(
                error.message,
                true
            );

            return false;
        }

        showAuthMessage(
            "Welcome back! 🎉"
        );

        updateAuthUI(
            data.user
        );

        return true;

    } catch (error) {

        console.error(
            "Login error:",
            error
        );

        showAuthMessage(
            "Something went wrong while logging in.",
            true
        );

        return false;
    }
}

async function submitAuth() {

    const name =
        document.getElementById(
            "authName"
        )?.value || "";

    const email =
        document.getElementById(
            "authEmail"
        )?.value || "";

    const password =
        document.getElementById(
            "authPassword"
        )?.value || "";

    const button =
        document.getElementById(
            "authSubmitButton"
        );

    if (button) {
        button.disabled = true;
    }

    try {

        if (
            authMode === "signup"
        ) {

            await signUpUser(
                email,
                password,
                name
            );

        } else {

            await loginUser(
                email,
                password
            );
        }

    } finally {

        if (button) {
            button.disabled = false;
        }
    }
}

async function logoutUser() {

    if (!supabaseReady) {
        return;
    }

    try {

        const {
            error
        } =
            await supabaseClient.auth.signOut();

        if (error) {

            console.error(
                "Logout error:",
                error
            );

            return;
        }

        updateAuthUI(
            null
        );

        showMenu();

    } catch (error) {

        console.error(
            "Logout error:",
            error
        );
    }
}

function updateAuthUI(
    user
) {

    const statusText =
        document.getElementById(
            "authStatusText"
        );

    const authButton =
        document.getElementById(
            "authButton"
        );

    if (user) {

        if (statusText) {

            const fullName =
                user.user_metadata
                    ?.full_name;

            statusText.textContent =
                fullName
                    ? `Hi, ${fullName} 👋`
                    : `Logged in: ${user.email}`;
        }

        if (authButton) {

            authButton.textContent =
                "🚪 Logout";

            authButton.onclick =
                logoutUser;
        }

    } else {

        if (statusText) {
            statusText.textContent =
                "Not logged in";
        }

        if (authButton) {

            authButton.textContent =
                "🔐 Login / Sign Up";

            authButton.onclick =
                openAuth;
        }
    }
}

async function checkLoggedInUser() {

    if (!supabaseReady) {
        return;
    }

    try {

        const {
            data,
            error
        } =
            await supabaseClient.auth.getUser();

        if (
            error ||
            !data?.user
        ) {

            updateAuthUI(
                null
            );

            return;
        }

        updateAuthUI(
            data.user
        );

    } catch (error) {

        console.error(
            "Could not check user:",
            error
        );

        updateAuthUI(
            null
        );
    }
}

function setupAuthListener() {

    if (!supabaseReady) {
        return;
    }

    supabaseClient.auth.onAuthStateChange(
        (
            event,
            session
        ) => {

            console.log(
                "Auth event:",
                event
            );

            updateAuthUI(
                session?.user ||
                null
            );
        }
    );
}


// ============================================================
// PERCENTAGE CALCULATOR
// ============================================================

function openPercentage() {

    hideAllTools();

    const tool =
        document.getElementById(
            "percentageTool"
        );

    if (tool) {
        tool.style.display =
            "block";
    }
}

function closePercentage() {

    const tool =
        document.getElementById(
            "percentageTool"
        );

    if (tool) {
        tool.style.display =
            "none";
    }

    showMenu();
}

function calculatePercentage() {

    const percentageInput =
        document.getElementById(
            "percentage"
        );

    const numberInput =
        document.getElementById(
            "number"
        );

    const result =
        document.getElementById(
            "percentageResult"
        );

    if (
        !percentageInput ||
        !numberInput ||
        !result
    ) {
        return;
    }

    if (
        percentageInput.value === "" ||
        numberInput.value === ""
    ) {

        result.textContent =
            "Please enter both numbers.";

        return;
    }

    const percentage =
        Number(
            percentageInput.value
        );

    const number =
        Number(
            numberInput.value
        );

    if (
        !Number.isFinite(
            percentage
        ) ||
        !Number.isFinite(
            number
        )
    ) {

        result.textContent =
            "Please enter valid numbers.";

        return;
    }

    const answer =
        (
            percentage /
            100
        ) *
        number;

    result.textContent =
        `${percentage}% of ${number} = ${answer}`;
}


// ============================================================
// MARKS CALCULATOR
// ============================================================

let subjectCount = 0;

function openMarks() {

    hideAllTools();

    const tool =
        document.getElementById(
            "marksTool"
        );

    if (tool) {
        tool.style.display =
            "block";
    }

    if (
        document.querySelectorAll(
            "#subjects .subject-row"
        ).length === 0
    ) {

        addSubject();
        addSubject();
        addSubject();
    }
}

function closeMarks() {

    const tool =
        document.getElementById(
            "marksTool"
        );

    if (tool) {
        tool.style.display =
            "none";
    }

    showMenu();
}

function addSubject() {

    subjectCount++;

    const container =
        document.getElementById(
            "subjects"
        );

    if (!container) {
        return;
    }

    const row =
        document.createElement(
            "div"
        );

    row.className =
        "subject-row";

    const nameInput =
        document.createElement(
            "input"
        );

    nameInput.type =
        "text";

    nameInput.placeholder =
        `Subject ${subjectCount}`;

    nameInput.className =
        "subject-name";

    const marksInput =
        document.createElement(
            "input"
        );

    marksInput.type =
        "number";

    marksInput.placeholder =
        "Marks";

    marksInput.className =
        "marks";

    marksInput.min =
        "0";

    marksInput.max =
        "100";

    const removeButton =
        document.createElement(
            "button"
        );

    removeButton.className =
        "remove-subject";

    removeButton.type =
        "button";

    removeButton.textContent =
        "✕";

    removeButton.onclick =
        () => row.remove();

    row.appendChild(
        nameInput
    );

    row.appendChild(
        marksInput
    );

    row.appendChild(
        removeButton
    );

    container.appendChild(
        row
    );
}

function removeSubject(
    button
) {

    button
        ?.parentElement
        ?.remove();
}

function calculateMarks() {

    const marksInputs =
        document.querySelectorAll(
            "#subjects .marks"
        );

    const result =
        document.getElementById(
            "marksResult"
        );

    if (!result) {
        return;
    }

    let total = 0;
    let subjects = 0;

    marksInputs.forEach(
        input => {

            if (
                input.value === ""
            ) {
                return;
            }

            const value =
                Number(
                    input.value
                );

            if (
                Number.isFinite(
                    value
                ) &&
                value >= 0 &&
                value <= 100
            ) {

                total += value;
                subjects++;
            }
        }
    );

    if (
        subjects === 0
    ) {

        result.innerHTML =
            "<p>Please enter your marks first.</p>";

        return;
    }

    const maximum =
        subjects * 100;

    const percentage =
        (
            total /
            maximum
        ) *
        100;

    let grade;

    if (
        percentage >= 90
    ) {
        grade = "A+ 🏆";
    } else if (
        percentage >= 80
    ) {
        grade = "A 🔥";
    } else if (
        percentage >= 70
    ) {
        grade = "B 👍";
    } else if (
        percentage >= 60
    ) {
        grade = "C 🙂";
    } else if (
        percentage >= 50
    ) {
        grade = "D";
    } else {
        grade = "F";
    }

    result.innerHTML = `
        <h3>📊 Your Result</h3>
        <p>Subjects: <strong>${subjects}</strong></p>
        <p>Total: <strong>${total} / ${maximum}</strong></p>
        <p>Percentage: <strong>${percentage.toFixed(2)}%</strong></p>
        <p>Grade: <strong>${grade}</strong></p>
    `;
}


// ============================================================
// CGPA CALCULATOR
// ============================================================

let cgpaSubjectCount = 0;

function openCGPA() {

    hideAllTools();

    const tool =
        document.getElementById(
            "cgpaTool"
        );

    if (tool) {
        tool.style.display =
            "block";
    }

    if (
        document.querySelectorAll(
            "#cgpaSubjects .cgpa-row"
        ).length === 0
    ) {

        addCGPASubject();
        addCGPASubject();
        addCGPASubject();
    }
}

function closeCGPA() {

    const tool =
        document.getElementById(
            "cgpaTool"
        );

    if (tool) {
        tool.style.display =
            "none";
    }

    showMenu();
}

function addCGPASubject() {

    cgpaSubjectCount++;

    const container =
        document.getElementById(
            "cgpaSubjects"
        );

    if (!container) {
        return;
    }

    const row =
        document.createElement(
            "div"
        );

    row.className =
        "cgpa-row";

    const nameInput =
        document.createElement(
            "input"
        );

    nameInput.type =
        "text";

    nameInput.placeholder =
        `Subject ${cgpaSubjectCount}`;

    const gradeInput =
        document.createElement(
            "input"
        );

    gradeInput.type =
        "number";

    gradeInput.className =
        "grade-point";

    gradeInput.placeholder =
        "Grade Point";

    gradeInput.min =
        "0";

    gradeInput.max =
        "10";

    gradeInput.step =
        "0.1";

    const removeButton =
        document.createElement(
            "button"
        );

    removeButton.className =
        "remove-subject";

    removeButton.type =
        "button";

    removeButton.textContent =
        "✕";

    removeButton.onclick =
        () => row.remove();

    row.appendChild(
        nameInput
    );

    row.appendChild(
        gradeInput
    );

    row.appendChild(
        removeButton
    );

    container.appendChild(
        row
    );
}

function calculateCGPA() {

    const inputs =
        document.querySelectorAll(
            "#cgpaSubjects .grade-point"
        );

    const result =
        document.getElementById(
            "cgpaResult"
        );

    if (!result) {
        return;
    }

    let total = 0;
    let count = 0;

    inputs.forEach(
        input => {

            if (
                input.value === ""
            ) {
                return;
            }

            const value =
                Number(
                    input.value
                );

            if (
                Number.isFinite(
                    value
                ) &&
                value >= 0 &&
                value <= 10
            ) {

                total += value;
                count++;
            }
        }
    );

    if (
        count === 0
    ) {

        result.innerHTML =
            "<p>Please enter your grade points.</p>";

        return;
    }

    const cgpa =
        total /
        count;

    result.innerHTML = `
        <h3>🎯 Your Result</h3>
        <p>Subjects: <strong>${count}</strong></p>
        <p>CGPA: <strong>${cgpa.toFixed(2)}</strong></p>
    `;
}


// ============================================================
// STUDY TIMER
// ============================================================

let timerSeconds =
    25 * 60;

let timerInterval =
    null;

let timerRunning =
    false;

function openTimer() {

    hideAllTools();

    const tool =
        document.getElementById(
            "timerTool"
        );

    if (tool) {
        tool.style.display =
            "block";
    }

    updateTimerDisplay();
}

function closeTimer() {

    pauseTimer();

    const tool =
        document.getElementById(
            "timerTool"
        );

    if (tool) {
        tool.style.display =
            "none";
    }

    showMenu();
}

function updateTimerDisplay() {

    const display =
        document.getElementById(
            "timerDisplay"
        );

    if (!display) {
        return;
    }

    const minutes =
        Math.floor(
            timerSeconds /
            60
        );

    const seconds =
        timerSeconds %
        60;

    display.textContent =
        `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function startTimer() {

    if (
        timerRunning ||
        timerSeconds <= 0
    ) {
        return;
    }

    timerRunning =
        true;

    const message =
        document.getElementById(
            "timerMessage"
        );

    if (message) {
        message.textContent =
            "Focus mode activated! 🔥";
    }

    timerInterval =
        setInterval(
            () => {

                timerSeconds--;

                updateTimerDisplay();

                if (
                    timerSeconds <= 0
                ) {

                    clearInterval(
                        timerInterval
                    );

                    timerInterval =
                        null;

                    timerRunning =
                        false;

                    if (message) {
                        message.textContent =
                            "🎉 Time's up! Great work!";
                    }

                    showFancyAlert(
                        "Your study session is complete. Great work! 🎉",
                        "Session Complete!",
                        "🎉",
                        "Awesome! 🚀"
                    );
                }

            },
            1000
        );
}

function pauseTimer() {

    clearInterval(
        timerInterval
    );

    timerInterval =
        null;

    timerRunning =
        false;

    const message =
        document.getElementById(
            "timerMessage"
        );

    if (message) {
        message.textContent =
            "Timer paused ⏸️";
    }
}

function resetTimer() {

    clearInterval(
        timerInterval
    );

    timerInterval =
        null;

    timerRunning =
        false;

    timerSeconds =
        25 * 60;

    updateTimerDisplay();

    const message =
        document.getElementById(
            "timerMessage"
        );

    if (message) {
        message.textContent =
            "Ready for another session! 💪";
    }
}

function setCustomTimer() {

    const input =
        document.getElementById(
            "timerMinutes"
        );

    if (!input) {
        return;
    }

    const minutes =
        Number(
            input.value
        );

    if (
        !Number.isFinite(
            minutes
        ) ||
        minutes < 1 ||
        minutes > 180
    ) {

        showFancyAlert(
            "Please enter a study time between 1 and 180 minutes.",
            "Invalid Time",
            "⏱️",
            "Try Again"
        );

        return;
    }

    clearInterval(
        timerInterval
    );

    timerInterval =
        null;

    timerRunning =
        false;

    timerSeconds =
        Math.floor(
            minutes * 60
        );

    updateTimerDisplay();

    input.value =
        "";

    const message =
        document.getElementById(
            "timerMessage"
        );

    if (message) {
        message.textContent =
            `${minutes} minute timer set! 🎯`;
    }
}


// ============================================================
// STUDY TIMETABLE
// ============================================================

let timetableEntries = [];

try {

    timetableEntries =
        JSON.parse(
            localStorage.getItem(
                "studentToolkitTimetable"
            ) || "[]"
        );

    if (
        !Array.isArray(
            timetableEntries
        )
    ) {
        timetableEntries = [];
    }

} catch (error) {

    console.warn(
        "Could not load timetable:",
        error
    );

    timetableEntries = [];
}

function saveTimetable() {

    localStorage.setItem(
        "studentToolkitTimetable",
        JSON.stringify(
            timetableEntries
        )
    );
}

function openTimetable() {

    hideAllTools();

    const tool =
        document.getElementById(
            "timetableTool"
        );

    if (tool) {
        tool.style.display =
            "block";
    }

    displayTimetable();
}

function closeTimetable() {

    const tool =
        document.getElementById(
            "timetableTool"
        );

    if (tool) {
        tool.style.display =
            "none";
    }

    showMenu();
}

function addTimetableEntry() {

    const day =
        document.getElementById(
            "timetableDay"
        )?.value || "";

    const time =
        document.getElementById(
            "timetableTime"
        )?.value || "";

    const subject =
        document.getElementById(
            "timetableSubject"
        )?.value.trim() || "";

    if (
        !day ||
        !time ||
        !subject
    ) {

        showFancyAlert(
            "Please select a day, choose a time and enter a subject.",
            "Almost There!",
            "📚",
            "Got It ✨"
        );

        return;
    }

    timetableEntries.push({
        day: day,
        time: time,
        subject: subject
    });

    saveTimetable();

    displayTimetable();

    document.getElementById(
        "timetableDay"
    ).value = "";

    document.getElementById(
        "timetableTime"
    ).value = "";

    document.getElementById(
        "timetableSubject"
    ).value = "";
}

function deleteTimetableEntry(
    index
) {

    if (
        index < 0 ||
        index >= timetableEntries.length
    ) {
        return;
    }

    timetableEntries.splice(
        index,
        1
    );

    saveTimetable();

    displayTimetable();
}

function clearTimetable() {

    if (
        timetableEntries.length === 0
    ) {
        return;
    }

    showFancyAlert(
        "This will remove every session from your timetable.",
        "Clear Timetable?",
        "🗑️",
        "Close"
    );

    const confirmed =
        confirm(
            "Clear your entire study timetable?"
        );

    if (!confirmed) {
        return;
    }

    timetableEntries = [];

    saveTimetable();

    displayTimetable();
}

function displayTimetable() {

    const days = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
    ];

    const dayOrder = {
        Monday: 1,
        Tuesday: 2,
        Wednesday: 3,
        Thursday: 4,
        Friday: 5,
        Saturday: 6,
        Sunday: 7
    };

    days.forEach(
        day => {

            const container =
                document.getElementById(
                    `${day}Sessions`
                );

            if (container) {
                container.innerHTML =
                    "";
            }
        }
    );

    const sortedEntries =
        timetableEntries
            .map(
                (
                    entry,
                    index
                ) => ({
                    ...entry,
                    originalIndex:
                        index
                })
            )
            .sort(
                (
                    a,
                    b
                ) => {

                    const dayDifference =
                        (
                            dayOrder[
                                a.day
                            ] || 99
                        ) -
                        (
                            dayOrder[
                                b.day
                            ] || 99
                        );

                    if (
                        dayDifference !== 0
                    ) {
                        return dayDifference;
                    }

                    return String(
                        a.time
                    ).localeCompare(
                        String(
                            b.time
                        )
                    );
                }
            );

    days.forEach(
        day => {

            const container =
                document.getElementById(
                    `${day}Sessions`
                );

            if (!container) {
                return;
            }

            const dayEntries =
                sortedEntries.filter(
                    entry =>
                        entry.day ===
                        day
                );

            if (
                dayEntries.length === 0
            ) {

                const empty =
                    document.createElement(
                        "div"
                    );

                empty.className =
                    "empty-day";

                empty.textContent =
                    "No sessions";

                container.appendChild(
                    empty
                );

                return;
            }

            dayEntries.forEach(
                entry => {

                    const card =
                        document.createElement(
                            "div"
                        );

                    card.className =
                        "session-card";

                    const time =
                        document.createElement(
                            "strong"
                        );

                    time.textContent =
                        entry.time;

                    const subject =
                        document.createElement(
                            "span"
                        );

                    subject.textContent =
                        entry.subject;

                    const deleteButton =
                        document.createElement(
                            "button"
                        );

                    deleteButton.type =
                        "button";

                    deleteButton.className =
                        "delete-session";

                    deleteButton.textContent =
                        "🗑️";

                    deleteButton.title =
                        "Delete session";

                    deleteButton.onclick =
                        () =>
                            deleteTimetableEntry(
                                entry.originalIndex
                            );

                    card.appendChild(
                        time
                    );

                    card.appendChild(
                        subject
                    );

                    card.appendChild(
                        deleteButton
                    );

                    container.appendChild(
                        card
                    );
                }
            );
        }
    );
}


// ============================================================
// UNIT CONVERTER
// ============================================================

const converterUnits = {

    length: {

        meter: {
            name: "Meters",
            factor: 1
        },

        kilometer: {
            name: "Kilometers",
            factor: 1000
        },

        centimeter: {
            name: "Centimeters",
            factor: 0.01
        },

        millimeter: {
            name: "Millimeters",
            factor: 0.001
        },

        mile: {
            name: "Miles",
            factor: 1609.344
        },

        yard: {
            name: "Yards",
            factor: 0.9144
        },

        foot: {
            name: "Feet",
            factor: 0.3048
        },

        inch: {
            name: "Inches",
            factor: 0.0254
        }
    },

    weight: {

        kilogram: {
            name: "Kilograms",
            factor: 1
        },

        gram: {
            name: "Grams",
            factor: 0.001
        },

        milligram: {
            name: "Milligrams",
            factor: 0.000001
        },

        pound: {
            name: "Pounds",
            factor: 0.45359237
        },

        ounce: {
            name: "Ounces",
            factor: 0.028349523125
        }
    },

    volume: {

        liter: {
            name: "Liters",
            factor: 1
        },

        milliliter: {
            name: "Milliliters",
            factor: 0.001
        },

        cubicMeter: {
            name: "Cubic Meters",
            factor: 1000
        },

        gallon: {
            name: "US Gallons",
            factor: 3.785411784
        },

        cup: {
            name: "US Cups",
            factor: 0.2365882365
        }
    },

    temperature: {

        celsius: {
            name: "Celsius"
        },

        fahrenheit: {
            name: "Fahrenheit"
        },

        kelvin: {
            name: "Kelvin"
        }
    }
};

function updateConverterUnits() {

    const category =
        document.getElementById(
            "converterCategory"
        )?.value ||
        "length";

    const from =
        document.getElementById(
            "converterFrom"
        );

    const to =
        document.getElementById(
            "converterTo"
        );

    if (
        !from ||
        !to
    ) {
        return;
    }

    from.innerHTML =
        "";

    to.innerHTML =
        "";

    Object.entries(
        converterUnits[
            category
        ]
    ).forEach(
        (
            [
                key,
                unit
            ]
        ) => {

            const fromOption =
                document.createElement(
                    "option"
                );

            fromOption.value =
                key;

            fromOption.textContent =
                unit.name;

            from.appendChild(
                fromOption
            );

            const toOption =
                document.createElement(
                    "option"
                );

            toOption.value =
                key;

            toOption.textContent =
                unit.name;

            to.appendChild(
                toOption
            );
        }
    );

    if (
        to.options.length > 1
    ) {
        to.selectedIndex =
            1;
    }

    convertUnits();
}

function convertTemperature(
    value,
    from,
    to
) {

    let celsius;

    if (
        from === "celsius"
    ) {

        celsius =
            value;

    } else if (
        from === "fahrenheit"
    ) {

        celsius =
            (
                value - 32
            ) *
            5 /
            9;

    } else {

        celsius =
            value - 273.15;
    }

    if (
        to === "celsius"
    ) {
        return celsius;
    }

    if (
        to === "fahrenheit"
    ) {

        return (
            celsius *
            9 /
            5
        ) + 32;
    }

    return (
        celsius +
        273.15
    );
}

function convertUnits() {

    const category =
        document.getElementById(
            "converterCategory"
        )?.value ||
        "length";

    const valueInput =
        document.getElementById(
            "converterValue"
        );

    const from =
        document.getElementById(
            "converterFrom"
        )?.value;

    const to =
        document.getElementById(
            "converterTo"
        )?.value;

    const result =
        document.getElementById(
            "converterResult"
        );

    if (
        !valueInput ||
        !result ||
        !from ||
        !to
    ) {
        return;
    }

    if (
        valueInput.value === ""
    ) {

        result.textContent =
            "Enter a value to convert.";

        return;
    }

    const value =
        Number(
            valueInput.value
        );

    if (
        !Number.isFinite(
            value
        )
    ) {

        result.textContent =
            "Please enter a valid number.";

        return;
    }

    let converted;

    if (
        category ===
        "temperature"
    ) {

        converted =
            convertTemperature(
                value,
                from,
                to
            );

    } else {

        const units =
            converterUnits[
                category
            ];

        const baseValue =
            value *
            units[from].factor;

        converted =
            baseValue /
            units[to].factor;
    }

    const fromName =
        converterUnits[
            category
        ][from].name;

    const toName =
        converterUnits[
            category
        ][to].name;

    result.textContent =
        `${value} ${fromName} = ${Number(converted.toFixed(8))} ${toName}`;
}

function swapUnits() {

    const from =
        document.getElementById(
            "converterFrom"
        );

    const to =
        document.getElementById(
            "converterTo"
        );

    if (
        !from ||
        !to
    ) {
        return;
    }

    const oldFrom =
        from.value;

    from.value =
        to.value;

    to.value =
        oldFrom;

    convertUnits();
}

function openConverter() {

    hideAllTools();

    const tool =
        document.getElementById(
            "converterTool"
        );

    if (tool) {
        tool.style.display =
            "block";
    }

    updateConverterUnits();
}

function closeConverter() {

    const tool =
        document.getElementById(
            "converterTool"
        );

    if (tool) {
        tool.style.display =
            "none";
    }

    showMenu();
}


// ============================================================
// INITIALIZATION
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        // 🌙 Initialize theme FIRST
        initializeTheme();

        showMenu();

        updateConverterUnits();

        displayTimetable();

        loadSupabase()
            .then(
                () => {

                    console.log(
                        "✅ Student Toolkit + Supabase ready!"
                    );

                    updateAuthUI(
                        null
                    );

                    setupAuthListener();

                    checkLoggedInUser();
                }
            )
            .catch(
                error => {

                    console.error(
                        "Supabase connection error:",
                        error
                    );

                    updateAuthUI(
                        null
                    );
                }
            );

        [
            "authName",
            "authEmail",
            "authPassword"
        ].forEach(
            id => {

                const input =
                    document.getElementById(
                        id
                    );

                if (!input) {
                    return;
                }

                input.addEventListener(
                    "keydown",
                    event => {

                        if (
                            event.key ===
                            "Enter"
                        ) {
                            submitAuth();
                        }
                    }
                );
            }
        );
    }
);