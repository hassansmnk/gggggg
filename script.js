// Global Active Runtime State Machine Data
let appState = {
    currentUser: {
        id: "usr-local-client", // Primary local signature hash
        name: "",
        email: "",
        karma: 0,
        avatar: "??"
    },
    activeCircle: "family", 
    inventory: [
        {
            id: "fam-car",
            name: "Toyota Camry",
            category: "Vehicles",
            circle: "family",
            status: "busy", // [avail, busy, requested]
            owner: "usr-sara-99", // Owned by a family member
            holder: "Youssef",
            returnTime: "6:30 PM",
            imageGradient: "linear-gradient(135deg, #FF9500, #FF5E3A)",
            fuel: 82, range: 520, odometer: 182541,
            history: [{ time: "9:15 AM", user: "Youssef", type: "borrowed", log: "Asset deployment initialized." }]
        },
        {
            id: "fam-drill",
            name: "DeWalt Cordless Drill 20V",
            category: "Tools",
            circle: "family",
            status: "avail",
            owner: "usr-local-client", // Owned exclusively by the Registered User
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
            owner: "usr-john-4b", // Owned by neighbor John
            holder: "None",
            returnTime: "",
            imageGradient: "linear-gradient(135deg, #11998E, #38EF7D)",
            history: [{ time: "Last Week", user: "John", type: "returned", log: "Blades wiped clean, tank full." }]
        }
    ]
};

// Application Bootstrap Initialize
document.addEventListener("DOMContentLoaded", () => {
    // Initial configuration matrices remain hidden until Auth verification sequence finishes
});

// Structural SPA Navigation Matrix Router Toggle
function navigateTo(viewId) {
    document.querySelectorAll(".view").forEach(view => view.classList.remove("active"));
    const targetView = document.getElementById(viewId);
    if(targetView) targetView.classList.add("active");
}

// Simulated Third-party Registration Connectors
function simulateOAuth(platform) {
    document.getElementById("ob-email").value = `${platform.toLowerCase()}.user@shareme.io`;
    document.getElementById("ob-pass").value = "••••••••••••";
    triggerToast("Identity Synchronized", `Pulled structural hash signature records from ${platform}.`);
}

// Onboarding Presentation Step Handler
function nextOnboardingStep() {
    const flowContainer = document.getElementById("onboarding-flow");
    let currentStep = parseInt(flowContainer.getAttribute("data-step"));
    
    if (currentStep === 1) {
        const emailVal = document.getElementById("ob-email").value;
        const passVal = document.getElementById("ob-pass").value;
        
        if(!emailVal || !passVal) {
            alert("A valid email coordinate structure and access code are required.");
            return;
        }
        appState.currentUser.email = emailVal;
        // Seed mock data generation values inside application memory
        appState.currentUser.name = emailVal.split('@')[0];
        document.getElementById("ob-name").value = appState.currentUser.name.charAt(0).toUpperCase() + appState.currentUser.name.slice(1);
    } else if (currentStep === 2) {
        const nameVal = document.getElementById("ob-name").value;
        if(!nameVal) {
            alert("Please specify a public identifier profile name.");
            return;
        }
        appState.currentUser.name = nameVal;
        appState.currentUser.avatar = nameVal.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    }
    
    flowContainer.setAttribute("data-step", currentStep + 1);
}

