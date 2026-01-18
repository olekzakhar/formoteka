// components/form-builder/block/MapContainer

import { cn } from '@/utils';
import { MapContainer, TileLayer, Marker, Tooltip, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useEffect, useMemo, useRef } from 'react';
import 'leaflet/dist/leaflet.css';

const defaultCenter = [40.7128, -74.006];

const getPinIcon = () =>
  L.divIcon({
    className: 'formoteka-map-pin',
    html: '<div class="formoteka-map-pin__dot"></div>',
    iconSize: [22, 22],
    iconAnchor: [11, 22],
  });

const MapViewSync = ({ center, zoom }) => {
  const map = useMap();

  useEffect(() => {
    map.setView(center, zoom, { animate: true });
  }, [map, center[0], center[1], zoom]);

  return null;
};

const BlockMapContainer = ({
  block,
  onUpdateBlock,
  isPreview = false,
  onRequestSelect,
}) => {
  const center = useMemo<[number, number]>(() => {
    if (block.mapCenterLat != null && block.mapCenterLng != null) {
      return [block.mapCenterLat, block.mapCenterLng];
    }
    if (block.mapMarkerLat != null && block.mapMarkerLng != null) {
      return [block.mapMarkerLat, block.mapMarkerLng];
    }
    return defaultCenter;
  }, [block.mapCenterLat, block.mapCenterLng, block.mapMarkerLat, block.mapMarkerLng]);

  const zoom = block.mapZoom ?? 14;
  const height = block.mapHeight ?? 320;
  const mapStyle = block.mapStyle ?? 'color';

  const tileUrl = useMemo(() => {
    switch (mapStyle) {
      case 'bw':
        return 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
      case 'satellite':
        return 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      default:
        return 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    }
  }, [mapStyle]);

  const tileAttribution = useMemo(() => {
    switch (mapStyle) {
      case 'bw':
        return '&copy; <a href="https://carto.com/">CARTO</a>';
      case 'satellite':
        return '&copy; <a href="https://www.esri.com/">Esri</a>';
      default:
        return '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';
    }
  }, [mapStyle]);

  const markerPos =
    block.mapMarkerLat != null && block.mapMarkerLng != null
      ? ([block.mapMarkerLat, block.mapMarkerLng])
      : null;

  const pinIcon = useMemo(() => getPinIcon(), []);

  const queuedRef = useRef({});
  const timerRef = useRef(null);
  const queueUpdate = (patch) => {
    if (!onUpdateBlock) return;
    queuedRef.current = { ...queuedRef.current, ...patch };
    if (timerRef.current != null) return;

    timerRef.current = window.setTimeout(() => {
      timerRef.current = null;
      const next = queuedRef.current;
      queuedRef.current = {};
      onUpdateBlock(next);
    }, 150);
  };

  const MapEvents = () => {
    useMapEvents({
      click: (e) => {
        if (isPreview || !onUpdateBlock) return;
        onUpdateBlock({
          mapMarkerLat: e.latlng.lat,
          mapMarkerLng: e.latlng.lng,
          mapCenterLat: e.latlng.lat,
          mapCenterLng: e.latlng.lng,
        });
      },
      moveend: (e) => {
        if (isPreview) return;
        const map = e.target;
        const c = map.getCenter();
        queueUpdate({ mapCenterLat: c.lat, mapCenterLng: c.lng });
      },
      zoomend: (e) => {
        if (isPreview) return;
        const map = e.target;
        queueUpdate({ mapZoom: map.getZoom() });
      },
    });
    return null;
  };

  return (
    <figure
      className="w-full overflow-hidden rounded-xl border border-border bg-muted/30"
      onMouseDown={(e) => {
        onRequestSelect?.();
        e.stopPropagation();
      }}
      onClick={(e) => {
        onRequestSelect?.();
        e.stopPropagation();
      }}
    >
      <div style={{ height }} className="w-full">
        <MapContainer center={center} zoom={zoom} className="h-full w-full relative z-0" scrollWheelZoom>
          <TileLayer
            attribution={tileAttribution}
            url={tileUrl}
          />

          <MapViewSync center={center} zoom={zoom} />

          <MapEvents />

          {markerPos && (
            <Marker
              position={markerPos}
              icon={pinIcon}
              draggable={!isPreview}
              eventHandlers={{
                dragend: (ev) => {
                  if (isPreview || !onUpdateBlock) return;
                  const m = ev.target;
                  const p = m.getLatLng();
                  onUpdateBlock({
                    mapMarkerLat: p.lat,
                    mapMarkerLng: p.lng,
                    mapCenterLat: p.lat,
                    mapCenterLng: p.lng,
                  });
                },
              }}
            >
              {block.mapMarkerLabel ? (
                <Tooltip
                  permanent
                  direction="top"
                  offset={[0, -22]}
                  opacity={1}
                  className={cn('form-map-label')}
                >
                  {block.mapMarkerLabel}
                </Tooltip>
              ) : null}
            </Marker>
          )}
        </MapContainer>
      </div>

      {!isPreview ? (
        <figcaption className="px-3 py-2 text-xs text-muted-foreground border-t border-border/60">
          Click to drop a pin. Drag the pin to adjust. Pan/zoom is saved automatically.
        </figcaption>
      ) : null}
    </figure>
  );
};

export default BlockMapContainer