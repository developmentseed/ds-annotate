import { useContext, useEffect } from "react";
import { Feature } from "ol";
import Polygon from "ol/geom/Polygon";

import { MainContext } from "../../contexts/MainContext";
import { guid } from "./../../utils/utils";
import { features2olFeatures, olFeatures2Features } from "../../utils/convert";
import { storeItems } from "./../../store/indexedDB";

export const MagicWand = ({ event }) => {
  const { map, wand, activeProject, activeClass, items, dispatchSetItems } =
    useContext(MainContext);

  useEffect(() => {
    const drawSelection = async () => {
      if (event && event.type === "keypress" && event.key === "s") {
        let contours = wand.getContours();
        if (!contours) return;
        let rings = contours.map((c) =>
          c.points.map((p) => map.getCoordinateFromPixel([p.x, p.y]))
        );
        if (rings.length === 0) return;
        try {
          const id = guid();
          const oLFeature = new Feature({
            geometry: new Polygon(rings),
            project: activeProject.properties.name,
            class: activeClass.name,
            color: activeClass.color,
            id: id,
          });

          //Simplify features
          const features = olFeatures2Features([oLFeature]);

          //Insert the first items
          const feature = features[0];
          const oLFeatures = features2olFeatures([feature]);

          dispatchSetItems({
            type: "SET_ITEMS",
            payload: [...items, oLFeatures[0]],
          });

          //Insert feature into the DB
          await storeItems.addData({
            ...feature,
            id,
            project: activeProject.properties.name,
          });
          wand.clearMask();
        } catch (error) {
          console.log(error);
        }
      }
    };
    drawSelection();
  }, [event]);

  return null;
};
