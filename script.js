const CAMPOS_ENDERECO = [
    'logradouro', 'complemento', 'unidade', 'bairro',
    'localidade', 'uf', 'estado', 'regiao', 'ibge', 'gia', 'ddd', 'siafi'
];


const TECLAS_PERMITIDAS = [
    'Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'Home', 'End'
];


window.onload = function () {

    const temaSalvo = localStorage.getItem('tema');
    if (temaSalvo === 'escuro') {
        document.body.classList.add('dark-mode');
        document.getElementById('chk-tema').checked = true;
    }

    configurarEventosCep();
};

function configurarEventosCep() {
    const inputCep = document.getElementById('cep');

    inputCep.addEventListener('keydown', function (evento) {

        if (evento.key === 'Enter') {
            evento.preventDefault();
            buscarCep();
            return;
        }

        if (TECLAS_PERMITIDAS.includes(evento.key) || evento.ctrlKey || evento.metaKey) {
            return;
        }

        if (!/^[0-9]$/.test(evento.key)) {
            evento.preventDefault();
        }
    });
}

function alternarTema() {
    document.body.classList.toggle('dark-mode');

    if (document.body.classList.contains('dark-mode')) {
        localStorage.setItem('tema', 'escuro');
    } else {
        localStorage.setItem('tema', 'claro');
    }
}

function mascaraCep(input) {
    let valor = input.value.replace(/\D/g, '');


    if (valor.length > 8) {
        valor = valor.slice(0, 8);
    }

    if (valor.length > 5) {
        valor = valor.replace(/^(\d{2})(\d{3})(\d{1,3}).*/, '$1.$2-$3');
    } else if (valor.length > 2) {
        valor = valor.replace(/^(\d{2})(\d{1,3}).*/, '$1.$2');
    }

    input.value = valor;
}

function limparCampos() {
    CAMPOS_ENDERECO.forEach(id => document.getElementById(id).value = '');
}

async function buscarCep() {
    const cep = document.getElementById('cep').value.replace(/\D/g, '');

    if (cep.length === 8) {
        try {
            const url = `https://viacep.com.br/ws/${cep}/json/`;
            const resposta = await fetch(url);
            const dados = await resposta.json();
            if (dados.erro) {
                alert('CEP não encontrado!');
                limparCampos();
            } else {
                CAMPOS_ENDERECO.forEach(id => {
                    document.getElementById(id).value = dados[id] || '';
                });
            }
        } catch (erro) {
            alert('Erro ao buscar o CEP!');
            limparCampos();
        }
    } else {
        alert('Por favor, digite um CEP válido com 8 dígitos!');
        limparCampos();
    }
}