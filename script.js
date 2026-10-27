const tasks = [
    { code: "DOT-104", name: "Інтеграція вебхуків GitLab", project: "E-Commerce API", status: "В роботі" },
    { code: "DOT-108", name: "Міграція таблиць БД", project: "E-Commerce API", status: "Перевірка" },
    { code: "DOT-112", name: "Налаштування черг Redis", project: "FinTech Core", status: "Готово" },
    { code: "DOT-115", name: "Оптимізація SQL-запитів", project: "FinTech Core", status: "Затверджено" }
];

// Нова функція (ПР 18): Динамічне оновлення віджетів статистики
function updateDashboardStats(currentTasks) {
    const totalTasksEl = document.getElementById("statTotal");
    const activeProjectsEl = document.getElementById("statProjects");

    // Підрахунок унікальних проєктів у поточному списку
    const uniqueProjects = new Set(currentTasks.map(task => task.project));
    
    totalTasksEl.textContent = currentTasks.length;
    activeProjectsEl.textContent = uniqueProjects.size;
}

function displayTasks(data) {
    const tbody = document.getElementById("tasksList");
    tbody.innerHTML = ""; 

    if (data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; padding: 20px;">Завдань не знайдено. Перевірте критерії пошуку.</td></tr>';
        return;
    }

    data.forEach(task => {
        // Визначення CSS-класу для статусу
        let statusClass = "status-done";
        if (task.status === "В роботі") statusClass = "status-progress";
        else if (task.status === "Перевірка") statusClass = "status-review";

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td style="font-family: var(--font-mono); color: var(--color-cyan);">${task.code}</td>
            <td>${task.name}</td>
            <td>${task.project}</td>
            <td><span class="status-badge ${statusClass}">${task.status}</span></td>
        `;
        tbody.appendChild(tr);
    });
}

function processTasks() {
    const searchQuery = document.getElementById("searchInput").value.trim().toLowerCase();
    const projectFilter = document.getElementById("projectFilter").value;
    const messageEl = document.getElementById("taskMessage");

    const filteredTasks = tasks.filter(task => {
        const matchesSearch = task.name.toLowerCase().includes(searchQuery) || task.code.toLowerCase().includes(searchQuery);
        const matchesProject = projectFilter === "all" ? true : task.project === projectFilter;
        return matchesSearch && matchesProject;
    });

    displayTasks(filteredTasks);
    updateDashboardStats(filteredTasks); // Виклик нової функції

    if (searchQuery !== "" || projectFilter !== "all") {
        messageEl.textContent = `Знайдено записів: ${filteredTasks.length}`;
    } else {
        messageEl.textContent = "";
    }
}

document.addEventListener("DOMContentLoaded", () => {
    displayTasks(tasks);
    updateDashboardStats(tasks); // Первинна ініціалізація статистики
    
    document.getElementById("btnSearch").addEventListener("click", processTasks);
    document.getElementById("searchInput").addEventListener("keydown", (e) => {
        if (e.key === "Enter") processTasks();
    });
    document.getElementById("projectFilter").addEventListener("change", processTasks);
});