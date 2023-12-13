document.addEventListener("DOMContentLoaded", function(event) {
  $('#datatable-vacancy-list').DataTable({
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
