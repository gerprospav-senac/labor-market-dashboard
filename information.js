document.addEventListener("DOMContentLoaded", function(event) {
  $('#datatable-information').DataTable({
    data: [],
    columns: [
      { title: 'Título' },
      { title: 'Empresa' },
      { title: 'Salário' },
      { title: 'Vínculo' },
      { title: 'Modalidade' },
      { title: 'Estado' },
      { title: 'PCD' },
      { title: 'Publicação' },
    ],
    columnDefs: [],
    order: [],
    responsive: true,
    paging: true,
    dom: '<"container-fluid"<"row"<"col"B><"col"f>>>rt<"container-fluid"<"row"<"col"i><"col"p>>>',
    buttons: ["copy", "csv", "excel", "pdf", "print", "colvis"],
    language: getDataTablesI18nPTBRConfig()
  });
});

function getDataTablesI18nPTBRConfig() {
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