// JSON 파일 로드
fetch('data.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        console.log('Data loaded successfully:', data);
        initialize(data);
    })
    .catch(error => console.error('Error loading data:', error));

let selectedStatuses = [];

function initialize(data) {
    const statuses = data.statuses;
    const cards = data.cards;
    const effects = data.effects;

    console.log('Initializing with data:', statuses, cards, effects);

    const statusButtonsContainer = document.getElementById('statusButtons');
    const effectCardsContainer = document.getElementById('effectCards');

    // 몸상태 버튼 생성
    Object.keys(statuses).forEach(statusKey => {
        const button = document.createElement('button');
        button.className = 'status-button';
        button.setAttribute('data-status', statusKey);
        
        const icon = document.createElement('img');
        icon.src = `icons/${statusKey}.png`;
        icon.alt = statuses[statusKey];
        
        const text = document.createElement('span');
        text.textContent = statuses[statusKey];
        
        button.appendChild(icon);
        button.appendChild(text);

        button.addEventListener('click', () => handleStatusClick(button, statusKey, effects, cards));
        statusButtonsContainer.appendChild(button);
    });

    const resetButton = document.getElementById('resetButton');
    resetButton.addEventListener('click', () => resetSelections(effectCardsContainer, statusButtonsContainer));
}

function handleStatusClick(button, statusKey, effects, cards) {
    if (!selectedStatuses.includes(statusKey) && selectedStatuses.length < 3) {
        selectedStatuses.push(statusKey);
        button.classList.add('selected');
        updateEffectCards(effects, cards);
    } else if (selectedStatuses.includes(statusKey)) {
        selectedStatuses = selectedStatuses.filter(status => status !== statusKey);
        button.classList.remove('selected');
        updateEffectCards(effects, cards);
    }
}

function resetSelections(effectCardsContainer, statusButtonsContainer) {
    selectedStatuses = [];
    effectCardsContainer.innerHTML = '<p>효과 카드가 선택되지 않았습니다.</p>';
    const buttons = statusButtonsContainer.querySelectorAll('.status-button');
    buttons.forEach(button => button.classList.remove('selected'));
}

function updateEffectCards(effects, cards) {
    const effectCardsContainer = document.getElementById('effectCards');
    effectCardsContainer.innerHTML = '';

    if (selectedStatuses.length === 0) {
        effectCardsContainer.innerHTML = '<p>효과 카드가 선택되지 않았습니다.</p>';
        return;
    }

    if (selectedStatuses.length < 3) {
        effectCardsContainer.innerHTML = '<p>세 가지 몸상태를 선택하세요.</p>';
        return;
    }

    // 선택된 몸상태 정렬 및 키 생성
    const selectedKey = selectedStatuses.slice().sort().join(',');
    console.log('Selected statuses:', selectedStatuses);
    console.log('Generated key:', selectedKey);

    const matchedCard = effects[selectedKey];

    if (matchedCard) {
        const effectCardDiv = document.createElement('div');
        effectCardDiv.className = 'effect-card';
        
        const effectCardImg = document.createElement('img');
        effectCardImg.src = `card-icons/${matchedCard}.png`;
        effectCardImg.alt = cards[matchedCard];
        
        const effectCardText = document.createElement('div');
        effectCardText.textContent = cards[matchedCard];
        
        effectCardDiv.appendChild(effectCardImg);
        effectCardDiv.appendChild(effectCardText);
        
        effectCardsContainer.appendChild(effectCardDiv);
    } else {
        effectCardsContainer.innerHTML = '<p>일치하는 효과 카드를 찾을 수 없습니다.</p>';
    }
}
