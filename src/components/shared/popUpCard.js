import React, { useEffect, useRef } from "react";

const PopUpCard = ({ word, onClose }) => {
  const audioRef = useRef(null);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-4 rounded-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-2">{word.character}</h2>
        <p className="text-lg mb-2">{word.pinyin}</p>
        <p className="mb-2">{word.english}</p>
        <div className="mb-2">
          <button
            onClick={playAudio}
            className="bg-blue-500 text-white px-2 py-1 rounded"
          >
            Play Audio
          </button>
          <audio ref={audioRef} src={`/audio/${word.character}.mp3`} />
        </div>
        <div className="mb-2">
          <h3 className="font-bold">Example Sentences:</h3>
          <ul className="list-disc list-inside">
            {word.exampleSentences &&
              word.exampleSentences.map((sentence, index) => (
                <li key={index}>
                  <p>{sentence.chinese}</p>
                  <p>{sentence.pinyin}</p>
                  <p>{sentence.english}</p>
                </li>
              ))}
          </ul>
        </div>
        <button onClick={onClose} className="bg-gray-300 px-2 py-1 rounded">
          Close
        </button>
      </div>
    </div>
  );
};

export default PopUpCard;
