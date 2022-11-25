import React from "react";
import { useState } from "react";

export function Modal() {
  const [displayModal, setDisplayModal] = useState(() => {
    const saved = localStorage.getItem("modalDisplay");
    if (!saved) return "block";
    return "none";
  });

  const modalStatus = (value) => {
    localStorage.setItem("modalDisplay", value);
    setDisplayModal(value);
  };

  return (
    <div>
      {displayModal === "block" ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                  <h3 className="text-3xl font-semibold">DS Annotate Tool</h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => modalStatus("none")}
                  >
                    <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                      ×
                    </span>
                  </button>
                </div>
                {/*body*/}
                <div className="relative p-6 flex-auto">
                  <p className="my-4 text-slate-500 text-lg leading-relaxed">
                    DS-annotate tool is used to draw polygons using{" "}
                    <a
                      className="text-red-500"
                      href="https://github.com/Tamersoul/ol-magic-wand"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {`Magic Wand `}
                    </a>
                    functionality over tiles. It allows to easily draw any
                    complex polygons on the map. For using DS-Annotate tool
                    select the project and the class in the sidebar menu, and
                    wait until all tiles loaded in the window view and then
                    right click on the field that you want to select, once you
                    have your selection push key "s" it will draw the polygon.
                  </p>
                  <p className="my-4 text-slate-500 text-lg leading-relaxed">
                    DS-annotate tool Allows to download the drawn polygon in a
                    Geojson file and in JOSM file.
                  </p>

                  <p className="my-4 text-slate-500 text-lg leading-relaxed">
                    <a
                      className="text-red-500"
                      href="https://github.com/developmentseed/ds-annotate/issues"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {`Give us feedbacks.`}
                    </a>
                  </p>
                </div>
                <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                  <button
                    className="text-red-600 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => modalStatus("none")}
                  >
                    Start playing
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-50 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </div>
  );
}
