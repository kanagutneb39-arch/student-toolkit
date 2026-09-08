// ============================================================
// STUDENT TOOLKIT
// BRAND-NEW SCRIPT.JS
// ============================================================


// ============================================================
// SUPABASE
// ============================================================

const SUPABASE_URL =
    "https://vfvghqnokipcqycfiznf.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_SbJXqQdFQtJnQliCwk1eDg_znXLy9cL";

let supabaseClient = null;


// Load Supabase
async function loadSupabase() {
    if (typeof window.supabase === "undefined") {
        throw new Error("Supabase library was not loaded.");
    }

    supabaseClient = window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY
    );

    return supabaseClient;
}


// ============================================================
// GLOBAL STATE
// ============================================================

let authMode = "login";

// Premium state
let isPremium = false;
let premiumUntil = null;

let timerInterval = null;
let timerSeconds = 25 * 60;
let timerRunning = false;

let timetableEntries = [];

const timetableDays = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday"
];


// ============================================================
// THEME / DARK MODE
// ============================================================

function applyTheme(theme) {
    const body = document.body;
    const button = document.getElementById("themeToggle");

    if (!body) return;

    if (theme === "dark") {
        body.classList.add("dark-mode");

        if (button) {
            button.textContent = "☀️ Light Mode";
            button.setAttribute(
                "aria-label",
                "Switch to light mode"
            );
        }
    } else {
        body.classList.remove("dark-mode");

        if (button) {
            button.textContent = "🌙 Dark Mode";
            button.setAttribute(
                "aria-label",
                "Switch to dark mode"
            );
        }
    }
}


function getSystemTheme() {
    if (
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
        return "dark";
    }

    return "light";
}


function initializeTheme() {
    const savedTheme =
        localStorage.getItem("studentToolkitTheme");

    if (savedTheme === "dark" || savedTheme === "light") {
        applyTheme(savedTheme);
    } else {
        applyTheme(getSystemTheme());
    }
}


function toggleTheme() {
    const isDark =
        document.body.classList.contains("dark-mode");

    const newTheme = isDark ? "light" : "dark";

    localStorage.setItem(
        "studentToolkitTheme",
        newTheme
    );

    applyTheme(newTheme);
}


// ============================================================
// FANCY ALERT
// ============================================================

function showFancyAlert(
    title,
    message,
    icon = "✨"
) {
    const alertBox =
        document.getElementById("fancyAlert");

    const iconElement =
        document.getElementById("fancyAlertIcon");

    const titleElement =
        document.getElementById("fancyAlertTitle");

    const messageElement =
        document.getElementById("fancyAlertMessage");

    if (!alertBox) {
        console.log(title, message);
        return;
    }

    if (iconElement) {
        iconElement.textContent = icon;
    }

    if (titleElement) {
        titleElement.textContent = title;
    }

    if (messageElement) {
        messageElement.textContent = message;
    }

    alertBox.classList.add("show");
    alertBox.setAttribute("aria-hidden", "false");
}


function closeFancyAlert() {
    const alertBox =
        document.getElementById("fancyAlert");

    if (!alertBox) return;

    alertBox.classList.remove("show");
    alertBox.setAttribute("aria-hidden", "true");
}


// Close fancy alert when clicking outside the card
document.addEventListener("click", function (event) {
    const alertBox =
        document.getElementById("fancyAlert");

    const card =
        document.querySelector(".fancy-alert-card");

    if (
        alertBox &&
        card &&
        event.target === alertBox
    ) {
        closeFancyAlert();
    }
});


// ============================================================
// NAVIGATION
// ============================================================

function hideAllTools() {
    const tools = document.querySelectorAll(".calculator");

    tools.forEach(tool => {
        tool.style.display = "none";
    });
}


function showMenu() {
    hideAllTools();

    const menu =
        document.getElementById("toolMenu");

    if (menu) {
        menu.style.display = "grid";
    }
}


function openTool(toolId) {
    hideAllTools();

    const tool =
        document.getElementById(toolId);

    if (tool) {
        tool.style.display = "block";
    }
}


function closeTool() {
    showMenu();
}


// ============================================================
// AUTHENTICATION
// ============================================================

function openAuth() {
    const authTool =
        document.getElementById("authTool");

    if (!authTool) return;

    hideAllTools();

    authTool.style.display = "block";

    updateAuthForm();
}


function closeAuth() {
    showMenu();
}


function toggleAuthMode() {
    authMode =
        authMode === "login"
            ? "signup"
            : "login";

    updateAuthForm();
}


function updateAuthForm() {
    const title =
        document.getElementById("authTitle");

    const description =
        document.getElementById("authDescription");

    const nameField =
        document.getElementById("nameField");

    const submitButton =
        document.getElementById("authSubmitButton");

    const switchButton =
        document.getElementById("authSwitchButton");

    const message =
        document.getElementById("authMessage");

    if (authMode === "signup") {
        if (title) {
            title.textContent = "📝 Create Account";
        }

        if (description) {
            description.textContent =
                "Create your Student Toolkit account.";
        }

        if (nameField) {
            nameField.hidden = false;
            nameField.style.display = "block";
        }

        if (submitButton) {
            submitButton.textContent =
                "Create Account";
        }

        if (switchButton) {
            switchButton.textContent =
                "Already have an account? Login";
        }
    } else {
        if (title) {
            title.textContent = "🔐 Login";
        }

        if (description) {
            description.textContent =
                "Login to your Student Toolkit account.";
        }

        if (nameField) {
            nameField.hidden = true;
            nameField.style.display = "none";
        }

        if (submitButton) {
            submitButton.textContent =
                "Login";
        }

        if (switchButton) {
            switchButton.textContent =
                "Don't have an account? Sign Up";
        }
    }

    if (message) {
        message.textContent = "";
    }
}


function setAuthMessage(message, success = false) {
    const element =
        document.getElementById("authMessage");

    if (!element) return;

    element.textContent = message;

    element.classList.toggle(
        "success",
        success
    );

    element.classList.toggle(
        "error",
        !success
    );
}


