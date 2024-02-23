function buildMapChart(id, dataset) {
  am5.ready(() => {
    const root = am5.Root.new(id);
    const exportingMenuOptions = { align: 'left', valign: 'top' };
    const exportingMenu = am5plugins_exporting.ExportingMenu.new(root, exportingMenuOptions);
    am5plugins_exporting.Exporting.new(root, { menu: exportingMenu });

    root.setThemes([am5themes_Animated.new(root)]);
    root.locale = am5locales_pt_BR;
    
    const chart = root.container.children.push(
      am5map.MapChart.new(
        root,
        {
          panX: 'rotateX',
          projection: am5map.geoMercator(),
          layout: root.horizontalLayout
        }
      )
    );

    const polygonSeries = chart.series.push(
      am5map.MapPolygonSeries.new(root, { calculateAggregates: true, valueField: 'value' })
    );
    
    polygonSeries.mapPolygons.template.setAll({ tooltipText: '{name}: {value}', interactive: true });
    polygonSeries.set('heatRules', [{
      target: polygonSeries.mapPolygons.template,
      dataField: 'value',
      min: am5.color(0x8ab7ff),
      max: am5.color(0x25529a),
      key: 'fill'
    }]);
    
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
    root.locale = am5locales_pt_BR;
    
    const chart = root.container.children.push(
      am5xy.XYChart.new(root, { layout: root.verticalLayout })
    );

    const cursor = chart.set('cursor', am5xy.XYCursor.new(root, {}));
    cursor.lineX.set('visible', false);
    cursor.lineY.set('visible', false);

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
          minGridDistance: 70
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
        labelText: '{valueX}'
      })
    }));
    
    series1.columns.template.setAll({ height: am5.percent(70) });
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
    root.locale = am5locales_pt_BR;
    
    const chart = root.container.children.push(am5xy.XYChart.new(root, {}));
    
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
    
    const xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(
        root,
        {
          maxDeviation: 0.3,
          categoryField: 'label',
          renderer: xRenderer,
          tooltip: am5.Tooltip.new(root, {})
        }
      )
    );
    
    const yRenderer = am5xy.AxisRendererY.new(root, { strokeOpacity: 0.1 });
    const yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, { maxDeviation: 0.3, renderer: yRenderer }));
    
    const series = chart.series.push(am5xy.ColumnSeries.new(root, {
      xAxis: xAxis,
      yAxis: yAxis,
      valueYField: 'value',
      sequencedInterpolation: true,
      categoryXField: 'label',
      tooltip: am5.Tooltip.new(root, { labelText: '{valueY}' })
    }));
    
    series.columns.template.setAll({ cornerRadiusTL: 5, cornerRadiusTR: 5, strokeOpacity: 0 });
    series.columns.template.adapters.add('fill', function (fill, target) {
      return chart.get('colors').getIndex(series.columns.indexOf(target));
    });
    
    series.columns.template.adapters.add('stroke', function (stroke, target) {
      return chart.get('colors').getIndex(series.columns.indexOf(target));
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

    root.setThemes([
      am5themes_Animated.new(root),
      am5themes_Responsive.new(root)
    ]);
    root.locale = am5locales_pt_BR;
    
    const chart = root.container.children.push(
      am5percent.PieChart.new(root, { layout: root.horizontalLayout })
    );
    
    const series = chart.series.push(am5percent.PieSeries.new(root, {
      valueField: 'value',
      categoryField: 'label',
      legendValueText: '{value}'
    }));
    series.labels.template.set('forceHidden', true);
    series.ticks.template.set('forceHidden', true);
    series.data.setAll(dataset);
    
    const legend = chart.children.push(am5.Legend.new(root, {
      centerY: am5.percent(50),
      y: am5.percent(50),
      layout: root.verticalLayout
    }));
    legend.labels.template.setAll({ oversizedBehavior: 'truncate' });
    legend.valueLabels.template.setAll({ width: 50, textAlign: 'right' });
    legend.data.setAll(series.dataItems);

    chart.onPrivate(
      'width',
      (width) => {
        const availableSpace = Math.max(width - chart.height() - 80, 80);
        legend.labels.template.setAll({
          fontSize: 14,
          width: availableSpace,
          maxWidth: availableSpace
        });
      }
    );

    series.appear(1000, 100);
  });
}
