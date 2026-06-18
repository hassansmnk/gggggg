// Baseline structural database state definition
const DEFAULT_INITIAL_STATE = {
    activeCircle: "family",
    users: {
        "usr-ahmed": { id: "usr-ahmed", name: "Ahmed Nour", email: "ahmed@shareme.io", karma: 15, avatar: "AN" },
        "usr-sara": { id: "usr-sara", name: "Sara Nour", email: "sara@shareme.io", karma: 45, avatar: "SN" },
        "usr-tareq": { id: "usr-tareq", name: "Tareq Node", email: "tareq@shareme.io", karma: 80, avatar: "TN" }
    },
    currentUserId: "usr-ahmed", 
    inventory: [
        {
            id: "fam-car",
            name: "Toyota Camry",
            category: "Vehicles",
            circle: "family",
            status: "busy", 
            owner: "usr-sara", 
            holder: "usr-ahmed",
            returnTime: "6:30 PM",
            imageGradient: "linear-gradient(135deg, #DECCA6, #A3967F)",
            fuel: 82, range: 520, odometer: 182541,
            history: [{ time: "9:15 AM", user: "Ahmed Nour", type: "borrowed", log: "Lease contract checked out." }]
        },
        {
            id: "fam-drill",
            name: "DeWalt Cordless Drill 20V",
            category: "Tools",
            circle: "family",
            status: "avail",
            owner: "usr-ahmed", 
            holder: "None",
            returnTime: "",
            imageGradient: "linear-gradient(135deg, #4E5340, #383B2E)",
            history: []
        },
        {
            id: "nb-mower",
            name: "Honda Self-Propelled Mower",
            category: "Tools",
            circle: "neighbor",
            status: "avail",
            owner: "usr-tareq", 
            holder: "None",
            returnTime: "",
            imageGradient: "linear-gradient(135deg, #7A8464, #525943)",
            history: [{ time: "Last Week", user: "Tareq Node", type: "returned", log: "Blades wiped clean, tank full." }]
        }
    ]
};

let appState = {};

function loadStateFromStorage() {
    const saved = localStorage.getItem("shareme_live_db");
    if (saved) {
        try {
            appState = JSON.parse(saved);
        } catch(e) {
            appState = JSON.parse(JSON.stringify(DEFAULT_INITIAL_STATE));
        }
    } else {
        appState = JSON.parse(JSON.stringify(DEFAULT_INITIAL_STATE));
    }
}

function saveStateToStorage() {
    localStorage.setItem("shareme_live_db", JSON.stringify(appState));
}

function resetSimulationData() {
    localStorage.removeItem("shareme_live_db");
    localStorage.removeItem("shareme_onboarding_passed");
    loadStateFromStorage();
    window.location.reload();
}

document.addEventListener("DOMContentLoaded", () => {
    loadStateFromStorage();
    
    if(localStorage.getItem("shareme_onboarding_passed") === "true") {
        syncSandboxToolbar();
        const activeUser = appState.users[appState.currentUserId];
        document.getElementById("dash-avatar").innerText = activeUser.avatar;
        document.getElementById("dash-greeting").innerText = `Hey ${activeUser.name.split(' ')[0]}`;
        document.getElementById("karma-count").innerText = activeUser.karma;
        
        switchCircle(appState.activeCircle);
        navigateTo("dashboard");
    }
});

function syncSandboxToolbar() {
    const bar = document.getElementById("demo-sandbox-panel");
    const selector = document.getElementById("sandbox-user-selector");
    if(!bar || !selector) return;
    
    bar.classList.remove("hidden");
    selector.innerHTML = "";
    
    Object.keys(appState.users).forEach(uid => {
        const u = appState.users[uid];
        const opt = document.createElement("option");
        opt.value = uid;
        opt.innerText = `${u.name} (${uid === appState.currentUserId ? 'You' : 'Remote Member'})`;
        if(uid === appState.currentUserId) opt.selected = true;
        selector.appendChild(opt);
    });
}

function handleSandboxUserSwitch(targetUserId) {
    appState.currentUserId = targetUserId;
    saveStateToStorage();
    
    const u = appState.users[targetUserId];
    document.getElementById("dash-avatar").innerText = u.avatar;
    document.getElementById("dash-greeting").innerText = `Hey ${u.name.split(' ')[0]}`;
    document.getElementById("karma-count").innerText = u.karma;
    
    syncSandboxToolbar();
    renderInventoryGrid();
    updateDashboardMetrics();
    
    triggerToast(`👤 Switched Identity: ${u.name}`, `Now viewing workspace parameters from this profile perspective.`);
}

