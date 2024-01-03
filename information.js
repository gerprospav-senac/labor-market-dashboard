document.addEventListener("DOMContentLoaded", function(event) {
  buildVacancyBoxes();
  buildVacancyList();

  // Refactoring
  document.querySelector('div.loading').style.display = 'none';
});

function buildVacancyBoxes() {
  const formatter = new Intl.NumberFormat('pt-BR', { style: 'decimal' });
  const value = Array.isArray(laborMarketDataset) ? laborMarketDataset.length : undefined;
  
  const displayed = document.querySelector('div#vacancies-displayed > div.inner > h3');
  if (displayed) {
    displayed.innerHTML = formatter.format(value);
  }

  const counter = document.querySelector('div#vacancies-counter > div.inner > h3');
  if (counter) {
    counter.innerHTML = formatter.format(value);
  }
}

function buildVacancyList() {
  let dataset = [];
  if (Array.isArray(laborMarketDataset)) {
    dataset = laborMarketDataset.map(item => ({
      ...item,
      'COMPANY': ['', '********'].includes(item['COMPANY']) ? 'Confidencial' : item['COMPANY']
    }));
  }

  const columns = [
    { title: 'Título', data: 'TITLE', render: upperCaseColumnRenderer },
    { title: 'Empresa', data: 'COMPANY', render: upperCaseColumnRenderer },
    { title: 'Salário', data: 'SALARY (MIN)', render: monetaryColumnRenderer },
    { title: 'Vínculo', data: 'RELATIONSHIP', render: upperCaseColumnRenderer },
    { title: 'Modalidade', data: 'MODALITY (NORMALIZED)', render: upperCaseColumnRenderer },
    { title: 'Estado', data: 'LOCATION (STATE)', render: upperCaseColumnRenderer },
    { title: 'PCD', data: 'PWD', render: booleanColumnRenderer },
    { title: 'Publicação', data: 'PUBLICATION DATE (NORMALIZED)', render: dateColumnRenderer },
  ];
  buildDataTables('#datatable-vacancy-list', dataset, columns);
}
