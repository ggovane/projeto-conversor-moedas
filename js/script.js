// Sons 
const somConversao = new Audio('./sounds/convert.mp3');
const somTroca = new Audio('./sounds/trocar.mp3');
const somReset = new Audio('./sounds/reset.mp3');
const somErro = new Audio('./sounds/erro.mp3');

// Garante que os sons sejam pré-carregados corretamente
const todosOsSons = [somConversao, somTroca, somReset, somErro];
todosOsSons.forEach(audio => {
  audio.load();
});

// Ajusta volume de todos os sons conforme o tamanho da tela
function ajustarVolumePorTela() {
  const largura = window.innerWidth;
  let volume;

  if (largura <= 480) {
    // Celulares pequenos: volume suave
    volume = 0.05;
  } else if (largura <= 768) {
    // Celulares médios: levemente mais presente
    volume = 0.08;
  } else if (largura <= 1024) {
    // Tablets: um pouco mais encorpado
    volume = 0.12;
  } else {
    // Desktops: volume mais completo
    volume = 0.2;
  }

  todosOsSons.forEach(audio => {
    audio.volume = volume;
  });
}

// Aplica o volume ao carregar completamente a página
window.addEventListener("load", ajustarVolumePorTela);

// Reajusta o volume se a tela for redimensionada
window.addEventListener("resize", ajustarVolumePorTela);

// Aplica o volume ao carregar
ajustarVolumePorTela();

// Reajusta em mudanças de tamanho de tela
window.addEventListener('resize', ajustarVolumePorTela);

function tocarSom(som) {
  if (!som.paused) {
    som.pause();
    som.currentTime = 0;
  }
  som.play();
}

const moedas = [
  { bandeira: "kr.png", nome: "₩ Won", pais: "Coreia", valor: 0.004 },
  { bandeira: "us.png", nome: "US$ Dólar", pais: "Estados Unidos", valor: 5.0 },
  { bandeira: "eu.png", nome: "€ Euro", pais: "União Europeia", valor: 5.5 },
  { bandeira: "cn.png", nome: "¥ Yuan", pais: "China", valor: 0.7 },
  { bandeira: "gb.png", nome: "£ Libra Esterlina", pais: "Reino Unido", valor: 6.3 },
  { bandeira: "ar.png", nome: "$ Peso Argentino", pais: "Argentina", valor: 0.025 },
  { bandeira: "in.png", nome: "₹ Rúpia Indiana", pais: "Índia", valor: 0.06 },
  { bandeira: "ru.png", nome: "₽ Rublo Russo", pais: "Rússia", valor: 0.055 },
];

let indiceMoedaAtual = 0;

function atualizarMoedaVisual() {
  const moeda = moedas[indiceMoedaAtual];
  document.getElementById("moedaNome").textContent = `${moeda.nome} - ${moeda.pais}`;
  document.getElementById("moedaBandeiraImg").src = `./img/flags/${moeda.bandeira}`;
  document.getElementById("moedaBandeiraImg").alt = `Bandeira da ${moeda.pais}`;
}

function trocarMoeda(direcao) {
  tocarSom(somTroca);

  indiceMoedaAtual += direcao;
  if (indiceMoedaAtual < 0) indiceMoedaAtual = moedas.length - 1;
  if (indiceMoedaAtual >= moedas.length) indiceMoedaAtual = 0;

  atualizarMoedaVisual();
}

function conversor() {
  const currentValor = moedas[indiceMoedaAtual].valor;
  const wonInput = document.getElementById("wonInputValue");
  const inputValor = parseFloat(wonInput.value.trim());
  const resultado = document.getElementById("result");
  const bgImage = document.getElementById("bgImage");

  wonInput.classList.remove("input-error");

  mostrarElementos(["mainTitle", "inputLabel", "wonInputValue", "infoText"], false);
  document.getElementById("btnConvert").style.display = "none";
  document.getElementById("btnReset").style.display = "inline-block";
  document.querySelector(".setas-moeda").style.display = "none";

  if (isNaN(inputValor) || inputValor <= 0) {
    tocarSom(somErro);
    resultado.innerHTML = "Digite um valor válido.";
    bgImage.src = "./img/jin-woofraco.png";
    wonInput.classList.add("input-error");
    return;
  }

  if (inputValor > 1e30) {
    tocarSom(somErro);
    resultado.innerHTML = "Esse valor é muito alto! Tente algo menor.";
    bgImage.src = "./img/jin-woofraco.png";
    return;
  }

  tocarSom(somConversao);

  const convertido = inputValor * currentValor;
  const resultadoFormatado = convertido.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  resultado.innerHTML = `O valor em reais é R$&nbsp;${resultadoFormatado}`;
  bgImage.src = "./img/beru-sololeveling.png";

  resultado.classList.remove("animate-glow");
  void resultado.offsetWidth;
  resultado.classList.add("animate-glow");

  document.querySelector(".content").classList.add("animate-aura");
  setTimeout(() => {
    document.querySelector(".content").classList.remove("animate-aura");
  }, 800);
}

function resetar() {
  tocarSom(somReset);

  const wonInputValue = document.getElementById("wonInputValue");
  const getResult = document.getElementById("result");
  const bgImage = document.getElementById("bgImage");

  mostrarElementos(["mainTitle", "inputLabel", "wonInputValue", "infoText"], true);
  document.getElementById("btnConvert").style.display = "inline-block";
  document.getElementById("btnReset").style.display = "none";
  document.querySelector(".setas-moeda").style.display = "flex";

  wonInputValue.value = "";
  wonInputValue.classList.remove("input-error");
  getResult.innerHTML = "";
  getResult.classList.remove("animate-glow");
  bgImage.src = "./img/sololeveling.png";

  atualizarMoedaVisual();
}

function mostrarElementos(ids, exibir) {
  ids.forEach(id => {
    document.getElementById(id).classList.toggle("fade-hidden", !exibir);
  });
}

// Eventos de clique e input
document.getElementById("btnConvert").addEventListener("click", conversor);
document.getElementById("btnReset").addEventListener("click", resetar);
document.getElementById("btnMoedaAnterior").addEventListener("click", () => trocarMoeda(-1));
document.getElementById("btnMoedaProxima").addEventListener("click", () => trocarMoeda(1));

document.getElementById("wonInputValue").addEventListener("input", () => {
  const valor = parseFloat(document.getElementById("wonInputValue").value.trim());
  document.getElementById("wonInputValue").classList.toggle("input-error", isNaN(valor) || valor <= 0);
});

// Inicialização
atualizarMoedaVisual();