function navigateTo(viewId) {
    document.querySelectorAll(".view").forEach(view => view.classList.remove("active"));
    const targetView = document.getElementById(viewId);
    if(targetView) targetView.classList.add("active");
}

function simulateOAuth(platform) {
    document.getElementById("ob-email").value = `${platform.toLowerCase()}.user@shareme.io`;
    document.getElementById("ob-pass").value = "••••••••••••";
    triggerToast("Identity Synchronized", `Pulled records securely via ${platform}.`);
}

function nextOnboardingStep() {
    const flowContainer = document.getElementById("onboarding-flow");
    let currentStep = parseInt(flowContainer.getAttribute("data-step"));
    
    if (currentStep === 1) {
        const emailVal = document.getElementById("ob-email").value;
        const passVal = document.getElementById("ob-pass").value;
        if(!emailVal || !passVal) { alert("Please complete required credentials inputs."); return; }
        
        appState.users["usr-ahmed"].email = emailVal;
        appState.users["usr-ahmed"].name = emailVal.split('@')[0];
        document.getElementById("ob-name").value = appState.users["usr-ahmed"].name.toUpperCase();
    } else if (currentStep === 2) {
        const nameVal = document.getElementById("ob-name").value;
        if(!nameVal) { alert("Please specify user display name descriptor."); return; }
        
        appState.users["usr-ahmed"].name = nameVal;
        appState.users["usr-ahmed"].avatar = nameVal.split(' ').map(n => n[0]).join('').toUpperCase().substring(0,2);
    }
    flowContainer.setAttribute("data-step", currentStep + 1);
}

function completeOnboarding() {
    localStorage.setItem("shareme_onboarding_passed", "true");
    appState.currentUserId = "usr-ahmed"; 
    saveStateToStorage();
    
    syncSandboxToolbar();
    const activeUser = appState.users[appState.currentUserId];
    document.getElementById("dash-avatar").innerText = activeUser.avatar;
    document.getElementById("dash-greeting").innerText = `Hey ${activeUser.name.split(' ')[0]}`;
    document.getElementById("karma-count").innerText = activeUser.karma;
    
    const activeCircleCard = document.querySelector(".circle-card.active");
    const targetCircle = activeCircleCard ? activeCircleCard.getAttribute("data-circle-type") : "family";
    
    switchCircle(targetCircle);
    navigateTo("dashboard");
}

function simulateAvatarUpload() {
    const preview = document.getElementById("avatar-preview");
    preview.style.background = "var(--accent-blue)";
    preview.style.color = "#FFFFFF";
    preview.innerText = "✓";
}

function toggleCircleOption(element) {
    element.parentElement.querySelectorAll(".circle-card").forEach(c => c.classList.remove("active"));
    element.classList.add("active");
}

function switchCircle(circleKey) {
    appState.activeCircle = circleKey;
    saveStateToStorage();
    
    const indicator = document.querySelector(".sliding-indicator");
    if(circleKey === 'neighbor') {
        if(indicator) indicator.style.transform = "translateX(100%)";
        document.getElementById("active-circle-context").innerText = "Neighbor Circle Hub";
    } else {
        if(indicator) indicator.style.transform = "translateX(0%)";
        document.getElementById("active-circle-context").innerText = "Family Circle Cluster";
    }
    
    document.querySelectorAll(".segment-btn").forEach(btn => {
        btn.classList.toggle("active", btn.getAttribute("data-circle") === circleKey);
    });

    renderInventoryGrid();
    updateDashboardMetrics();
}

function updateDashboardMetrics() {
    const activeSet = appState.inventory.filter(item => item.circle === appState.activeCircle);
    const available = activeSet.filter(item => item.status === 'avail').length;
    const itemsHolding = appState.inventory.filter(item => item.status === 'busy' && item.holder === appState.currentUserId).length;
    
    document.getElementById("metric-avail").innerText = available;
    document.getElementById("metric-borrowed").innerText = itemsHolding;
}

