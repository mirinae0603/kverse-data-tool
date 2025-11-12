import { useControls } from "react-zoom-pan-pinch";

export const Controls = () => {
  const { zoomIn, zoomOut, resetTransform } = useControls();

  return (
    <div className="flex items-center justify-center gap-4 p-3">
      <button
        onClick={() => zoomIn()}
        className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 text-lg font-semibold transition"
      >
        +
      </button>
      <button
        onClick={() => zoomOut()}
        className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 text-lg font-semibold transition"
      >
        −
      </button>
      <button
        onClick={() => resetTransform()}
        className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 text-lg font-semibold transition"
      >
        ⨉
      </button>
    </div>
  );
};