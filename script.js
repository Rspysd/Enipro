document.addEventListener('DOMContentLoaded', function () {

    // ******************************************************
    // ******** CONFIGURAÇÃO DO FIREBASE   ********
    // ******************************************************
   const firebaseConfig = {
  apiKey: "AIzaSyD8sNfGilLum2rnN7Qt1fBRP4ONhzemWNE",
  authDomain: "guilherme-2a3f3.firebaseapp.com",
  projectId: "guilherme-2a3f3",
  storageBucket: "guilherme-2a3f3.firebasestorage.app",
  messagingSenderId: "60682599861",
  appId: "1:60682599861:web:c74a9aaa7651d14cbd2dfc",
  measurementId: "G-MZSHRPP56K"
};

    firebase.initializeApp(firebaseConfig);
    const database = firebase.database();

    // --- Referências aos Elementos do DOM ---
    const mainView = document.getElementById('main-view');
    const employeeListView = document.getElementById('employee-list-view');
    const employeeDetailView = document.getElementById('employee-detail-view');
    const reportView = document.getElementById('report-view');
    
    const genericModal = document.getElementById('genericModal');
    const statusModal = document.getElementById('statusModal');
    const vencimentosModal = document.getElementById('vencimentosModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalFields = document.getElementById('modalFields');
    const modalForm = document.getElementById('modalForm');
    
    // Elementos do formulário principal
    const selectCliente = document.getElementById('selectCliente');
    const inputEndereco = document.getElementById('inputEndereco');
    const inputCidade = document.getElementById('inputCidade');
    const selectFornecedor = document.getElementById('selectFornecedor');
    const selectEquipamento = document.getElementById('selectEquipamento');
    const selectFuncionario = document.getElementById('selectFuncionario');
    const dataTableBody = document.getElementById('dataTableBody');
    const mainForm = document.getElementById('main-form');
    
    // Filtros da página principal
    const filterCliente = document.getElementById('filterCliente');
    const filterEquipamento = document.getElementById('filterEquipamento');
    const filterFornecedor = document.getElementById('filterFornecedor');
    const filterFuncionario = document.getElementById('filterFuncionario');
    const filterStatus = document.getElementById('filterStatus');

    // Filtros da página de relatório (Dashboard)
    const filterClienteDashboard = document.getElementById('filterClienteDashboard');
    const filterEquipamentoDashboard = document.getElementById('filterEquipamentoDashboard');
    const filterFornecedorDashboard = document.getElementById('filterFornecedorDashboard');
    const filterFuncionarioDashboard = document.getElementById('filterFuncionarioDashboard');
    const filterStatusDashboard = document.getElementById('filterStatusDashboard');
    
    let currentModalType = '';
    let clientesData = {};
    let currentStatusUpdateId = null;
    let lancamentosAtuais = {};
    let funcionariosAtuais = {};

    // --- Lógica de Navegação entre Views ---
    const showView = (viewId) => {
        document.querySelectorAll('.view').forEach(view => view.style.display = 'none');
        const viewToShow = document.getElementById(viewId);
        if(viewToShow) {
            viewToShow.style.display = 'block';
        }
        lucide.createIcons();
    };

    const router = () => {
        const hash = window.location.hash;

        if (hash.startsWith('#employee-detail/')) {
            const employeeId = hash.substring('#employee-detail/'.length);
            const employee = funcionariosAtuais[employeeId];
            if (employee) {
                renderEmployeeDetails(employeeId, employee.nome);
            } else {
                 window.location.hash = '';
            }
        } else if (hash === '#employee-list') {
            renderEmployeeList();
            showView('employee-list-view');
        } else if (hash === '#dashboard') {
            renderDashboardView();
            showView('dashboard-view');
        }
        else {
            showView('main-view');
        }
    };

    // --- Lógica dos Modais ---
    const openModal = (type) => {
        currentModalType = type;
        modalFields.innerHTML = '';
        switch (type) {
            case 'clientes':
                modalTitle.textContent = 'Cadastrar Nova Obra/Cliente';
                modalFields.innerHTML = `<div class="form-group"><label for="modalNomeCliente">Nome do Cliente</label><input type="text" id="modalNomeCliente" required></div><div class="form-group"><label for="modalEndereco">Endereço</label><input type="text" id="modalEndereco" required></div><div class="form-group"><label for="modalCidade">Cidade</label><input type="text" id="modalCidade" required></div>`;
                break;
            case 'fornecedores':
                modalTitle.textContent = 'Cadastrar Novo Fornecedor';
                modalFields.innerHTML = `<div class="form-group"><label for="modalNomeFornecedor">Nome do Fornecedor</label><input type="text" id="modalNomeFornecedor" required></div>`;
                break;
            case 'equipamentos':
                modalTitle.textContent = 'Cadastrar Novo Equipamento';
                modalFields.innerHTML = `<div class="form-group"><label for="modalNomeEquipamento">Nome do Equipamento</label><input type="text" id="modalNomeEquipamento" required></div>`;
                break;
            case 'funcionarios':
                modalTitle.textContent = 'Cadastrar Novo Funcionário';
                modalFields.innerHTML = `<div class="form-group"><label for="modalNomeFuncionario">Nome do Funcionário</label><input type="text" id="modalNomeFuncionario" required></div>`;
                break;
        }
        genericModal.style.display = 'block';
    };

    const closeModal = () => {
        genericModal.style.display = 'none';
        statusModal.style.display = 'none';
        vencimentosModal.style.display = 'none';
        if (modalForm) modalForm.reset();
    };

    document.getElementById('genericModalClose')?.addEventListener('click', closeModal);
    document.getElementById('vencimentosModalClose')?.addEventListener('click', closeModal);
    window.addEventListener('click', (event) => {
        if (event.target == genericModal || event.target == statusModal || event.target == vencimentosModal) {
            closeModal();
        }
    });

    document.getElementById('btnNovaObra').addEventListener('click', () => openModal('clientes'));
    document.getElementById('btnNovoFornecedor').addEventListener('click', () => openModal('fornecedores'));
    document.getElementById('btnNovoEquipamento').addEventListener('click', () => openModal('equipamentos'));
    document.getElementById('btnNovoFuncionario').addEventListener('click', () => openModal('funcionarios'));
    document.getElementById('btnFastAddCliente').addEventListener('click', () => openModal('clientes'));
    document.getElementById('btnFastAddFornecedor').addEventListener('click', () => openModal('fornecedores'));
    document.getElementById('btnFastAddEquipamento').addEventListener('click', () => openModal('equipamentos'));
    document.getElementById('btnFastAddFuncionario').addEventListener('click', () => openModal('funcionarios'));

    modalForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let data = {};
        switch (currentModalType) {
            case 'clientes': data = { nome: document.getElementById('modalNomeCliente').value, endereco: document.getElementById('modalEndereco').value, cidade: document.getElementById('modalCidade').value }; break;
            case 'fornecedores': data = { nome: document.getElementById('modalNomeFornecedor').value }; break;
            case 'equipamentos': data = { nome: document.getElementById('modalNomeEquipamento').value }; break;
            case 'funcionarios': data = { nome: document.getElementById('modalNomeFuncionario').value }; break;
        }
        database.ref(currentModalType).push(data).then(() => closeModal()).catch(error => console.error("Erro ao salvar: ", error));
    });

    // --- Carregamento de Dados e Lógica Principal ---
    const loadSelectOptions = (refName, selectElement, placeholder) => {
        database.ref(refName).on('value', (snapshot) => {
            const data = snapshot.val();
            if(refName === 'funcionarios') { funcionariosAtuais = data || {}; }
            if (refName === 'clientes') { clientesData = data || {}; }
            
            const selectedValue = selectElement.value;
            selectElement.innerHTML = `<option value="">${placeholder}</option>`;

            for (const key in data) {
                const option = document.createElement('option');
                option.value = key;
                option.textContent = data[key].nome;
                selectElement.appendChild(option);
            }
            selectElement.value = selectedValue;
        });
    };

    loadSelectOptions('clientes', selectCliente, 'Selecione uma obra');
    loadSelectOptions('fornecedores', selectFornecedor, 'Selecione um fornecedor');
    loadSelectOptions('equipamentos', selectEquipamento, 'Selecione um equipamento');
    loadSelectOptions('funcionarios', selectFuncionario, 'Selecione um funcionário');

    selectCliente.addEventListener('change', () => {
        const selectedKey = selectCliente.value;
        if (selectedKey && clientesData[selectedKey]) {
            inputEndereco.value = clientesData[selectedKey].endereco;
            inputCidade.value = clientesData[selectedKey].cidade;
        } else {
            inputEndereco.value = '';
            inputCidade.value = '';
        }
    });

    mainForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const data = {
            clienteId: selectCliente.value,
            clienteNome: selectCliente.options[selectCliente.selectedIndex].text,
            fornecedorId: selectFornecedor.value,
            fornecedorNome: selectFornecedor.options[selectFornecedor.selectedIndex].text,
            equipamentoId: selectEquipamento.value,
            equipamentoNome: selectEquipamento.options[selectEquipamento.selectedIndex].text,
            funcionarioId: selectFuncionario.value,
            funcionarioNome: selectFuncionario.options[selectFuncionario.selectedIndex].text,
            ctr: document.getElementById('inputCtr').value,
            valor: document.getElementById('inputValor').value,
            observacao: document.getElementById('inputObservacao').value,
            status: 'Locado',
            dataInicio: document.getElementById('inputDataInicio').value,
            frequencia: document.getElementById('selectFrequencia').value,
            reagendamentoAutomatico: document.getElementById('selectFrequencia').value !== 'unico'
        };
        database.ref('lancamentos').push(data).then(() => {
            mainForm.reset();
            inputEndereco.value = '';
            inputCidade.value = '';
        }).catch(error => console.error("Erro ao salvar lançamento: ", error));
    });

    const calcularProximoVencimento = (dataInicioStr, frequencia, reagendamentoAutomatico) => {
        if (!dataInicioStr || !frequencia) return null;
        if (!reagendamentoAutomatico || frequencia === 'unico') { return dataInicioStr; }
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);
        let proximaData = new Date(dataInicioStr + 'T03:00:00Z');
        while (proximaData < hoje) {
            if (frequencia === 'diario') { proximaData.setDate(proximaData.getDate() + 1); }
            else if (frequencia === 'semanal') { proximaData.setDate(proximaData.getDate() + 7); }
            else if (frequencia === 'mensal') { proximaData.setMonth(proximaData.getMonth() + 1); }
            else { break; }
        }
        return proximaData.toISOString().split('T')[0];
    };

    const applyFiltersAndRender = () => {
        const clienteQuery = filterCliente.value.toLowerCase();
        const equipamentoQuery = filterEquipamento.value.toLowerCase();
        const fornecedorQuery = filterFornecedor.value.toLowerCase();
        const funcionarioQuery = filterFuncionario.value.toLowerCase();
        const statusQuery = filterStatus.value;

        dataTableBody.innerHTML = '';
        
        const filteredKeys = Object.keys(lancamentosAtuais).filter(key => {
            const item = lancamentosAtuais[key];
            if (item.status === 'Devolvido') return false;

            const matchesCliente = item.clienteNome?.toLowerCase().includes(clienteQuery) ?? false;
            const matchesEquipamento = item.equipamentoNome?.toLowerCase().includes(equipamentoQuery) ?? false;
            const matchesFornecedor = item.fornecedorNome?.toLowerCase().includes(fornecedorQuery) ?? false;
            const matchesFuncionario = item.funcionarioNome?.toLowerCase().includes(funcionarioQuery) ?? false;
            const matchesStatus = statusQuery === 'all' || item.status === statusQuery;

            return matchesCliente && matchesEquipamento && matchesFornecedor && matchesFuncionario && matchesStatus;
        });

        filteredKeys.forEach(key => {
            const item = lancamentosAtuais[key];
            const proximoVencimentoStr = calcularProximoVencimento(item.dataInicio, item.frequencia, item.reagendamentoAutomatico);
            const row = document.createElement('tr');
            let statusClass = item.status === 'Locado' ? 'status-locado' : (item.status === 'Parcial' ? 'status-parcial' : '');
            const formatarFrequencia = (freq) => {
                if (!freq) return 'N/A';
                return { unico: 'Sem Reagendamento', diario: 'Diário', semanal: 'Semanal', mensal: 'Mensal' }[freq] || freq;
            };
            row.innerHTML = `<td>${item.clienteNome || ''}</td><td>${item.equipamentoNome || ''}</td><td>${item.fornecedorNome || ''}</td><td>${item.funcionarioNome || ''}</td><td>${item.ctr || ''}</td><td>R$ ${item.valor ? parseFloat(item.valor).toFixed(2) : '0.00'}</td><td>${proximoVencimentoStr ? new Date(proximoVencimentoStr + 'T03:00:00Z').toLocaleDateString('pt-BR') : 'N/A'}</td><td>${formatarFrequencia(item.frequencia)}</td><td><span class="status ${statusClass}">${item.status}</span></td><td><button class="btn-status" data-id="${key}" title="Alterar Status"><i data-lucide="edit"></i></button></td>`;
            dataTableBody.appendChild(row);
        });

        lucide.createIcons();
    };

    const lancamentosRef = database.ref('lancamentos');
    lancamentosRef.on('value', (snapshot) => {
        lancamentosAtuais = snapshot.val() || {};
        applyFiltersAndRender();
        router(); 
    });
    
    [filterCliente, filterEquipamento, filterFornecedor, filterFuncionario, filterStatus].forEach(input => {
        input.addEventListener('input', applyFiltersAndRender);
    });

    dataTableBody.addEventListener('click', (e) => {
        const button = e.target.closest('.btn-status');
        if (button) {
            currentStatusUpdateId = button.dataset.id;
            statusModal.style.display = 'block';
        }
    });

    document.getElementById('btnStatusCancelar').addEventListener('click', closeModal);
    document.getElementById('btnStatusParcial').addEventListener('click', () => { if (currentStatusUpdateId) { database.ref('lancamentos/' + currentStatusUpdateId).update({ status: 'Parcial' }).then(closeModal); } });
    document.getElementById('btnStatusCompleto').addEventListener('click', () => { if (currentStatusUpdateId) { database.ref('lancamentos/' + currentStatusUpdateId).update({ status: 'Devolvido' }).then(closeModal); } });

    // --- LÓGICA DE VISUALIZAÇÃO DE FUNCIONÁRIOS ---
    const renderEmployeeList = () => {
        const container = document.getElementById('employee-list-container');
        container.innerHTML = '';
        for(const key in funcionariosAtuais) {
            const funcionario = funcionariosAtuais[key];
            const item = document.createElement('div');
            item.className = 'list-item';
            item.innerHTML = `
                <span class="list-item-name">${funcionario.nome}</span>
                <a href="#employee-detail/${key}" class="view-details-button">
                    <i data-lucide="eye"></i> Ver Detalhes
                </a>
            `;
            container.appendChild(item);
        }
        lucide.createIcons();
    };

    const renderEmployeeDetails = (employeeId, employeeName) => {
        const tableBody = document.getElementById('employeeDetailTableBody');
        document.getElementById('employee-detail-title').textContent = `${employeeName}`;
        tableBody.innerHTML = '';

        Object.values(lancamentosAtuais).filter(item => item.funcionarioId === employeeId).forEach(item => {
            const proximoVencimentoStr = calcularProximoVencimento(item.dataInicio, item.frequencia, item.reagendamentoAutomatico);
            const row = document.createElement('tr');
            let statusClass = item.status === 'Locado' ? 'status-locado' : (item.status === 'Parcial' ? 'status-parcial' : '');
            const formatarFrequencia = (freq) => {
                 if (!freq) return 'N/A';
                return { unico: 'Sem Reagendamento', diario: 'Diário', semanal: 'Semanal', mensal: 'Mensal' }[freq] || freq;
            };
            row.innerHTML = `
                <td>${item.clienteNome || ''}</td>
                <td>${item.equipamentoNome || ''}</td>
                <td>${item.fornecedorNome || ''}</td>
                <td>${item.ctr || ''}</td>
                <td>R$ ${item.valor ? parseFloat(item.valor).toFixed(2) : '0.00'}</td>
                <td>${proximoVencimentoStr ? new Date(proximoVencimentoStr + 'T03:00:00Z').toLocaleDateString('pt-BR') : 'N/A'}</td>
                <td>${formatarFrequencia(item.frequencia)}</td>
                <td><span class="status ${statusClass}">${item.status}</span></td>
                <td>${item.observacao || ''}</td>
            `;
            tableBody.appendChild(row);
        });
        showView('employee-detail-view');
    };
    
    // --- LÓGICA DA PÁGINA DE DASHBOARD ---
    const renderDashboardView = () => {
        const clienteQuery = filterClienteDashboard.value.toLowerCase();
        const equipamentoQuery = filterEquipamentoDashboard.value.toLowerCase();
        const fornecedorQuery = filterFornecedorDashboard.value.toLowerCase();
        const funcionarioQuery = filterFuncionarioDashboard.value.toLowerCase();
        const statusQuery = filterStatusDashboard.value;
        const tableBody = document.getElementById('dashboardTableBody');
        tableBody.innerHTML = '';

        const filteredKeys = Object.keys(lancamentosAtuais).filter(key => {
            const item = lancamentosAtuais[key];
            if (item.status === 'Devolvido') return false;

            const matchesCliente = item.clienteNome?.toLowerCase().includes(clienteQuery) ?? false;
            const matchesEquipamento = item.equipamentoNome?.toLowerCase().includes(equipamentoQuery) ?? false;
            const matchesFornecedor = item.fornecedorNome?.toLowerCase().includes(fornecedorQuery) ?? false;
            const matchesFuncionario = item.funcionarioNome?.toLowerCase().includes(funcionarioQuery) ?? false;
            const matchesStatus = statusQuery === 'all' || item.status === statusQuery;
            return matchesCliente && matchesEquipamento && matchesFornecedor && matchesFuncionario && matchesStatus;
        });

        filteredKeys.forEach(key => {
            const item = lancamentosAtuais[key];
            const proximoVencimentoStr = calcularProximoVencimento(item.dataInicio, item.frequencia, item.reagendamentoAutomatico);
            const row = document.createElement('tr');
            let statusClass = item.status === 'Locado' ? 'status-locado' : (item.status === 'Parcial' ? 'status-parcial' : '');
            const formatarFrequencia = (freq) => {
                if (!freq) return 'N/A';
                return { unico: 'Sem Reagendamento', diario: 'Diário', semanal: 'Semanal', mensal: 'Mensal' }[freq] || freq;
            };
            row.innerHTML = `<td>${item.clienteNome || ''}</td><td>${item.equipamentoNome || ''}</td><td>${item.fornecedorNome || ''}</td><td>${item.funcionarioNome || ''}</td><td>${item.ctr || ''}</td><td>R$ ${item.valor ? parseFloat(item.valor).toFixed(2) : '0.00'}</td><td>${proximoVencimentoStr ? new Date(proximoVencimentoStr + 'T03:00:00Z').toLocaleDateString('pt-BR') : 'N/A'}</td><td>${formatarFrequencia(item.frequencia)}</td><td><span class="status ${statusClass}">${item.status}</span></td><td>${item.observacao || ''}</td>`;
            tableBody.appendChild(row);
        });
    };

    [filterClienteDashboard, filterEquipamentoDashboard, filterFornecedorDashboard, filterFuncionarioDashboard, filterStatusDashboard].forEach(input => {
        input.addEventListener('input', renderDashboardView);
    });

    window.addEventListener('hashchange', router);
    window.addEventListener('load', router);


    // --- LÓGICA DE VERIFICAÇÃO DE VENCIMENTOS ---
    const getHojeFormatado = () => {
        const hojeDate = new Date();
        const ano = hojeDate.getFullYear();
        const mes = String(hojeDate.getMonth() + 1).padStart(2, '0');
        const dia = String(hojeDate.getDate()).padStart(2, '0');
        return `${ano}-${mes}-${dia}`;
    };
    
    const verificarVencimentos = () => {
        const itensVencidos = [];
        const hoje = getHojeFormatado();

        for (const key in lancamentosAtuais) {
            const item = lancamentosAtuais[key];
            if (item.reagendamentoAutomatico && item.status !== 'Devolvido') {
                const proximoVencimento = calcularProximoVencimento(item.dataInicio, item.frequencia, true);
                if (proximoVencimento === hoje) {
                    itensVencidos.push({ key, ...item });
                }
            }
        }

        if (itensVencidos.length > 0) {
            abrirModalVencimentos(itensVencidos);
        } else {
            alert('Nenhum item com vencimento para hoje.');
        }
    };

    const abrirModalVencimentos = (itens) => {
        const listaVencimentos = document.getElementById('vencimentosList');
        listaVencimentos.innerHTML = '';

        itens.forEach((item, index) => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'vencimento-item';
            itemDiv.innerHTML = `
                <div class="vencimento-item-info">
                    ${item.equipamentoNome}
                    <span>Cliente: ${item.clienteNome}</span>
                </div>
                <div class="vencimento-item-actions">
                    <div class="checkbox-group">
                        <input type="checkbox" id="reagendar-${index}" name="acao-${index}" data-key="${item.key}" data-action="reagendar">
                        <label for="reagendar-${index}">Reagendar</label>
                    </div>
                    <div class="checkbox-group">
                        <input type="checkbox" id="baixa-${index}" name="acao-${index}" data-key="${item.key}" data-action="baixa">
                        <label for="baixa-${index}">Dar Baixa</label>
                    </div>
                </div>
            `;
            listaVencimentos.appendChild(itemDiv);
        });

        listaVencimentos.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                if (e.target.checked) {
                    const name = e.target.name;
                    listaVencimentos.querySelectorAll(`input[type="checkbox"][name="${name}"]`).forEach(otherCb => {
                        if (otherCb !== e.target) {
                            otherCb.checked = false;
                        }
                    });
                }
            });
        });

        vencimentosModal.style.display = 'block';
    };

    const calcularNovaDataReagendamento = (dataAtualStr, frequencia) => {
        const data = new Date(dataAtualStr + 'T03:00:00Z');
        switch (frequencia) {
            case 'diario': data.setDate(data.getDate() + 1); break;
            case 'semanal': data.setDate(data.getDate() + 7); break;
            case 'mensal': data.setMonth(data.getMonth() + 1); break;
            default: data.setDate(data.getDate() + 1);
        }
        return data.toISOString().split('T')[0];
    };
    
    const btnConfirmar = document.getElementById('btnConfirmarAcoesVencimento');
    if (btnConfirmar) {
        btnConfirmar.addEventListener('click', () => {
            const updates = {};
            const checkboxes = document.querySelectorAll('#vencimentosList input[type="checkbox"]:checked');

            checkboxes.forEach(cb => {
                const key = cb.dataset.key;
                const action = cb.dataset.action;
                const itemData = lancamentosAtuais[key];

                if (!itemData) return;

                if (action === 'reagendar') {
                    const dataVencimentoAtual = calcularProximoVencimento(itemData.dataInicio, itemData.frequencia, itemData.reagendamentoAutomatico);
                    const novaDataInicio = calcularNovaDataReagendamento(dataVencimentoAtual, itemData.frequencia);
                    
                    const historico = itemData.historicoVencimentos || [];
                    historico.push(dataVencimentoAtual);

                    updates[`/lancamentos/${key}/dataInicio`] = novaDataInicio;
                    updates[`/lancamentos/${key}/historicoVencimentos`] = historico;
                } else if (action === 'baixa') {
                    updates[`/lancamentos/${key}/status`] = 'Devolvido';
                }
            });

            if (Object.keys(updates).length > 0) {
                database.ref().update(updates)
                    .then(() => {
                        console.log('Ações de vencimento aplicadas com sucesso.');
                        closeModal();
                    })
                    .catch(err => console.error('Erro ao aplicar ações de vencimento:', err));
            } else {
                closeModal();
            }
        });
    }

    const btnVerificarHoje = document.getElementById('btnVerificarVencimentosHoje');
    if(btnVerificarHoje){
        btnVerificarHoje.addEventListener('click', verificarVencimentos);
    }
    
    // Inicia a verificação automática uma vez na primeira carga
    lancamentosRef.once('value', () => {
       if (window.location.hash === '' || window.location.hash === '#') {
           verificarVencimentos();
       }
    });
});
