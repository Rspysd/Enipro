document.addEventListener('DOMContentLoaded', () => {

    // --- PALETA DE CORES PARA OS CARDS ---
    const cardThemes = [
        { background: '#f1f8ff', border: '#d4e8ff' }, { background: '#f3fef5', border: '#d8f7e0' },
        { background: '#fffbeb', border: '#fff1c2' }, { background: '#fbf5ff', border: '#f1dffd' },
        { background: '#fff5f5', border: '#ffe3e3' }, { background: '#f7f8fa', border: '#e0e4e8' }
    ];

    // --- BANCO DE DADOS DO PROJETO ---
    const projectData = {
        garagem: {
            title: 'Garagem',
            luminaires: [
                { name: 'SPOT DE EMBUTIR SIMPLES', quantity: 6, description: 'Ponto de luz focado para iluminação geral e funcional.' },
                { name: 'ARANDELA TIPO 1', quantity: 5, description: 'Luz de apoio e decorativa para as paredes.' }
            ]
        },
        circulacaoExterna: {
            title: 'Circulação Externa',
            luminaires: [
                { name: 'ARANDELA TIPO 1 (EXTERNA)', quantity: 5, description: 'Iluminação para caminhos e paredes, resistente a intempéries.' }
            ]
        },
        areaExterna: {
            title: 'Área Externa',
            luminaires: [
                { name: 'ARANDELA TIPO 1 (EXTERNA)', quantity: 6, description: 'Iluminação de paredes, resistente ao tempo.' },
                { name: 'ARANDELA TIPO 4 (INTERNA PARA ÁREA MOLHADA)', quantity: 1, description: 'Arandela com proteção para áreas sujeitas a umidade.' },
                { name: 'ARANDELA TIPO 3 (INTERNA)', quantity: 1, description: 'Ponto de luz decorativo para áreas cobertas.' },
                { name: 'ESPETO DE JARDIM', quantity: 2, description: 'Luz de destaque para plantas e paisagismo.' }
            ]
        },
        jardim: {
            title: 'Jardim',
            luminaires: [
                { name: 'ARANDELA TIPO 1 (EXTERNA2)', quantity: 2, description: 'Iluminação funcional e decorativa para muros e paredes.' },
            ]
        },
        solario: {
            title: 'Solário',
            luminaires: [
                { name: 'ARANDELA TIPO 1 (EXTERNA)', quantity: 1, description: 'Luz de parede para criar um ambiente aconchegante.' },
                { name: 'ESPETO DE JARDIM', quantity: 4, description: 'Iluminação de destaque para vasos e plantas.' }
            ]
        },
        salaDeTv: {
            title: 'Sala de TV',
            luminaires: [
                { name: 'SPOT DUPLO PAR 20 DE EMBUTIR', quantity: 8, description: 'Iluminação direcionável para destacar pontos ou fornecer luz geral suave.' },
                { name: 'PENDENTE TIPO 2', quantity: 3, description: 'Ponto de luz decorativo central ou lateral.' },
                { name: 'ARANDELA TIPO 2 (INTERNA)', quantity: 1, description: 'Luz indireta e de apoio nas paredes, ideal para conforto visual.' }
            ]
        },
        salaDeJantar: {
            title: 'Sala de Jantar',
            luminaires: [
                { name: 'PENDENTE TIPO 1', quantity: 1, description: 'Luminária principal sobre a mesa de jantar, valorizando o espaço.' },
                { name: 'ARANDELA TIPO 2 (INTERNA)', quantity: 1, description: 'Iluminação decorativa de parede para compor o ambiente.' },
                { name: 'ESPETO DE JARDIM', quantity: 1, description: 'Usado internamente para destacar plantas ou objetos.' }
            ]
        },
        cozinha: {
            title: 'Cozinha',
            luminaires: [
                { name: 'SPOT DUPLO PAR 20 DE EMBUTIR', quantity: 6, description: 'Iluminação geral e focada para o centro do ambiente.' },
                { name: 'SPOT INDIVIDUAL PAR 20 DE EMBUTIR', quantity: 3, description: 'Luz direcionada para bancadas e áreas de trabalho.' },
                { name: 'PERFIL DE LED', quantity: 'Verificar', description: 'Iluminação linear e moderna, ideal para bancadas e armários.' }
            ]
        },
        areaGourmet: {
            title: 'Área Gourmet',
            luminaires: [
                { name: 'SPOT INDIVIDUAL PAR 20 DE EMBUTIR', quantity: 3, description: 'Luz focada em pontos como churrasqueira e bancadas.' },
                { name: 'SPOT DUPLO PAR 20 DE EMBUTIR', quantity: 3, description: 'Iluminação geral e direcionável para o ambiente.' },
                { name: 'PENDENTE TIPO 4', quantity: 1, description: 'Ponto de luz decorativo sobre ilhas ou mesas.' },
                { name: 'PERFIL DE LED', quantity: 'Verificar', description: 'Iluminação funcional e estética para bancadas e prateleiras.' }
            ]
        },
        lavanderia: {
            title: 'Lavanderia',
            luminaires: [
                { name: 'SPOT INDIVIDUAL PAR 20 DE EMBUTIR', quantity: 4, description: 'Iluminação funcional e direta para a área de serviço.' }
            ]
        },
        banhoSocial: {
            title: 'Banho Social',
            luminaires: [
                { name: 'SPOT DUPLO PAR 20 DE EMBUTIR', quantity: 2, description: 'Iluminação geral do banheiro.' },
                { name: 'SPOT INDIVIDUAL PAR 20 DE EMBUTIR', quantity: 2, description: 'Luz focada na área da bancada e espelho.' }
            ]
        },
        circulacaoIntima: {
            title: 'Circulação Íntima',
            luminaires: [
                { name: 'SPOT DUPLO PAR 20 DE EMBUTIR', quantity: 2, description: 'Iluminação geral para o corredor.' },
                { name: 'ARANDELA TIPO 2 (INTERNA)', quantity: 1, description: 'Luz de balizamento ou decorativa nas paredes.' }
            ]
        },
        depositoHospedes2: {
            title: 'Depósito / Hóspedes 2',
            luminaires: [
                { name: 'SPOT INDIVIDUAL PAR 20 DE EMBUTIR', quantity: 3, description: 'Iluminação de apoio.' },
                { name: 'PLAFON QUADRADO DE EMBUTIR 50x50cm', quantity: 1, description: 'Iluminação geral e difusa para todo o ambiente.' },
                { name: 'PERFIL DE LED', quantity: 'Verificar', description: 'Luz decorativa ou funcional em marcenaria.' }
            ]
        },
        dormitorioHospedesOffice: {
            title: 'Dormitório de Hóspedes / Office',
            luminaires: [
                { name: 'SPOT INDIVIDUAL PAR 20 DE EMBUTIR', quantity: 5, description: 'Iluminação focada para a área de trabalho ou leitura.' },
                { name: 'PLAFON QUADRADO DE EMBUTIR 50x50cm', quantity: 1, description: 'Luz geral e confortável para o quarto.' },
                { name: 'PERFIL DE LED', quantity: 'Verificar', description: 'Iluminação indireta em sancas ou estantes.' }
            ]
        },
        banhoHospedes: {
            title: 'Banho Hóspedes',
            luminaires: [
                { name: 'SPOT INDIVIDUAL PAR 20 DE EMBUTIR', quantity: 2, description: 'Iluminação focada na bancada.' },
                { name: 'SPOT DUPLO PAR 20 DE EMBUTIR', quantity: 1, description: 'Luz geral para o banheiro.' }
            ]
        },
        suiteMaster: {
            title: 'Suíte Master',
            luminaires: [
                { name: 'SPOT INDIVIDUAL PAR 20 DE EMBUTIR', quantity: 3, description: 'Luz de destaque para closets ou objetos.' },
                { name: 'PENDENTE TIPO 3', quantity: 2, description: 'Luminárias decorativas ao lado da cama.' },
                { name: 'ARANDELA TIPO 2 (INTERNA)', quantity: 2, description: 'Luz de leitura ou decorativa na parede.' },
                { name: 'PLAFON QUADRADO DE EMBUTIR 50x50cm', quantity: 1, description: 'Iluminação central e geral do quarto.' },
                { name: 'PERFIL DE LED', quantity: 'Verificar', description: 'Luz indireta em cabeceiras ou sancas de gesso.' }
            ]
        },
        banhoCasal: {
            title: 'Banho Casal',
            luminaires: [
                { name: 'SPOT INDIVIDUAL PAR 20 DE EMBUTIR', quantity: 5, description: 'Luz funcional sobre as cubas e espelhos.' },
                { name: 'SPOT DUPLO PAR 20 DE EMBUTIR', quantity: 1, description: 'Iluminação geral e para a área do box.' }
            ]
        },
        lavaboExterno: {
            title: 'Lavabo Externo',
            luminaires: [
                { name: 'SPOT INDIVIDUAL PAR 20 DE EMBUTIR', quantity: 1, description: 'Iluminação focada na bancada.' },
                { name: 'SPOT DUPLO PAR 20 DE EMBUTIR', quantity: 1, description: 'Luz geral para o ambiente.' }
            ]
        }
    };

    // --- ELEMENTOS DA PÁGINA ---
    const mainView = document.getElementById('main-view');
    const detailView = document.getElementById('detail-view');
    const gridContainer = document.getElementById('grid-container');
    const detailTitle = document.getElementById('detail-title');
    const luminaireList = document.getElementById('luminaire-list');
    const backButton = document.getElementById('back-button');

    // --- ELEMENTOS DO MODAL ---
    const imageModal = document.getElementById('image-modal');
    const modalImageContent = document.getElementById('modal-image-content');
    const modalCloseButton = document.querySelector('.modal-close');

    // --- FUNÇÕES ---
    function getImagePath(luminaireName) {
        const folder = 'imagens/';
        const filename = luminaireName.toLowerCase().replace(/\s+/g, '');
        return `${folder}${filename}.png`; 
    }

    function showDetailView(roomKey) {
        const room = projectData[roomKey];
        if (!room) return;
        detailTitle.textContent = room.title;
        luminaireList.innerHTML = '';
        
        room.luminaires.forEach(luminaire => {
            const item = document.createElement('div');
            item.className = 'luminaire-item';
            const imagePath = getImagePath(luminaire.name);
            let quantityDisplay = '';
            if (typeof luminaire.quantity === 'number') {
                quantityDisplay = `<div class="quantity-value">${luminaire.quantity}</div><div class="quantity-label">unidades</div>`;
            } else {
                quantityDisplay = `<div class="quantity-value" style="font-size: 0.9rem; line-height: 1.1;">${luminaire.quantity}</div>`;
            }

            item.innerHTML = `
                <img 
                    src="${imagePath}" 
                    alt="${luminaire.name}" 
                    class="luminaire-img" 
                    onerror="this.onerror=null;this.src='https://placehold.co/200x200/e9ecef/495057?text=Sem+Foto';"
                >
                <div class="luminaire-desc">
                    <h3>${luminaire.name}</h3>
                    <p>${luminaire.description}</p>
                </div>
                <div class="luminaire-quantity">
                    ${quantityDisplay}
                </div>
            `;
            luminaireList.appendChild(item);
        });

        mainView.classList.add('hidden');
        detailView.classList.remove('hidden');
        window.scrollTo(0, 0);
    }

    function showMainView() {
        detailView.classList.add('hidden');
        mainView.classList.remove('hidden');
    }

    function createRoomCards() {
        let themeIndex = 0;
        for (const key in projectData) {
            const room = projectData[key];
            const card = document.createElement('div');
            card.className = 'card';
            card.dataset.roomKey = key;
            const currentTheme = cardThemes[themeIndex];
            card.style.backgroundColor = currentTheme.background;
            card.style.borderColor = currentTheme.border;
            card.innerHTML = `<div class="card-icon"></div><h2>${room.title}</h2><p>Clique para ver detalhes</p>`;
            card.addEventListener('click', () => showDetailView(key));
            gridContainer.appendChild(card);
            themeIndex = (themeIndex + 1) % cardThemes.length;
        }
    }

    // --- FUNÇÕES DO MODAL ---
    function openModal(imageSrc) {
        modalImageContent.src = imageSrc;
        imageModal.classList.remove('hidden');
    }

    function closeModal() {
        imageModal.classList.add('hidden');
    }

    // --- INICIALIZAÇÃO E EVENTOS ---
    createRoomCards();
    backButton.addEventListener('click', showMainView);
    modalCloseButton.addEventListener('click', closeModal);
    imageModal.addEventListener('click', (e) => {
        if (e.target === imageModal) {
            closeModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !imageModal.classList.contains('hidden')) {
            closeModal();
        }
    });

    luminaireList.addEventListener('click', (e) => {
        if (e.target && e.target.matches('.luminaire-img')) {
            openModal(e.target.src);
        }
    });
});