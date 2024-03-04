document.addEventListener("DOMContentLoaded", function(event) {
  bootstrap();
});

document.addEventListener("onReferenceChange", function(event) {
  document.querySelector('div.loading').style.display = 'block';

  Array.from(am5.registry.rootElements).forEach(root => root.dispose());
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
    buildGeographicDistribution(laborMarketDataset);
    buildHighlightEmployers(laborMarketDataset);
    buildHighlightStateVacancy(laborMarketDataset);
    buildVacancyProfile(laborMarketDataset);
    buildHighlightTitles(laborMarketDataset);
    buildSalaryDistribution(laborMarketDataset);

    document.querySelector('div.loading').style.display = 'none';
  });
}

function buildGeographicDistribution(laborMarketDataset) {
  const dataset = buildGeographicDistributionDataset(laborMarketDataset);
  buildMapChart('chart-geographic-distribution', dataset);

  const columns = [
    { title: 'Estado', data: 'label', render: upperCaseColumnRenderer },
    { title: 'N.º de vagas', data: 'value', render: numberColumnRenderer },
    { title: 'N.º de contratantes', data: 'contractors', render: numberColumnRenderer },
    { title: 'Média por contratante', data: 'average', render: numberColumnRenderer },
    { title: 'Vagas confidenciais', data: 'percentage', render: percentageColumnRenderer },
  ];
  const columnDefs = [];
  const order = [[ 1, 'desc' ]];
  buildDataTables('#datatable-geographic-distribution', dataset, columns, columnDefs, order);
}

function buildHighlightEmployers(laborMarketDataset) {
  const dataset = buildHighlightEmployersDataset(laborMarketDataset);
  buildBarChart('chart-highlight-employers', dataset);
}

function buildHighlightStateVacancy(laborMarketDataset) {
  const dataset = buildHighlightStateVacancyDataset(laborMarketDataset);
  const columns = [
    { title: 'Estado', data: 'state', render: upperCaseColumnRenderer },
    { title: 'Vaga destacada', data: 'vacancy', render: upperCaseColumnRenderer },
    { title: 'N.º de postagens', data: 'posts', render: numberColumnRenderer },
    { title: 'N.º de contratantes', data: 'contractors', render: numberColumnRenderer },
    { title: 'Contratantes confidenciais', data: 'percentage', render: percentageColumnRenderer },
  ];
  const columnDefs = [];
  const order = [[ 0, 'asc' ]];
  buildDataTables('#datatable-highlight-state-vacancy', dataset, columns, columnDefs, order);
}

function buildVacancyProfile(laborMarketDataset) {
  const datasetRelationship = buildVacancyProfileRelationshipDataset(laborMarketDataset);
  buildPieChart('chart-vacancy-profile-relationship', datasetRelationship);

  const datasetModality = buildVacancyProfileModalityDataset(laborMarketDataset);
  buildPieChart('chart-vacancy-profile-modality', datasetModality);

  const datasetPWD = buildVacancyProfilePWDDataset(laborMarketDataset);
  buildPieChart('chart-vacancy-profile-pwd', datasetPWD);
}

function buildHighlightTitles(laborMarketDataset) {
  buildHighlightTitlesApprentice(laborMarketDataset);
  buildHighlightTitlesTechnician(laborMarketDataset);
  buildHighlightTitlesOthers(laborMarketDataset);
}

function buildHighlightTitlesApprentice(laborMarketDataset) {
  const datasetOrderedStates = buildHighlightTitlesApprenticeStateDataset(laborMarketDataset);
  buildHighlightTitlesBoxes('highlight-titles-apprentice', datasetOrderedStates);
  
  const dataset = buildHighlightTitlesApprenticeDataset(laborMarketDataset);
  const columns = [
    { title: 'Nome da vaga', data: 'label', render: upperCaseColumnRenderer },
    { title: 'N.º de vagas', data: 'value', render: numberColumnRenderer },
  ];
  const columnDefs = [{ width: '50%', targets: 1 }];
  const order = [[ 1, 'desc' ]];
  buildDataTables('#datatable-highlight-titles-apprentice', dataset, columns, columnDefs, order);
}

