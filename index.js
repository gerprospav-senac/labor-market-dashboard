document.addEventListener("DOMContentLoaded", function(event) {
  buildGeographicDistribution();
  buildHighlightEmployers();
  buildSalaryDistribution();
  buildVacancyProfile();
  buildHighlightTitles();
});

function buildGeographicDistribution() {
  const dataset = buildGeographicDistribuitionDataset();
  buildMapChart('chart-geographic-distribution', dataset);

  const columns = [
    { title: 'Estado', data: 'label', render: upperCaseColumnRenderer },
    { title: 'Número de vagas', data: 'value', render: numberColumnRenderer },
  ];
  const columnDefs = [{ width: '50%', targets: 1 }];
  const order = [[ 1, 'desc' ]];
  buildDataTables('#datatable-geographic-distribution', dataset, columns, columnDefs, order);
}

function buildHighlightEmployers() {
  const dataset = buildHighlightEmployersDataset();
  buildBarChart('chart-highlight-employers', dataset);
}

function buildSalaryDistribution() {
  const dataset = buildSalaryDistributionDataset();
  buildColumnChart('chart-salary-distribution', dataset);
}

function buildVacancyProfile() {
  const datasetRelationship = buildVacancyProfileRelationshipDataset();
  buildPieChart('chart-vacancy-profile-relationship', datasetRelationship);

  const datasetModality = buildVacancyProfileModalityDataset();
  buildPieChart('chart-vacancy-profile-modality', datasetModality);

  const datasetPWD = buildVacancyProfilePWDDataset();
  buildPieChart('chart-vacancy-profile-pwd', datasetPWD);
}

function buildHighlightTitles() {
  buildHighlightTitlesApprentice();
  buildHighlightTitlesTechnician();
  buildHighlightTitlesOthers();
}
function buildHighlightTitlesApprentice() {
  const datasetOrderedStates = buildHighlightTitlesApprenticeStateDataset();
  buildHighlightTitlesBoxes('highlight-titles-apprentice', datasetOrderedStates);
  
  const dataset = buildHighlightTitlesApprenticeDataset();
  const columns = [
    { title: 'Título', data: 'label', render: upperCaseColumnRenderer },
    { title: 'Número de vagas', data: 'value', render: numberColumnRenderer },
  ];
  const columnDefs = [{ width: '50%', targets: 1 }];
  const order = [[ 1, 'desc' ]];
  buildDataTables('#datatable-highlight-titles-apprentice', dataset, columns, columnDefs, order);
}
function buildHighlightTitlesTechnician() {
  const datasetOrderedStates = buildHighlightTitlesTechnicianStateDataset();
  buildHighlightTitlesBoxes('highlight-titles-technician', datasetOrderedStates);
  
  const dataset = buildHighlightTitlesTechnicianDataset();
  const columns = [
    { title: 'Título', data: 'label', render: upperCaseColumnRenderer },
    { title: 'Número de vagas', data: 'value', render: numberColumnRenderer },
  ];
  const columnDefs = [{ width: '50%', targets: 1 }];
  const order = [[ 1, 'desc' ]];
  buildDataTables('#datatable-highlight-titles-technician', dataset, columns, columnDefs, order);
}
function buildHighlightTitlesOthers() {
  const datasetOrderedStates = buildHighlightTitlesOthersStateDataset();
  buildHighlightTitlesBoxes('highlight-titles-others', datasetOrderedStates);

  const dataset = buildHighlightTitlesOthersDataset();
  const columns = [
    { title: 'Título', data: 'label', render: upperCaseColumnRenderer },
    { title: 'Número de vagas', data: 'value', render: numberColumnRenderer },
  ];
  const columnDefs = [{ width: '50%', targets: 1 }];
  const order = [[ 1, 'desc' ]];
  buildDataTables('#datatable-highlight-titles-others', dataset, columns, columnDefs, order);
}

function buildGeographicDistribuitionDataset() {
  const evaluatorFn = (item, other) => item.name === other['LOCATION (STATE)'];
  const counterFn = item => laborMarketDataset.filter(other => evaluatorFn(item, other)).length;
  const formatterFn = item => ({ id: `BR-${item.abbreviation}`, label: item.name, value: counterFn(item) });
  return brazilianGeographyDataset.map(formatterFn);
}

function buildHighlightEmployersDataset() {
  const filtered = laborMarketDataset.map(item => ({
    ...item,
    'COMPANY': ['', '********'].includes(item['COMPANY']) ? 'Confidencial' : item['COMPANY']
  })).filter(item => item['COMPANY'].toLowerCase() !== 'confidencial');

  const companies = filtered.map(item => item['COMPANY']).sort();
  const unique = [...new Set(companies)];

  const counterFn = item => companies.filter(other => other === item).length;
  const formatterFn = item => ({ label: item, value: counterFn(item) });
  return unique.map(formatterFn).sort((item, other) => other.value - item.value).slice(0, 10);
}

