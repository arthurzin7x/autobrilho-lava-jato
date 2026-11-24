const checkboxes = document.querySelectorAll('.check-servico');
const radiosPorte = document.querySelectorAll('input[name="porte"]');
const valoresOriginais = document.querySelectorAll('.servico-valor');
const valorTotalEl = document.getElementById('valor-total');
const tempoTotalEl = document.getElementById('tempo-total');
const form = document.getElementById('form-orcamento');

// Atualiza o preço de cada serviço na lista, o total e o tempo em tempo real
function atualizarOrcamento() {
  let total = 0;
  let minutos = 0;

  const adicionalPorte = Number(document.querySelector('input[name="porte"]:checked').value);

  checkboxes.forEach((box, indice) => {
    const valorBase = Number(box.value);
    const precoItem = valorBase + adicionalPorte;

    valoresOriginais[indice].textContent = `R$ ${precoItem}`;

    if (box.checked) {
      total += precoItem;
      minutos += Number(box.dataset.tempo);
    }
  });

  valorTotalEl.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;

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

checkboxes.forEach((box) => box.addEventListener('change', atualizarOrcamento));
radiosPorte.forEach((radio) => radio.addEventListener('change', atualizarOrcamento));

// Envia direto para o WhatsApp ao clicar no botão
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const carro = document.getElementById('cliente-carro').value.trim();
  const nome = document.getElementById('cliente-nome').value.trim();
  const dataHorario = document.getElementById('cliente-data').value.trim();
  const adicionalPorte = Number(document.querySelector('input[name="porte"]:checked').value);
  const porteTexto = adicionalPorte === 0 ? 'Carro comum' : 'SUV / Caminhonete';

  const servicosSelecionados = [];
  let totalFinal = 0;

  checkboxes.forEach((box) => {
    if (box.checked) {
      servicosSelecionados.push(box.dataset.nome);
      totalFinal += Number(box.value) + adicionalPorte;
    }
  });

  if (servicosSelecionados.length === 0) {
    alert('Marca pelo menos uma lavagem antes de ir para o WhatsApp.');
    return;
  }

  const valorFormatado = `R$ ${totalFinal.toFixed(2).replace('.', ',')}`;
  const numeroLoja = '5561999999999'; // Troque pelo seu número com DDD

  let mensagem =
    `Olá, AutoBrilho! Quero fazer uma lavagem:%0A%0A` +
    `*Carro:* ${carro} (${porteTexto})%0A` +
    `*Lavagem / Serviços:* ${servicosSelecionados.join(', ')}%0A` +
    `*Valor Estimado:* ${valorFormatado}`;

  if (nome) {
    mensagem += `%0A*Nome:* ${nome}`;
  }
  if (dataHorario) {
    mensagem += `%0A*Horário:* ${dataHorario}`;
  }

  const urlWhatsApp = `https://wa.me/${numeroLoja}?text=${mensagem}`;
  window.open(urlWhatsApp, '_blank');
});