// Exit Onboarding Process Configuration Sync
function completeOnboarding() {
    document.getElementById("dash-avatar").innerText = appState.currentUser.avatar;
    document.getElementById("dash-greeting").innerText = `Hey ${appState.currentUser.name.split(' ')[0]}`;
    document.getElementById("karma-count").innerText = appState.currentUser.karma;
    
    // Evaluate active selected circle node target path element
    const activeCircleCard = document.querySelector(".circle-card.active");
    if(activeCircleCard) {
        const selectedType = activeCircleCard.getAttribute("data-circle-type");
        switchCircle(selectedType);
    } else {
        renderInventoryGrid();
        updateDashboardMetrics();
    }
    
    navigateTo("dashboard");
    triggerToast("🔒 Key Signed", "Account compiled successfully. Secure layer initiated.");
    
    // Simulate a live structural delay, then inject an external neighbor borrow request context
    // This allows you to test your "Accept Share Request" validation engine immediately.
    setTimeout(() => {
        const ownItem = appState.inventory.find(i => i.id === "fam-drill");
        if(ownItem && ownItem.status === "avail") {
            ownItem.status = "requested";
            ownItem.holder = "Tareq (Downstairs)";
            renderInventoryGrid();
            updateDashboardMetrics();
            triggerToast("📥 Incoming Request", "Tareq requested access to your DeWalt Cordless Drill.");
        }
    }, 6000);
}

