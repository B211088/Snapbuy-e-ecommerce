import { useRef, useState } from "react";

const tfjsScript =
  "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@latest/dist/tf.min.js";
const tmImageScript =
  "https://cdn.jsdelivr.net/npm/@teachablemachine/image@latest/dist/teachablemachine-image.min.js";

const MODEL_URL = "https://teachablemachine.withgoogle.com/models/tWBZuCvmo/"; // model bạn đã train

const TeachableMachineComponent = () => {
  const webcamRef = useRef(null);
  const labelContainerRef = useRef(null);
  const imageRef = useRef(null);
  const [model, setModel] = useState(null);
  const [mode, setMode] = useState(null); // 'webcam' hoặc 'upload'
  const [webcamInstance, setWebcamInstance] = useState(null);

  const loadScripts = () => {
    return new Promise((resolve) => {
      const script1 = document.createElement("script");
      script1.src = tfjsScript;
      script1.onload = () => {
        const script2 = document.createElement("script");
        script2.src = tmImageScript;
        script2.onload = resolve;
        document.body.appendChild(script2);
      };
      document.body.appendChild(script1);
    });
  };

  const loadModel = async () => {
    if (!window.tmImage) await loadScripts();
    const modelURL = MODEL_URL + "model.json";
    const metadataURL = MODEL_URL + "metadata.json";
    const loadedModel = await window.tmImage.load(modelURL, metadataURL);
    setModel(loadedModel);
    return loadedModel;
  };

  const startWebcamMode = async () => {
    setMode("webcam");
    const model = await loadModel();
    const webcam = new window.tmImage.Webcam(200, 200, true);
    await webcam.setup();
    await webcam.play();
    webcamRef.current.innerHTML = "";
    webcamRef.current.appendChild(webcam.canvas);
    labelContainerRef.current.innerHTML = "";
    for (let i = 0; i < model.getTotalClasses(); i++) {
      labelContainerRef.current.appendChild(document.createElement("div"));
    }
    setWebcamInstance(webcam);
    loop(webcam, model);
  };

  const loop = async (webcam, model) => {
    webcam.update();
    await predict(webcam.canvas);
    requestAnimationFrame(() => loop(webcam, model));
  };

  const handleUpload = async (event) => {
    setMode("upload");
    const model = await loadModel();
    const file = event.target.files[0];
    if (!file) return;

    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = async () => {
      imageRef.current.innerHTML = "";
      imageRef.current.appendChild(img);
      await predict(img);
    };
  };

  const predict = async (source) => {
    if (!model) return;
    const prediction = await model.predict(source);

    labelContainerRef.current.innerHTML = "";
    prediction.forEach((p) => {
      const label = document.createElement("div");
      label.innerText = `${p.className}: ${(p.probability * 100).toFixed(2)}%`;
      label.className = "text-sm text-gray-700";
      labelContainerRef.current.appendChild(label);
    });
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-md max-w-md mx-auto space-y-4">
      <h1 className="text-xl font-semibold text-center">
        Nhận diện CCCD bằng AI
      </h1>

      <div className="flex justify-center gap-4">
        <button
          onClick={startWebcamMode}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Dùng Webcam
        </button>

        <label className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 cursor-pointer">
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            className="hidden"
          />
          Tải ảnh lên
        </label>
      </div>

      <div className="flex justify-center">
        {mode === "webcam" && <div ref={webcamRef} />}
        {mode === "upload" && <div ref={imageRef} />}
      </div>

      <div ref={labelContainerRef} className="text-center space-y-1" />
    </div>
  );
};

export default TeachableMachineComponent;
