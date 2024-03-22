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
  let dataset = Array.isArray(laborMarketDataset) ? laborMarketDataset : [];
  dataset = dataset.map(item => {
    const relationships = [];
    const validate = (item, field) => item[field] === true || item[field] === 'true';
    if (validate(item, 'relationship_permanent')) relationships.push('Efetivo');
    if (validate(item, 'relationship_independent')) relationships.push('Autônomo');
    if (validate(item, 'relationship_temporary')) relationships.push('Temporário');
    if (validate(item, 'relationship_internship')) relationships.push('Estágio');
    if (validate(item, 'relationship_apprenticeship')) relationships.push('Jovem Aprendiz');
    if (validate(item, 'relationship_other')) relationships.push('Outros');
    if (validate(item, 'relationship_uninformed')) relationships.push('Não Informado');
    item.relationship = relationships.join(', ');
    return item;
  });

  const columns = [
    { title: 'Nome da vaga', data: 'title', render: upperCaseColumnRenderer },
    { title: 'Empresa', data: 'company', render: upperCaseColumnRenderer },
    { title: 'Salário', data: 'salary_min', render: monetaryColumnRenderer },
    { title: 'Vínculo', data: 'relationship', render: upperCaseColumnRenderer },
    { title: 'Modalidade', data: 'modality_normalized', render: upperCaseColumnRenderer },
    { title: 'Estado', data: 'location_state', render: upperCaseColumnRenderer },
    { title: 'PCD', data: 'pwd', render: booleanColumnRenderer },
    { title: 'Publicação', data: 'publication_date_normalized', render: dateColumnRenderer },
  ];
  buildDataTables('#datatable-vacancy-list', dataset, columns);
}
