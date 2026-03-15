// Chatbox simples para LG Placas Automotivas
// Configurações de opções e respostas podem ser alteradas aqui.

const CHATBOX_WHATSAPP_URL =
  "https://wa.me/5535998669644?text=Olá!%20Quero%20falar%20com%20o%20atendimento%20da%20LG%20Placas.";

const CHAT_BOX_FLOW = {
  main: {
    title: "Escolha uma opção (digite ou clique no número):",
    options: [
      { label: "1 - Placas", value: "placas", next: "placas" },
      { label: "2 - Orçamento", value: "orcamento", next: "orcamento" },
      { label: "3 - Atendimento", value: "atendente", next: "atendente" },
    ],
  },
  placas: {
    title: "Placas (escolha uma opção):",
    options: [
      {
        label: "1 - Placa perdida",
        value: "placa-perdida",
        response:
          "Faça boletim de ocorrência (BO). Nós orientamos quais documentos você precisa e explicamos os próximos passos.",
      },
      {
        label: "2 - 2ª via (extravio/furto/dano)",
        value: "segunda-via",
        response:
          "A segunda via depende de autorização do DETRAN. Nós explicamos como acompanhar e o que entregar.",
      },
      {
        label: "3 - Primeiro emplacamento",
        value: "primeiro-emplacamento",
        response:
          "Para primeiro emplacamento, nos envie os dados do veículo e documentos; nós preparamos a placa assim que estiver tudo certo.",
      },
      { label: "0 - Voltar", value: "voltar-main", next: "main" },
    ],
  },
  orcamento: {
    title: "Orçamento (escolha tipo):",
    options: [
      {
        label: "1 - Placa para carro",
        value: "placa-carro",
        response:
          "Placa Mercosul para carro com material 3M e QR Code. Informe modelo/ano para orçamento mais preciso.",
      },
      {
        label: "2 - Placa para moto",
        value: "placa-moto",
        response:
          "Placa Mercosul para moto com alumínio reforçado. Informe modelo para orçamento mais preciso.",
      },
      {
        label: "3 - Troca de placa cinza",
        value: "troca-cinza",
        response:
          "A placa cinza não é mais produzida. Fazemos a troca para o modelo Mercosul e orientamos o processo.",
      },
      { label: "0 - Voltar", value: "voltar-main", next: "main" },
    ],
  },
  atendente: {
    title: "Fale com um atendente:",
    options: [
      {
        label: "1 - Abrir WhatsApp",
        value: "open-whatsapp",
        response:
          "Clique no botão 'Falar com atendente' para abrir o WhatsApp e falar direto com a nossa equipe.",
      },
      { label: "0 - Voltar", value: "voltar-main", next: "main" },
    ],
  },
};

const CHATBOX_INITIAL_MESSAGE =
  "Olá! Eu sou o assistente virtual da LG Placas. Digite ou clique no número para navegar (ex: 1).";

const CHATBOX_CLASSES = {
  root: "fixed bottom-6 right-6 z-50",
  toggle:
    "w-14 h-14 rounded-full bg-blue-600 shadow-xl flex items-center justify-center text-white text-2xl hover:bg-blue-700 focus:outline-none",
  panel:
    "hidden w-80 h-[520px] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col",
  header: "flex items-center justify-between px-4 py-3 bg-blue-600 text-white",
  title: "flex items-center gap-2",
  status: "text-xs bg-white/20 px-2 py-0.5 rounded-lg",
  close:
    "text-white text-xl leading-none hover:text-white/80 focus:outline-none",
  messages: "flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50",
  footer: "px-4 pb-4",
  footerText: "text-xs text-slate-500 mb-2",
  options: "grid gap-2",
  optionBtn:
    "chat-option bg-blue-600 text-white py-2 rounded-xl text-sm font-semibold",
  whatsappBtn:
    "bg-green-500 text-white py-2 rounded-xl text-sm font-semibold",
};

function chatboxCreateElement(tag, props = {}, children = []) {
  const el = document.createElement(tag);
  Object.entries(props).forEach(([key, value]) => {
    if (key === "class") {
      el.className = value;
    } else if (key === "text") {
      el.textContent = value;
    } else if (key === "html") {
      el.innerHTML = value;
    } else if (key.startsWith("data-")) {
      el.setAttribute(key, value);
    } else if (key === "onclick" && typeof value === "function") {
      el.addEventListener("click", value);
    } else {
      el.setAttribute(key, value);
    }
  });

  if (Array.isArray(children)) {
    children.forEach((child) => {
      if (typeof child === "string") {
        el.appendChild(document.createTextNode(child));
      } else if (child instanceof Node) {
        el.appendChild(child);
      }
    });
  }
  return el;
}

function chatboxAddMessage(container, text, isUser = false) {
  const msg = chatboxCreateElement("div", {
    class: `max-w-[85%] px-3 py-2 rounded-xl text-sm ${
      isUser ? "bg-blue-600 text-white self-end" : "bg-white text-slate-700"
    }`,
    text,
  });

  container.appendChild(msg);
  container.scrollTop = container.scrollHeight;
}

function chatboxInit() {
  const root = document.getElementById("chat-widget");
  if (!root) return;

  const toggle = document.getElementById("chat-toggle");
  const panel = document.getElementById("chat-panel");
  const closeBtn = document.getElementById("chat-close");
  const messages = document.getElementById("chat-messages");
  const whatsappBtn = document.getElementById("chat-whatsapp");
  const optionsContainer = document.getElementById("chat-options");

  // Fluxo de menu (tipo WhatsApp) baseado em etapas.
  let currentStep = "main";

  const renderStep = (stepKey) => {
    const step = CHAT_BOX_FLOW[stepKey];
    if (!step || !optionsContainer) return;

    currentStep = stepKey;
    optionsContainer.innerHTML = "";

    // Mostra a pergunta/título do passo como mensagem do bot.
    chatboxAddMessage(messages, step.title, false);

    step.options.forEach((option) => {
      const btn = chatboxCreateElement("button", {
        class: CHATBOX_CLASSES.optionBtn,
        type: "button",
        "data-value": option.value,
        text: option.label,
      });

      btn.addEventListener("click", () => {
        handleOption(option);
      });

      optionsContainer.appendChild(btn);
    });
  };

  const handleOption = (option) => {
    chatboxAddMessage(messages, option.label, true);

    if (option.value === "open-whatsapp") {
      window.open(CHATBOX_WHATSAPP_URL, "_blank");
    }

    if (option.response) {
      setTimeout(() => {
        chatboxAddMessage(messages, option.response, false);

        if (option.next) {
          renderStep(option.next);
        }
      }, 250);
    } else if (option.next) {
      setTimeout(() => renderStep(option.next), 250);
    }
  };

  // renderiza passo inicial
  renderStep(currentStep);

  toggle.addEventListener("click", () => {
    panel.classList.toggle("hidden");
  });

  closeBtn.addEventListener("click", () => {
    panel.classList.add("hidden");
  });

  whatsappBtn.addEventListener("click", () => {
    window.open(CHATBOX_WHATSAPP_URL, "_blank");
  });

  // mensagem inicial
  chatboxAddMessage(messages, CHATBOX_INITIAL_MESSAGE, false);
}

document.addEventListener("DOMContentLoaded", chatboxInit);
