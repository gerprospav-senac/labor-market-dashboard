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
    { title: 'UF' },
    { title: 'Número de vagas' },
  ];
  buildDataTables('#datatable-geographic-distribution', dataset, columns);
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
    { title: 'Título' },
    { title: 'Número de vagas' },
  ];
  buildDataTables('#datatable-highlight-titles-apprentice', dataset, columns);
}
function buildHighlightTitlesTechnician() {
  const datasetOrderedStates = buildHighlightTitlesTechnicianStateDataset();
  buildHighlightTitlesBoxes('highlight-titles-technician', datasetOrderedStates);
  
  const dataset = buildHighlightTitlesTechnicianDataset();
  const columns = [
    { title: 'Título' },
    { title: 'Número de vagas' },
  ];
  buildDataTables('#datatable-highlight-titles-technician', dataset, columns);
}
function buildHighlightTitlesOthers() {
  const datasetOrderedStates = buildHighlightTitlesOthersStateDataset();
  buildHighlightTitlesBoxes('highlight-titles-others', datasetOrderedStates);

  const dataset = buildHighlightTitlesOthersDataset();
  const columns = [
    { title: 'Título' },
    { title: 'Número de vagas' },
  ];
  buildDataTables('#datatable-highlight-titles-others', dataset, columns);
}

function buildGeographicDistribuitionDataset() { return []; }
function buildHighlightEmployersDataset() { return []; }
function buildSalaryDistributionDataset() { return []; }
function buildVacancyProfileRelationshipDataset() { return []; }
function buildVacancyProfileModalityDataset() { return []; }
function buildVacancyProfilePWDDataset() { return []; }
function buildHighlightTitlesApprenticeStateDataset() { return []; }
function buildHighlightTitlesApprenticeDataset() { return []; }
function buildHighlightTitlesTechnicianStateDataset() { return []; }
function buildHighlightTitlesTechnicianDataset() { return []; }
function buildHighlightTitlesOthersStateDataset() { return []; }
function buildHighlightTitlesOthersDataset() { return []; }

function buildHighlightTitlesBoxes(id, dataset) {}

function buildMapChart(id, dataset) {
  am5.ready(function() {
    const root = am5.Root.new(id);
    
    const exportingMenuOptions = { align: 'left', valign: 'top' };
    const exportingMenu = am5plugins_exporting.ExportingMenu.new(root, exportingMenuOptions);
    am5plugins_exporting.Exporting.new(root, { menu: exportingMenu });

    root.setThemes([am5themes_Animated.new(root)]);
    
    var chart = root.container.children.push(am5map.MapChart.new(root, {
      panX: "rotateX",
      projection: am5map.geoMercator(),
      layout: root.horizontalLayout
    }));

    var polygonSeries = chart.series.push(am5map.MapPolygonSeries.new(root, {
      calculateAggregates: true,
      valueField: "value"
    }));
    
    polygonSeries.mapPolygons.template.setAll({
      tooltipText: "{name}",
      interactive: true
    });
    
    polygonSeries.mapPolygons.template.states.create("hover", {
      fill: am5.color(0x677935)
    });
    
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
    
    var heatLegend = chart.children.push(
      am5.HeatLegend.new(root, {
        orientation: "vertical",
        startColor: am5.color(0x8ab7ff),
        endColor: am5.color(0x25529a),
        startText: "Menos vagas",
        endText: "Mais vagas",
        stepCount: 5
      })
    );
    
    heatLegend.startLabel.setAll({
      fontSize: 12,
      fill: heatLegend.get("startColor")
    });
    
    heatLegend.endLabel.setAll({
      fontSize: 12,
      fill: heatLegend.get("endColor")
    });
    
    polygonSeries.events.on("datavalidated", function () {
      heatLegend.set("startValue", polygonSeries.getPrivate("valueLow"));
      heatLegend.set("endValue", polygonSeries.getPrivate("valueHigh"));
    });

    loadGeodata('BR');
    function loadGeodata(country) {
      chart.set("projection", am5map.geoMercator());
      
      var currentMap = "usaLow";
      if (am5geodata_data_countries2[country] !== undefined) {
        currentMap = am5geodata_data_countries2[country]["maps"][0];
      }
      
      // console.log(currentMap);
      am5.net.load("https://cdn.amcharts.com/lib/5/geodata/json/" + currentMap + ".json", chart).then(function (result) {
        var geodata = am5.JSONParser.parse(result.response);
        
        var data = [];
        for(var i = 0; i < geodata.features.length; i++) {
          data.push({
            id: geodata.features[i].id,
            value: Math.round( Math.random() * 10000 )
          });
        }
        // console.log(data);

        polygonSeries.set("geoJSON", geodata);
        polygonSeries.data.setAll(data);
      });
    }
  });
}

