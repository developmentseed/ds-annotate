import { useEffect, useContext } from "react";
import VectorSource from "ol/source/Vector";
import { GeoJSON } from "ol/format";
import * as turf from "@turf/turf";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";

import { MapContext } from "../../contexts/MapContext";
import { MainContext } from "../../contexts/MainContext";

import {
  vector,
  mainLayer,
  getImageryLayer,
  vectorSegData,
  vectorHighlighted,
  vectorPointSelector,
  encodeMapViews,
} from "./layers";

import { bbox2polygon, getOLFeatures } from "../../utils/convert";

const PADDING = { padding: [100, 100, 100, 100] };

export const ProjectLayer = ({ project, items, highlightedItem }) => {
  const { map } = useContext(MapContext);
  const { pointsSelector, dispatchSetPointsSelector, encodeItems } =
    useContext(MainContext);

  useEffect(() => {
    if (!map) return;
    if (project) {
      const geojsonSource = new VectorSource({
        features: new GeoJSON({ featureProjection: "EPSG:3857" }).readFeatures(
          turf.featureCollection([project])
        ),
      });
      vector.setSource(geojsonSource);
      map.getView().fit(geojsonSource.getExtent(), PADDING);
    }

    return () => {
      if (map) map.getView().fit([0, 0, 0, 0], PADDING);
    };
  }, [map, project]);

  useEffect(() => {
    if (!map) return;
    if (project && project.properties && project.properties.imagery && map) {
      mainLayer.setSource(getImageryLayer(project.properties.imagery));
    }

    return () => {
      if (map) mainLayer.setSource(null);
    };
  }, [map, project]);

  useEffect(() => {
    if (!map) return;
    try {
      if (items.length >= 0) {
        const segDataSource = new VectorSource({
          features: items,
          wrapX: true,
        });
        vectorSegData.setSource(segDataSource);
      }
    } catch (error) {
      console.log(error);
    }
  }, [map, items]);

  useEffect(() => {
    if (!map) return;
    const segDataSource = new VectorSource({
      features: highlightedItem ? [highlightedItem] : [],
      wrapX: true,
    });
    vectorHighlighted.setSource(segDataSource);
  }, [map, highlightedItem]);

  useEffect(() => {
    if (!map) return;
    map.on("moveend", function (e) {
      map.updateSize();
    });
  }, [map]);

  // Add point to send request to SAM
  useEffect(() => {
    if (!map) return;
    map.on("click", function (e) {
      const coordinates = e.coordinate;
      const point = new Feature(new Point(coordinates));
      point.setProperties({
        px: Math.ceil(e.pixel_[0]),
        py: Math.ceil(e.pixel_[1]),
      });
      dispatchSetPointsSelector({
        type: "SET_POINTS_SELECTORS",
        payload: [point],
      });
    });
  }, [pointsSelector]);

  // Display points selector in the map
  useEffect(() => {
    if (!map) return;
    const pointsSelectorDataSource = new VectorSource({
      features: pointsSelector,
      wrapX: true,
    });
    vectorPointSelector.setSource(pointsSelectorDataSource);
  }, [pointsSelector]);

  // Update vector layer to desplay the bbox of the decode images

  useEffect(() => {
    if (!map) return;

    const features = encodeItems.map((ei) => {
      return bbox2polygon(ei.bbox);
    });

    const olFeatures = getOLFeatures(features);
    const dataSource = new VectorSource({
      features: olFeatures,
      wrapX: true,
    });
    encodeMapViews.setSource(dataSource);
  }, [encodeItems]);

  return null;
};
