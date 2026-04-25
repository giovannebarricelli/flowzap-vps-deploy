// Configurações Globais
const CONFIG = {
    API_URL: "https://api.flowzap.store",
    MIN_DURATION: 2.5
};

const authArea = document.getElementById('authArea');
const panelArea = document.getElementById('panelArea');
const messageEl = document.getElementById('message');
const btnStart = document.getElementById('btnStart');
const controlsRow = document.getElementById('controlsRow');
const logContent = document.getElementById('logContent');

let isPaused = false;
let isRunning = false;

// --- LÓGICA DE LOGIN ---
document.getElementById('codeForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const code = document.getElementById('codeInput').value.trim();

    if (code.toLowerCase() === 'teste1') {
        renderPanel('MODO_TESTE');
        return;
    }

    messageEl.textContent = "Validando instância...";
    try {
        const res = await fetch(`${CONFIG.API_URL}/instance/validate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code })
        });
        const data = await res.json();
        if (data.valid || data.success) {
            renderPanel(code);
        } else {
            messageEl.textContent = "Instância inválida.";
        }
    } catch {
        messageEl.textContent = "Erro ao conectar com o servidor.";
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
    addLog("Campanha iniciada com sucesso.");
};

document.getElementById('btnPause').onclick = function() {
    isPaused = !isPaused;
    this.textContent = isPaused ? "Retomar" : "Pausar";
    this.style.background = isPaused ? "var(--warning)" : "transparent";
    this.style.color = isPaused ? "#000" : "var(--warning)";
    addLog(isPaused ? "Operação Pausada." : "Operação Retomada.", isPaused ? 'error' : 'success');
};

document.getElementById('btnCancel').onclick = () => {
    if (confirm("Cancelar todos os disparos?")) {
        isRunning = false;
        btnStart.classList.remove('hidden');
        controlsRow.classList.add('hidden');
        addLog("Operação cancelada.", "error");
    }
};

document.getElementById('btnLogout').onclick = () => {
    localStorage.removeItem('fz_token');
    window.location.reload();
};

// Auto-login (Opcional: descomente para persistir sessão)
// if (localStorage.getItem('fz_token')) renderPanel(localStorage.getItem('fz_token'));