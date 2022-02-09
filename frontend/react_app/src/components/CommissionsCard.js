import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import '../index.css'
import { Row, Col, Button } from "react-bootstrap";
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts/core';
import {
    // LineChart,
    BarChart,
    // PieChart,
    // ScatterChart,
    // RadarChart,
    // MapChart,
    // TreeChart,
    // TreemapChart,
    // GraphChart,
    // GaugeChart,
    // FunnelChart,
    // ParallelChart,
    // SankeyChart,
    // BoxplotChart,
    // CandlestickChart,
    // EffectScatterChart,
    // LinesChart,
    // HeatmapChart,
    // PictorialBarChart,
    // ThemeRiverChart,
    // SunburstChart,
    // CustomChart,
  } from 'echarts/charts';
import {
    // GridSimpleComponent,
    GridComponent,
    // PolarComponent,
    // RadarComponent,
    // GeoComponent,
    // SingleAxisComponent,
    // ParallelComponent,
    // CalendarComponent,
    // GraphicComponent,
    // ToolboxComponent,
    TooltipComponent,
    // AxisPointerComponent,
    // BrushComponent,
    TitleComponent,
    // TimelineComponent,
    // MarkPointComponent,
    // MarkLineComponent,
    // MarkAreaComponent,
    // LegendComponent,
    // LegendScrollComponent,
    // LegendPlainComponent,
    // DataZoomComponent,
    // DataZoomInsideComponent,
    // DataZoomSliderComponent,
    // VisualMapComponent,
    // VisualMapContinuousComponent,
    // VisualMapPiecewiseComponent,
    // AriaComponent,
    // TransformComponent,
    DatasetComponent,
} from 'echarts/components';
// Import renderer, note that introducing the CanvasRenderer or SVGRenderer is a required step
import {
    CanvasRenderer,
    // SVGRenderer,
} from 'echarts/renderers';


const CommissionsCard = (props) => {

    echarts.use(
        [TitleComponent, TooltipComponent, GridComponent, BarChart, CanvasRenderer]
    );

    const commissionData = props.commissionData;

    return (
        <Row style={{ margin: '0px 0px 0px 0px', padding: '0px' }}>
            <Col style={{ margin: '0px', padding: '0px' }} xl={12} lg={12} md={12} sm={12} xs={12}>
                <ReactECharts
                    echarts={echarts}
                    option={commissionData}
                    notMerge={true}
                    lazyUpdate={true}
                />
            </Col>
        </Row>
    );
    }

export default withRouter(CommissionsCard);