function buildSalaryDistributionDataset() {
  const available = laborMarketDataset.filter(item => item['SALARY (AVAILABLE)'] === true);
  const salaries = available.map(item => item['SALARY (MIN)']);
  console.log(salaries);
  const filtered = salaries.filter(item => item > 300 && item < 30000);

  const counterFn = (min, max) => filtered.filter(item => item >= min && item <= max).length;
  return [
    { label: 'Até 1.000', value: counterFn(0, 1000) },
    { label: '1.001 a 1.500', value: counterFn(1001, 1500) },
    { label: '1.501 a 2.000', value: counterFn(1501, 2000) },
    { label: '2.001 a 3.000', value: counterFn(2001, 3000) },
    { label: '3.001 a 4.000', value: counterFn(3001, 4000) },
    { label: '4.001 a 5.000', value: counterFn(4001, 5000) },
    { label: '5.001 a 7.000', value: counterFn(5001, 7000) },
    { label: '7.001 a 10.000', value: counterFn(7001, 10000) },
    { label: 'Acima de 10.001', value: counterFn(10001, 30000) }
  ];
}

function buildVacancyProfileRelationshipDataset() {
  return [
    { label: 'Efetivo', value: 3000 },
    { label: 'Temporário', value: 692 },
  ];
}

function buildVacancyProfileModalityDataset() {
  const homeoffice = laborMarketDataset.filter(item => item['MODALITY (NORMALIZED)'] === 'home office');
  return [
    { label: 'Presencial', value: laborMarketDataset.length - homeoffice.length },
    { label: 'Home Office', value: homeoffice.length },
  ];
}

function buildVacancyProfilePWDDataset() {
  const pwd = laborMarketDataset.filter(item => item['PWD'] === true);
  return [
    { label: 'Padrão', value: laborMarketDataset.length - pwd.length },
    { label: 'PCD', value: pwd.length },
  ];
}

function buildHighlightTitlesApprenticeStateDataset() {
  const filtered = laborMarketDataset.filter(item => {
    return typeof item['TITLE'] === 'string' && item['TITLE'].toLowerCase().includes('aprendiz');
  });

  const evaluatorFn = (item, other) => item.name === other['LOCATION (STATE)'];
  const counterFn = item => filtered.filter(other => evaluatorFn(item, other)).length;
  const formatterFn = item => ({ id: `BR-${item.abbreviation}`, label: item.name, value: counterFn(item) });
  return brazilianGeographyDataset.map(formatterFn).sort((item, other) => other.value - item.value).slice(0, 3);
}

function buildHighlightTitlesApprenticeDataset() {
  const filtered = laborMarketDataset.filter(item => {
    return typeof item['TITLE'] === 'string' && item['TITLE'].toLowerCase().includes('aprendiz');
  });

  const titles = filtered.map(item => item['TITLE']).sort();
  const unique = [...new Set(titles)];

  const counterFn = item => titles.filter(other => other === item).length;
  const formatterFn = item => ({ label: item, value: counterFn(item) });
  return unique.map(formatterFn);
}

function buildHighlightTitlesTechnicianStateDataset() {
  const filtered = laborMarketDataset.filter(item => {
    return typeof item['TITLE'] === 'string' && item['TITLE'].toLowerCase().startsWith('técnico');
  });

  const evaluatorFn = (item, other) => item.name === other['LOCATION (STATE)'];
  const counterFn = item => filtered.filter(other => evaluatorFn(item, other)).length;
  const formatterFn = item => ({ id: `BR-${item.abbreviation}`, label: item.name, value: counterFn(item) });
  return brazilianGeographyDataset.map(formatterFn).sort((item, other) => other.value - item.value).slice(0, 3);
}

function buildHighlightTitlesTechnicianDataset() {
  const filtered = laborMarketDataset.filter(item => {
    return typeof item['TITLE'] === 'string' && item['TITLE'].toLowerCase().startsWith('técnico');
  });
  
  const titles = filtered.map(item => item['TITLE']).sort();
  const unique = [...new Set(titles)];

  const counterFn = item => titles.filter(other => other === item).length;
  const formatterFn = item => ({ label: item, value: counterFn(item) });
  return unique.map(formatterFn);
}

