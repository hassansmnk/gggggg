// Global Active Runtime State Machine Data
let appState = {
    currentUser: {
        name: "Ahmed Nour",
        karma: 320,
        avatar: "AN"
    },
    activeCircle: "family", 
    inventory: [
        {
            id: "fam-car",
            name: "Toyota Camry",
            category: "Vehicles",
            circle: "family",
            status: "busy",
            holder: "Ahmed",
            returnTime: "6:30 PM",
            imageGradient: "linear-gradient(135deg, #FF9500, #FF5E3A)",
            fuel: 82,
            range: 520,
            odometer: 182541,
            history: [
                { time: "9:15 AM", user: "Ahmed", type: "borrowed", log: "Ahmed borrowed the car." },
                { time: "Yesterday", user: "Sara", type: "returned", log: "Returned. Fuel: 88% | Mileage: 182,490 km. Dash OK." }
            ]
        },
        {
            id: "fam-camp",
            name: "Premium Camping Gear Set",
            category: "Outdoor",
            circle: "family",
            status: "avail",
            holder: "None",
            returnTime: "",
            imageGradient: "linear-gradient(135deg, #34C759, #11998E)",
            history: [
                { time: "3 days ago", user: "Tareq", type: "returned", log: "Returned clean and fully repacked." }
            ]
        },
        {
            id: "fam-drill",
            name: "DeWalt Cordless Drill 20V",
            category: "Tools",
            circle: "family",
            status: "avail",
            holder: "None",
            returnTime: "",
            imageGradient: "linear-gradient(135deg, #1C1C1E, #48484A)",
            history: []
        },
        {
            id: "nb-mower",
            name: "Honda Self-Propelled Mower",
            category: "Tools",
            circle: "neighbor",
            status: "avail",
            holder: "None",
            returnTime: "",
            imageGradient: "linear-gradient(135deg, #11998E, #38EF7D)",
            history: [
                { time: "Last Week", user: "John (Unit 4B)", type: "returned", log: "Blades wiped clean, tank left full." }
            ]
        },
        {
            id: "nb-grill",
            name: "Weber Liquid Propane Grill",
            category: "Outdoor",
            circle: "neighbor",
            status: "busy",
            holder: "Youssef (Next Door)",
            returnTime: "Tomorrow, 2:00 PM",
            imageGradient: "linear-gradient(135deg, #FF416C, #FF4B2B)",
            history: []
        }
    ]
};

// Application Bootstrap Initialize
document.addEventListener("DOMContentLoaded", () => {
    renderInventoryGrid();
    updateDashboardMetrics();
    
    // Automated Seamless Transition from Splash directly into Onboarding after 2.5 seconds
    setTimeout(() => {
        const splashScreen = document.getElementById("splash-screen");
        if(splashScreen && splashScreen.classList.contains("active")) {
            navigateTo('onboarding');
        }
    }, 2500);
});

// Structural SPA Navigation Matrix Router Toggle
function navigateTo(viewId) {
    document.querySelectorAll(".view").forEach(view => view.classList.remove("active"));
    const targetView = document.getElementById(viewId);
    if(targetView) targetView.classList.add("active");
}

// Onboarding Presentation Step Handler
function nextOnboardingStep() {
    const flowContainer = document.getElementById("onboarding-flow");
    let currentStep = parseInt(flowContainer.getAttribute("data-step"));
    
    if (currentStep === 1) {
        const emailVal = document.getElementById("ob-email").value;
        if(emailVal) appState.currentUser.name = emailVal.split('@')[0];
    } else if (currentStep === 2) {
        const nameVal = document.getElementById("ob-name").value;
        if(nameVal) {
            appState.currentUser.name = nameVal;
            appState.currentUser.avatar = nameVal.split(' ').map(n => n[0]).join('').toUpperCase();
        }
    }
    
    flowContainer.setAttribute("data-step", currentStep + 1);
}