async function submitAuth() {
    if (!supabaseClient) {
        setAuthMessage(
            "Authentication is still loading. Please try again."
        );
        return;
    }

    const email =
        document.getElementById("authEmail")?.value.trim();

    const password =
        document.getElementById("authPassword")?.value;

    const name =
        document.getElementById("authName")?.value.trim();

    if (!email || !password) {
        setAuthMessage(
            "Please enter your email and password."
        );
        return;
    }

    if (authMode === "signup" && !name) {
        setAuthMessage(
            "Please enter your name."
        );
        return;
    }

    try {
        setAuthMessage("Please wait...", true);

        if (authMode === "signup") {
            const { data, error } =
                await supabaseClient.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: name
                        }
                    }
                });

            if (error) {
                throw error;
            }

            if (data.user && !data.session) {
                setAuthMessage(
                    "Account created! Check your email to confirm your account.",
                    true
                );
            } else {
                setAuthMessage(
                    "Account created successfully! 🎉",
                    true
                );
            }
        } else {
            const { error } =
                await supabaseClient.auth.signInWithPassword({
                    email,
                    password
                });

            if (error) {
                throw error;
            }

            setAuthMessage(
                "Login successful! 🎉",
                true
            );

            await checkLoggedInUser();
        }
    } catch (error) {
        console.error("Authentication error:", error);

        setAuthMessage(
            error.message ||
            "Something went wrong. Please try again."
        );
    }
}


async function logout() {
    if (!supabaseClient) return;

    try {
        const { error } =
            await supabaseClient.auth.signOut();

        if (error) {
            throw error;
        }

        updateAuthUI(null);

        showFancyAlert(
            "Logged out",
            "You have been safely logged out.",
            "👋"
        );
    } catch (error) {
        console.error("Logout error:", error);

        showFancyAlert(
            "Logout failed",
            "Something went wrong while logging out.",
            "⚠️"
        );
    }
}


function updateAuthUI(user) {
    const status =
        document.getElementById("authStatusText");

    const button =
        document.getElementById("authButton");

    if (!status || !button) return;

    if (user) {
        const name =
            user.user_metadata?.full_name ||
            user.email?.split("@")[0] ||
            "Student";

        status.textContent =
            `👋 Hi, ${name}`;

        button.textContent =
            "🚪 Logout";

        button.onclick = logout;
    } else {
        status.textContent =
            "Not logged in";

        button.textContent =
            "🔐 Login / Sign Up";

        button.onclick = openAuth;
    }
}


async function checkLoggedInUser() {
    console.log("🔥 CHECK LOGGED IN USER STARTED");

    if (!supabaseClient) {
        console.log("❌ Supabase client is missing");
        return;
    }

    try {
        const {
            data,
            error
        } = await supabaseClient.auth.getUser();

        if (error || !data.user) {
            isPremium = false;
            premiumUntil = null;

            updateAuthUI(null);
            return;
        }

        const user = data.user;

        const {
            data: profile,
            error: profileError
        } = await supabaseClient
            .from("profiles")
            .select("is_premium, premium_until")
            .eq("id", user.id)
            .maybeSingle();

        console.log("DEBUG USER ID:", user.id);
        console.log("DEBUG PROFILE:", profile);
        console.log("DEBUG PROFILE ERROR:", profileError);

        const debugProfile = document.getElementById("premiumDebugStatus");

        if (debugProfile) {
            debugProfile.innerHTML =
                "👤 Logged in: Yes<br>" +
                "🆔 User ID: " + user.id + "<br>" +
                "📦 Profile found: " + (profile ? "Yes" : "NO") + "<br>" +
                "👑 Database Premium: " + String(profile?.is_premium) + "<br>" +
                "⏰ Database expiry: " + String(profile?.premium_until);
        }

        if (profileError) {
            console.error(
                "Loading premium status failed:",
                profileError
            );

            isPremium = false;
            premiumUntil = null;
        } else {
            console.log("🧪 RAW PREMIUM VALUE:", profile?.is_premium);
            console.log("🧪 PREMIUM VALUE TYPE:", typeof profile?.is_premium);
            console.log("🧪 RAW EXPIRY VALUE:", profile?.premium_until);

            isPremium = profile?.is_premium === true;
            premiumUntil = profile?.premium_until || null;

            if (isPremium && premiumUntil) {
            const expiryDate = new Date(premiumUntil);
            const nowDate = new Date();

            console.log("🧪 PREMIUM DATE DEBUG");
            console.log("Database expiry:", premiumUntil);
            console.log("Expiry date:", expiryDate);
            console.log("Current date:", nowDate);
            console.log("Expiry timestamp:", expiryDate.getTime());
            console.log("Current timestamp:", nowDate.getTime());
            console.log(
                "Is expired:",
                expiryDate <= nowDate
            );

            if (expiryDate <= nowDate) {
                isPremium = false;
            }
        }
        }

        updateAuthUI(user);

        const debug = document.getElementById("premiumDebugStatus");

        if (debug) {
            debug.innerHTML =
                "👤 Logged in: Yes<br>" +
                "👑 Premium: " + (isPremium ? "YES" : "NO") + "<br>" +
                "⏰ Premium until: " + (premiumUntil || "Not set");
        }

        console.log(
            "Premium status:",
            isPremium,
            "Until:",
            premiumUntil
        );

    } catch (error) {
        console.error(
            "Checking logged-in user failed:",
            error
        );

        isPremium = false;
        premiumUntil = null;

        updateAuthUI(null);
    }
}

function setupAuthListener() {
    if (!supabaseClient) return;

    supabaseClient.auth.onAuthStateChange(
        (_event, session) => {
            updateAuthUI(
                session?.user || null
            );
        }
    );
}


// ============================================================
// PERCENTAGE CALCULATOR
// ============================================================

function openPercentage() {
    openTool("percentageTool");
}


function calculatePercentage() {
    const value =
        Number(
            document.getElementById("percentageValue")?.value
        );

    const total =
        Number(
            document.getElementById("percentageTotal")?.value
        );

    const result =
        document.getElementById("percentageResult");

    if (!result) return;

    if (
        !Number.isFinite(value) ||
        !Number.isFinite(total)
    ) {
        result.textContent =
            "Please enter valid numbers.";

        return;
    }

    if (total === 0) {
        result.textContent =
            "Total cannot be zero.";

        return;
    }

    const percentage =
        (value / total) * 100;

    result.textContent =
        `${percentage.toFixed(2)}%`;
}


