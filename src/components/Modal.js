import React from "react";
import { useState } from "react";

export const Modal = () => {
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
                  <p className="my-4 text-slate-500 text-md leading-relaxed">
                    The DS-Annotate tool empowers users to draw intricate
                    polygons over tiles using the{" "}
                    <a
                      className="text-red-500"
                      href="https://github.com/facebookresearch/segment-anything"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {`SegmentAnything Model (SAM) `}
                    </a>
                    and the{" "}
                    <a
                      className="text-red-500"
                      href="https://github.com/Tamersoul/ol-magic-wand"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {` Magic Wand `}
                    </a>{" "}
                    functionality. This tool simplifies the process of creating
                    complex polygons on maps, making it an essential asset for
                    detailed annotation.
                  </p>
                  <p className="my-4 text-slate-500 text-md leading-relaxed">
                    To get started with DS-Annotate, follow these steps:
                  </p>
                  <ul className="list-disc list-inside space-y-2">
                    <li className="text-md text-slate-500 leading-relaxed">
                      Select the desired project and class from the sidebar
                      menu.
                    </li>
                    <li className="text-md text-slate-500 leading-relaxed">
                      Wait for all tiles to load in the window view.
                    </li>
                  </ul>

                  <p className="my-4 text-slate-500 text-md leading-relaxed">
                    Once your workspace is set up, you can begin annotating in
                    two ways:
                  </p>

                  <ul className="list-disc list-inside space-y-2">
                    <li className="text-md text-slate-500 leading-relaxed">
                      <span className="text-red-500">Magic Wand</span>:
                      Right-click on the area you want to select. After making
                      your selection, press the 's' key to draw your polygon.
                    </li>
                    <li className="text-md text-slate-500 leading-relaxed">
                      <span className="text-red-500">
                        SegmentAnything Model
                      </span>{" "}
                      : Click on the area you wish to map. After this, press the
                      'Segment Anything' button to activate the model and start
                      drawing your polygon.
                    </li>
                  </ul>

                  <p className="my-4 text-slate-500 text-md leading-relaxed">
                    Both of these tools offer precise and efficient mapping,
                    enhancing the overall annotation experience.
                  </p>

                  <p className="my-4 text-slate-500 text-md leading-relaxed">
                    The DS-Annotate tool provides the ability to export drawn
                    polygons in both GeoJSON and in Java OpenStreetMap Editor.
                  </p>

                  <p className="my-4 text-slate-500 text-md leading-relaxed">
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
};