// Exit Onboarding Process Configuration Sync
function completeOnboarding() {
    document.getElementById("dash-avatar").innerText = appState.currentUser.avatar;
    document.getElementById("dash-greeting").innerText = `Hey ${appState.currentUser.name.split(' ')[0]}`;
    navigateTo("dashboard");
    triggerToast("🏠 Welcome!", "Your sharing engine is synchronized and active.");
}

function simulateAvatarUpload() {
    const preview = document.getElementById("avatar-preview");
    preview.style.background = "linear-gradient(135deg, #007AFF, #0051A8)";
    preview.innerText = "✓";
    triggerToast("Avatar Saved", "Profile image successfully optimized.");
}

function toggleCircleOption(element) {
    element.parentElement.querySelectorAll(".circle-card").forEach(c => c.classList.remove("active"));
    element.classList.add("active");
}

// Circle Segment Controller Interface Engine Switch
function switchCircle(circleKey) {
    appState.activeCircle = circleKey;
    
    const indicator = document.querySelector(".sliding-indicator");
    if(circleKey === 'neighbor') {
        indicator.style.transform = "translateX(100%)";
        document.getElementById("active-circle-context").innerText = "Neighbor Circle";
    } else {
        indicator.style.transform = "translateX(0%)";
        document.getElementById("active-circle-context").innerText = "Family Circle";
    }
    
    document.querySelectorAll(".segment-btn").forEach(btn => {
        btn.classList.toggle("active", btn.getAttribute("data-circle") === circleKey);
    });

    renderInventoryGrid();
    updateDashboardMetrics();
}

// Metrics Display Real-time Recalculation Engine
function updateDashboardMetrics() {
    const activeSet = appState.inventory.filter(item => item.circle === appState.activeCircle);
    const available = activeSet.filter(item => item.status === 'avail').length;
    const inUseByMe = activeSet.filter(item => item.status === 'busy' && item.holder === 'Ahmed').length;
    
    document.getElementById("metric-avail").innerText = available;
    document.getElementById("metric-borrowed").innerText = inUseByMe;
}

// Live Dynamic Component HTML Matrix Renderer
function renderInventoryGrid() {
    const container = document.getElementById("items-container");
    container.innerHTML = ""; 
    
    const contextItems = appState.inventory.filter(item => item.circle === appState.activeCircle);
    
    if(contextItems.length === 0) {
        container.innerHTML = `<div class="subtext" style="text-align:center; padding:40px 0;">No items shared in this network layer yet.</div>`;
        return;
    }
    
    contextItems.forEach(item => {
        const card = document.createElement("div");
        card.className = "item-card";
        card.onclick = () => openItemDetailSheet(item.id);
        
        const isAvailable = item.status === "avail";
        const statusBadge = isAvailable 
            ? `<div class="status-indicator-pill avail">🟢 Available Now</div>`
            : `<div class="status-indicator-pill busy">🔴 Borrowed by ${item.holder}</div>`;
            
        const contextLine = isAvailable ? `Ready for deployment` : `Expected back around ${item.returnTime}`;

        card.innerHTML = `
            <div class="item-card-image-wrap">
                <div class="fallback-gradient-avatar" style="background: ${item.imageGradient};"></div>
            </div>
            <div class="item-card-details">
                <div class="item-title-row">
                    <h5>${item.name}</h5>
                    ${statusBadge}
                </div>
                <div class="holder-meta-row">${contextLine}</div>
            </div>
        `;
        container.appendChild(card);
    });
}