function buildHighlightTitlesTechnician(laborMarketDataset) {
  const datasetOrderedStates = buildHighlightTitlesTechnicianStateDataset(laborMarketDataset);
  buildHighlightTitlesBoxes('highlight-titles-technician', datasetOrderedStates);
  
  const dataset = buildHighlightTitlesTechnicianDataset(laborMarketDataset);
  const columns = [
    { title: 'Nome da vaga', data: 'label', render: upperCaseColumnRenderer },
    { title: 'N.º de vagas', data: 'value', render: numberColumnRenderer },
  ];
  const columnDefs = [{ width: '50%', targets: 1 }];
  const order = [[ 1, 'desc' ]];
  buildDataTables('#datatable-highlight-titles-technician', dataset, columns, columnDefs, order);
}

function buildHighlightTitlesOthers(laborMarketDataset) {
  const datasetOrderedStates = buildHighlightTitlesOthersStateDataset(laborMarketDataset);
  buildHighlightTitlesBoxes('highlight-titles-others', datasetOrderedStates);

  const dataset = buildHighlightTitlesOthersDataset(laborMarketDataset);
  const columns = [
    { title: 'Nome da vaga', data: 'label', render: upperCaseColumnRenderer },
    { title: 'N.º de vagas', data: 'value', render: numberColumnRenderer },
  ];
  const columnDefs = [{ width: '50%', targets: 1 }];
  const order = [[ 1, 'desc' ]];
  buildDataTables('#datatable-highlight-titles-others', dataset, columns, columnDefs, order);
}

function buildSalaryDistribution(laborMarketDataset) {
  const dataset = buildSalaryDistributionDataset(laborMarketDataset);
  buildColumnChart('chart-salary-distribution', dataset);
}

function buildGeographicDistributionDataset(laborMarketDataset) {
  const _buildStateInformation = (state) => {
    const filtered = laborMarketDataset.filter(item => item['LOCATION (STATE)'] === state);
    const value = filtered.length;

    const companyFilter = (item) => typeof item['COMPANY'] === 'string' && item['COMPANY']?.trim();
    const companyMapper = (item) => item['COMPANY']?.toUpperCase();
    const contractorList = filtered.filter(companyFilter).map(companyMapper).sort();
    const contractors = [...new Set(contractorList)].length;

    const average = value && contractors ? value / contractors : 0;

    const confidentialFilter = (item) => item['COMPANY']?.toLowerCase() === 'confidencial';
    const confidentials = filtered.filter(companyFilter).filter(confidentialFilter).length;
    const percentage = confidentials && value ? confidentials / value : 0;

    return { value, contractors, average, percentage };
  };

  return brazilianGeographyDataset.map(item => {
    return {
      id: `BR-${item.abbreviation}`,
      label: item.name,
      ..._buildStateInformation(item.name)
    };
  });
}

function buildHighlightEmployersDataset(laborMarketDataset) {
  const filtered = laborMarketDataset
    .filter(item => typeof item['COMPANY'] === 'string' && item['COMPANY']?.trim())
    .filter(item => item['COMPANY']?.toLowerCase() !== 'confidencial');
  const companies = filtered.map(item => item['COMPANY']?.toUpperCase()).sort();
  const unique = [...new Set(companies)];

  const counterFn = item => companies.filter(other => other === item).length;
  const formatterFn = item => ({ label: item, value: counterFn(item) });
  const descendingSorterFn = (item, other) => other.value - item.value;
  const ascendingSorterFn = (item, other) => item.value - other.value;
  return unique.map(formatterFn).sort(descendingSorterFn).slice(0, 10).sort(ascendingSorterFn);
}

