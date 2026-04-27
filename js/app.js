// --- REFERÊNCIAS DA INTERFACE ---
const authArea = document.getElementById('authArea');
const panelArea = document.getElementById('panelArea');
const messageEl = document.getElementById('message');
const btnStart = document.getElementById('btnStart');
const controlsRow = document.getElementById('controlsRow');
const logContent = document.getElementById('logContent');

let isPaused = false;
let isRunning = false;

// --- LÓGICA DE LOGIN E VALIDAÇÃO ---
document.getElementById('codeForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const instanciaDigitada = document.getElementById('codeInput').value.trim();

    if (instanciaDigitada.toLowerCase() === 'teste1') {
        renderPanel('MODO_TESTE');
        return;
    }

    messageEl.textContent = "Validando instância na Evolution API...";

    try {
        const res = await fetch(`${window.APP_CONFIG.API_URL}/instance/fetchInstances`, {
            method: 'GET',
            headers: { 
                'apikey': window.APP_CONFIG.API_KEY 
            }
        });

        if (!res.ok) throw new Error("Erro na API");

        const instances = await res.json();
        const instanceFound = instances.find(i => i.instanceName === instanciaDigitada);

        if (instanceFound && instanceFound.status === 'open') {
            renderPanel(instanciaDigitada);
        } else if (instanceFound) {
            messageEl.textContent = "WhatsApp desconectado na Evolution.";
        } else {
            messageEl.textContent = "Instância não encontrada.";
        }
    } catch (err) {
        messageEl.textContent = "Erro ao conectar com a VPS.";
    }
});

function renderPanel(instancia) {
    localStorage.setItem('fz_token', instancia);
    authArea.classList.add('hidden');
    panelArea.classList.remove('hidden');
    messageEl.textContent = "Conectado: " + instancia;
}

// --- LOGS E INTERFACE ---
function addLog(msg, type = 'success') {
    const div = document.createElement('div');
    div.className = type === 'success' ? 'log-success' : 'log-error';
    div.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
    logContent.appendChild(div);
    logContent.scrollTop = logContent.scrollHeight;
}

document.getElementById('toggleLogs').onclick = () => {
    document.getElementById('logPanel').classList.add('open');
    document.getElementById('container').classList.add('shifted');
};

document.getElementById('closeLogs').onclick = () => {
    document.getElementById('logPanel').classList.remove('open');
    document.getElementById('container').classList.remove('shifted');
};

// --- CONTROLE DE DISPARO ---
btnStart.onclick = () => {
    if (!document.getElementById('phoneList').value.trim()) return alert("Insira contatos!");
    isRunning = true;
    btnStart.classList.add('hidden');
    controlsRow.classList.remove('hidden');
    addLog("Campanha iniciada.");
};

document.getElementById('btnPause').onclick = function() {
    isPaused = !isPaused;
    this.textContent = isPaused ? "Retomar" : "Pausar";
    addLog(isPaused ? "Pausado." : "Retomado.");
};

document.getElementById('btnCancel').onclick = () => {
    if (confirm("Cancelar?")) {
        isRunning = false;
        btnStart.classList.remove('hidden');
        controlsRow.classList.add('hidden');
        addLog("Cancelado.", "error");
    }
};

document.getElementById('btnLogout').onclick = () => {
    localStorage.removeItem('fz_token');
    window.location.reload();
};