// Bottom Action Drawer Controller Core Sheet Engine
function openItemDetailSheet(itemId) {
    const item = appState.inventory.find(i => i.id === itemId);
    if(!item) return;
    
    const detailRenderContainer = document.getElementById("sheet-detail-render");
    
    let specializedModuleHTML = "";
    let callToActionButton = "";
    
    if(item.status === 'avail') {
        callToActionButton = `<button class="btn btn-primary" onclick="executeStartUsage('${item.id}')">Start Using Now</button>`;
    } else if(item.status === 'busy' && item.holder === 'Ahmed') {
        callToActionButton = `<button class="btn btn-primary" style="background:var(--danger);" onclick="executeFinishUsage('${item.id}')">Finish & Return Asset</button>`;
    } else {
        callToActionButton = `<button class="btn btn-primary" style="opacity:0.4; pointer-events:none;">Currently In Use</button>`;
    }

    if(item.category === "Vehicles") {
        specializedModuleHTML = `
            <div class="fuel-gauge-card" id="telemetry-card">
                <div class="gauge-meta-title-row">
                    <span>Fuel Level Visualizer</span>
                    <span id="tel-fuel-text">${item.fuel}%</span>
                </div>
                <div class="progress-track-bar">
                    <div class="progress-fill" id="tel-fuel-bar" style="width: ${item.fuel}%;"></div>
                </div>
                <div class="gauge-submetrics-row">
                    <span>Est. Range: <strong id="tel-range">${item.range} km</strong></span>
                    <span>Odometer: <strong id="tel-odo">${item.odometer.toLocaleString()} km</strong></span>
                </div>
            </div>
        `;
    }

    let historyNodes = "";
    if(item.history && item.history.length > 0) {
        item.history.forEach(logEntry => {
            historyNodes += `
                <div class="timeline-node">
                    <span class="tl-timestamp">${logEntry.time}</span>
                    <span class="tl-body">${logEntry.log}</span>
                </div>
            `;
        });
    } else {
        historyNodes = `<p class="subtext">No operations logged during the active cycle layout phase.</p>`;
    }

    detailRenderContainer.innerHTML = `
        <div style="background: ${item.imageGradient}; width:100%; height:140px; border-radius:16px; margin-bottom:16px; display:flex; align-items:center; justify-content:center; color:#fff; font-size:40px;">📦</div>
        <h2>${item.name}</h2>
        <p class="subtitle" style="margin-bottom:16px;">Categorized under ${item.category} • Access Level: Local Circle</p>
        
        ${specializedModuleHTML}

        <h4 class="section-title" style="margin-top:20px;">Reservation Matrix Calendar</h4>
        <div class="reservation-calendar-grid">
            <div class="cal-day-cell">Mo</div><div class="cal-day-cell booked">Tu</div><div class="cal-day-cell">We</div>
            <div class="cal-day-cell">Th</div><div class="cal-day-cell">Fr</div><div class="cal-day-cell">Sa</div><div class="cal-day-cell">Su</div>
        </div>

        <h4 class="section-title" style="margin-top:24px;">Usage Timeline Logs</h4>
        <div class="timeline-module">
            ${historyNodes}
        </div>

        <div style="margin-top:32px;">
            ${callToActionButton}
        </div>
    `;

    document.getElementById("item-detail-sheet").classList.add("open");
}

function closeBottomSheet() {
    document.getElementById("item-detail-sheet").classList.remove("open");
}

function executeStartUsage(itemId) {
    const item = appState.inventory.find(i => i.id === itemId);
    item.status = 'busy';
    item.holder = 'Ahmed';
    item.returnTime = 'Indefinite';
    
    item.history.unshift({
        time: "Just Now",
        user: "Ahmed",
        type: "borrowed",
        log: "Ahmed initiated immediate deployment lock."
    });
    
    closeBottomSheet();
    renderInventoryGrid();
    updateDashboardMetrics();
    triggerToast("Asset Engaged 🟢", `You unlocked access permission keys for ${item.name}`);
}

function executeFinishUsage(itemId) {
    // Fixed syntax bug here (changed 'alt' to '===')
    const item = appState.inventory.find(i => i.id === itemId);
    const detailRenderContainer = document.getElementById("sheet-detail-render");
    
    detailRenderContainer.innerHTML = `
        <h2>Return Asset Checklist</h2>
        <p class="subtitle">Upload operational proof dashboard analytics to calculate maintenance indicators.</p>
        
        <div class="photo-dropzone" id="return-upload-box" onclick="simulateReturnPhotoCapture('${item.id}')">
            <span class="camera-icon">📸</span>
            <p>Snapshot Odometer & Gauges</p>
        </div>
        
        <div class="ai-loading-container hidden" id="ai-processing-loader">
            <p class="subtext" style="font-weight:600; color:var(--primary);">AI Analysis Pipeline Reading Asset Telemetry...</p>
            <div class="skeleton-line"></div>
            <div class="skeleton-line w80"></div>
            <div class="skeleton-line w60"></div>
        </div>
    `;
}