function buildHighlightStateVacancyDataset(laborMarketDataset) {
  const _buildStateInformation = (state) => {
    const filtered = laborMarketDataset.filter(item => item['LOCATION (STATE)'] === state);

    const titleFilter = (item) => typeof item['TITLE'] === 'string' && item['TITLE']?.trim();
    const titleMapper = (item) => item['TITLE']?.toUpperCase();
    const titles = filtered.filter(titleFilter).map(titleMapper).sort();
    const unique = [...new Set(titles)];

    const counterFn = item => titles.filter(other => other === item).length;
    const formatterFn = item => ({ label: item, value: counterFn(item) });
    const descendingSorterFn = (item, other) => other?.value - item?.value;
    const [ highlighted ] = unique.map(formatterFn).sort(descendingSorterFn);
    const vacancy = typeof highlighted?.label === 'string' ? highlighted?.label : 'N/A';
    const posts = typeof highlighted?.value === 'number' ? highlighted?.value : 0;

    const highlightFilter = (item) => item['TITLE']?.toUpperCase() === vacancy?.toUpperCase();
    const companyFilter = (item) => typeof item['COMPANY'] === 'string' && item['COMPANY']?.trim();
    const companyMapper = (item) => item['COMPANY']?.toUpperCase();
    const contractorList =  filtered
      .filter(titleFilter)
      .filter(highlightFilter)
      .filter(companyFilter)
      .map(companyMapper)
      .sort();
    const contractors = [...new Set(contractorList)].length;
    
    const confidentialFilter = (item) => item['COMPANY']?.toLowerCase() === 'confidencial';
    const confidentials = filtered
      .filter(titleFilter)
      .filter(highlightFilter)
      .filter(companyFilter)
      .filter(confidentialFilter)
      .length;

    const percentage = confidentials && posts ? confidentials / posts : 0;

    return { vacancy, posts, contractors, percentage };
  };
  
  return brazilianGeographyDataset.map(item => {
    return {
      id: `BR-${item.abbreviation}`,
      state: item.name,
      ..._buildStateInformation(item.name)
    };
  });
}

function buildSalaryDistributionDataset(laborMarketDataset) {
  const filtered = laborMarketDataset
    .filter(item => item['SALARY (AVAILABLE)'] === true)
    .filter(item => typeof item['SALARY (MIN)'] === 'number')
    .filter(item => item['SALARY (MIN)'] > 100  && item['SALARY (MIN)'] < 100000);
  const salaries = filtered.map(item => item['SALARY (MIN)']);

  const counterFn = (min, max) => salaries.filter(item => item >= min && item <= max).length;
  return [
    { label: 'Até R$ 1.000', value: counterFn(100, 1000) },
    { label: 'R$ 1.001 a R$ 1.500', value: counterFn(1001, 1500) },
    { label: 'R$ 1.501 a R$ 2.000', value: counterFn(1501, 2000) },
    { label: 'R$ 2.001 a R$ 3.000', value: counterFn(2001, 3000) },
    { label: 'R$ 3.001 a R$ 4.000', value: counterFn(3001, 4000) },
    { label: 'R$ 4.001 a R$ 5.000', value: counterFn(4001, 5000) },
    { label: 'R$ 5.001 a R$ 7.000', value: counterFn(5001, 7000) },
    { label: 'R$ 7.001 a R$ 10.000', value: counterFn(7001, 10000) },
    { label: 'Acima de R$ 10.001', value: counterFn(10001, 100000) }
  ];
}

function buildVacancyProfileRelationshipDataset(laborMarketDataset) {
  const filtered = laborMarketDataset.filter(item => typeof item['RELATIONSHIP'] === 'string' && item['RELATIONSHIP']?.trim());
  const relationships = filtered.map(item => item['RELATIONSHIP']).sort();
  const unique = [...new Set(relationships)];

  const counterFn = item => relationships.filter(other => other === item).length;
  const formatterFn = item => ({ label: item, value: counterFn(item) });
  return unique.map(formatterFn);
}

function buildVacancyProfileModalityDataset(laborMarketDataset) {
  const homeOffice = laborMarketDataset.filter(item => item['MODALITY (NORMALIZED)'] === 'home office');
  return [
    { label: 'Presencial', value: laborMarketDataset.length - homeOffice.length },
    { label: 'Home Office', value: homeOffice.length },
  ];
}

function buildVacancyProfilePWDDataset(laborMarketDataset) {
  const pwd = laborMarketDataset.filter(item => item['PWD'] === true);
  return [
    { label: 'Padrão', value: laborMarketDataset.length - pwd.length },
    { label: 'PCD', value: pwd.length },
  ];
}

function buildHighlightTitlesApprenticeStateDataset(laborMarketDataset) {
  const filtered = laborMarketDataset
    .filter(item => typeof item['TITLE'] === 'string' && item['TITLE']?.trim())
    .filter(item => item['TITLE']?.toLowerCase()?.includes('aprendiz'));

  const evaluatorFn = (item, other) => item?.name === other['LOCATION (STATE)'];
  const counterFn = item => filtered.filter(other => evaluatorFn(item, other)).length;
  const formatterFn = item => ({ id: `BR-${item.abbreviation}`, label: item.name, value: counterFn(item) });
  return brazilianGeographyDataset.map(formatterFn).sort((item, other) => other.value - item.value).slice(0, 3);
}

