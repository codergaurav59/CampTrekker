'use client';

import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface MapBoxProps {
  campgrounds?: Array<{
    _id: string;
    title: string;
    description: string;
    geometry: {
      coordinates: [number, number];
    };
    properties?: {
      popupText: string;
    };
  }>;
  center?: [number, number];
  zoom?: number;
  height?: string;
  showMarker?: boolean;
}

export default function MapBox({
  campgrounds,
  center = [-103.5917, 40.6699],
  zoom = 3,
  height = '400px',
  showMarker = false,
}: MapBoxProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: center,
      zoom: zoom,
    });

    map.current.addControl(new mapboxgl.NavigationControl());

    // Add single marker if showMarker is true
    if (showMarker) {
      new mapboxgl.Marker()
        .setLngLat(center)
        .addTo(map.current);
    }

    // Add cluster map for multiple campgrounds
    if (campgrounds && campgrounds.length > 0) {
      map.current.on('load', () => {
        const geojsonData = {
          type: 'FeatureCollection' as const,
          features: campgrounds.map(camp => ({
            type: 'Feature' as const,
            geometry: camp.geometry,
            properties: {
              popupText: `<strong><a href='/campgrounds/${camp._id}'>${camp.title}</a></strong>
              <p>${camp.description.substring(0, 20)}...</p>`,
            },
          })),
        };

        map.current!.addSource('campgrounds', {
          type: 'geojson',
          data: geojsonData,
          cluster: true,
          clusterMaxZoom: 14,
          clusterRadius: 50,
        });

        // Clusters
        map.current!.addLayer({
          id: 'clusters',
          type: 'circle',
          source: 'campgrounds',
          filter: ['has', 'point_count'],
          paint: {
            'circle-color': [
              'step',
              ['get', 'point_count'],
              '#51bbd6',
              100,
              '#f1f075',
              750,
              '#f28cb1'
            ],
            'circle-radius': [
              'step',
              ['get', 'point_count'],
              20,
              100,
              30,
              750,
              40
            ]
          }
        });

        // Cluster count
        map.current!.addLayer({
          id: 'cluster-count',
          type: 'symbol',
          source: 'campgrounds',
          filter: ['has', 'point_count'],
          layout: {
            'text-field': ['get', 'point_count_abbreviated'],
            'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
            'text-size': 12
          }
        });

        // Unclustered points
        map.current!.addLayer({
          id: 'unclustered-point',
          type: 'circle',
          source: 'campgrounds',
          filter: ['!', ['has', 'point_count']],
          paint: {
            'circle-color': '#11b4da',
            'circle-radius': 4,
            'circle-stroke-width': 1,
            'circle-stroke-color': '#fff'
          }
        });

        // Click events
        map.current!.on('click', 'clusters', (e) => {
          const features = map.current!.queryRenderedFeatures(e.point, {
            layers: ['clusters']
          });
          const clusterId = features[0].properties!.cluster_id;
          (map.current!.getSource('campgrounds') as mapboxgl.GeoJSONSource).getClusterExpansionZoom(
            clusterId,
            (err, zoom) => {
              if (err) return;
              map.current!.easeTo({
                center: (features[0].geometry as any).coordinates,
                zoom: zoom
              });
            }
          );
        });

        map.current!.on('click', 'unclustered-point', (e) => {
          const coordinates = (e.features![0].geometry as any).coordinates.slice();
          const text = e.features![0].properties!.popupText;

          while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
          }

          new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML(text)
            .addTo(map.current!);
        });

        map.current!.on('mouseenter', 'clusters', () => {
          map.current!.getCanvas().style.cursor = 'pointer';
        });
        map.current!.on('mouseleave', 'clusters', () => {
          map.current!.getCanvas().style.cursor = '';
        });
      });
    }

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [campgrounds, center, zoom, showMarker]);

  return <div ref={mapContainer} style={{ height }} className="w-full rounded-lg" />;
}