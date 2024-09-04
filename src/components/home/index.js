import React, { useState, useEffect, useRef } from "react";
import { sentenceGroups } from "../../vocabularyData";
import Button from "../shared/customButton";
import PopUpCard from "../shared/popUpCard";
import HowToStudyModal from "./howToStudyModal";
import axios from "../../utils/axiosConfig";
import { putWord } from "../functions/wordsFunctions";
const Home = () => {
  const [currentMode, setCurrentMode] = useState("vocabulary");
  const [knownWords, setKnownWords] = useState({});
  const [selectedWord, setSelectedWord] = useState(null);
  const [currentDay, setCurrentDay] = useState(1);
  const [focusedWordId, setFocusedWordId] = useState(null);
  const [showHowToStudy, setShowHowToStudy] = useState(false);
  const [groups, setGroups] = useState([]);
  const [translatedSentences, setTranslatedSentences] = useState([]);
  const audioRef = useRef(null);

  useEffect(() => {
    const savedStates = localStorage.getItem("knownWords");
    if (savedStates) {
      setKnownWords(JSON.parse(savedStates));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("knownWords", JSON.stringify(knownWords));
  }, [knownWords]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [focusedWordId, currentMode]);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await axios.get("api/groups"); // Adjust URL as needed
        setGroups(response.data); // Set the fetched groups in state
        const words = response.data.flatMap((group) => group.words);
        const knownWordsMap = words.reduce((acc, word) => {
          acc[word._id] = word.isKnown; // Map word ID to its isKnown status
          return acc;
        }, {});
        console.log(knownWordsMap);
        setKnownWords(knownWordsMap);
      } catch (error) {
        console.error("Error fetching groups:", error);
      }
    };

    fetchGroups();
  }, []);
  const fetchTranslatedSentences = async () => {
    try {
      const response = await axios.get("api/translate"); // Adjust URL as needed
      setTranslatedSentences(response.data); // Set the fetched groups in state
    } catch (error) {
      console.error("Error fetching sentence:", error);
    }
  };
  useEffect(() => {
    fetchTranslatedSentences();
  }, []);
  console.log(groups);
  console.log(knownWords);
  const playAudio = (character) => {
    if (audioRef.current) {
      audioRef.current.src = `/audio/${character}.mp3`;
      audioRef.current.play();
    }
  };

  const handleKeyPress = async (e) => {
    if (!focusedWordId) return;
    console.log(focusedWordId);

    // Flatten the groups to get all words and find the word by focusedWordId
    const allWords = groups.flatMap((group) => group.words); // Assuming words are nested in groups
    const word = allWords.find((word) => word._id === focusedWordId);
    if (!word) {
      console.error("Word not found");
      return;
    }

    console.log(word);
    switch (e.key.toLowerCase()) {
      case "g":
        await putWord(word._id, { isKnown: "known" });
        setKnownWords((prev) => ({ ...prev, [focusedWordId]: "known" }));
        break;
      case "r":
        await putWord(word._id, { isKnown: "unknown" });

        setKnownWords((prev) => ({ ...prev, [focusedWordId]: "unknown" }));
        break;
      case "d":
        // await putWord(word._id, { isKnown: "unknown" });

        setSelectedWord((prev) => (prev ? null : word));
        break;
      case "s":
        playAudio(word.character);
        break;
      default:
        return;
    }
  };

  const handleWordClick = (word, wordId) => {
    if (focusedWordId === wordId) {
      setSelectedWord(word);
    } else {
      setFocusedWordId(wordId);
      setSelectedWord(null);
    }
  };

  const resetEverything = () => {
    setKnownWords({});
    localStorage.removeItem("knownWords");
  };

  const resetCurrentDay = () => {
    const updatedKnownWords = { ...knownWords };
    Object.keys(updatedKnownWords).forEach((key) => {
      if (key.startsWith(`${currentDay}-`)) {
        delete updatedKnownWords[key];
      }
    });
    setKnownWords(updatedKnownWords);
  };
  const handleSentenceSubmit = async (e) => {
    e.preventDefault();
    const sentence = e.target.sentence.value;

    try {
      const response = await axios.post("/api/translate", { sentence });
      console.log(response.data);
      await fetchTranslatedSentences();
    } catch (error) {
      console.error("Error submitting sentence:", error);

      // Optional: Show an error message to the user
      if (error.response) {
        console.error("Server responded with an error:", error.response.data);
      } else if (error.request) {
        console.error("No response received:", error.request);
      } else {
        console.error("Error setting up request:", error.message);
      }
    }
  };

  return (
    <div className="p-4 max-w-7xl mx-auto text-base">
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-2">
          <Button
            className={`${
              currentMode === "vocabulary"
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
            }`}
            onClick={() => setCurrentMode("vocabulary")}
          >
            Chinese List 1
          </Button>
          <Button
            className={`${
              currentMode === "sentences"
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
            }`}
            onClick={() => setCurrentMode("sentences")}
          >
            Practice Sentences
          </Button>
          <Button
            className="bg-green-500 text-white"
            onClick={() => setShowHowToStudy(true)}
          >
            How to Study
          </Button>
        </div>
        <div className="flex space-x-2">
          <Button
            className="bg-yellow-500 text-white"
            onClick={resetCurrentDay}
          >
            Clear Current Day
          </Button>
          <Button className="bg-red-500 text-white" onClick={resetEverything}>
            Reset All Progress
          </Button>
        </div>
      </div>

      <div className="mb-6">
        <p className="text-center mb-2">Day {currentDay} of 30</p>
        <input
          type="range"
          min="1"
          max="30"
          value={currentDay}
          onChange={(e) => setCurrentDay(parseInt(e.target.value))}
          className="w-full"
        />
      </div>

      <div className="grid grid-cols-6 gap-4">
        {(currentMode === "vocabulary" ? groups : sentenceGroups)
          .slice(0, currentDay)
          .map((group, groupIndex) => (
            <div key={groupIndex} className="break-inside-avoid">
              <h3 className="font-bold mb-2 text-lg">{group.name}</h3>
              {group.words.map((word, wordIndex) => {
                const wordId = word._id;
                const isSelected = focusedWordId === wordId;
                return (
                  <div
                    key={wordIndex}
                    className={`p-2 mb-1 cursor-pointer ${
                      isSelected ? "outline outline-2 outline-blue-500 " : ""
                    }${
                      knownWords[wordId] === "known"
                        ? "bg-green-200"
                        : knownWords[wordId] === "unknown"
                        ? "bg-red-200"
                        : ""
                    }`}
                    onClick={() => handleWordClick(word, wordId)}
                    tabIndex={0}
                  >
                    <div className="font-normal">
                      {currentMode === "vocabulary"
                        ? `${word.character} (${word.pinyin})`
                        : word.chinese}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
      </div>

      {selectedWord && (
        <PopUpCard word={selectedWord} onClose={() => setSelectedWord(null)} />
      )}

      {showHowToStudy && (
        <HowToStudyModal onClose={() => setShowHowToStudy(false)} />
      )}

      <audio ref={audioRef} />

      <div className="mt-6 text-center text-sm text-gray-600">
        <p>Click on a word once to focus it (blue outline).</p>

        <form onSubmit={handleSentenceSubmit}>
          <label>
            Enter a Sentence
            <input type="text" name="sentence" />
          </label>
          <button type="submit">Submit</button>
        </form>

        {translatedSentences.map((sentence, index) => (
          <div key={index}>
            <p>{sentence.chinese}</p>
            <p>{sentence.english}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
