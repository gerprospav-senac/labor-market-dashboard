document.addEventListener("DOMContentLoaded", function(event) {
  $('#datatable-geographic-distribution').DataTable({
    data: [],
    columns: [
      { title: 'UF' },
      { title: 'Número de vagas' },
    ],
    columnDefs: [],
    order: [],
    responsive: true,
    paging: true,
    dom: '<"container-fluid"<"row"<"col"B><"col"f>>>rt<"container-fluid"<"row"<"col"i><"col"p>>>',
    buttons: ["copy", "csv", "excel", "pdf", "print", "colvis"],
    language: getDataTablesI18nPTBRConfig()
  });

  $('#datatable-highlight-titles-apprentice').DataTable({
    data: [],
    columns: [
      { title: 'Título' },
      { title: 'Número de vagas' },
    ],
    columnDefs: [],
    order: [],
    responsive: true,
    paging: true,
    dom: '<"container-fluid"<"row"<"col"B><"col"f>>>rt<"container-fluid"<"row"<"col"i><"col"p>>>',
    buttons: ["copy", "csv", "excel", "pdf", "print", "colvis"],
    language: getDataTablesI18nPTBRConfig()
  });

  $('#datatable-highlight-titles-technician').DataTable({
    data: [],
    columns: [
      { title: 'Título' },
      { title: 'Número de vagas' },
    ],
    columnDefs: [],
    order: [],
    responsive: true,
    paging: true,
    dom: '<"container-fluid"<"row"<"col"B><"col"f>>>rt<"container-fluid"<"row"<"col"i><"col"p>>>',
    buttons: ["copy", "csv", "excel", "pdf", "print", "colvis"],
    language: getDataTablesI18nPTBRConfig()
  });

  $('#datatable-highlight-titles-others').DataTable({
    data: [],
    columns: [
      { title: 'Título' },
      { title: 'Número de vagas' },
    ],
    columnDefs: [],
    order: [],
    responsive: true,
    paging: true,
    dom: '<"container-fluid"<"row"<"col"B><"col"f>>>rt<"container-fluid"<"row"<"col"i><"col"p>>>',
    buttons: ["copy", "csv", "excel", "pdf", "print", "colvis"],
    language: getDataTablesI18nPTBRConfig()
  });

  locationSensitiveMapChart('chart-geographic-distribution');
  barAndLineChart('chart-highlight-employers');
  simpleColumnChart('chart-salary-distribution');
  pieChart('chart-vacancy-profile-type');
  pieChart('chart-vacancy-profile-modality');
  pieChart('chart-vacancy-profile-pwd');
});

