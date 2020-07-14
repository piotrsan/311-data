
import geojsonExtent from '@mapbox/geojson-extent';
import { circle as turfCircle, mask as turfMask } from '@turf/turf';

function makeCircle(center, radius=1, opts={ units: 'miles' }) {
  return turfCircle([center.lng, center.lat], radius, opts);
}

function makeMask(poly) {
  return turfMask(poly);
}

export default function AddressLayer({ map, onDragEnd, onSetCenter }) {
  let canvas = map.getCanvasContainer();
  let offset;
  let center;

  map.addSource('shed', {
    type: 'geojson',
    data: null
  });

  map.addSource('shed-mask', {
    type: 'geojson',
    data: null
  });

  map.addLayer({
    id: 'shed-border',
    type: 'line',
    source: 'shed',
    layout: {
      visibility: 'visible'
    },
    paint: {
      'line-width': 1.0,
      'line-color': '#FFFFFF',
      // 'line-opacity': [
      //   'interpolate',
      //   ['linear'],
      //   ['zoom'],
      //   10, 1,
      //   13, 0.5
      // ]
    }
  });

  map.addLayer({
    id: 'shed-fill',
    type: 'fill',
    source: 'shed',
    layout: {
      visibility: 'visible'
    },
    paint: {
      'fill-color': 'transparent',
      // 'fill-opacity': 0.2
    }
  });

  map.addLayer({
    id: 'shed-mask-fill',
    type: 'fill',
    source: 'shed-mask',
    layout: {
      visibility: 'visible'
    },
    paint: {
      'fill-color': '#FFFFFF',
      'fill-opacity': [
        'interpolate',
        ['linear'],
        ['zoom'],
        10, 0,
        13, 0.2
      ],
    }
  });

  map.on('mouseenter', 'shed-fill', e => {
    // map.setPaintProperty('shed-fill', 'fill-color', '#FFFFFF');
    canvas.style.cursor = 'move';
  });

  map.on('mouseleave', 'shed-fill', e => {
    // map.setPaintProperty('shed-fill', 'fill-color', 'transparent');
    canvas.style.cursor = '';
  });

  const onMove = e => {
    const { lng, lat } = e.lngLat;
    center = {
      lng: lng - offset.lng,
      lat: lat - offset.lat
    };

    const circle = makeCircle(center);
    map.getSource('shed').setData(circle);
    map.getSource('shed-mask').setData(turfMask(circle));
    canvas.style.cursor = 'grabbing';
  };

  const onUp = e => {
    const { lng, lat } = e.lngLat;
    center = {
      lng: lng - offset.lng,
      lat: lat - offset.lat
    };

    const circle = makeCircle(center);
    map.getSource('shed').setData(circle);
    map.getSource('shed-mask').setData(turfMask(circle));
    onDragEnd({ geo: circle, center });

    map.off('mousemove', onMove);
    map.off('touchmove', onMove);
    canvas.style.cursor = '';
  }

  map.on('mousedown', 'shed-fill', e => {
    e.preventDefault();

    offset = {
      lng: e.lngLat.lng - center.lng,
      lat: e.lngLat.lat - center.lat,
    };

    map.on('mousemove', onMove);
    map.once('mouseup', onUp);
    canvas.style.cursor = 'grab';
  });

  map.on('touchstart', 'shed-fill', e => {
    if (e.points.length !== 1) return;

    e.preventDefault();

    map.on('touchmove', onMove);
    map.once('touchend', onUp);
  });

  return {
    show: () => {
      map.setLayoutProperty('shed-border', 'visibility', 'visible');
      map.setLayoutProperty('shed-fill', 'visibility', 'visible');
      map.setLayoutProperty('shed-mask-fill', 'visibility', 'visible');
    },
    hide: () => {
      map.setLayoutProperty('shed-border', 'visibility', 'none');
      map.setLayoutProperty('shed-fill', 'visibility', 'none');
      map.setLayoutProperty('shed-mask-fill', 'visibility', 'none');

      // NOTE: make empty geojson a constant somewhere and use instead of this
      map.getSource('shed').setData({ type: "FeatureCollection", features: []});
      map.getSource('shed-mask').setData({ type: "FeatureCollection", features: []});
    },
    setCenter: (lngLat, cb) => {
      center = lngLat;

      const circle = makeCircle(center);
      map.getSource('shed').setData(circle);
      map.getSource('shed-mask').setData(turfMask(circle));
      map.fitBounds(geojsonExtent(circle), { padding: 50 });
      map.once('zoomend', () => cb(circle));
    },
    setRadius: miles => {
      console.log('to be implemented');
    }
  };
}
