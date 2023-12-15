document.addEventListener("DOMContentLoaded", function(event) {
  buildVacancyBoxes();
  buildVacancyList();
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
    { title: 'Título', data: 'TITLE', render: titleColumnRender },
    { title: 'Empresa', data: 'COMPANY', render: companyColumnRender },
    { title: 'Salário', data: 'SALARY (MIN)', render: salaryColumnRender },
    { title: 'Vínculo', data: 'RELATIONSHIP', render: relationshipColumnRender },
    { title: 'Modalidade', data: 'MODALITY (NORMALIZED)', render: modalityColumnRender },
    { title: 'Estado', data: 'LOCATION (STATE)', render: stateColumnRender },
    { title: 'PCD', data: 'PWD', render: pwdColumnRender },
    { title: 'Publicação', data: 'PUBLICATION DATE (NORMALIZED)', render: publicationColumnRender },
  ];
  buildDataTables('#datatable-vacancy-list', dataset, columns);
}