function locationSensitiveMapChart(id) {
  am5.ready(function() {

    // Create root element
    // https://www.amcharts.com/docs/v5/getting-started/#Root_element
    var root = am5.Root.new(id);
    
    // Set themes
    // https://www.amcharts.com/docs/v5/concepts/themes/
    root.setThemes([
      am5themes_Animated.new(root)
    ]);

    var exporting = am5plugins_exporting.Exporting.new(
      root, {
        menu: am5plugins_exporting.ExportingMenu.new(root, { align: 'left', valign: 'top' })
      }
    );
    
    // Create the map chart
    // https://www.amcharts.com/docs/v5/charts/map-chart/
    var chart = root.container.children.push(am5map.MapChart.new(root, {
      panX: "rotateX",
      projection: am5map.geoMercator(),
      layout: root.horizontalLayout
    }));
    
    loadGeodata('BR');
    
    // Create polygon series for continents
    // https://www.amcharts.com/docs/v5/charts/map-chart/map-polygon-series/
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
    
    function loadGeodata(country) {
    
      // Default map
      var defaultMap = "usaLow";
      
      if (country == "US") {
        chart.set("projection", am5map.geoAlbersUsa());
      }
      else {
        chart.set("projection", am5map.geoMercator());
      }
    
      // calculate which map to be used
      var currentMap = defaultMap;
      var title = "";
      if (am5geodata_data_countries2[country] !== undefined) {
        currentMap = am5geodata_data_countries2[country]["maps"][0];
    
        // add country title
        if (am5geodata_data_countries2[country]["country"]) {
          title = am5geodata_data_countries2[country]["country"];
        }
      }
      
      am5.net.load("https://cdn.amcharts.com/lib/5/geodata/json/" + currentMap + ".json", chart).then(function (result) {
        var geodata = am5.JSONParser.parse(result.response);
        var data = [];
        for(var i = 0; i < geodata.features.length; i++) {
          data.push({
            id: geodata.features[i].id,
            value: Math.round( Math.random() * 10000 )
          });
        }
    
        polygonSeries.set("geoJSON", geodata);
        polygonSeries.data.setAll(data)
      });
    
    }
    
    var heatLegend = chart.children.push(
      am5.HeatLegend.new(root, {
        orientation: "vertical",
        startColor: am5.color(0x8ab7ff),
        endColor: am5.color(0x25529a),
        startText: "Lowest",
        endText: "Highest",
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
    
    // change this to template when possible
    polygonSeries.events.on("datavalidated", function () {
      heatLegend.set("startValue", polygonSeries.getPrivate("valueLow"));
      heatLegend.set("endValue", polygonSeries.getPrivate("valueHigh"));
    });
    
    });
}

function barAndLineChart(id) {
  am5.ready(function() {

    // Create root element
    // https://www.amcharts.com/docs/v5/getting-started/#Root_element
    var root = am5.Root.new(id);
    
    
    // Set themes
    // https://www.amcharts.com/docs/v5/concepts/themes/
    root.setThemes([
      am5themes_Animated.new(root)
    ]);
    
    var exporting = am5plugins_exporting.Exporting.new(
      root, {
        menu: am5plugins_exporting.ExportingMenu.new(root, { align: 'left', valign: 'top' })
      }
    );
    
    // Create chart
    // https://www.amcharts.com/docs/v5/charts/xy-chart/
    var chart = root.container.children.push(am5xy.XYChart.new(root, {
      panX: false,
      panY: false,
      wheelX: "panX",
      wheelY: "zoomX",
      paddingLeft: 0,
      layout: root.verticalLayout
    }));
    
    
    // Add legend
    // https://www.amcharts.com/docs/v5/charts/xy-chart/legend-xy-series/
    var legend = chart.children.push(am5.Legend.new(root, {
      centerX: am5.p50,
      x: am5.p50
    }))
    
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
    }];;
    
    
    // Create axes
    // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
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
    
    
    // Add series
    // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
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
    
    
    var series2 = chart.series.push(am5xy.LineSeries.new(root, {
      name: "Expenses",
      xAxis: xAxis,
      yAxis: yAxis,
      valueXField: "expenses",
      categoryYField: "year",
      sequencedInterpolation: true,
      tooltip: am5.Tooltip.new(root, {
        pointerOrientation: "horizontal",
        labelText: "[bold]{name}[/]\n{categoryY}: {valueX}"
      })
    }));
    
    series2.strokes.template.setAll({
      strokeWidth: 2,
    });
    
    series2.bullets.push(function () {
      return am5.Bullet.new(root, {
        locationY: 0.5,
        sprite: am5.Circle.new(root, {
          radius: 5,
          stroke: series2.get("stroke"),
          strokeWidth: 2,
          fill: root.interfaceColors.get("background")
        })
      });
    });
    
    
    // Add legend
    // https://www.amcharts.com/docs/v5/charts/xy-chart/legend-xy-series/
    var legend = chart.children.push(am5.Legend.new(root, {
      centerX: am5.p50,
      x: am5.p50
    }));
    
    legend.data.setAll(chart.series.values);
    
    // Add cursor
    // https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
    var cursor = chart.set("cursor", am5xy.XYCursor.new(root, {
      behavior: "zoomY"
    }));
    cursor.lineX.set("visible", false);
    
    series1.data.setAll(data);
    series2.data.setAll(data);
    
    // Make stuff animate on load
    // https://www.amcharts.com/docs/v5/concepts/animations/
    series1.appear();
    series2.appear();
    chart.appear(1000, 100);
    
    });
}

function simpleColumnChart(id) {
  am5.ready(function() {

    // Create root element
    // https://www.amcharts.com/docs/v5/getting-started/#Root_element
    var root = am5.Root.new(id);
    const myTheme = am5.Theme.new(root);

    var exporting = am5plugins_exporting.Exporting.new(
      root, {
        menu: am5plugins_exporting.ExportingMenu.new(root, { align: 'left', valign: 'top' })
      }
    );
    
    myTheme.rule("AxisLabel", ["minor"]).setAll({
      dy:1
    });
    
    // Set themes
    // https://www.amcharts.com/docs/v5/concepts/themes/
    root.setThemes([
      am5themes_Animated.new(root),
      myTheme,
      am5themes_Responsive.new(root)
    ]);
    
    
    // Create chart
    // https://www.amcharts.com/docs/v5/charts/xy-chart/
    var chart = root.container.children.push(am5xy.XYChart.new(root, {
      panX: false,
      panY: false,
      wheelX: "panX",
      wheelY: "zoomX",
      paddingLeft:0
    }));
    
    
    // Add cursor
    // https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
    var cursor = chart.set("cursor", am5xy.XYCursor.new(root, {
      behavior: "zoomX"
    }));
    cursor.lineY.set("visible", false);
    
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
    
    
    // Create axes
    // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
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
    
    
    // Add series
    // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
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
    
    
    // Add scrollbar
    // https://www.amcharts.com/docs/v5/charts/xy-chart/scrollbars/
    chart.set("scrollbarX", am5.Scrollbar.new(root, {
      orientation: "horizontal"
    }));
    
    var data = generateDatas(30);
    series.data.setAll(data);
    
    
    // Make stuff animate on load
    // https://www.amcharts.com/docs/v5/concepts/animations/
    series.appear(1000);
    chart.appear(1000, 100);
    
    });
}

function pieChart(id) {
  am5.ready(function() {

    // Create root element
    // https://www.amcharts.com/docs/v5/getting-started/#Root_element
    var root = am5.Root.new(id);
    
    // Set themes
    // https://www.amcharts.com/docs/v5/concepts/themes/
    root.setThemes([
      am5themes_Animated.new(root)
    ]);

    var exporting = am5plugins_exporting.Exporting.new(
      root, {
        menu: am5plugins_exporting.ExportingMenu.new(root, { align: 'left', valign: 'top' })
      }
    );
    
    // Create chart
    // https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/
    var chart = root.container.children.push(
      am5percent.PieChart.new(root, {
        endAngle: 270
      })
    );
    
    // Create series
    // https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/#Series
    var series = chart.series.push(
      am5percent.PieSeries.new(root, {
        valueField: "value",
        categoryField: "category",
        endAngle: 270
      })
    );
    
    series.states.create("hidden", {
      endAngle: -90
    });
    
    // Set data
    // https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/#Setting_data
    series.data.setAll([{
      category: "Lithuania",
      value: 501.9
    }, {
      category: "Czechia",
      value: 301.9
    }, {
      category: "Ireland",
      value: 201.1
    }, {
      category: "Germany",
      value: 165.8
    }, {
      category: "Australia",
      value: 139.9
    }, {
      category: "Austria",
      value: 128.3
    }, {
      category: "UK",
      value: 99
    }]);
    
    series.appear(1000, 100);
    
    });
}