function buildHighlightTitlesOthersStateDataset() {
  const filtered = laborMarketDataset.filter(item => {
    return typeof item['TITLE'] === 'string' && !item['TITLE'].toLowerCase().includes('aprendiz') && !item['TITLE'].toLowerCase().startsWith('técnico');
  });

  const evaluatorFn = (item, other) => item.name === other['LOCATION (STATE)'];
  const counterFn = item => filtered.filter(other => evaluatorFn(item, other)).length;
  const formatterFn = item => ({ id: `BR-${item.abbreviation}`, label: item.name, value: counterFn(item) });
  return brazilianGeographyDataset.map(formatterFn).sort((item, other) => other.value - item.value).slice(0, 3);
}

function buildHighlightTitlesOthersDataset() {
  const filtered = laborMarketDataset.filter(item => {
    return typeof item['TITLE'] === 'string' && !item['TITLE'].toLowerCase().includes('aprendiz') && !item['TITLE'].toLowerCase().startsWith('técnico');
  });
  
  const titles = filtered.map(item => item['TITLE']).sort();
  const unique = [...new Set(titles)];

  const counterFn = item => titles.filter(other => other === item).length;
  const formatterFn = item => ({ label: item, value: counterFn(item) });
  return unique.map(formatterFn);
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

function buildMapChart(id, dataset) {
  am5.ready(() => {
    const root = am5.Root.new(id);
    const exportingMenuOptions = { align: 'left', valign: 'top' };
    const exportingMenu = am5plugins_exporting.ExportingMenu.new(root, exportingMenuOptions);
    am5plugins_exporting.Exporting.new(root, { menu: exportingMenu });

    root.setThemes([am5themes_Animated.new(root)]);
    
    const chart = root.container.children.push(
      am5map.MapChart.new(
        root,
        { panX: 'rotateX', projection: am5map.geoMercator(), layout: root.horizontalLayout }
      )
    );

    const polygonSeries = chart.series.push(
      am5map.MapPolygonSeries.new(
        root,
        { calculateAggregates: true, valueField: 'value' }
      )
    );
    
    polygonSeries.mapPolygons.template.setAll({ tooltipText: '{name}', interactive: true });
    polygonSeries.mapPolygons.template.states.create('hover', { fill: am5.color(0x677935) });
    
    polygonSeries.set("heatRules", [{
      target: polygonSeries.mapPolygons.template,
      dataField: "value",
      min: am5.color(0x8ab7ff),
      max: am5.color(0x25529a),
      key: "fill"
    }]);
    
    polygonSeries.mapPolygons.template.events.on("pointerover", function(ev) {
      heatLegend.showValue(ev.target.dataItem.get("value"));
    });
    
    const heatLegend = chart.children.push(
      am5.HeatLegend.new(
        root,
        {
          orientation: 'vertical',
          startColor: am5.color(0x8ab7ff),
          endColor: am5.color(0x25529a),
          startText: 'Menos vagas',
          endText: 'Mais vagas',
          stepCount: 5
        }
      )
    );
    
    heatLegend.startLabel.setAll({ fontSize: 12, fill: heatLegend.get('startColor') });
    heatLegend.endLabel.setAll({ fontSize: 12, fill: heatLegend.get('endColor') });

    polygonSeries.events.on('datavalidated', function () {
      heatLegend.set('startValue', polygonSeries.getPrivate('valueLow'));
      heatLegend.set('endValue', polygonSeries.getPrivate('valueHigh'));
    });

    polygonSeries.set('geoJSON', am5geodata_brazilHigh);
    polygonSeries.data.setAll(dataset);
  });
}

function buildBarChart(id, dataset) {
  am5.ready(() => {
    const root = am5.Root.new(id);
    const exportingMenuOptions = { align: 'right', valign: 'bottom' };
    const exportingMenu = am5plugins_exporting.ExportingMenu.new(root, exportingMenuOptions);
    am5plugins_exporting.Exporting.new(root, { menu: exportingMenu });

    root.setThemes([am5themes_Animated.new(root)]);
    
    var chart = root.container.children.push(
      am5xy.XYChart.new(
        root,
        {
          panX: false,
          panY: false,
          wheelX: 'panX',
          wheelY: 'zoomX',
          paddingLeft: 0,
          layout: root.verticalLayout
        }
      )
    );

    var yRenderer = am5xy.AxisRendererY.new(
      root,
      {
        cellStartLocation: 0.1,
        cellEndLocation: 0.9,
        minorGridEnabled: true
      }
    );
    yRenderer.grid.template.set('location', 1);
    
    var yAxis = chart.yAxes.push(
      am5xy.CategoryAxis.new(root, {
        categoryField: 'label',
        renderer: yRenderer,
        tooltip: am5.Tooltip.new(root, {})
      })
    );
    yAxis.data.setAll(dataset);
    
    var xAxis = chart.xAxes.push(
      am5xy.ValueAxis.new(root, {
        min: 0,
        renderer: am5xy.AxisRendererX.new(root, {
          strokeOpacity: 0.1,
          minGridDistance:70
        })
      })
    );
    
    var series1 = chart.series.push(am5xy.ColumnSeries.new(root, {
      name: 'value',
      xAxis: xAxis,
      yAxis: yAxis,
      valueXField: 'value',
      categoryYField: 'label',
      sequencedInterpolation: true,
      tooltip: am5.Tooltip.new(root, {
        pointerOrientation: 'horizontal',
        labelText: '{categoryY}: {valueX}'
      })
    }));
    
    series1.columns.template.setAll({ height: am5.percent(70) });

    const cursor = chart.set('cursor', am5xy.XYCursor.new(root, { behavior: 'zoomY' }));
    cursor.lineX.set('visible', false);
    cursor.lineY.set('visible', false);
    
    series1.data.setAll(dataset);
    series1.appear();
    chart.appear(1000, 100);
  });
}

function buildColumnChart(id, dataset) {
  am5.ready(() => {
    const root = am5.Root.new(id);
    const exportingMenuOptions = { align: 'right', valign: 'bottom' };
    const exportingMenu = am5plugins_exporting.ExportingMenu.new(root, exportingMenuOptions);
    am5plugins_exporting.Exporting.new(root, { menu: exportingMenu });

    root.setThemes([am5themes_Animated.new(root)]);
    
    const chart = root.container.children.push(
      am5xy.XYChart.new(
        root,
        {
          panX: true,
          panY: true,
          wheelX: 'panX',
          wheelY: 'zoomX',
          pinchZoomX: true,
          paddingLeft: 0,
          paddingRight: 1
        }
      )
    );
    
    const cursor = chart.set('cursor', am5xy.XYCursor.new(root, {}));
    cursor.lineX.set('visible', false);
    cursor.lineY.set('visible', false);
    
    const xRenderer = am5xy.AxisRendererX.new(root, { minGridDistance: 30, minorGridEnabled: true });
    xRenderer.labels.template.setAll({
      rotation: -90,
      centerY: am5.p50,
      centerX: am5.p100,
      paddingRight: 15
    });
    xRenderer.grid.template.setAll({ location: 1 });
    
    var xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
      maxDeviation: 0.3,
      categoryField: 'label',
      renderer: xRenderer,
      tooltip: am5.Tooltip.new(root, {})
    }));
    
    const yRenderer = am5xy.AxisRendererY.new(root, { strokeOpacity: 0.1 });
    const yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, { maxDeviation: 0.3, renderer: yRenderer }));
    
    const series = chart.series.push(am5xy.ColumnSeries.new(root, {
      name: "Series 1",
      xAxis: xAxis,
      yAxis: yAxis,
      valueYField: "value",
      sequencedInterpolation: true,
      categoryXField: "label",
      tooltip: am5.Tooltip.new(root, {
        labelText: "{valueY}"
      })
    }));
    
    series.columns.template.setAll({ cornerRadiusTL: 5, cornerRadiusTR: 5, strokeOpacity: 0 });
    series.columns.template.adapters.add("fill", function (fill, target) {
      return chart.get("colors").getIndex(series.columns.indexOf(target));
    });
    
    series.columns.template.adapters.add("stroke", function (stroke, target) {
      return chart.get("colors").getIndex(series.columns.indexOf(target));
    });
    
    xAxis.data.setAll(dataset);
    series.data.setAll(dataset);

    series.appear(1000);
    chart.appear(1000, 100);
  });
}

function buildPieChart(id, dataset) {
  am5.ready(() => {
    const root = am5.Root.new(id);
    const exportingMenuOptions = { align: 'right', valign: 'bottom' };
    const exportingMenu = am5plugins_exporting.ExportingMenu.new(root, exportingMenuOptions);
    am5plugins_exporting.Exporting.new(root, { menu: exportingMenu });

    root.setThemes([am5themes_Animated.new(root)]);
    
    var chart = root.container.children.push(am5percent.PieChart.new(root, { endAngle: 270 }));
    var series = chart.series.push(
      am5percent.PieSeries.new(
        root,
        {
          valueField: 'value',
          categoryField: 'label',
          endAngle: 270
        }
      )
    );

    series.states.create('hidden', { endAngle: -90 });
    series.data.setAll(dataset);
    series.appear(1000, 100);
  });
}
