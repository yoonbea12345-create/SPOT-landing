/* eslint-disable @typescript-eslint/no-explicit-any */
declare namespace kakao {
  namespace maps {
    class Map {
      constructor(container: HTMLElement, options: MapOptions);
      setCenter(latlng: LatLng): void;
      getCenter(): LatLng;
      setZoom(level: number): void;
      getZoom(): number;
      setLevel(level: number, options?: { animate?: boolean; anchor?: LatLng }): void;
      getLevel(): number;
      panTo(latlng: LatLng): void;
      addControl(control: any, position: ControlPosition): void;
      removeControl(control: any): void;
      setDraggable(draggable: boolean): void;
      setZoomable(zoomable: boolean): void;
      getBounds(): LatLngBounds;
      getProjection(): MapProjection;
      relayout(): void;
    }
    interface MapOptions {
      center: LatLng;
      level: number;
      mapTypeId?: MapTypeId;
      draggable?: boolean;
      scrollwheel?: boolean;
      disableDoubleClickZoom?: boolean;
      projectionId?: string;
      tileAnimation?: boolean;
    }
    class LatLng {
      constructor(lat: number, lng: number);
      getLat(): number;
      getLng(): number;
    }
    class LatLngBounds {
      constructor(sw?: LatLng, ne?: LatLng);
      extend(latlng: LatLng): void;
      getSouthWest(): LatLng;
      getNorthEast(): LatLng;
      contain(latlng: LatLng): boolean;
    }
    class Marker {
      constructor(options: MarkerOptions);
      setMap(map: Map | null): void;
      getMap(): Map | null;
      setPosition(latlng: LatLng): void;
      getPosition(): LatLng;
      setImage(image: MarkerImage): void;
      setTitle(title: string): void;
      setDraggable(draggable: boolean): void;
      setClickable(clickable: boolean): void;
      setZIndex(zIndex: number): void;
      setOpacity(opacity: number): void;
      getTitle(): string;
    }
    interface MarkerOptions {
      map?: Map;
      position: LatLng;
      image?: MarkerImage;
      title?: string;
      draggable?: boolean;
      clickable?: boolean;
      zIndex?: number;
      opacity?: number;
    }
    class MarkerImage {
      constructor(src: string, size: Size, options?: MarkerImageOptions);
    }
    interface MarkerImageOptions {
      alt?: string;
      coords?: string;
      offset?: Point;
      shape?: string;
      spriteOrigin?: Point;
      spriteSize?: Size;
    }
    class CustomOverlay {
      constructor(options: CustomOverlayOptions);
      setMap(map: Map | null): void;
      getMap(): Map | null;
      setPosition(latlng: LatLng): void;
      getPosition(): LatLng;
      setContent(content: string | HTMLElement): void;
      getContent(): string | HTMLElement;
      setVisible(visible: boolean): void;
      getVisible(): boolean;
      setZIndex(zIndex: number): void;
      getZIndex(): number;
      setAltitude(altitude: number): void;
      getAltitude(): number;
      setRange(range: number): void;
      getRange(): number;
    }
    interface CustomOverlayOptions {
      map?: Map;
      position: LatLng;
      content: string | HTMLElement;
      xAnchor?: number;
      yAnchor?: number;
      zIndex?: number;
      clickable?: boolean;
      altitude?: number;
      range?: number;
    }
    class Size {
      constructor(width: number, height: number);
    }
    class Point {
      constructor(x: number, y: number);
    }
    class InfoWindow {
      constructor(options: InfoWindowOptions);
      open(map: Map, marker?: Marker): void;
      close(): void;
      getMap(): Map | null;
      setPosition(latlng: LatLng): void;
      getPosition(): LatLng;
      setContent(content: string | HTMLElement): void;
      getContent(): string | HTMLElement;
      setZIndex(zIndex: number): void;
      getZIndex(): number;
      setAltitude(altitude: number): void;
      getAltitude(): number;
      setRange(range: number): void;
      getRange(): number;
    }
    interface InfoWindowOptions {
      map?: Map;
      position?: LatLng;
      content: string | HTMLElement;
      removable?: boolean;
      zIndex?: number;
      altitude?: number;
      range?: number;
    }
    class Polyline {
      constructor(options: PolylineOptions);
      setMap(map: Map | null): void;
      setPath(path: LatLng[]): void;
      getPath(): LatLng[];
      setOptions(options: PolylineOptions): void;
      getLength(): number;
    }
    interface PolylineOptions {
      map?: Map;
      path: LatLng[];
      strokeWeight?: number;
      strokeColor?: string;
      strokeOpacity?: number;
      strokeStyle?: string;
    }
    class Circle {
      constructor(options: CircleOptions);
      setMap(map: Map | null): void;
      setPosition(latlng: LatLng): void;
      getPosition(): LatLng;
      setRadius(radius: number): void;
      getRadius(): number;
    }
    interface CircleOptions {
      map?: Map;
      center: LatLng;
      radius: number;
      strokeWeight?: number;
      strokeColor?: string;
      strokeOpacity?: number;
      strokeStyle?: string;
      fillColor?: string;
      fillOpacity?: number;
    }
    interface MapProjection {
      pointFromCoords(latlng: LatLng): Point;
      coordsFromPoint(point: Point): LatLng;
      containerPointFromCoords(latlng: LatLng): Point;
      coordsFromContainerPoint(point: Point): LatLng;
    }
    enum MapTypeId {
      ROADMAP = 1,
      SKYVIEW = 2,
      HYBRID = 3,
      OVERLAY = 4,
      ROADVIEW = 5,
      TRAFFIC = 6,
      TERRAIN = 7,
      BICYCLE = 8,
      BICYCLE_HYBRID = 9,
      USE_DISTRICT = 10,
    }
    enum ControlPosition {
      TOP = 0,
      TOPLEFT = 1,
      TOPRIGHT = 2,
      LEFT = 3,
      RIGHT = 4,
      BOTTOMLEFT = 5,
      BOTTOM = 6,
      BOTTOMRIGHT = 7,
    }
    namespace event {
      function addListener(target: any, type: string, handler: (...args: any[]) => void): void;
      function removeListener(target: any, type: string, handler: (...args: any[]) => void): void;
      function trigger(target: any, type: string, data?: any): void;
    }
    namespace services {
      class Geocoder {
        addressSearch(address: string, callback: (result: any[], status: Status) => void): void;
        coord2Address(lng: number, lat: number, callback: (result: any[], status: Status) => void): void;
        coord2RegionCode(lng: number, lat: number, callback: (result: any[], status: Status) => void): void;
      }
      class Places {
        constructor(map?: Map);
        keywordSearch(keyword: string, callback: (result: any[], status: Status, pagination: any) => void, options?: any): void;
        categorySearch(code: string, callback: (result: any[], status: Status, pagination: any) => void, options?: any): void;
        setMap(map: Map | null): void;
      }
      enum Status {
        OK = 'OK',
        ZERO_RESULT = 'ZERO_RESULT',
        ERROR = 'ERROR',
      }
      enum SortBy {
        ACCURACY = 'accuracy',
        DISTANCE = 'distance',
      }
    }
  }
}
