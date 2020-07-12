import React from 'react';
import PropTypes from 'proptypes';
import * as turf from '@turf/turf';
import { VegaLite } from 'react-vega';
import { REQUEST_TYPES } from '@components/common/CONSTANTS';

class MapCharts extends React.PureComponent {
  render() {
    const { filterPolygon, requests, selectedTypes } = this.props;

    const filteredRequests = filterPolygon
      ? turf.within(requests, filterPolygon)
      : requests;

    const counts = {};
    filteredRequests.features.forEach(feature => {
      const { type } = feature.properties;
      counts[type] = (counts[type] || 0) + 1;
    });

    const table = [];
    Object.keys(REQUEST_TYPES).forEach(type => {
      if (selectedTypes.includes(type))
        table.push({
          requestType: REQUEST_TYPES[type]?.abbrev,
          count: counts[type] || 0,
          color: REQUEST_TYPES[type]?.color
        });
    });

    const spec = {
      width: 210,
      height: 200,
      mark: 'bar',
      background: 'transparent',
      config: {
        axis: {
          tickColor: 'red',
          labelColor: 'white',
          titleColor: 'white',
        }
      },
      encoding: {
        y: {
          field: 'requestType',
          type: 'nominal',
          marks: {
            color: 'white',
            style: {
              color: 'white'
            }
          },
          axis: {
            title: 'request type',
            color: 'white',
            style: {
              color: 'white'
            }
          }
        },
        x: {
          field: 'count',
          type: 'quantitative',
          start: 0,
          axis: {
            title: 'count'
          }
        },
        color: {
          field: 'color',
          type: 'nominal',
          scale: null
        }
      },
      data: { name: 'table' },
    }

    const barData = { table: table };

    return (
      <div className="map-charts map-control">
        <VegaLite spec={spec} data={barData} />
      </div>
    );
  }
}

MapCharts.propTypes = {
  requests: PropTypes.shape({}).isRequired,
  filterPolygon: PropTypes.shape({}),
  selectedTypes: PropTypes.arrayOf(PropTypes.string)
};

MapCharts.defaultProps = {
  filterPolygon: null,
  selectedTypes: []
};

export default MapCharts;
