document.addEventListener("DOMContentLoaded", function(event) {
  bootstrap();
});

document.addEventListener("onReferenceChange", function(event) {
  document.querySelector('div.loading').style.display = 'block';

  const tables = $.fn.dataTable.fnTables();
  for (const table of tables) {
    const datatable = $(table).dataTable();
    datatable.fnClearTable();
    datatable.fnDestroy();
  }

  bootstrap();
});

function bootstrap() {
  const website = document.getElementById('website-reference');
  const websiteValue = website?.value?.toLowerCase();
  console.log(`Website reference: ${websiteValue}`);

  const date = document.getElementById('date-reference');
  const dateValue = date?.value;
  console.log(`Date reference: ${dateValue}`);

  $.getJSON(`dataset/${websiteValue}/dataset-${websiteValue}-${dateValue}.json`, function(laborMarketDataset) {
    buildVacancyBoxes(laborMarketDataset);
    buildVacancyList(laborMarketDataset);

    document.querySelector('div.loading').style.display = 'none';
  });
}

function buildVacancyBoxes(laborMarketDataset) {
  const value = Array.isArray(laborMarketDataset) ? laborMarketDataset.length : undefined;
  const formatter = new Intl.NumberFormat('pt-BR', { style: 'decimal' });
  
  const displayed = document.querySelector('div#vacancies-displayed > div.inner > h3');
  if (displayed) {
    displayed.innerHTML = formatter.format(value);
  }

  const counter = document.querySelector('div#vacancies-counter > div.inner > h3');
  if (counter) {
    counter.innerHTML = formatter.format(value);
  }
}

function buildVacancyList(laborMarketDataset) {
  const dataset = Array.isArray(laborMarketDataset) ? laborMarketDataset : [];
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
