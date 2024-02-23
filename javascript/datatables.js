function buildDataTables(selector, dataset, columns = [], columnDefs = [], order = []) {
  return $(selector).DataTable({
    data: dataset,
    columns: columns,
    columnDefs: columnDefs,
    order: order,
    responsive: true,
    paging: true,
    dom: '<"container-fluid"<"row"<"col"B><"col"f>>>rt<"container-fluid"<"row"<"col"i><"col"p>>>',
    buttons: ["copy", "csv", "excel", "pdf", "print", "colvis"],
    language: buildDataTablesI18n()
  });
}

function buildDataTablesI18n() {
  return {
    'sEmptyTable': 'Nenhum registro encontrado',
    'sInfo': 'Mostrando de _START_ até _END_ de _TOTAL_ registros',
    'sInfoEmpty': 'Mostrando 0 até 0 de 0 registros',
    'sInfoFiltered': '(Filtrados de _MAX_ registros)',
    'sInfoPostFix': '',
    'sInfoThousands': '.',
    'sLengthMenu': '_MENU_ resultados por página',
    'sLoadingRecords': 'Carregando...',
    'sProcessing': 'Processando...',
    'sZeroRecords': 'Nenhum registro encontrado',
    'sSearch': 'Pesquisar',
    'oPaginate': {
      'sNext': 'Próximo',
      'sPrevious': 'Anterior',
      'sFirst': 'Primeiro',
      'sLast': 'Último'
    },
    'oAria': {
      'sSortAscending': ': Ordenar colunas de forma ascendente',
      'sSortDescending': ': Ordenar colunas de forma descendente'
    },
    'select': {
      'rows': {
        '_': 'Selecionado %d linhas',
        '0': 'Nenhuma linha selecionada',
        '1': 'Selecionado 1 linha'
      }
    },
    'thousands': '.',
    'decimal': ',',
    'buttons': {
      'copy': 'Copiar',
      'print': 'Imprimir',
      'colvis': 'Coluna(s)'
    }
  };
}

function configureColumnRenderer(data, type, row, renderer) {
  return type === 'display' ? renderer(data, type, row) : data;
}

function upperCaseColumnRenderer(data, type, row) {
  const renderer = (data, type, row) => typeof data === 'string' ? data?.toUpperCase() : '-';
  return configureColumnRenderer(data, type, row, renderer);
}

function numberColumnRenderer(data, type, row) {
  const renderer = (data, type, row) => {
    const formatter = new Intl.NumberFormat('pt-BR', { style: 'decimal' });
    return typeof data === 'number' ? formatter.format(data) : 0;
  };
  return configureColumnRenderer(data, type, row, renderer);
}

function monetaryColumnRenderer(data, type, row) {
  const renderer = (data, type, row) => {
    const formatter = new Intl.NumberFormat('pt-BR', { style: 'decimal' });
    return typeof data === 'number' ? `R$ ${formatter.format(data)}` : '-';
  };
  return configureColumnRenderer(data, type, row, renderer);
}

function booleanColumnRenderer(data, type, row) {
  const renderer = (data, type, row) => data ? 'SIM' : 'NÃO';
  return configureColumnRenderer(data, type, row, renderer);
}

function dateColumnRenderer(data, type, row) {
  const renderer = (data, type, row) => {
    const DateTime = luxon.DateTime;
    return DateTime.fromISO(data).toLocaleString(DateTime.DATE_SHORT);
  };
  return configureColumnRenderer(data, type, row, renderer);
}