function buildBarChart(id, dataset) {
  am5.ready(function() {
    const root = am5.Root.new(id);

    const exportingMenuOptions = { align: 'right', valign: 'bottom' };
    const exportingMenu = am5plugins_exporting.ExportingMenu.new(root, exportingMenuOptions);
    am5plugins_exporting.Exporting.new(root, { menu: exportingMenu });

    root.setThemes([am5themes_Animated.new(root)]);
    
    var chart = root.container.children.push(am5xy.XYChart.new(root, {
      panX: false,
      panY: false,
      wheelX: "panX",
      wheelY: "zoomX",
      paddingLeft: 0,
      layout: root.verticalLayout
    }));
    
    var data = [{
      "year": "2005",
      "income": 23.5,
      "expenses": 18.1
    }, {
      "year": "2006",
      "income": 26.2,
      "expenses": 22.8
    }, {
      "year": "2007",
      "income": 30.1,
      "expenses": 23.9
    }, {
      "year": "2008",
      "income": 29.5,
      "expenses": 25.1
    }, {
      "year": "2009",
      "income": 24.6,
      "expenses": 25
    }];

    var yRenderer = am5xy.AxisRendererY.new(root, {
      cellStartLocation: 0.1,
      cellEndLocation: 0.9,
      minorGridEnabled: true
    });
    
    yRenderer.grid.template.set("location", 1);
    
    var yAxis = chart.yAxes.push(
      am5xy.CategoryAxis.new(root, {
        categoryField: "year",
        renderer: yRenderer,
        tooltip: am5.Tooltip.new(root, {})
      })
    );
    
    yAxis.data.setAll(data);
    
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
      name: "Income",
      xAxis: xAxis,
      yAxis: yAxis,
      valueXField: "income",
      categoryYField: "year",
      sequencedInterpolation: true,
      tooltip: am5.Tooltip.new(root, {
        pointerOrientation: "horizontal",
        labelText: "[bold]{name}[/]\n{categoryY}: {valueX}"
      })
    }));
    
    series1.columns.template.setAll({
      height: am5.percent(70)
    });

    var cursor = chart.set("cursor", am5xy.XYCursor.new(root, {
      behavior: "zoomY"
    }));
    cursor.lineX.set("visible", false);
    
    series1.data.setAll(data);
    series1.appear();
    chart.appear(1000, 100);
  });
}

function buildColumnChart(id, dataset) {
  am5.ready(function() {
    const root = am5.Root.new(id);

    const exportingMenuOptions = { align: 'right', valign: 'bottom' };
    const exportingMenu = am5plugins_exporting.ExportingMenu.new(root, exportingMenuOptions);
    am5plugins_exporting.Exporting.new(root, { menu: exportingMenu });

    const myTheme = am5.Theme.new(root);
    myTheme.rule("AxisLabel", ["minor"]).setAll({
      dy:1
    });
    root.setThemes([
      am5themes_Animated.new(root),
      myTheme,
      am5themes_Responsive.new(root)
    ]);
    
    var chart = root.container.children.push(am5xy.XYChart.new(root, {
      panX: false,
      panY: false,
      wheelX: "panX",
      wheelY: "zoomX",
      paddingLeft:0
    }));
    
    var cursor = chart.set("cursor", am5xy.XYCursor.new(root, {
      behavior: "zoomX"
    }));
    cursor.lineY.set("visible", false);
    
    var xAxis = chart.xAxes.push(am5xy.DateAxis.new(root, {
      maxDeviation: 0,
      baseInterval: {
        timeUnit: "day",
        count: 1
      },
      renderer: am5xy.AxisRendererX.new(root, {
        minorGridEnabled:true,
        minorLabelsEnabled:true
      }),
      tooltip: am5.Tooltip.new(root, {})
    }));
    
    xAxis.set("minorDateFormats", {
      "day":"dd",
      "month":"MM"
    });
    
    var yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
      renderer: am5xy.AxisRendererY.new(root, {})
    }));
    
    var series = chart.series.push(am5xy.ColumnSeries.new(root, {
      name: "Series",
      xAxis: xAxis,
      yAxis: yAxis,
      valueYField: "value",
      valueXField: "date",
      tooltip: am5.Tooltip.new(root, {
        labelText: "{valueY}"
      })
    }));
    
    series.columns.template.setAll({ strokeOpacity: 0 })
    
    chart.set("scrollbarX", am5.Scrollbar.new(root, {
      orientation: "horizontal"
    }));
    
    var date = new Date();
    date.setHours(0, 0, 0, 0);
    var value = 100;
    function generateData() {
      value = Math.round((Math.random() * 10 - 5) + value);
      am5.time.add(date, "day", 1);
      return {
        date: date.getTime(),
        value: value
      };
    }
    function generateDatas(count) {
      var data = [];
      for (var i = 0; i < count; ++i) {
        data.push(generateData());
      }
      return data;
    }
    var data = generateDatas(30);
    series.data.setAll(data);

    series.appear(1000);
    chart.appear(1000, 100);
  });
}

function buildPieChart(id, dataset) {
  am5.ready(function() {
    const root = am5.Root.new(id);
    
    const exportingMenuOptions = { align: 'right', valign: 'bottom' };
    const exportingMenu = am5plugins_exporting.ExportingMenu.new(root, exportingMenuOptions);
    am5plugins_exporting.Exporting.new(root, { menu: exportingMenu });

    root.setThemes([am5themes_Animated.new(root)]);
    
    var chart = root.container.children.push(am5percent.PieChart.new(root, { endAngle: 270 }));
    var series = chart.series.push(
      am5percent.PieSeries.new(root, {
        valueField: "value",
        categoryField: "category",
        endAngle: 270
      })
    );

    series.states.create("hidden", { endAngle: -90 });
    series.data.setAll([{ category: 'Austria', value: 128.3 }, { category: 'UK', value: 99 }]);
    series.appear(1000, 100);
  });
}