function buildHighlightTitlesApprenticeDataset(laborMarketDataset) {
  const filtered = laborMarketDataset
    .filter(item => typeof item['TITLE'] === 'string' && item['TITLE']?.trim())
    .filter(item => item['TITLE']?.toLowerCase()?.includes('aprendiz'));
  
  const titles = filtered.map(item => item['TITLE']?.toLowerCase()).sort();
  const unique = [...new Set(titles)];

  const counterFn = item => titles.filter(other => other === item).length;
  return unique.map(item => ({ label: item, value: counterFn(item) }));
}

function buildHighlightTitlesTechnicianStateDataset(laborMarketDataset) {
  const filtered = laborMarketDataset
    .filter(item => typeof item['TITLE'] === 'string' && item['TITLE']?.trim())
    .filter(item => item['TITLE']?.toLowerCase()?.startsWith('técnico'));

  const evaluatorFn = (item, other) => item.name === other['LOCATION (STATE)'];
  const counterFn = item => filtered.filter(other => evaluatorFn(item, other)).length;
  const formatterFn = item => ({ id: `BR-${item.abbreviation}`, label: item.name, value: counterFn(item) });
  return brazilianGeographyDataset.map(formatterFn).sort((item, other) => other.value - item.value).slice(0, 3);
}

function buildHighlightTitlesTechnicianDataset(laborMarketDataset) {
  const filtered = laborMarketDataset
    .filter(item => typeof item['TITLE'] === 'string' && item['TITLE']?.trim())
    .filter(item => item['TITLE']?.toLowerCase()?.startsWith('técnico'));
  
  const titles = filtered.map(item => item['TITLE']?.toLowerCase()).sort();
  const unique = [...new Set(titles)];

  const counterFn = item => titles.filter(other => other === item).length;
  return unique.map(item => ({ label: item, value: counterFn(item) }));
}

function buildHighlightTitlesOthersStateDataset(laborMarketDataset) {
  const filtered = laborMarketDataset
    .filter(item => typeof item['TITLE'] === 'string' && item['TITLE']?.trim())
    .filter(item => !item['TITLE']?.toLowerCase()?.includes('aprendiz') && !item['TITLE']?.toLowerCase()?.startsWith('técnico'));

  const evaluatorFn = (item, other) => item.name === other['LOCATION (STATE)'];
  const counterFn = item => filtered.filter(other => evaluatorFn(item, other)).length;
  const formatterFn = item => ({ id: `BR-${item.abbreviation}`, label: item.name, value: counterFn(item) });
  return brazilianGeographyDataset.map(formatterFn).sort((item, other) => other.value - item.value).slice(0, 3);
}

function buildHighlightTitlesOthersDataset(laborMarketDataset) {
  const filtered = laborMarketDataset
    .filter(item => typeof item['TITLE'] === 'string' && item['TITLE']?.trim())
    .filter(item => !item['TITLE']?.toLowerCase()?.includes('aprendiz') && !item['TITLE']?.toLowerCase()?.startsWith('técnico'));
  
  const titles = filtered.map(item => item['TITLE']?.toLowerCase()).sort();
  const unique = [...new Set(titles)];

  const counterFn = item => titles.filter(other => other === item).length;
  return unique.map(item => ({ label: item, value: counterFn(item) }));
}

function buildHighlightTitlesBoxes(id, dataset) {
  const [first, second, third] = dataset;

  buildHighlightTitlesBox(id, 'first', first);
  buildHighlightTitlesBox(id, 'second', second);
  buildHighlightTitlesBox(id, 'third', third);
}

function buildHighlightTitlesBox(id, position, data) {
  const formatter = new Intl.NumberFormat('pt-BR', { style: 'decimal' });

  const textSelector = `div#${id}-${position} > div.info-box-content > span.info-box-text`;
  const text = document.querySelector(textSelector);
  if (text) {
    text.innerHTML = data?.label || 'N/A';
  }

  const numberSelector = `div#${id}-${position} > div.info-box-content > span.info-box-number`;
  const number = document.querySelector(numberSelector);
  if (number) {
    number.innerHTML = `${formatter.format(data?.value || 0)} vagas`;
  }
}