// ============================================================
// MARKS CALCULATOR
// ============================================================

function openMarks() {
    openTool("marksTool");
}


function calculateMarks() {
    const marks =
        Number(
            document.getElementById("marksObtained")?.value
        );

    const total =
        Number(
            document.getElementById("marksTotal")?.value
        );

    const result =
        document.getElementById("marksResult");

    if (!result) return;

    if (
        !Number.isFinite(marks) ||
        !Number.isFinite(total)
    ) {
        result.textContent =
            "Please enter valid marks.";

        return;
    }

    if (total <= 0) {
        result.textContent =
            "Total marks must be greater than zero.";

        return;
    }

    if (marks < 0 || marks > total) {
        result.textContent =
            "Obtained marks must be between 0 and total marks.";

        return;
    }

    const percentage =
        (marks / total) * 100;

    result.textContent =
        `${percentage.toFixed(2)}%`;
}


// ============================================================
// CGPA CALCULATOR
// ============================================================

function openCGPA() {
    openTool("cgpaTool");
}


function calculateCGPA() {
    const inputs =
        document.querySelectorAll(
            ".cgpa-input"
        );

    const result =
        document.getElementById("cgpaResult");

    if (!result) return;

    if (!inputs.length) {
        result.textContent =
            "Add your grade points first.";

        return;
    }

    let total = 0;
    let count = 0;

    inputs.forEach(input => {
        const value =
            Number(input.value);

        if (
            input.value.trim() !== "" &&
            Number.isFinite(value)
        ) {
            total += value;
            count++;
        }
    });

    if (count === 0) {
        result.textContent =
            "Please enter at least one grade point.";

        return;
    }

    const cgpa =
        total / count;

    result.textContent =
        `CGPA: ${cgpa.toFixed(2)}`;
}


// ============================================================
// STUDY TIMER
// ============================================================

function openTimer() {
    openTool("timerTool");

    updateTimerDisplay();
}