function simulateReturnPhotoCapture(itemId) {
    document.getElementById("return-upload-box").classList.add("hidden");
    document.getElementById("ai-processing-loader").classList.remove("hidden");
    
    setTimeout(() => {
        const item = appState.inventory.find(i => i.id === itemId);
        item.status = "avail";
        item.holder = "None";
        item.returnTime = "";
        
        if(item.category === "Vehicles") {
            item.fuel = 67; 
            item.range = 485;
            item.odometer += 42; 
        }
        
        item.history.unshift({
            time: "Just Now",
            user: "Ahmed",
            type: "returned",
            log: `Returned by Ahmed. AI Metrics: Fuel level evaluated at ${item.fuel}%. Odometer adjusted.`
        });
        
        appState.currentUser.karma += 20; 
        document.getElementById("karma-count").innerText = appState.currentUser.karma;
        
        closeBottomSheet();
        renderInventoryGrid();
        updateDashboardMetrics();
        triggerToast("AI Analysis Complete ✅", "Telemetry reconciled successfully. +20 Karma points.");
    }, 2400);
}

// Modal and utility triggers
function openAddAssetModal() {
    document.getElementById("add-asset-modal").classList.add("open");
}

function closeAddAssetModal() {
    document.getElementById("add-asset-modal").classList.remove("open");
    document.getElementById("new-item-name").value = "";
    document.getElementById("dropzone-preview").classList.add("hidden");
    document.getElementById("dropzone-placeholder").classList.remove("hidden");
}

function simulatePhotoCapture() {
    const placeholder = document.getElementById("dropzone-placeholder");
    const preview = document.getElementById("dropzone-preview");
    
    placeholder.classList.add("hidden");
    preview.classList.remove("hidden");
    preview.style.background = "linear-gradient(135deg, #A8BFFF, #8843F2)";
    preview.style.width = "100%";
    preview.style.height = "100%";
}

function submitNewAsset() {
    const name = document.getElementById("new-item-name").value;
    const category = document.getElementById("new-item-category").value;
    const circle = document.getElementById("new-item-circle").value;
    
    if(!name) {
        alert("Please assign a valid title identity value descriptor to your shared resource.");
        return;
    }
    
    const generatedRecord = {
        id: "custom-" + Date.now(),
        name: name,
        category: category,
        circle: circle,
        status: "avail",
        holder: "None",
        returnTime: "",
        imageGradient: "linear-gradient(135deg, #818CF8, #C084FC)",
        history: [{ time: "Created", user: appState.currentUser.name, type: "init", log: "Published to localized network inventory pool." }]
    };
    
    appState.inventory.push(generatedRecord);
    appState.currentUser.karma += 100;
    document.getElementById("karma-count").innerText = appState.currentUser.karma;
    
    closeAddAssetModal();
    renderInventoryGrid();
    updateDashboardMetrics();
    triggerToast("Asset Published 🎉", `Shared pipeline active for your chosen cluster.`);
}

function switchTab(targetId) {
    if(targetId === 'home') {
        switchCircle(appState.activeCircle);
    }
}

function toggleNotificationCenter() {
    triggerToast("Alerts Manifest Sync", "System reports zero pending operational fault signals.");
}

// Toast Notification Manager UI Engine
function showKarmaDetails() {
    triggerToast("Karma Status", `Score: ${appState.currentUser.karma}. High standing rank levels authorize immediate unvouched deployment locks.`);
}

function triggerToast(title, bodyText) {
    const toast = document.getElementById("toast-notification");
    document.getElementById("toast-title").innerText = title;
    document.getElementById("toast-body").innerText = bodyText;
    
    toast.classList.add("visible");
    setTimeout(() => {
        toast.classList.remove("visible");
    }, 4000);
}