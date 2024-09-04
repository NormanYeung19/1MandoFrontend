import React from "react";
import Button from "../shared/customButton";

const HowToStudyModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-2xl w-full">
        <h2 className="text-2xl font-bold mb-4">How to Study Effectively</h2>
        <ul className="list-disc list-inside space-y-2 mb-4">
          <li>Focus on one group per day, reviewing previous days' words.</li>
          <li>Click on a word once to focus it (blue outline).</li>
          <li>
            Click again or press 'D' to show word details and example sentences.
          </li>
          <li>
            Use the 'G' key for words you recognize instantly (turns green).
          </li>
          <li>
            Use the 'R' key for words you need to review more (turns red).
          </li>
          <li>Press 'S' to hear the pronunciation of the focused word.</li>
          <li>Practice writing the characters to reinforce memory.</li>
          <li>Create sentences using new words to understand context.</li>
          <li>Review red-marked words more frequently.</li>
          <li>Set a daily study goal and track your progress.</li>
        </ul>
        <Button onClick={onClose} className="bg-blue-500 text-white">
          Close
        </Button>
      </div>
    </div>
  );
};

export default HowToStudyModal;
