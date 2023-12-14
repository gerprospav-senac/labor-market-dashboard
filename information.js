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

  $('#datatable-vacancy-list').DataTable({
    data: dataset,
    columns: [
      { title: 'Título', data: 'TITLE', render: titleColumnRender },
      { title: 'Empresa', data: 'COMPANY', render: companyColumnRender },
      { title: 'Salário', data: 'SALARY (MIN)', render: salaryColumnRender },
      { title: 'Vínculo', data: 'RELATIONSHIP', render: relationshipColumnRender },
      { title: 'Modalidade', data: 'MODALITY (NORMALIZED)', render: modalityColumnRender },
      { title: 'Estado', data: 'LOCATION (STATE)', render: stateColumnRender },
      { title: 'PCD', data: 'PWD', render: pwdColumnRender },
      { title: 'Publicação', data: 'PUBLICATION DATE (NORMALIZED)', render: publicationColumnRender },
    ],
    columnDefs: [],
    order: [],
    responsive: true,
    paging: true,
    dom: '<"container-fluid"<"row"<"col"B><"col"f>>>rt<"container-fluid"<"row"<"col"i><"col"p>>>',
    buttons: ["copy", "csv", "excel", "pdf", "print", "colvis"],
    language: getDataTablesI18nPTBRConfig()
  });
}

function titleColumnRender(data, type, row) {
  if (type == 'display') {
    return data?.toUpperCase();
  }
  return data;
}

function companyColumnRender(data, type, row) {
  if (type == 'display') {
    return data?.toUpperCase();
  }
  return data;
}

function salaryColumnRender(data, type, row) {
  if (type == 'display') {
    const formatter = new Intl.NumberFormat('pt-BR', { style: 'decimal' });
    return typeof data === 'number' ? `R$ ${formatter.format(data)}` : '-';
  }
  return data;
}

function relationshipColumnRender(data, type, row) {
  if (type == 'display') {
    return data?.toUpperCase();
  }
  return data;
}

function modalityColumnRender(data, type, row) {
  if (type == 'display') {
    return data?.toUpperCase();
  }
  return data;
}

function stateColumnRender(data, type, row) {
  if (type == 'display') {
    return data?.toUpperCase();
  }
  return data;
}

function pwdColumnRender(data, type, row) {
  if (type == 'display') {
    return data ? 'SIM' : 'NÃO';
  }
  return data;
}

function publicationColumnRender(data, type, row) {
  if (type == 'display') {
    const DateTime = luxon.DateTime;
    return DateTime.fromISO(data).toLocaleString(DateTime.DATE_SHORT);
  }
  return data;
}
