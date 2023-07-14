import React, { useContext } from "react";
import { MainContext } from "./../contexts/MainContext";
import { BsXLg } from "react-icons/bs";

export const Modal = () => {
  const { displayModal, setDisplayModal } = useContext(MainContext);

  const modalStatus = (value) => {
    localStorage.setItem("modalDisplay", value);
    setDisplayModal(value);
  };

  if (displayModal === "block") {
    return (
      <div>
        <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none text-slate-600">
          <div className="relative w-auto my-6 mx-auto max-w-3xl">
            {/*content*/}
            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
              {/*header*/}
              <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                <h3 className="text-3xl font-semibold">DS Annotate Tool</h3>

                <BsXLg
                  className="p-1 cursor-pointer ml-auto border-0 text-black-900 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                  onClick={() => modalStatus("none")}
                />
              </div>
              {/*body*/}
              <div className="relative p-6 flex-auto">
                <p className="my-4 text-md">
                  DS-Annotate empowers users to draw intricate polygons over
                  aerial imagery using the{" "}
                  <a
                    className="text-red-500"
                    href="https://github.com/facebookresearch/segment-anything"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {`Segment Anything Model (SAM)`}
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
                  functionality. DS-Annotate simplifies the process of creating
                  complex polygons on maps, making it an essential asset for
                  detailed annotation.
                </p>
                <p className="my-4 text-md">
                  To get started, follow these steps:
                </p>
                <ul className="list-disc list-inside space-y-2">
                  <li className="text-md">
                    Select the desired project and class from the sidebar menu.
                  </li>
                  <li className="text-md">
                    Wait until all imagery tiles are loaded in the map.
                  </li>
                </ul>

                <p className="my-4 text-md">
                  Once your workspace is set up, you can begin annotating in two
                  ways:
                </p>

                <ul className="list-disc list-inside space-y-2">
                  <li className="text-md ">
                    <span className="font-bold">Magic Wand</span>: Right-click
                    on the area you want to select. You can click and drag your
                    mouse up/down to adjust the thresold. After making your
                    selection, press the{" "}
                    <b>
                      <code>s</code>
                    </b>{" "}
                    key to store the polygon.
                  </li>
                  <li className="text-md">
                    <span className="font-bold">Segment Anything Model</span>:
                    Click on the element in the imagery you want to get mapped.
                    Then, press the <b>Segment Anything</b> button to activate
                    the model and start getting the polygons. If you want more
                    elements mapped, just click on them.
                  </li>
                </ul>

                <p className="my-4 text-md">
                  Both ways offer precise and efficient mapping, enhancing the
                  overall annotation experience.
                </p>

                <p className="my-4 text-md">
                  You can then download the polygons in GeoJSON format or export
                  it to the Java OpenStreetMap Editor (JOSM).
                </p>

                <p className="my-4 text-md">
                  <a
                    className="text-red-500"
                    href="https://github.com/developmentseed/ds-annotate/issues"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Give us some feedback
                  </a>
                  .
                </p>
              </div>
              <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                <button
                  className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
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
      </div>
    );
  }
  return false;
};
