const checkboxes = document.querySelectorAll('.check-servico');
const radiosPorte = document.querySelectorAll('input[name="porte"]');
const valorTotalEl = document.getElementById('valor-total');
const tempoTotalEl = document.getElementById('tempo-total');
const form = document.getElementById('form-orcamento');

const modal = document.getElementById('modal-comprovante');
const detalhesPedidoEl = document.getElementById('detalhes-pedido');
const btnWhats = document.getElementById('btn-whats');
const btnFechar = document.getElementById('btn-fechar');

let urlWhatsAppAtual = '';

// Função para calcular total e tempo em tempo real
function atualizarOrcamento() {
  let total = 0;
  let minutos = 0;

  // Verifica adicional de porte (0 para Hatch/Sedan, 20 para SUV)
  const adicionalPorte = Number(document.querySelector('input[name="porte"]:checked').value);

  checkboxes.forEach((box) => {
    if (box.checked) {
      total += Number(box.value) + adicionalPorte;
      minutos += Number(box.dataset.tempo);
    }
  });

  // Formata valor
  valorTotalEl.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;

  // Formata tempo (minutos ou horas)
  if (minutos === 0) {
    tempoTotalEl.textContent = '0 min';
  } else if (minutos < 60) {
    tempoTotalEl.textContent = `${minutos} min`;
  } else {
    const horas = Math.floor(minutos / 60);
    const restoMin = minutos % 60;
    tempoTotalEl.textContent = restoMin > 0 ? `${horas}h ${restoMin}m` : `${horas}h`;
  }
}

// Função chamada pelos botões "Selecionar" nos cards superiores
function selecionarPacote(nomePacote) {
  checkboxes.forEach((box) => {
    if (box.dataset.nome === nomePacote) {
      box.checked = true;
    }
  });
  atualizarOrcamento();
  document.getElementById('orcamento').scrollIntoView({ behavior: 'smooth' });
}

// Escuta alterações nos checkboxes e no porte do veículo
checkboxes.forEach((box) => box.addEventListener('change', atualizarOrcamento));
radiosPorte.forEach((radio) => radio.addEventListener('change', atualizarOrcamento));

// Envio do formulário e geração do comprovante
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const nome = document.getElementById('cliente-nome').value.trim();
  const carro = document.getElementById('cliente-carro').value.trim();
  const dataHorario = document.getElementById('cliente-data').value.trim();
  const adicionalPorte = Number(document.querySelector('input[name="porte"]:checked').value);
  const porteTexto = adicionalPorte === 0 ? 'Hatch / Sedan' : 'SUV / Caminhonete';

  const servicosSelecionados = [];
  let totalFinal = 0;

  checkboxes.forEach((box) => {
    if (box.checked) {
      servicosSelecionados.push(box.dataset.nome);
      totalFinal += Number(box.value) + adicionalPorte;
    }
  });

  if (servicosSelecionados.length === 0) {
    alert('Selecione pelo menos um serviço antes de gerar o agendamento.');
    return;
  }

  // Gera número aleatório de protocolo
  const protocolo = Math.floor(1000 + Math.random() * 9000);
  const valorFormatado = `R$ ${totalFinal.toFixed(2).replace('.', ',')}`;

  // Preenche o ticket visual no modal
  detalhesPedidoEl.innerHTML = `
    <strong>Protocolo:</strong> #${protocolo}<br>
    <strong>Cliente:</strong> ${nome}<br>
    <strong>Veículo:</strong> ${carro} (${porteTexto})<br>
    <strong>Serviços:</strong> ${servicosSelecionados.join(', ')}<br>
    <strong>Data/Hora:</strong> ${dataHorario}<br>
    <strong>Total Estimado:</strong> ${valorFormatado}
  `;

  // Prepara link do WhatsApp
  const numeroLoja = '5561999999999'; // Substitua pelo número desejado
  const textoMensagem =
    `Olá, AutoBrilho! Fiz um pré-agendamento pelo site:%0A%0A` +
    `*Protocolo:* #${protocolo}%0A` +
    `*Cliente:* ${nome}%0A` +
    `*Veículo:* ${carro} (${porteTexto})%0A` +
    `*Serviços:* ${servicosSelecionados.join(', ')}%0A` +
    `*Horário:* ${dataHorario}%0A` +
    `*Total Estimado:* ${valorFormatado}`;

  urlWhatsAppAtual = `https://wa.me/${numeroLoja}?text=${textoMensagem}`;

  // Abre o modal
  modal.classList.remove('hidden');
});

// Botões do Modal
btnWhats.addEventListener('click', () => {
  window.open(urlWhatsAppAtual, '_blank');
});

btnFechar.addEventListener('click', () => {
  modal.classList.add('hidden');
});