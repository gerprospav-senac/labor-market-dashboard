document.addEventListener("DOMContentLoaded", function(event) {});

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

function upperCaseColumnRender(data, type, row) {
  if (type == 'display') {
    return data?.toUpperCase();
  }
  return data;
}

function numberColumnRender(data, type, row) {
  if (type == 'display') {
    const formatter = new Intl.NumberFormat('pt-BR', { style: 'decimal' });
    return formatter.format(data);
  }
  return data;
}
