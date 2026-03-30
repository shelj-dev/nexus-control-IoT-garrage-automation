/**
 * SmartSpace IoT Control Dashboard
 * JavaScript Implementation for UI Interactivity & Mock API
 */

document.addEventListener('DOMContentLoaded', () => {

    // --- State Management ---
    const state = {
        door: 'closed', // 'closed', 'open', 'opening', 'closing'
        light: false,
        fan: false,
        airQuality: {
            aqi: 42,
            co: 12,
            gas: 0,
            status: 'safe' // 'safe', 'warning', 'danger'
        }
    };

    // --- DOM Elements ---
    const els = {
        // Buttons
        btnOpen: document.getElementById('btn-open'),
        btnClose: document.getElementById('btn-close'),
        mobileBtnOpen: document.getElementById('mobile-btn-open'),
        mobileBtnClose: document.getElementById('mobile-btn-close'),

        // Door Status Visualization
        doorStatusContainer: document.getElementById('door-status-indicator').parentElement,
        doorIcon: document.getElementById('door-icon'),
        doorStatusText: document.getElementById('door-status-text'),
        doorGlow: document.getElementById('door-glow'),
        mobileStatusLabel: document.getElementById('mobile-status-label'),
        mobileStatusDot: document.getElementById('mobile-status-dot'),

        // Controls
        toggleLight: document.getElementById('toggle-light'),
        lightStatusText: document.getElementById('light-status-text'),
        lightIcon: document.getElementById('light-icon'),

        toggleFan: document.getElementById('toggle-fan'),
        fanStatusText: document.getElementById('fan-status-text'),
        fanIcon: document.getElementById('fan-icon'),
        fanCard: document.getElementById('fan-card'),

        // Air Quality
        aqValue: document.getElementById('aq-value'),
        aqBadge: document.getElementById('aq-badge'),
        aqGlow: document.getElementById('aq-glow'),
        aqMeterFill: document.getElementById('aq-meter-fill'),
        coValue: document.getElementById('co-value'),
        coBar: document.getElementById('co-bar'),
        gasValue: document.getElementById('gas-value'),
        gasBar: document.getElementById('gas-bar'),

        // Activity Log
        activityLog: document.getElementById('activity-log'),
        btnClearLogs: document.getElementById('btn-clear-logs')
    };

    // --- Helper Formatting ---
    const formatTime = (date = new Date()) => {
        return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true });
    };

    // --- Logging System ---
    const addLog = (message, type = 'info') => {
        const time = formatTime();

        let iconClass = 'ph-info text-blue-400';
        let bgClass = 'bg-blue-500/10';

        if (type === 'success') {
            iconClass = 'ph-check-circle text-emerald-400';
            bgClass = 'bg-emerald-500/10';
        } else if (type === 'warning') {
            iconClass = 'ph-warning text-yellow-400';
            bgClass = 'bg-yellow-500/10';
        } else if (type === 'danger') {
            iconClass = 'ph-warning-octagon text-red-500';
            bgClass = 'bg-red-500/10';
        } else if (type === 'action') {
            iconClass = 'ph-lightning text-accent-400';
            bgClass = 'bg-accent-500/10';
        }

        const logHTML = `
            <div class="log-entry flex items-start gap-3 p-3 rounded-xl bg-glass-100 border border-glass-border hover:bg-glass-200 transition-colors">
                <div class="w-8 h-8 rounded-lg ${bgClass} flex items-center justify-center shrink-0 mt-0.5">
                    <i class="ph ${iconClass} text-lg"></i>
                </div>
                <div>
                    <p class="text-sm text-gray-200 leading-snug">${message}</p>
                    <span class="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">${time}</span>
                </div>
            </div>
        `;

        els.activityLog.insertAdjacentHTML('afterbegin', logHTML);
    };

    els.btnClearLogs.addEventListener('click', () => {
        els.activityLog.innerHTML = '';
        addLog('System logs cleared.', 'info');
    });

    // --- API Mocking Functions ---
    // Simulate network delay
    const delay = (ms) => new Promise(res => setTimeout(res, ms));

    const mockApiCall = async (endpoint, payload = null) => {
        // Simulating 500ms to 1.5s network latency
        await delay(Math.random() * 1000 + 500);
        console.log(`[API Mock] POST ${endpoint} -> 200 OK`);
        return { status: 'success' };
    };

    // --- Core Actions ---
    const setDoorState = (newState) => {
        state.door = newState;

        // Reset classes
        els.doorStatusContainer.classList.remove('status-open', 'status-closed', 'status-transitioning');

        switch (newState) {
            case 'open':
                els.doorStatusContainer.classList.add('status-open');
                els.doorIcon.className = 'ph ph-garage text-4xl text-red-400 drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]';
                els.doorStatusText.textContent = 'OPEN';
                els.doorStatusText.className = 'font-display font-bold text-2xl tracking-wide text-red-400';
                els.doorGlow.className = 'absolute inset-10 rounded-full bg-red-500/20 blur-2xl -z-10 transition-colors duration-700';
                els.mobileStatusLabel.textContent = 'Open';
                els.mobileStatusLabel.className = 'text-[10px] uppercase font-bold tracking-wider text-red-400';
                els.mobileStatusDot.className = 'absolute top-2 right-6 w-2 h-2 rounded-full bg-red-500 animate-pulse';

                break;

            case 'closed':
                els.doorStatusContainer.classList.add('status-closed');
                els.doorIcon.className = 'ph ph-garage text-4xl text-emerald-400 drop-shadow-[0_0_10px_rgba(16,185,129,0.8)]';
                els.doorStatusText.textContent = 'CLOSED';
                els.doorStatusText.className = 'font-display font-bold text-2xl tracking-wide text-emerald-400';
                els.doorGlow.className = 'absolute inset-10 rounded-full bg-emerald-500/10 blur-2xl -z-10 transition-colors duration-700';
                els.mobileStatusLabel.textContent = 'Closed';
                els.mobileStatusLabel.className = 'text-[10px] uppercase font-bold tracking-wider text-emerald-400';
                els.mobileStatusDot.className = 'absolute top-2 right-6 w-2 h-2 rounded-full bg-emerald-500';

                break;

            case 'opening':
            case 'closing':
                els.doorStatusContainer.classList.add('status-transitioning');
                els.doorIcon.className = 'ph ph-arrows-clockwise text-4xl text-yellow-500 animate-spin';
                els.doorStatusText.textContent = newState.toUpperCase();
                els.doorStatusText.className = 'font-display font-bold text-2xl tracking-wide text-yellow-500';
                els.doorGlow.className = 'absolute inset-10 rounded-full bg-yellow-500/20 blur-2xl -z-10 transition-colors duration-700';
                els.mobileStatusLabel.textContent = newState === 'opening' ? 'Opening...' : 'Closing...';
                els.mobileStatusLabel.className = 'text-[10px] uppercase font-bold tracking-wider text-yellow-500';
                els.mobileStatusDot.className = 'absolute top-2 right-6 w-2 h-2 rounded-full bg-yellow-500 animate-pulse';

                break;
        }
    };

    const updateGarageRelay = async (payload) => {
        try {
            await fetch('/api/update-control/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
        } catch (e) {
            console.error('Garage relay update failed', e);
        }
    };

    const handleOpenPress = async (event) => {
        event.preventDefault();
        const btn = event.currentTarget;

        addLog('Open button pressed (push mode)', 'action');
        setDoorState('opening');
        await updateGarageRelay({ is_garage_open: true, is_garage_close: false, is_light: true });

        state.light = true;
        els.toggleLight.checked = true;
        els.lightStatusText.textContent = 'On';
        els.lightIcon.className = 'ph-fill ph-lightbulb text-2xl text-yellow-400';
    };

    const handleOpenRelease = async (event) => {
        event.preventDefault();
        const btn = event.currentTarget;
        btn.classList.remove('pressed');

        addLog('Open button released (push mode)', 'info');
        await updateGarageRelay({ is_garage_open: false });

        setDoorState('closed');
        addLog('Garage open command released', 'info');
    };

    const handleClosePress = async (event) => {
        event.preventDefault();
        const btn = event.currentTarget;
        btn.classList.add('pressed');

        addLog('Close button pressed (push mode)', 'action');
        setDoorState('closing');
        await updateGarageRelay({ is_garage_close: true, is_garage_open: false, is_light: false });

        state.light = false;
        els.toggleLight.checked = false;
        els.lightStatusText.textContent = 'Off';
        els.lightIcon.className = 'ph ph-lightbulb text-2xl text-yellow-500';
    };

    const handleCloseRelease = async (event) => {
        event.preventDefault();
        const btn = event.currentTarget;
        btn.classList.remove('pressed');

        addLog('Close button released (push mode)', 'info');
        await updateGarageRelay({ is_garage_close: false, is_garage_open: false });

        setDoorState('closed');
        addLog('Garage close command released', 'info');
    };

    els.btnClose.addEventListener('mousedown', handleClosePress);
    els.btnClose.addEventListener('mouseup', handleCloseRelease);
    els.btnClose.addEventListener('mouseleave', handleCloseRelease);
    els.btnClose.addEventListener('touchstart', handleClosePress);
    els.btnClose.addEventListener('touchend', handleCloseRelease);
    els.btnClose.addEventListener('touchcancel', handleCloseRelease);

    const handleOpenDoor = async () => {
        if (state.door !== 'closed') return;

        addLog('Opening garage...', 'action');
        setDoorState('opening');

        console.log("Sending OPEN command");

        await fetch('/api/update-control/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ is_garage_open: true })
        });

        // 💡 UPDATE LIGHT UI (IMPORTANT)
        state.light = true;
        els.toggleLight.checked = true;
        els.lightStatusText.textContent = 'On';
        els.lightIcon.className = 'ph-fill ph-lightbulb text-2xl text-yellow-400';

        setTimeout(() => {
            setDoorState('open');
            addLog('Garage opened', 'success');
        }, 2000);
    };

    const handleCloseDoor = async () => {
        if (state.door !== 'open') return;

        addLog('Closing garage...', 'action');
        setDoorState('closing');

        await fetch('/api/update-control/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ is_garage_close: true })
        });

        // 💡 UPDATE LIGHT UI (IMPORTANT)
        state.light = false;
        els.toggleLight.checked = false;
        els.lightStatusText.textContent = 'Off';
        els.lightIcon.className = 'ph ph-lightbulb text-2xl text-yellow-500';

        setTimeout(() => {
            setDoorState('closed');
            addLog('Garage closed', 'success');
        }, 2000);
    };

    const toggleLightState = async (forceState = null) => {
        const nextState = forceState !== null ? forceState : !state.light;

        els.toggleLight.disabled = true;

        if (nextState) {
            els.lightStatusText.textContent = 'On';
            els.lightIcon.className = 'ph-fill ph-lightbulb text-2xl text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]';
            addLog('Main lighting switched ON manually.', 'action');
        } else {
            els.lightStatusText.textContent = 'Off';
            els.lightIcon.className = 'ph ph-lightbulb text-2xl text-yellow-500';
            addLog('Main lighting switched OFF manually.', 'info');
        }

        // Mock API Call
        await fetch('/api/update-control/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ is_light: nextState })
        });

        state.light = nextState;
        els.toggleLight.checked = nextState;
        els.toggleLight.disabled = false;
    };

    const toggleFanState = async (forceState = null, isAuto = false) => {
        const nextState = forceState !== null ? forceState : !state.fan;

        els.toggleFan.disabled = true;
        const modeBadge = document.getElementById('fan-mode-badge');

        if (isAuto) {
            modeBadge.textContent = 'Auto';
            modeBadge.className = 'text-xs px-2 py-0.5 rounded-full bg-accent-500/20 text-accent-400 border border-accent-500/50';
        } else {
            modeBadge.textContent = 'Manual';
            modeBadge.className = 'text-xs px-2 py-0.5 rounded-full bg-gray-800 text-gray-300 border border-gray-700';
        }

        if (nextState) {
            els.fanStatusText.textContent = 'On';
            els.fanCard.classList.add('fan-active');
            addLog(`Exhaust fan activated (${isAuto ? 'AUTO' : 'MANUAL'}).`, 'info');
        } else {
            els.fanStatusText.textContent = 'Off';
            els.fanCard.classList.remove('fan-active');
            addLog(`Exhaust fan deactivated (${isAuto ? 'AUTO' : 'MANUAL'}).`, 'info');
        }

        await fetch('/api/update-control/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ is_exhaust: nextState })
        });

        state.fan = nextState;
        els.toggleFan.checked = nextState;
        els.toggleFan.disabled = false;
    };


    // --- Event Listeners ---
    els.btnOpen.addEventListener('mousedown', handleOpenPress);
    els.btnOpen.addEventListener('mouseup', handleOpenRelease);
    els.btnOpen.addEventListener('mouseleave', handleOpenRelease);
    els.btnOpen.addEventListener('touchstart', handleOpenPress);
    els.btnOpen.addEventListener('touchend', handleOpenRelease);
    els.btnOpen.addEventListener('touchcancel', handleOpenRelease);

    els.btnClose.addEventListener('mousedown', handleClosePress);
    els.btnClose.addEventListener('mouseup', handleCloseRelease);
    els.mobileBtnClose.addEventListener('touchstart', handleClosePress);
    els.mobileBtnClose.addEventListener('touchend', handleCloseRelease);

    els.toggleLight.addEventListener('change', () => toggleLightState());
    els.toggleFan.addEventListener('change', () => toggleFanState());


    // --- Air Quality Simulation ---
    const updateAirQualityUI = () => {
        const aq = state.airQuality;

        // Update values
        els.aqValue.textContent = aq.aqi;
        els.coValue.textContent = `${aq.co} ppm`;
        els.gasValue.textContent = `${aq.gas}% LEL`;

        // Update bars
        els.coBar.style.width = `${Math.min(100, (aq.co / 50) * 100)}%`;
        els.gasBar.style.width = `${Math.min(100, (aq.gas / 20) * 100)}%`;

        // Circular Gauge Update (339.29 is full circle circumference)
        // 0 AQI = 270 offset (empty), 100 AQI = 0 offset (full)
        // Adjust mapping: let's say 200 is max gauge instead of 100
        const percentage = Math.min(100, (aq.aqi / 150) * 100);
        const offset = 339.29 - (percentage / 100) * 339.29;
        els.aqMeterFill.style.strokeDashoffset = offset + 50; // offset a bit to start from bottom left

        // Determine Status Color
        if (aq.aqi > 100 || aq.gas > 10 || aq.co > 35) {
            // Danger
            if (aq.status !== 'danger') {
                aq.status = 'danger';
                addLog(`DANGER: Critical air quality levels detected! AQI: ${aq.aqi}`, 'danger');

                // Auto trigger fan
                if (!state.fan) toggleFanState(true, true);

                // UI Updates
                els.aqBadge.textContent = 'Danger';
                els.aqBadge.className = 'px-3 py-1 text-xs font-semibold rounded-full bg-red-500/20 text-red-500 border border-red-500/50 blink-fast';
                els.aqMeterFill.classList.replace('stroke-emerald-500', 'stroke-red-500');
                els.aqMeterFill.classList.replace('stroke-yellow-400', 'stroke-red-500');
                els.aqGlow.className = 'absolute right-0 top-0 w-64 h-64 bg-red-500/20 blur-[80px] rounded-full pointer-events-none transition-colors duration-1000';
            }
        } else if (aq.aqi > 50 || aq.gas > 5 || aq.co > 15) {
            // Warning
            if (aq.status !== 'warning') {
                aq.status = 'warning';
                addLog(`WARNING: Elevated air contaminants detected. AQI: ${aq.aqi}`, 'warning');

                // UI Updates
                els.aqBadge.textContent = 'Warning';
                els.aqBadge.className = 'px-3 py-1 text-xs font-semibold rounded-full bg-yellow-400/20 text-yellow-400 border border-yellow-400/50';
                els.aqMeterFill.classList.replace('stroke-emerald-500', 'stroke-yellow-400');
                els.aqMeterFill.classList.replace('stroke-red-500', 'stroke-yellow-400');
                els.aqGlow.className = 'absolute right-0 top-0 w-64 h-64 bg-yellow-400/10 blur-[80px] rounded-full pointer-events-none transition-colors duration-1000';
            }
        } else {
            // Safe
            if (aq.status !== 'safe') {
                aq.status = 'safe';
                addLog('Air quality returned to normal safe levels.', 'success');

                // UI Updates
                els.aqBadge.textContent = 'Safe Air';
                els.aqBadge.className = 'px-3 py-1 text-xs font-semibold rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
                els.aqMeterFill.classList.replace('stroke-yellow-400', 'stroke-emerald-500');
                els.aqMeterFill.classList.replace('stroke-red-500', 'stroke-emerald-500');
                els.aqGlow.className = 'absolute right-0 top-0 w-64 h-64 bg-emerald-500/5 blur-[80px] rounded-full pointer-events-none transition-colors duration-1000';
            }
        }
    };

    const fetchControlState = async () => {
        try {
            const res = await fetch('/api/send-relay/');
            const data = await res.json();

            // 🌪️ Sync fan UI
            if (data.is_exhaust) {
                state.fan = true;
                els.toggleFan.checked = true;
                els.fanStatusText.textContent = 'On';
                els.fanCard.classList.add('fan-active');
            } else {
                state.fan = false;
                els.toggleFan.checked = false;
                els.fanStatusText.textContent = 'Off';
                els.fanCard.classList.remove('fan-active');
            }

        } catch (e) {
            console.log("Control sync error", e);
        }
    };

    // --- Initialization ---
    const init = () => {
        // Set initial UI states
        setDoorState('closed');
        els.toggleLight.checked = false;
        els.toggleFan.checked = false;

        // Initial log
        addLog('System initialized and connected securely.', 'success');
        addLog('Monitoring sensors active.', 'info');

        // Start "live" simulations
        // setInterval(simulateAirQuality, 3000);
        setInterval(fetchSensorData, 3000);
        setInterval(fetchControlState, 2000);

        // Initial UI draw
        updateAirQualityUI();
    };



    const fetchSensorData = async () => {
        try {
            const res = await fetch('/api/get-latest-sensor/');
            const data = await res.json();

            const value = data.value;

            // Update AQ number
            document.getElementById('aq-value').textContent = value;

            // 🔥 Convert raw value → percentage (approx)
            let gasPercent = Math.min(100, Math.floor(value / 300));

            // Update combustible gas
            document.getElementById('gas-value').textContent = gasPercent + "%";
            document.getElementById('gas-bar').style.width = gasPercent + "%";

            // CO estimation (simple mapping)
            let co = Math.floor(value / 100);
            document.getElementById('co-value').textContent = co + " ppm";
            document.getElementById('co-bar').style.width = Math.min(100, co) + "%";

            // 🔴 STATUS LOGIC
            if (value > 12000) {
                setDangerState(value);
            }
            else if (value > 10000) {
                setWarningState(value);
            }
            else {
                setSafeState();
            }

        } catch (e) {
            console.log("Sensor fetch error", e);
        }
    };

    function setDangerState(value) {
        document.getElementById('aq-badge').textContent = "DANGER";

        const meter = document.getElementById('aq-meter-fill');
        meter.classList.remove('stroke-yellow-400');
        meter.classList.add('stroke-red-500');

        fetch('/api/update-control/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ is_exhaust: true })
        });
    }


    function setWarningState(value) {
        document.getElementById('aq-badge').textContent = "WARNING";

        const meter = document.getElementById('aq-meter-fill');
        meter.classList.remove('stroke-red-500');
        meter.classList.add('stroke-yellow-400');

        fetch('/api/update-control/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ is_exhaust: true })
        });
    }


    function setSafeState() {
        document.getElementById('aq-badge').textContent = "SAFE";

        document.getElementById('aq-badge').className =
            "px-3 py-1 text-xs font-semibold rounded-full bg-green-500 text-white";

        // ✅ RESET METER COLOR
        const meter = document.getElementById('aq-meter-fill');
        meter.classList.remove('stroke-red-500');
        meter.classList.remove('stroke-yellow-400');
        meter.classList.add('stroke-emerald-500');

        // 🌪️ AUTO FAN OFF
        fetch('/api/update-control/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ is_exhaust: false })
        });
    }

    init();
});