function renderInventoryGrid() {
    const container = document.getElementById("items-container");
    if(!container) return;
    container.innerHTML = ""; 
    
    const contextItems = appState.inventory.filter(item => item.circle === appState.activeCircle);
    
    if(contextItems.length === 0) {
        container.innerHTML = `<div class="subtext" style="text-align:center; padding:40px 0; grid-column: 1 / -1; opacity: 0.5;">No items linked to this cluster node layer yet.</div>`;
        return;
    }
    
    contextItems.forEach(item => {
        const card = document.createElement("div");
        card.className = "item-card";
        card.onclick = () => openItemDetailSheet(item.id);
        
        const isOwner = (item.owner === appState.currentUserId);
        const ownershipBadge = isOwner ? `<span style="background: rgba(0,0,0,0.05); font-size:9px; padding:2px 6px; border-radius:4px; font-weight:600; text-transform:uppercase; color:#555;">Your Asset</span>` : "";

        let statusBadge = "";
        let contextLine = "";
        const holderName = appState.users[item.holder] ? appState.users[item.holder].name : "Unknown User";

        if (item.status === "avail") {
            statusBadge = `<div class="status-indicator-pill avail">🟢 Available</div>`;
            contextLine = `Ready for deployment`;
        } else if (item.status === "requested") {
            statusBadge = `<div class="status-indicator-pill busy" style="background:rgba(255,149,0,0.1); color:#FF9500;">⏳ Requested</div>`;
            contextLine = `Awaiting authorization keys`;
        } else {
            const displayHolder = (item.holder === appState.currentUserId) ? "You" : holderName;
            statusBadge = `<div class="status-indicator-pill busy">🔴 Borrowed</div>`;
            contextLine = `Possessed by ${displayHolder}`;
        }

        card.innerHTML = `
            <div class="item-card-image-wrap">
                <div style="background: ${item.imageGradient}; height:100%; width:100%; border-radius:12px; display:flex; align-items:center; justify-content:center; color:#fff; font-size:24px;">📦</div>
            </div>
            <div class="item-card-details">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                    <h5 style="margin:0; font-size:14px; font-weight:600; flex:1;">${item.name}</h5>
                    ${statusBadge}
                </div>
                <div style="display:flex; justify-content:space-between; align-items:center; margin-top:4px;">
                    <span style="font-size:12px; opacity:0.6;">${contextLine}</span>
                    ${ownershipBadge}
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

function openItemDetailSheet(itemId) {
    const item = appState.inventory.find(i => i.id === itemId);
    if(!item) return;
    
    const detailRenderContainer = document.getElementById("sheet-detail-render");
    const isOwner = (item.owner === appState.currentUserId);
    const ownerName = appState.users[item.owner] ? appState.users[item.owner].name : "System User";
    const holderName = appState.users[item.holder] ? appState.users[item.holder].name : "Unknown User";
    
    let administrativeControlHTML = "";
    let actionExecutionHTML = "";
    
    if(isOwner) {
        administrativeControlHTML = `
            <div style="display:flex; gap:10px; margin-bottom:20px; padding:12px; background:rgba(0,0,0,0.02); border-radius:8px; border:1px dashed rgba(0,0,0,0.08);">
                <button class="btn" style="flex:1; font-size:12px; background:#fff; border:1px solid #ddd; padding:8px;" onclick="executeEditAsset('${item.id}')">✏️ Modify</button>
                <button class="btn" style="flex:1; font-size:12px; background:rgba(255,59,48,0.08); color:#FF3B30; border:1px solid rgba(255,59,48,0.15); padding:8px;" onclick="executeDeleteAsset('${item.id}')">🗑️ Delete</button>
            </div>
        `;

        if(item.status === 'requested') {
            actionExecutionHTML = `
                <div style="background:rgba(255,149,0,0.05); padding:16px; border-radius:12px; border:1px solid rgba(255,149,0,0.2); text-align:center;">
                    <p style="margin:0 0 12px 0; font-size:13px; font-weight:500;"><strong>${holderName}</strong> signature requested asset deployment.</p>
                    <button class="btn btn-primary" onclick="executeAcceptRequest('${item.id}')">Approve & Hand Over Over (+5 Karma)</button>
                </div>
            `;
        } else if (item.status === 'busy') {
            actionExecutionHTML = `<button class="btn btn-primary" style="opacity:0.6; pointer-events:none;">Currently possessed by ${holderName}</button>`;
        } else {
            actionExecutionHTML = `<div style="text-align:center; padding:10px; font-size:12px; opacity:0.6; font-style:italic;">Asset secure. Awaiting access requests.</div>`;
        }
    } else {
        if(item.status === 'avail') {
            actionExecutionHTML = `<button class="btn btn-primary" onclick="executeSendRequest('${item.id}')">Trigger Access Borrow Request</button>`;
        } else if(item.status === 'requested') {
            if(item.holder === appState.currentUserId) {
                actionExecutionHTML = `<button class="btn btn-primary" style="background:#8E8E93; opacity:0.6; pointer-events:none;">Request pending owner authentication...</button>`;
            } else {
                actionExecutionHTML = `<button class="btn btn-primary" style="opacity:0.4; pointer-events:none;">Unavailable • Requested by another account</button>`;
            }
        } else if(item.status === 'busy' && item.holder === appState.currentUserId) {
            actionExecutionHTML = `<button class="btn btn-primary" style="background:#34C759;" onclick="executeReturnAssetFlow('${item.id}')">Signal Returned Asset Reconcile (+8 Karma)</button>`;
        } else {
            actionExecutionHTML = `<button class="btn btn-primary" style="opacity:0.4; pointer-events:none;">Unavailable • Deployed with ${holderName}</button>`;
        }
    }

    detailRenderContainer.innerHTML = `
        <div style="background: ${item.imageGradient}; width:100%; height:120px; border-radius:12px; margin-bottom:16px; display:flex; align-items:center; justify-content:center; color:#fff; font-size:32px;">📦</div>
        <h2 style="margin:0 0 4px 0; font-size:20px; font-weight:700;">${item.name}</h2>
        <p class="subtitle" style="margin:0 0 16px 0; font-size:13px; opacity:0.6;">Owner: ${ownerName} • Category: ${item.category}</p>
        
        ${administrativeControlHTML}

        <h4 class="section-title" style="margin:16px 0 8px 0; font-size:11px;">System Event Log Nodes</h4>
        <div style="border-left:2px solid #E2E0D8; padding-left:12px; margin-bottom:24px;">
            ${item.history && item.history.length > 0 ? item.history.map(h => `
                <div style="margin-bottom:8px; font-size:12px;">
                    <span style="opacity:0.4; margin-right:6px;">${h.time}</span>
                    <strong>${h.user}:</strong> <span style="opacity:0.8;">${h.log}</span>
                </div>
            `).join('') : '<p style="font-size:12px; opacity:0.4; font-style:italic; margin:0;">No verified state historical adjustments.</p>'}
        </div>

        <div style="margin-top:20px;">
            ${actionExecutionHTML}
        </div>
    `;

    document.getElementById("item-detail-sheet").classList.add("open");
}

function closeBottomSheet() {
    document.getElementById("item-detail-sheet").classList.remove("open");
}

function executeSendRequest(itemId) {
    const item = appState.inventory.find(i => i.id === itemId);
    item.status = 'requested';
    item.holder = appState.currentUserId; 
    
    saveStateToStorage();
    closeBottomSheet();
    renderInventoryGrid();
    updateDashboardMetrics();
    triggerToast("📡 Request Dispatched", "Asset access token dispatched into sync pipeline.");
}

function executeAcceptRequest(itemId) {
    const item = appState.inventory.find(i => i.id === itemId);
    item.status = 'busy';
    item.returnTime = "Indefinite";
    
    const receiver = appState.users[item.holder] ? appState.users[item.holder].name : "Network Profile";
    item.history.unshift({
        time: "Just Now",
        user: appState.users[appState.currentUserId].name,
        type: "approval",
        log: `Granted share authorization lease contract to ${receiver}.`
    });
    
    adjustKarma(5, "Share Request Authorized");
    saveStateToStorage();
    closeBottomSheet();
    renderInventoryGrid();
    updateDashboardMetrics();
}

function executeReturnAssetFlow(itemId) {
    const item = appState.inventory.find(i => i.id === itemId);
    const detailRenderContainer = document.getElementById("sheet-detail-render");
    
    detailRenderContainer.innerHTML = `
        <h2 style="font-size:18px; margin-bottom:6px;">Confirm Return Security</h2>
        <p class="subtitle" style="font-size:13px; opacity:0.6; margin-bottom:20px;">Confirm item deployment state condition check.</p>
        <button class="btn btn-primary" style="background:#34C759; margin-bottom:10px;" onclick="finalizeReturnProcess('${item.id}', true)">Pristine Secure Return (+8 Karma)</button>
        <button class="btn" style="background:rgba(0,0,0,0.05); width:100%; border:1px solid #ddd;" onclick="finalizeReturnProcess('${item.id}', false)">Flag Variance Exception</button>
    `;
}

function finalizeReturnProcess(itemId, inGoodCondition) {
    const item = appState.inventory.find(i => i.id === itemId);
    item.status = "avail";
    const previousBorrowerName = appState.users[item.holder] ? appState.users[item.holder].name : "Borrower";
    item.holder = "None";
    item.returnTime = "";
    
    item.history.unshift({
        time: "Just Now",
        user: previousBorrowerName,
        type: "returned",
        log: `Recompiled back to pool inventory. Condition state: ${inGoodCondition ? 'Pristine' : 'Requires Maintenance Review'}`
    });
    
    if(inGoodCondition) {
        adjustKarma(8, "Pristine Asset Reconciled");
    } else {
        triggerToast("Asset Logged", "Item returned with discrepancy flags.");
    }
    
    saveStateToStorage();
    closeBottomSheet();
    renderInventoryGrid();
    updateDashboardMetrics();
}

function executeDeleteAsset(itemId) {
    appState.inventory = appState.inventory.filter(i => i.id !== itemId);
    saveStateToStorage();
    closeBottomSheet();
    renderInventoryGrid();
    updateDashboardMetrics();
    triggerToast("🗑️ Entry Purged", "Asset deleted from network repository indices.");
}

function executeEditAsset(itemId) {
    const item = appState.inventory.find(i => i.id === itemId);
    const updateTitle = prompt("Modify Asset Descriptor Name Title:", item.name);
    if(updateTitle && updateTitle.trim() !== "") {
        item.name = updateTitle.trim();
        saveStateToStorage();
        closeBottomSheet();
        renderInventoryGrid();
        triggerToast("✏️ Parameters Modified", "Internal global database metadata updated.");
    }
}

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
    if(placeholder && preview) {
        placeholder.classList.add("hidden");
        preview.classList.remove("hidden");
        preview.style.background = "linear-gradient(135deg, #A3967F, #525943)";
        preview.style.width = "100%"; preview.style.height = "100%"; preview.style.borderRadius = "10px";
    }
}

function submitNewAsset() {
    const name = document.getElementById("new-item-name").value;
    const category = document.getElementById("new-item-category").value;
    const circle = document.getElementById("new-item-circle").value;
    
    if(!name) { alert("Please compile identification description text."); return; }
    
    const generatedRecord = {
        id: "custom-" + Date.now(),
        name: name,
        category: category,
        circle: circle,
        status: "avail",
        owner: appState.currentUserId, 
        holder: "None",
        returnTime: "",
        imageGradient: "linear-gradient(135deg, #7A8464, #A3967F)",
        history: [{ time: "Created", user: appState.users[appState.currentUserId].name, type: "init", log: "Published structural database node entry." }]
    };
    
    appState.inventory.push(generatedRecord);
    adjustKarma(5, "Inventory Entry Contributed");
    
    saveStateToStorage();
    closeAddAssetModal();
    renderInventoryGrid();
    updateDashboardMetrics();
}

function adjustKarma(pointDelta, reasonString) {
    appState.users[appState.currentUserId].karma += pointDelta;
    document.getElementById("karma-count").innerText = appState.users[appState.currentUserId].karma;
    triggerToast(`+${pointDelta} Karma ⚡`, reasonString);
}

function switchTab(targetId) {
    if(targetId === 'home') switchCircle(appState.activeCircle);
}

function toggleNotificationCenter() {
    const activeRequests = appState.inventory.filter(i => i.owner === appState.currentUserId && i.status === 'requested');
    if(activeRequests.length > 0) {
        triggerToast("Alert Notification", `You have ${activeRequests.length} incoming signature borrow requests pending action inputs.`);
    } else {
        triggerToast("Alert System", "No pending transaction flags detected in sync scope.");
    }
}

function showKarmaDetails() {
    const u = appState.users[appState.currentUserId];
    triggerToast("Ledger Balance", `${u.name} structural trust ledger contains ${u.karma} system karma assets metrics calculation score.`);
}

function triggerToast(title, bodyText) {
    const toast = document.getElementById("toast-notification");
    const tTitle = document.getElementById("toast-title");
    const tBody = document.getElementById("toast-body");
    if(toast && tTitle && tBody) {
        tTitle.innerText = title; tBody.innerText = bodyText;
        toast.classList.add("visible");
        setTimeout(() => toast.classList.remove("visible"), 4000);
    }
}