function updateTimerDisplay() {
    const display =
        document.getElementById("timerDisplay");

    if (!display) return;

    const minutes =
        Math.floor(timerSeconds / 60);

    const seconds =
        timerSeconds % 60;

    display.textContent =
        `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}


function startTimer() {
    if (timerRunning) return;

    timerRunning = true;

    timerInterval =
        setInterval(() => {
            if (timerSeconds > 0) {
                timerSeconds--;

                updateTimerDisplay();
            } else {
                stopTimer();

                showFancyAlert(
                    "Time's up! ⏰",
                    "Great job! Your study session is complete.",
                    "🎉"
                );
            }
        }, 1000);
}


function stopTimer() {
    timerRunning = false;

    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}


function resetTimer() {
    stopTimer();

    timerSeconds = 25 * 60;

    updateTimerDisplay();
}


function setTimer(minutes) {
    stopTimer();

    const value =
        Number(minutes);

    if (
        !Number.isFinite(value) ||
        value <= 0
    ) {
        return;
    }

    timerSeconds =
        Math.floor(value * 60);

    updateTimerDisplay();
}


// ============================================================
// TIMETABLE
// ============================================================

function openTimetable() {
    hideAllTools();

    const tool =
        document.getElementById("timetableTool");

    if (tool) {
        tool.style.display = "block";
    }

    renderTimetable();

    if (timetableIsEmpty()) {
        showFancyAlert(
            "Almost there! 📅",
            "Your timetable is empty. Add your first study session to get started! 📚✨",
            "📚"
        );
    }
}


function timetableIsEmpty() {
    return timetableEntries.length === 0;
}


function saveTimetable() {
    localStorage.setItem(
        "studentToolkitTimetable",
        JSON.stringify(timetableEntries)
    );
}


function loadTimetable() {
    try {
        const saved =
            localStorage.getItem(
                "studentToolkitTimetable"
            );

        if (!saved) {
            timetableEntries = [];
            return;
        }

        const parsed =
            JSON.parse(saved);

        if (Array.isArray(parsed)) {
            timetableEntries = parsed;
        } else {
            timetableEntries = [];
        }
    } catch (error) {
        console.error(
            "Could not load timetable:",
            error
        );

        timetableEntries = [];
    }
}


function addTimetableEntry() {
    const day =
        document.getElementById("timetableDay")?.value;

    const time =
        document.getElementById("timetableTime")?.value;

    const subject =
        document.getElementById("timetableSubject")?.value.trim();

    if (!day || !time || !subject) {
        showFancyAlert(
            "Almost there! 📅",
            "Please choose a day, time, and subject.",
            "⚠️"
        );

        return;
    }

    const entry = {
        id:
            Date.now().toString() +
            Math.random().toString(36).slice(2),

        day,
        time,
        subject
    };

    timetableEntries.push(entry);

    timetableEntries.sort((a, b) => {
        const dayA =
            timetableDays.indexOf(a.day);

        const dayB =
            timetableDays.indexOf(b.day);

        if (dayA !== dayB) {
            return dayA - dayB;
        }

        return a.time.localeCompare(b.time);
    });

    saveTimetable();
    renderTimetable();

    const subjectInput =
        document.getElementById("timetableSubject");

    if (subjectInput) {
        subjectInput.value = "";
    }

    showFancyAlert(
        "Session added! 🎉",
        `${subject} has been added to your timetable.`,
        "📚"
    );
}


function renderTimetable() {
    timetableDays.forEach(day => {
        const container =
            document.getElementById(
                `${day}Sessions`
            );

        if (!container) return;

        container.innerHTML = "";

        const sessions =
            timetableEntries
                .filter(entry => entry.day === day)
                .sort((a, b) =>
                    a.time.localeCompare(b.time)
                );

        if (sessions.length === 0) {
            const empty =
                document.createElement("div");

            empty.className = "empty-day";
            empty.textContent =
                "No sessions yet";

            container.appendChild(empty);

            return;
        }

        sessions.forEach(entry => {
            const session =
                document.createElement("div");

            session.className =
                "session-card";

            const time =
                document.createElement("div");

            time.className =
                "session-time";

            time.textContent =
                entry.time;

            const subject =
                document.createElement("div");

            subject.className =
                "session-subject";

            subject.textContent =
                entry.subject;

            const removeButton =
                document.createElement("button");

            removeButton.className =
                "remove-session";

            removeButton.type =
                "button";

            removeButton.textContent =
                "✕";

            removeButton.setAttribute(
                "aria-label",
                `Remove ${entry.subject}`
            );

            removeButton.onclick = () => {
                removeTimetableEntry(
                    entry.id
                );
            };

            session.appendChild(time);
            session.appendChild(subject);
            session.appendChild(removeButton);

            container.appendChild(session);
        });
    });
}


function removeTimetableEntry(id) {
    const entry =
        timetableEntries.find(
            item => item.id === id
        );

    timetableEntries =
        timetableEntries.filter(
            item => item.id !== id
        );

    saveTimetable();
    renderTimetable();

    if (entry) {
        showFancyAlert(
            "Session removed",
            `${entry.subject} was removed from your timetable.`,
            "🗑️"
        );
    }
}


function clearTimetable() {
    if (timetableEntries.length === 0) {
        showFancyAlert(
            "Nothing to clear",
            "Your timetable is already empty. Add a study session first! 📚",
            "📅"
        );

        return;
    }

    timetableEntries = [];

    saveTimetable();
    renderTimetable();

    showFancyAlert(
        "Timetable cleared",
        "Your whole timetable has been cleared. You can start fresh whenever you're ready! ✨",
        "🧹"
    );
}


// ============================================================
// UNIT CONVERTER
// ============================================================

const converterUnits = {
    length: {
        meter: "Meter",
        kilometer: "Kilometer",
        centimeter: "Centimeter",
        millimeter: "Millimeter",
        mile: "Mile",
        yard: "Yard",
        foot: "Foot",
        inch: "Inch"
    },

    weight: {
        kilogram: "Kilogram",
        gram: "Gram",
        milligram: "Milligram",
        pound: "Pound",
        ounce: "Ounce"
    },

    temperature: {
        celsius: "Celsius",
        fahrenheit: "Fahrenheit",
        kelvin: "Kelvin"
    },

    volume: {
        liter: "Liter",
        milliliter: "Milliliter",
        gallon: "Gallon",
        cup: "Cup"
    }
};


function openConverter() {
    hideAllTools();

    const tool =
        document.getElementById("converterTool");

    if (tool) {
        tool.style.display = "block";
    }

    updateConverterUnits();
}


function closeConverter() {
    showMenu();
}


function updateConverterUnits() {
    const category =
        document.getElementById(
            "converterCategory"
        )?.value;

    const from =
        document.getElementById(
            "converterFrom"
        );

    const to =
        document.getElementById(
            "converterTo"
        );

    if (!category || !from || !to) {
        return;
    }

    const units =
        converterUnits[category];

    if (!units) return;

    from.innerHTML = "";
    to.innerHTML = "";

    Object.entries(units).forEach(
        ([value, label]) => {
            const fromOption =
                document.createElement("option");

            fromOption.value =
                value;

            fromOption.textContent =
                label;

            const toOption =
                document.createElement("option");

            toOption.value =
                value;

            toOption.textContent =
                label;

            from.appendChild(
                fromOption
            );

            to.appendChild(
                toOption
            );
        }
    );

    if (to.options.length > 1) {
        to.selectedIndex = 1;
    }

    convertUnits();
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

    if (!from || !to) return;

    const oldFrom =
        from.value;

    from.value =
        to.value;

    to.value =
        oldFrom;

    convertUnits();
}


function convertUnits() {
    const category =
        document.getElementById(
            "converterCategory"
        )?.value;

    const valueInput =
        document.getElementById(
            "converterValue"
        );

    const from =
        document.getElementById(
            "converterFrom"
        );

    const to =
        document.getElementById(
            "converterTo"
        );

    const result =
        document.getElementById(
            "converterResult"
        );

    if (
        !category ||
        !valueInput ||
        !from ||
        !to ||
        !result
    ) {
        return;
    }

    if (valueInput.value === "") {
        result.textContent =
            "Enter a value to convert.";

        return;
    }

    const value =
        Number(valueInput.value);

    if (!Number.isFinite(value)) {
        result.textContent =
            "Please enter a valid number.";

        return;
    }

    let converted;

    if (category === "length") {
        converted =
            convertLength(
                value,
                from.value,
                to.value
            );
    } else if (category === "weight") {
        converted =
            convertWeight(
                value,
                from.value,
                to.value
            );
    } else if (category === "temperature") {
        converted =
            convertTemperature(
                value,
                from.value,
                to.value
            );
    } else if (category === "volume") {
        converted =
            convertVolume(
                value,
                from.value,
                to.value
            );
    }

    const fromName =
        converterUnits[category][from.value]
        || from.value;

    const toName =
        converterUnits[category][to.value]
        || to.value;

    result.textContent =
        `${value} ${fromName} = ${formatNumber(converted)} ${toName}`;
}


function formatNumber(value) {
    if (!Number.isFinite(value)) {
        return "Invalid";
    }

    return Number(
        value.toFixed(8)
    ).toString();
}


function convertLength(
    value,
    from,
    to
) {
    const meters = {
        meter: 1,
        kilometer: 1000,
        centimeter: 0.01,
        millimeter: 0.001,
        mile: 1609.344,
        yard: 0.9144,
        foot: 0.3048,
        inch: 0.0254
    };

    return (
        value * meters[from]
    ) / meters[to];
}


function convertWeight(
    value,
    from,
    to
) {
    const grams = {
        kilogram: 1000,
        gram: 1,
        milligram: 0.001,
        pound: 453.59237,
        ounce: 28.349523125
    };

    return (
        value * grams[from]
    ) / grams[to];
}


function convertTemperature(
    value,
    from,
    to
) {
    let celsius;

    if (from === "celsius") {
        celsius = value;
    } else if (from === "fahrenheit") {
        celsius =
            (value - 32) * 5 / 9;
    } else {
        celsius =
            value - 273.15;
    }

    if (to === "celsius") {
        return celsius;
    }

    if (to === "fahrenheit") {
        return (
            celsius * 9 / 5 + 32
        );
    }

    return celsius + 273.15;
}


function convertVolume(
    value,
    from,
    to
) {
    const liters = {
        liter: 1,
        milliliter: 0.001,
        gallon: 3.785411784,
        cup: 0.2365882365
    };

    return (
        value * liters[from]
    ) / liters[to];
}


// ============================================================
// KEYBOARD / ESCAPE
// ============================================================

document.addEventListener(
    "keydown",
    event => {
        if (event.key === "Escape") {
            closeFancyAlert();
        }
    }
);


// ============================================================
// INITIALIZATION
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    async () => {
        initializeTheme();

        loadTimetable();
        renderTimetable();

        showMenu();

        try {
            console.log("🟢 INIT: BEFORE SUPABASE");
            await loadSupabase();
            console.log("🟢 INIT: AFTER SUPABASE");

            setupAuthListener();
            console.log("🟢 INIT: AFTER AUTH LISTENER");

            await checkLoggedInUser();
            console.log("🟢 INIT: AFTER CHECK USER");
        } catch (error) {
            console.error(
                "Supabase initialization error:",
                error
            );

            updateAuthUI(null);
        }

        updateTimerDisplay();

        updateConverterUnits();
    }
);

/* =========================
   EXAM COUNTDOWN
   ========================= */

let countdownInterval = null;

function stopCountdownInterval() {
    if (countdownInterval) {
        clearInterval(countdownInterval);
        countdownInterval = null;
    }
}

function getSavedCountdown() {
    try {
        return JSON.parse(
            localStorage.getItem("studentToolkitExamCountdown")
        );
    } catch {
        return null;
    }
}

function saveCountdown(data) {
    localStorage.setItem(
        "studentToolkitExamCountdown",
        JSON.stringify(data)
    );
}

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, function (char) {
        return {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        }[char];
    });
}

function formatCountdownDate(date) {
    return date.toLocaleDateString(undefined, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    });
}

function getCountdownParts(target) {
    const difference = target.getTime() - Date.now();

    if (difference <= 0) {
        return null;
    }

    const totalSeconds = Math.floor(difference / 1000);

    return {
        days: Math.floor(totalSeconds / 86400),
        hours: Math.floor((totalSeconds % 86400) / 3600),
        minutes: Math.floor((totalSeconds % 3600) / 60),
        seconds: totalSeconds % 60
    };
}

function renderCountdown(data) {
    const result = document.getElementById("countdownResult");

    if (!result || !data) return;

    const target = new Date(data.date + "T00:00:00");

    if (Number.isNaN(target.getTime())) {
        result.innerHTML = "❌ Invalid exam date.";
        return;
    }

    const parts = getCountdownParts(target);

    if (!parts) {
        const today = new Date();
        const examDay = target.toDateString() === today.toDateString();

        result.innerHTML = `
            <div class="countdown-exam-name">
                📚 ${escapeHTML(data.name)}
            </div>
            <div class="countdown-time">
                ${examDay ? "🎯 Exam Day!" : "⏰ Exam date has passed."}
            </div>
            <div class="countdown-date-text">
                ${formatCountdownDate(target)}
            </div>
        `;

        stopCountdownInterval();
        return;
    }

    result.innerHTML = `
        <div class="countdown-exam-name">
            📚 ${escapeHTML(data.name)}
        </div>
        <div class="countdown-time">
            ${parts.days}d ${String(parts.hours).padStart(2, "0")}h
            ${String(parts.minutes).padStart(2, "0")}m
            ${String(parts.seconds).padStart(2, "0")}s
        </div>
        <div class="countdown-date-text">
            ${formatCountdownDate(target)}
        </div>
    `;
}

function openCountdown() {
    stopCountdownInterval();

    if (typeof hideAllTools === "function") {
        hideAllTools();
    }

    document.querySelectorAll(".calculator").forEach(function (tool) {
        tool.style.display = "none";
    });

    const countdown = document.getElementById("countdownTool");

    if (!countdown) return;

    countdown.style.display = "block";

    const saved = getSavedCountdown();

    if (saved) {
        document.getElementById("countdownName").value = saved.name || "";
        document.getElementById("countdownDate").value = saved.date || "";

        renderCountdown(saved);

        countdownInterval = setInterval(function () {
            renderCountdown(saved);
        }, 1000);
    }
}

function closeCountdown() {
    stopCountdownInterval();

    const countdown = document.getElementById("countdownTool");

    if (countdown) {
        countdown.style.display = "none";
    }

    if (typeof showHome === "function") {
        showHome();
    }
}

function startCountdown() {
    const nameInput = document.getElementById("countdownName");
    const dateInput = document.getElementById("countdownDate");

    const name = nameInput.value.trim();
    const date = dateInput.value;

    if (!name || !date) {
        if (typeof showAlert === "function") {
            showAlert("Please enter the exam name and date.");
        } else {
            alert("Please enter the exam name and date.");
        }
        return;
    }

    const data = {
        name: name,
        date: date
    };

    saveCountdown(data);

    stopCountdownInterval();
    renderCountdown(data);

    countdownInterval = setInterval(function () {
        renderCountdown(data);
    }, 1000);
}

function clearCountdown() {
    stopCountdownInterval();

    localStorage.removeItem("studentToolkitExamCountdown");

    document.getElementById("countdownName").value = "";
    document.getElementById("countdownDate").value = "";

    const result = document.getElementById("countdownResult");

    if (result) {
        result.innerHTML = "Enter an exam name and date to begin.";
    }
}


/* =========================
   FANCY ALERT BRIDGE
   ========================= */

function showFancyAlert(title, message, icon = "✨") {
    const overlay = document.getElementById("fancyAlert");
    const titleEl = document.getElementById("fancyAlertTitle");
    const messageEl = document.getElementById("fancyAlertMessage");
    const iconEl = document.getElementById("fancyAlertIcon");

    if (!overlay) {
        console.warn(title + ": " + message);
        return;
    }

    if (titleEl) titleEl.textContent = title;
    if (messageEl) messageEl.textContent = message;
    if (iconEl) iconEl.textContent = icon;

    overlay.classList.add("show");
    overlay.setAttribute("aria-hidden", "false");
}

function closeFancyAlert() {
    const overlay = document.getElementById("fancyAlert");

    if (!overlay) return;

    overlay.classList.remove("show");
    overlay.setAttribute("aria-hidden", "true");
}

function showAlert(message) {
    showFancyAlert("Notice", message, "⚠️");
}


/* =========================
   TO-DO LIST
   ========================= */

const TODO_STORAGE_KEY = "studentToolkitTodos";

function getTodos() {
    try {
        return JSON.parse(
            localStorage.getItem(TODO_STORAGE_KEY)
        ) || [];
    } catch {
        return [];
    }
}

function saveTodos(todos) {
    localStorage.setItem(
        TODO_STORAGE_KEY,
        JSON.stringify(todos)
    );
}

function openTodo() {
    if (typeof hideAllTools === "function") {
        hideAllTools();
    }

    document.querySelectorAll(".calculator").forEach(function (tool) {
        tool.style.display = "none";
    });

    const todo = document.getElementById("todoTool");

    if (!todo) return;

    todo.style.display = "block";
    renderTodos();
}

function closeTodo() {
    const todo = document.getElementById("todoTool");

    if (todo) {
        todo.style.display = "none";
    }

    if (typeof showHome === "function") {
        showHome();
    }
}

function addTodo() {
    const taskInput = document.getElementById("todoTask");
    const subjectInput = document.getElementById("todoSubject");
    const dateInput = document.getElementById("todoDate");

    const task = taskInput.value.trim();
    const subject = subjectInput.value.trim();
    const dueDate = dateInput.value;

    if (!task) {
        if (typeof showAlert === "function") {
            showAlert("Please enter a task.");
        }
        return;
    }

    const todos = getTodos();

    todos.push({
        id: Date.now(),
        task: task,
        subject: subject,
        dueDate: dueDate,
        completed: false
    });

    saveTodos(todos);

    taskInput.value = "";
    subjectInput.value = "";
    dateInput.value = "";

    renderTodos();
}

function toggleTodo(id) {
    const todos = getTodos();

    const todo = todos.find(function (item) {
        return item.id === id;
    });

    if (!todo) return;

    todo.completed = !todo.completed;

    saveTodos(todos);
    renderTodos();
}

function deleteTodo(id) {
    const todos = getTodos().filter(function (item) {
        return item.id !== id;
    });

    saveTodos(todos);
    renderTodos();
}

function formatTodoDate(dateString) {
    if (!dateString) return "";

    const date = new Date(dateString + "T00:00:00");

    if (Number.isNaN(date.getTime())) return "";

    return date.toLocaleDateString(undefined, {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric"
    });
}

function isTodoOverdue(todo) {
    if (!todo.dueDate || todo.completed) return false;

    const due = new Date(todo.dueDate + "T23:59:59");

    return due.getTime() < Date.now();
}

function renderTodos() {
    const list = document.getElementById("todoList");

    if (!list) return;

    const todos = getTodos();

    if (todos.length === 0) {
        list.innerHTML = `
            <div class="todo-empty">
                📝 No tasks yet. Add your first task above!
            </div>
        `;
        return;
    }

    todos.sort(function (a, b) {
        if (a.completed !== b.completed) {
            return a.completed ? 1 : -1;
        }

        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;

        return a.dueDate.localeCompare(b.dueDate);
    });

    list.innerHTML = todos.map(function (todo) {

        const overdue = isTodoOverdue(todo);

        const dueText = todo.dueDate
            ? `
                <div class="todo-due ${overdue ? "todo-overdue" : ""}">
                    ${overdue ? "⚠️ Overdue • " : "📅 Due • "}
                    ${formatTodoDate(todo.dueDate)}
                </div>
              `
            : "";

        return `
            <div class="todo-item ${todo.completed ? "completed" : ""}">

                <input
                    class="todo-check"
                    type="checkbox"
                    ${todo.completed ? "checked" : ""}
                    onchange="toggleTodo(${todo.id})"
                >

                <div class="todo-content">

                    <div class="todo-task">
                        ${escapeHTML(todo.task)}
                    </div>

                    ${
                        todo.subject
                            ? `<div class="todo-subject">
                                📚 ${escapeHTML(todo.subject)}
                              </div>`
                            : ""
                    }

                    ${dueText}

                </div>

                <button
                    type="button"
                    class="todo-delete"
                    onclick="deleteTodo(${todo.id})"
                    aria-label="Delete task"
                >
                    🗑️
                </button>

            </div>
        `;
    }).join("");
}


/* =========================
   NOTES
   ========================= */

const NOTES_STORAGE_KEY = "studentToolkitNotes";
let editingNoteId = null;

function getNotes() {
    try {
        return JSON.parse(
            localStorage.getItem(NOTES_STORAGE_KEY)
        ) || [];
    } catch {
        return [];
    }
}

function saveNotes(notes) {
    localStorage.setItem(
        NOTES_STORAGE_KEY,
        JSON.stringify(notes)
    );
}

function openNotes() {
    if (typeof hideAllTools === "function") {
        hideAllTools();
    }

    document.querySelectorAll(".calculator").forEach(function (tool) {
        tool.style.display = "none";
    });

    const notes = document.getElementById("notesTool");

    if (!notes) return;

    notes.style.display = "block";
    renderNotes();
}

function closeNotes() {
    cancelNoteEdit();

    const notes = document.getElementById("notesTool");

    if (notes) {
        notes.style.display = "none";
    }

    if (typeof showHome === "function") {
        showHome();
    }
}

function saveNote() {
    const titleInput = document.getElementById("noteTitle");
    const subjectInput = document.getElementById("noteSubject");
    const contentInput = document.getElementById("noteContent");

    const title = titleInput.value.trim();
    const subject = subjectInput.value.trim();
    const content = contentInput.value.trim();

    if (!title || !content) {
        if (typeof showAlert === "function") {
            showAlert("Please enter a title and note content.");
        }
        return;
    }

    const notes = getNotes();

    if (editingNoteId !== null) {

        const note = notes.find(function (item) {
            return item.id === editingNoteId;
        });

        if (note) {
            note.title = title;
            note.subject = subject;
            note.content = content;
            note.updatedAt = Date.now();
        }

        editingNoteId = null;

    } else {

        notes.unshift({
            id: Date.now(),
            title: title,
            subject: subject,
            content: content,
            createdAt: Date.now(),
            updatedAt: Date.now()
        });

    }

    saveNotes(notes);

    titleInput.value = "";
    subjectInput.value = "";
    contentInput.value = "";

    const cancelButton = document.getElementById("cancelNoteButton");

    if (cancelButton) {
        cancelButton.style.display = "none";
    }

    renderNotes();
}

function editNote(id) {
    const notes = getNotes();

    const note = notes.find(function (item) {
        return item.id === id;
    });

    if (!note) return;

    document.getElementById("noteTitle").value = note.title || "";
    document.getElementById("noteSubject").value = note.subject || "";
    document.getElementById("noteContent").value = note.content || "";

    editingNoteId = id;

    const cancelButton = document.getElementById("cancelNoteButton");

    if (cancelButton) {
        cancelButton.style.display = "block";
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

function cancelNoteEdit() {
    editingNoteId = null;

    const title = document.getElementById("noteTitle");
    const subject = document.getElementById("noteSubject");
    const content = document.getElementById("noteContent");
    const cancelButton = document.getElementById("cancelNoteButton");

    if (title) title.value = "";
    if (subject) subject.value = "";
    if (content) content.value = "";

    if (cancelButton) {
        cancelButton.style.display = "none";
    }
}

function deleteNote(id) {
    const notes = getNotes().filter(function (item) {
        return item.id !== id;
    });

    saveNotes(notes);

    if (editingNoteId === id) {
        cancelNoteEdit();
    }

    renderNotes();
}

function renderNotes() {
    const list = document.getElementById("notesList");

    if (!list) return;

    const searchInput = document.getElementById("noteSearch");
    const search = searchInput
        ? searchInput.value.trim().toLowerCase()
        : "";

    const notes = getNotes();

    const filtered = notes.filter(function (note) {
        if (!search) return true;

        return (
            String(note.title || "").toLowerCase().includes(search) ||
            String(note.subject || "").toLowerCase().includes(search) ||
            String(note.content || "").toLowerCase().includes(search)
        );
    });

    if (filtered.length === 0) {
        list.innerHTML = `
            <div class="notes-empty">
                📒 ${
                    notes.length === 0
                        ? "No notes yet. Create your first note above!"
                        : "No notes match your search."
                }
            </div>
        `;
        return;
    }

    list.innerHTML = filtered.map(function (note) {

        return `
            <article class="note-card">

                <div class="note-card-title">
                    ${escapeHTML(note.title)}
                </div>

                ${
                    note.subject
                        ? `<div class="note-card-subject">
                            📚 ${escapeHTML(note.subject)}
                          </div>`
                        : ""
                }

                <div class="note-card-content">
                    ${escapeHTML(note.content)}
                </div>

                <div class="note-card-actions">

                    <button
                        type="button"
                        class="note-edit-button"
                        onclick="editNote(${note.id})"
                    >
                        ✏️ Edit
                    </button>

                    <button
                        type="button"
                        class="note-delete-button"
                        onclick="deleteNote(${note.id})"
                    >
                        🗑️ Delete
                    </button>

                </div>

            </article>
        `;

    }).join("");
}


/* =========================
   STUDENT TOOLKIT QUIZ
   ========================= */

const QUIZ_STORAGE_KEY = "studentToolkitBestScores";

const QUIZ_QUESTIONS = [
    // Science
    {
        subject: "science",
        question: "Which organelle is known as the powerhouse of the cell?",
        options: ["Nucleus", "Mitochondria", "Ribosome", "Chloroplast"],
        answer: 1
    },
    {
        subject: "science",
        question: "What is the chemical formula of water?",
        options: ["CO₂", "O₂", "H₂O", "H₂"],
        answer: 2
    },
    {
        subject: "science",
        question: "Which gas is mainly used by plants during photosynthesis?",
        options: ["Oxygen", "Nitrogen", "Carbon dioxide", "Hydrogen"],
        answer: 2
    },
    {
        subject: "science",
        question: "What is the SI unit of force?",
        options: ["Joule", "Newton", "Watt", "Pascal"],
        answer: 1
    },
    {
        subject: "science",
        question: "Which planet is known as the Red Planet?",
        options: ["Venus", "Mars", "Jupiter", "Mercury"],
        answer: 1
    },

    // Mathematics
    {
        subject: "math",
        question: "What is 12 × 8?",
        options: ["86", "96", "108", "92"],
        answer: 1
    },
    {
        subject: "math",
        question: "What is 15% of 200?",
        options: ["20", "25", "30", "35"],
        answer: 2
    },
    {
        subject: "math",
        question: "What is the sum of the angles of a triangle?",
        options: ["90°", "180°", "270°", "360°"],
        answer: 1
    },
    {
        subject: "math",
        question: "What is √144?",
        options: ["10", "11", "12", "14"],
        answer: 2
    },
    {
        subject: "math",
        question: "What is 3/4 + 1/4?",
        options: ["1/2", "1", "3/8", "4/8"],
        answer: 1
    },

    // General Knowledge
    {
        subject: "general",
        question: "Which is the largest planet in our Solar System?",
        options: ["Earth", "Saturn", "Jupiter", "Neptune"],
        answer: 2
    },
    {
        subject: "general",
        question: "What is the capital of Japan?",
        options: ["Seoul", "Tokyo", "Beijing", "Bangkok"],
        answer: 1
    },
    {
        subject: "general",
        question: "How many continents are there?",
        options: ["5", "6", "7", "8"],
        answer: 2
    },
    {
        subject: "general",
        question: "Which is the largest ocean on Earth?",
        options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
        answer: 3
    },
    {
        subject: "general",
        question: "Which language is primarily used to structure web pages?",
        options: ["HTML", "Python", "SQL", "C++"],
        answer: 0
    }
];

let quizQuestions = [];
let quizCurrentIndex = 0;
let quizScore = 0;
let quizAnswered = false;

function shuffleQuizArray(array) {
    const copy = [...array];

    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }

    return copy;
}

function getQuizQuestions() {
    const subject =
        document.getElementById("quizSubject")?.value || "mixed";

    let available = QUIZ_QUESTIONS;

    if (subject !== "mixed") {
        available = QUIZ_QUESTIONS.filter(q => q.subject === subject);
    }

    return shuffleQuizArray(available).slice(0, 5);
}

function openQuiz() {
    document.querySelectorAll(".calculator").forEach(tool => {
        tool.style.display = "none";
    });

    const quiz = document.getElementById("quizTool");

    if (quiz) {
        quiz.style.display = "block";
        startQuiz();
    }
}

function closeQuiz() {
    const quiz = document.getElementById("quizTool");

    if (quiz) {
        quiz.style.display = "none";
    }

    if (typeof showHome === "function") {
        showHome();
    }
}

function startQuiz() {
    quizQuestions = getQuizQuestions();
    quizCurrentIndex = 0;
    quizScore = 0;
    quizAnswered = false;

    const restartButton =
        document.getElementById("quizRestartButton");

    const nextButton =
        document.getElementById("quizNextButton");

    const result =
        document.getElementById("quizResult");

    if (restartButton) restartButton.style.display = "none";
    if (nextButton) {
        nextButton.style.display = "inline-block";
        nextButton.disabled = true;
    }
    if (result) result.innerHTML = "";

    renderQuizQuestion();
}

function renderQuizQuestion() {
    const questionEl =
        document.getElementById("quizQuestion");

    const optionsEl =
        document.getElementById("quizOptions");

    const progressEl =
        document.getElementById("quizProgress");

    const feedbackEl =
        document.getElementById("quizFeedback");

    const nextButton =
        document.getElementById("quizNextButton");

    if (!questionEl || !optionsEl) return;

    if (quizCurrentIndex >= quizQuestions.length) {
        finishQuiz();
        return;
    }

    const current = quizQuestions[quizCurrentIndex];

    quizAnswered = false;

    questionEl.textContent = current.question;

    if (progressEl) {
        progressEl.textContent =
            `Question ${quizCurrentIndex + 1} of ${quizQuestions.length}`;
    }

    if (feedbackEl) {
        feedbackEl.textContent = "";
    }

    if (nextButton) {
        nextButton.disabled = true;
        nextButton.textContent =
            quizCurrentIndex === quizQuestions.length - 1
                ? "Finish 🏁"
                : "Next ➡️";
    }

    optionsEl.innerHTML = "";

    current.options.forEach((option, index) => {
        const button = document.createElement("button");

        button.type = "button";
        button.className = "quiz-option";
        button.textContent = option;

        button.addEventListener("click", () => {
            selectQuizAnswer(index);
        });

        optionsEl.appendChild(button);
    });
}

function selectQuizAnswer(selectedIndex) {
    if (quizAnswered) return;

    quizAnswered = true;

    const current = quizQuestions[quizCurrentIndex];
    const buttons =
        document.querySelectorAll(".quiz-option");

    buttons.forEach(button => {
        button.disabled = true;
    });

    if (buttons[current.answer]) {
        buttons[current.answer].classList.add("correct");
    }

    const feedbackEl =
        document.getElementById("quizFeedback");

    if (selectedIndex === current.answer) {
        quizScore++;

        if (feedbackEl) {
            feedbackEl.textContent = "✅ Correct!";
        }
    } else {
        if (buttons[selectedIndex]) {
            buttons[selectedIndex].classList.add("wrong");
        }

        if (feedbackEl) {
            feedbackEl.textContent =
                `❌ Wrong! Correct answer: ${current.options[current.answer]}`;
        }
    }

    const nextButton =
        document.getElementById("quizNextButton");

    if (nextButton) {
        nextButton.disabled = false;
    }
}

function nextQuizQuestion() {
    if (!quizAnswered) return;

    quizCurrentIndex++;
    renderQuizQuestion();
}

function getQuizBestScores() {
    try {
        return JSON.parse(
            localStorage.getItem(QUIZ_STORAGE_KEY)
        ) || {};
    } catch {
        return {};
    }
}

function saveQuizBestScore(subject, score) {
    const scores = getQuizBestScores();

    if (!scores[subject] || score > scores[subject]) {
        scores[subject] = score;

        localStorage.setItem(
            QUIZ_STORAGE_KEY,
            JSON.stringify(scores)
        );
    }
}

function finishQuiz() {
    const questionEl =
        document.getElementById("quizQuestion");

    const optionsEl =
        document.getElementById("quizOptions");

    const progressEl =
        document.getElementById("quizProgress");

    const feedbackEl =
        document.getElementById("quizFeedback");

    const nextButton =
        document.getElementById("quizNextButton");

    const restartButton =
        document.getElementById("quizRestartButton");

    const result =
        document.getElementById("quizResult");

    const subject =
        document.getElementById("quizSubject")?.value || "mixed";

    saveQuizBestScore(subject, quizScore);

    const best =
        getQuizBestScores()[subject] || quizScore;

    if (questionEl) {
        questionEl.textContent = "🎉 Quiz Complete!";
    }

    if (optionsEl) {
        optionsEl.innerHTML = "";
    }

    if (progressEl) {
        progressEl.textContent = "";
    }

    if (feedbackEl) {
        feedbackEl.textContent = "";
    }

    if (nextButton) {
        nextButton.style.display = "none";
    }

    if (restartButton) {
        restartButton.style.display = "inline-block";
    }

    if (result) {
        result.innerHTML =
            `You scored <strong>${quizScore}/${quizQuestions.length}</strong><br>` +
            `🏆 Best score: ${best}/${quizQuestions.length}`;
    }
}


/* =========================
   NCERT TEXTBOOKS
   ========================= */

function openTextbooks() {
    document.querySelectorAll(".calculator").forEach(tool => {
        tool.style.display = "none";
    });

    const textbooks = document.getElementById("textbooksTool");

    if (textbooks) {
        textbooks.style.display = "block";
    }
}

function closeTextbooks() {
    const textbooks = document.getElementById("textbooksTool");

    if (textbooks) {
        textbooks.style.display = "none";
    }

    if (typeof showHome === "function") {
        showHome();
    }
}


function updateNCERTClass() {
    const select = document.getElementById("ncertClassSelect");
    const display = document.getElementById("selectedNCERTClass");

    if (!select || !display) return;

    const classNumber = select.value;

    display.textContent =
        `📖 Class ${classNumber} Textbooks`;
}

/* =========================
   CURRENT YEAR
   ========================= */

function updateCurrentYear() {
    const yearElement = document.getElementById("currentYear");

    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

document.addEventListener("DOMContentLoaded", updateCurrentYear);