function simulateAvatarUpload() {
    const preview = document.getElementById("avatar-preview");
    preview.style.background = "linear-gradient(135deg, #007AFF, #0051A8)";
    preview.style.color = "#FFFFFF";
    preview.innerText = "✓";
    triggerToast("Asset Optimized", "Custom avatar key structure verified.");
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

// Metrics Display Real-time Recalculation Engine
function updateDashboardMetrics() {
    const activeSet = appState.inventory.filter(item => item.circle === appState.activeCircle);
    const available = activeSet.filter(item => item.status === 'avail').length;
    
    // Assets that the current local profile handles right now
    const itemsHolding = appState.inventory.filter(item => item.status === 'busy' && item.holder === appState.currentUser.name).length;
    
    document.getElementById("metric-avail").innerText = available;
    document.getElementById("metric-borrowed").innerText = itemsHolding;
}

// Live Dynamic Component HTML Matrix Renderer
function renderInventoryGrid() {
    const container = document.getElementById("items-container");
    if(!container) return;
    container.innerHTML = ""; 
    
    const contextItems = appState.inventory.filter(item => item.circle === appState.activeCircle);
    
    if(contextItems.length === 0) {
        container.innerHTML = `<div class="subtext" style="text-align:center; padding:40px 0; grid-column: 1 / -1; opacity: 0.5;">No items linked to this network layer yet.</div>`;
        return;
    }
    
    contextItems.forEach(item => {
        const card = document.createElement("div");
        card.className = "item-card";
        card.onclick = () => openItemDetailSheet(item.id);
        
        // Ownership Badge Engine
        const isOwner = (item.owner === appState.currentUser.id);
        const ownershipBadge = isOwner ? `<span class="owner-badge-node" style="background: rgba(0,0,0,0.06); font-size:9px; padding:2px 6px; border-radius:4px; font-weight:600; text-transform:uppercase; letter-spacing:0.3px; color:#555;">You Own This</span>` : "";

        let statusBadge = "";
        let contextLine = "";

        if (item.status === "avail") {
            statusBadge = `<div class="status-indicator-pill avail">🟢 Available</div>`;
            contextLine = `Ready for instant coordination`;
        } else if (item.status === "requested") {
            statusBadge = `<div class="status-indicator-pill busy" style="background:rgba(255,149,0,0.1); color:#FF9500;">⏳ Requested</div>`;
            contextLine = `Awaiting owner authorization keys`;
        } else {
            statusBadge = `<div class="status-indicator-pill busy">🔴 Shared Out</div>`;
            contextLine = `Deployed to ${item.holder} • Return: ${item.returnTime || 'Indefinite'}`;
        }

        card.innerHTML = `
            <div class="item-card-image-wrap">
                <div class="fallback-gradient-avatar" style="background: ${item.imageGradient}; height:100%; width:100%; border-radius:12px; display:flex; align-items:center; justify-content:center; color:#fff; font-size:24px;">📦</div>
            </div>
            <div class="item-card-details" style="padding-top:10px;">
                <div class="item-title-row" style="display:flex; justify-content:between; align-items:center; margin-bottom:4px;">
                    <h5 style="margin:0; font-size:14px; font-weight:600; flex:1;">${item.name}</h5>
                    ${statusBadge}
                </div>
                <div style="display:flex; justify-content:space-between; align-items:center; margin-top:6px;">
                    <span class="holder-meta-row" style="font-size:12px; opacity:0.6;">${contextLine}</span>
                    ${ownershipBadge}
                </div>
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
    const isOwner = (item.owner === appState.currentUser.id);
    
    let administrativeControlHTML = "";
    let actionExecutionHTML = "";
    
    // 1. EVALUATE OWNER-SPECIFIC UTILITIES
    if(isOwner) {
        administrativeControlHTML = `
            <div class="owner-control-panel-row" style="display:flex; gap:10px; margin-bottom:20px; padding:12px; background:rgba(0,0,0,0.02); border-radius:8px; border:1px dashed rgba(0,0,0,0.08);">
                <button class="btn" style="flex:1; font-size:12px; background:#fff; border:1px solid #ddd;" onclick="executeEditAsset('${item.id}')">✏️ Modify Specs</button>
                <button class="btn" style="flex:1; font-size:12px; background:rgba(255,59,48,0.08); color:#FF3B30; border:1px solid rgba(255,59,48,0.15);" onclick="executeDeleteAsset('${item.id}')">🗑️ Delete Asset</button>
            </div>
        `;

        if(item.status === 'requested') {
            actionExecutionHTML = `
                <div style="background:rgba(255,149,0,0.05); padding:16px; border-radius:12px; border:1px solid rgba(255,149,0,0.2); text-align:center;">
                    <p style="margin:0 0 12px 0; font-size:13px; font-weight:500;"><strong>${item.holder}</strong> wants to borrow this item.</p>
                    <button class="btn btn-primary" onclick="executeAcceptRequest('${item.id}')">Accept & Share Asset (+5 Karma)</button>
                </div>
            `;
        } else if (item.status === 'busy') {
            actionExecutionHTML = `
                <button class="btn btn-primary" style="opacity:0.6; pointer-events:none;">Currently deployed with ${item.holder}</button>
            `;
        } else {
            actionExecutionHTML = `
                <div style="text-align:center; padding:10px; font-size:12px; opacity:0.6; font-style:italic;">
                    Asset is safely cataloged in your circle. Sitting tight for incoming request triggers.
                </div>
            `;
        }
    } 
    // 2. EVALUATE STRANGER/BORROWER UTILITIES
    else {
        if(item.status === 'avail') {
            actionExecutionHTML = `<button class="btn btn-primary" onclick="executeSendRequest('${item.id}')">Request Access Credentials</button>`;
        } else if(item.status === 'requested') {
            actionExecutionHTML = `<button class="btn btn-primary" style="background:#8E8E93; opacity:0.6; pointer-events:none;">Pending Owner Verification Signature...</button>`;
        } else if(item.status === 'busy' && item.holder === appState.currentUser.name) {
            actionExecutionHTML = `<button class="btn btn-primary" style="background:#34C759;" onclick="executeReturnAssetFlow('${item.id}')">Confirm Asset Return (+8 Karma)</button>`;
        } else {
            actionExecutionHTML = `<button class="btn btn-primary" style="opacity:0.4; pointer-events:none;">Unavailable • Checked out by ${item.holder}</button>`;
        }
    }

    // Secondary Telemetry Module Container
    let specializedModuleHTML = "";
    if(item.category === "Vehicles") {
        specializedModuleHTML = `
            <div class="fuel-gauge-card" style="background:rgba(0,0,0,0.02); padding:12px; border-radius:8px; margin:16px 0;">
                <div style="display:flex; justify-content:space-between; font-size:12px; margin-bottom:6px;">
                    <span>Fuel Volume Parameter</span>
                    <strong>${item.fuel || 100}%</strong>
                </div>
                <div style="background:#ddd; height:6px; border-radius:3px; overflow:hidden;">
                    <div style="background:#007AFF; height:100%; width:${item.fuel || 100}%;"></div>
                </div>
            </div>
        `;
    }

    detailRenderContainer.innerHTML = `
        <div style="background: ${item.imageGradient}; width:100%; height:120px; border-radius:12px; margin-bottom:16px; display:flex; align-items:center; justify-content:center; color:#fff; font-size:32px;">📦</div>
        <h2 style="margin:0 0 4px 0; font-size:20px; font-weight:700;">${item.name}</h2>
        <p class="subtitle" style="margin:0 0 16px 0; font-size:13px; opacity:0.6;">Category Hierarchy: ${item.category} Node</p>
        
        ${administrativeControlHTML}
        ${specializedModuleHTML}

        <h4 class="section-title" style="margin:16px 0 8px 0; font-size:12px; text-transform:uppercase; letter-spacing:0.5px; opacity:0.4;">Historical Asset Logs</h4>
        <div class="timeline-module" style="border-left:2px solid #eee; padding-left:12px; margin-bottom:24px;">
            ${item.history && item.history.length > 0 ? item.history.map(h => `
                <div style="margin-bottom:8px; font-size:12px;">
                    <span style="opacity:0.4; margin-right:6px;">${h.time}</span>
                    <strong>${h.user}:</strong> <span style="opacity:0.8;">${h.log}</span>
                </div>
            `).join('') : '<p style="font-size:12px; opacity:0.4; font-style:italic; margin:0;">No record clusters verified in current index.</p>'}
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

// BORROWER: Dispatches request ping to owner
function executeSendRequest(itemId) {
    const item = appState.inventory.find(i => i.id === itemId);
    item.status = 'requested';
    item.holder = appState.currentUser.name;
    
    closeBottomSheet();
    renderInventoryGrid();
    updateDashboardMetrics();
    triggerToast("📡 Request Dispatched", "Asset permission access logs queued for owner confirmation.");
}

// OWNER: Validates access permissions, signs lease contract
function executeAcceptRequest(itemId) {
    const item = appState.inventory.find(i => i.id === itemId);
    item.status = 'busy';
    item.returnTime = "Indefinite";
    
    item.history.unshift({
        time: "Just Now",
        user: appState.currentUser.name,
        type: "approval",
        log: `Granted share authorization to ${item.holder}.`
    });
    
    // Karma Rule 2: +5 Points for accepting to share your asset
    adjustKarma(5, "Share Request Authorized");
    
    closeBottomSheet();
    renderInventoryGrid();
    updateDashboardMetrics();
}

// BORROWER: Initiates returning verification loop
function executeReturnAssetFlow(itemId) {
    const item = appState.inventory.find(i => i.id === itemId);
    const detailRenderContainer = document.getElementById("sheet-detail-render");
    
    detailRenderContainer.innerHTML = `
        <h2 style="font-size:18px; margin-bottom:6px;">Confirm Return Condition</h2>
        <p class="subtitle" style="font-size:13px; opacity:0.6; margin-bottom:20px;">Is the asset clean, fully fueled/charged, and working flawlessly?</p>
        
        <button class="btn btn-primary" style="background:#34C759; margin-bottom:10px;" onclick="finalizeReturnProcess('${item.id}', true)">Yes, Returned in Pristine Condition (+8 Karma)</button>
        <button class="btn" style="background:rgba(0,0,0,0.05); width:100%; border:1px solid #ddd;" onclick="finalizeReturnProcess('${item.id}', false)">Returned (Requires Maintenance Notice)</button>
    `;
}

// BORROWER: Signs transaction closure
function finalizeReturnProcess(itemId, inGoodCondition) {
    const item = appState.inventory.find(i => i.id === itemId);
    item.status = "avail";
    const previousBorrower = item.holder;
    item.holder = "None";
    item.returnTime = "";
    
    item.history.unshift({
        time: "Just Now",
        user: previousBorrower,
        type: "returned",
        log: `Returned to source node. Condition status evaluated: ${inGoodCondition ? 'Pristine' : 'Requires Review'}`
    });
    
    if(inGoodCondition) {
        // Karma Rule 3: +8 Points for returning item in good condition
        adjustKarma(8, "Pristine Asset Restructured");
    } else {
        triggerToast("Asset Returned", "Returned safely. Processing conditional warning flags.");
    }
    
    closeBottomSheet();
    renderInventoryGrid();
    updateDashboardMetrics();
}

// OWNER: Deletes item from repository completely
function executeDeleteAsset(itemId) {
    const originalCount = appState.inventory.length;
    appState.inventory = appState.inventory.filter(i => i.id !== itemId);
    
    if(appState.inventory.length < originalCount) {
        closeBottomSheet();
        renderInventoryGrid();
        updateDashboardMetrics();
        triggerToast("🗑️ Entry Purged", "Asset deleted from network catalog.");
    }
}

// OWNER: Fires configuration modifier
function executeEditAsset(itemId) {
    const item = appState.inventory.find(i => i.id === itemId);
    const updateTitle = prompt("Modify Asset Name Descriptor:", item.name);
    if(updateTitle && updateTitle.trim() !== "") {
        item.name = updateTitle.trim();
        closeBottomSheet();
        renderInventoryGrid();
        triggerToast("✏️ Matrix Updated", "Internal parameters saved.");
    }
}

// Trigger Form Capture Modal
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
        preview.style.background = "linear-gradient(135deg, #A8BFFF, #8843F2)";
        preview.style.width = "100%";
        preview.style.height = "100%";
    }
}

// INGESTION: Appends new assets to registry array
function submitNewAsset() {
    const name = document.getElementById("new-item-name").value;
    const category = document.getElementById("new-item-category").value;
    const circle = document.getElementById("new-item-circle").value;
    
    if(!name) {
        alert("Please assign a structural identity descriptor string label.");
        return;
    }
    
    const generatedRecord = {
        id: "custom-" + Date.now(),
        name: name,
        category: category,
        circle: circle,
        status: "avail",
        owner: appState.currentUser.id, // Absolute local credential link mapping
        holder: "None",
        returnTime: "",
        imageGradient: "linear-gradient(135deg, #818CF8, #C084FC)",
        history: [{ time: "Created", user: appState.currentUser.name, type: "init", log: "Published to network pool." }]
    };
    
    appState.inventory.push(generatedRecord);
    
    // Karma Rule 1: +5 Points for adding item to the index
    adjustKarma(5, "Inventory Contribution Added");
    
    closeAddAssetModal();
    renderInventoryGrid();
    updateDashboardMetrics();
}

// Centralized Math Scoring Module
function adjustKarma(pointDelta, reasonString) {
    appState.currentUser.karma += pointDelta;
    const countDisplay = document.getElementById("karma-count");
    if(countDisplay) countDisplay.innerText = appState.currentUser.karma;
    triggerToast(`+${pointDelta} Karma ⚡`, reasonString);
}

function switchTab(targetId) {
    if(targetId === 'home') {
        switchCircle(appState.activeCircle);
    }
}

function toggleNotificationCenter() {
    const activeRequests = appState.inventory.filter(i => i.owner === appState.currentUser.id && i.status === 'requested');
    if(activeRequests.length > 0) {
        triggerToast("System Alerts", `You have ${activeRequests.length} pending share requests active.`);
    } else {
        triggerToast("Alerts Manifest Clear", "System reports zero pending operational fault codes.");
    }
}

function showKarmaDetails() {
    triggerToast("Karma Metrics Hub", `Score Ledger: ${appState.currentUser.karma} points. Earn points via network listings (+5), rentals approved (+5), and clean standard turn-ins (+8).`);
}

function triggerToast(title, bodyText) {
    const toast = document.getElementById("toast-notification");
    const tTitle = document.getElementById("toast-title");
    const tBody = document.getElementById("toast-body");
    
    if(toast && tTitle && tBody) {
        tTitle.innerText = title;
        tBody.innerText = bodyText;
        toast.classList.add("visible");
        setTimeout(() => {
            toast.classList.remove("visible");
        }, 4000);
    }
}
