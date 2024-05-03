const cardHeaderClassList = ['card__header', 'card__header--light'];
const data = [
  {
    id: 1,
    description: 'in sunt soluta',
    status: 'close',
    serverity: 'low',
  },
  {
    id: 2,
    description:
      'lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    status: 'close',
    serverity: 'medium',
  },
  {
    id: 3,
    description: 'testing phase',
    status: 'open',
    serverity: 'high',
  },
];

/* UI Elements */
const cardWrapperEl = document.getElementById('card-wrapper');

const sortButtonEl = document.getElementById('sort');
const searchInputEl = document.getElementById('search');
const filterButtonEl = document.querySelectorAll('button[data-filter]');

const addButtonEl = document.getElementById('add-button');
const closeButtonEl = document.getElementById('close-button');
const deleteButtonEl = document.getElementById('delete-button');

const serverityInputEl = document.getElementById('serverity');
const descriptionInputEl = document.getElementById('description');

/* Utility Functions */
const resetUI = (dataSource = []) => {
  cardWrapperEl.innerHTML = '';
  descriptionInputEl.value = '';
  serverityInputEl.value = 'low';

  dataSource.map((item) => {
    renderCard(item);
  });
};

const debounce = (func, delay) => {
  let timer;

  return function (...args) {
    clearTimeout(timer);

    timer = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

/* Business Logic */
const addData = () => {
  const isAddable = isFormValid();
  if (!isAddable) {
    return;
  }

  const newItem = {
    id: Math.floor(Math.random() * 100),
    description: descriptionInputEl.value,
    status: 'open',
    serverity: serverityInputEl.value,
  };

  // Add new item to data
  data.push(newItem);

  // Reset UI
  resetUI(data);
};

const deleteData = (item) => {
  const itemId = item.id;

  const index = data.findIndex((_item) => _item.id === itemId);
  data.splice(index, 1);

  // Reset UI
  resetUI(data);
};

const sortData = (sortValue) => {
  if (sortValue === 'asc') {
    return data.sort((a, b) => a.id - b.id);
  }

  return data.sort((a, b) => b.id - a.id);
};

const filterData = (filterValue = 'all') => {
  if (filterValue !== 'all') {
    return data.filter((item) => {
      return item.status === filterValue;
    });
  }

  return data;
};

const searchData = (searchValue) => {
  return data.filter((item) => {
    return item.description.includes(searchValue);
  });
};

const closeData = (item) => {
  const itemId = item.id;

  const index = data.findIndex((_item) => _item.id === itemId);
  data[index].status = 'close';

  // Reset UI
  resetUI(data);
};

/* Validaiton Function */
const isFormValid = () => {
  // Remove previous error messages
  const prevErrorMessageEl =
    descriptionInputEl.parentElement.querySelector('p');

  if (prevErrorMessageEl) {
    prevErrorMessageEl.remove();
  }

  if (!descriptionInputEl.value) {
    const parentEl = descriptionInputEl.parentNode;
    const errorMessageEl = document.createElement('p');

    errorMessageEl.classList.add('message', 'message--error');
    errorMessageEl.textContent = 'Description is required';
    parentEl.appendChild(errorMessageEl);

    descriptionInputEl.style.border = '1px solid red';
    descriptionInputEl.style.backgroundColor = 'lightgrey';
    descriptionInputEl.focus();
    return false;
  }

  descriptionInputEl.style.border = '';
  descriptionInputEl.style.backgroundColor = '';
  return true;
};

/* UI Render Functions */
const cardButtonRender = ({ type = 'close', dataSource, clickHandler }) => {
  const lowerCaseType = type.toLowerCase();

  const cardButtonClasslist = {
    close: ['btn', 'btn--primary'],
    delete: ['btn', 'btn--danger'],
  }[lowerCaseType];

  const cardButtonEl = document.createElement('button');
  cardButtonEl.classList.add(...cardButtonClasslist);
  cardButtonEl.id = `${lowerCaseType}-button`;
  cardButtonEl.textContent = type;

  cardButtonEl.addEventListener('click', () => {
    clickHandler(dataSource);
  });

  return cardButtonEl;
};

const renderCard = (item) => {
  // Create card element phase
  const cardEl = document.createElement('div');
  cardEl.classList.add('card');

  // Create card header element phase
  const cardHeaderEl = document.createElement('div');
  cardHeaderEl.classList.add(...cardHeaderClassList);

  const cardIdEl = document.createElement('p');
  const cardStatusEl = document.createElement('span');
  cardStatusEl.classList.add('card-status', `card-status--${item.status}`);
  cardStatusEl.textContent = `${item.status}`;

  cardIdEl.textContent = `${item.id}`;
  cardIdEl.appendChild(cardStatusEl);

  cardHeaderEl.appendChild(cardIdEl);

  // Create card main element phase
  const cardMainEl = document.createElement('div');
  cardMainEl.classList.add('card__main');

  const cardDescriptionEl = document.createElement('p');
  cardDescriptionEl.textContent = `${item.description}`;

  const cardServerityEl = document.createElement('span');
  cardServerityEl.classList.add(
    'card-serverity',
    `card-serverity--${item.serverity}`
  );
  cardServerityEl.textContent = `${item.serverity}`;

  cardMainEl.appendChild(cardDescriptionEl);
  cardMainEl.appendChild(cardServerityEl);

  // Create card button group element phase
  const cardButtonGroupEl = document.createElement('div');
  cardButtonGroupEl.classList.add('card__btn-group');

  const cardCloseButtonEl = cardButtonRender({
    type: 'Close',
    dataSource: item,
    clickHandler: closeData,
  });

  const cardDeleteButtonEl = cardButtonRender({
    type: 'Delete',
    dataSource: item,
    clickHandler: deleteData,
  });

  cardButtonGroupEl.appendChild(cardCloseButtonEl);
  cardButtonGroupEl.appendChild(cardDeleteButtonEl);

  // Append all elements to card element phase
  cardEl.appendChild(cardHeaderEl);
  cardEl.appendChild(cardMainEl);
  cardEl.appendChild(cardButtonGroupEl);
  cardWrapperEl.appendChild(cardEl);
};

const initializeApp = () => {
  addButtonEl.addEventListener('click', (e) => {
    e.preventDefault();
    addData();
  });

  searchInputEl.addEventListener(
    'input',
    debounce((e) => {
      const searchValue = e.target.value;
      const filteredData = searchData(searchValue);

      /* Reset UI */
      resetUI(filteredData);
    }, 500)
  );

  filterButtonEl.forEach((button) => {
    button.addEventListener('click', (e) => {
      // Get the value of the clicked button using dataset.filter
      const filterValue = e.target.dataset.filter;
      const filteredData = filterData(filterValue);

      /* Reset UI */
      resetUI(filteredData);
    });
  });

  sortButtonEl.addEventListener('click', (e) => {
    const sortValue = e.target.value;
    const sortedData = sortData(sortValue);

    /* Reset UI */
    resetUI(sortedData);
  });

  data.map((item) => {
    renderCard(item);
  });
};

initializeApp();
