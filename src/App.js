import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from './components/Header';
import Figure from './components/Figure';
import WrongLetters from './components/WrongLetters';
import Word from './components/Word';
import Popup from './components/Popup';
import Notification from './components/Notification';
import { showNotification as show } from './helpers/Helpers'; /* since we are using showNotification as state we can't use the same name so we change it */
import "./styles/App.scss";

// const words = ['application', 'universe', 'lot', 'development', 'evolution', 'basic', 'flight', 'vehicle'];
// let selectedWord = words[Math.floor(Math.random() * words.length)];

function App() {
  const [playable, setPlayable] = useState(true);
  const [correctLetters, setCorrectLetters] = useState([]);
  const [wrongLetters, setWrongLetters] = useState([]);
  const [showNotification, setShowNotification] = useState(false);
  let [selectedWord, setSelectedWord] = useState("");
  const firstRender = true;

  const newWords = () => {
    axios.get("https://random-word-api.herokuapp.com/word")
      .then((response) => {
        setSelectedWord(response.data[0]);
        console.log('response', response.data[0]);
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  useEffect(() => {
    // newWords();
    if (!firstRender) {
      newWords();
    }

    const handleKeydown = (event) => {
      const { key, keyCode } = event;
      if (playable && keyCode >= 65 && keyCode <= 90) {
        const letter = key.toLowerCase();

        if (selectedWord.includes(letter)) {
          if (!correctLetters.includes(letter)) {
            setCorrectLetters(currentLetters => [...currentLetters, letter]);
          } else {
            show(setShowNotification);
          }
        } else {
          if (!wrongLetters.includes(letter)) {
            setWrongLetters(wrongLetters => [...wrongLetters, letter]);
          } else {
            show(setShowNotification);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeydown);

    return () => window.removeEventListener('keydown', handleKeydown);
  }, [correctLetters, wrongLetters, playable, selectedWord, firstRender]);

  function playAgain() {
    setPlayable(true);
    // we need to empty arrays
    setCorrectLetters([]);
    setWrongLetters([]);
    // const random = Math.floor(Math.random() * words.length);
    selectedWord = newWords();
  }

  return (
    <div className='main-layout'>
      <Header />
      <div>
        <div className='game-container'>
          <div className='figure-and-wrong'>
            <Figure wrongLetters={wrongLetters} />
            <WrongLetters wrongLetters={wrongLetters} />
          </div>
          <Word selectedWord={selectedWord} correctLetters={correctLetters} />
        </div>
      </div>
      <Popup correctLetters={correctLetters} wrongLetters={wrongLetters} selectedWord={selectedWord} setPlayable={setPlayable} playAgain={playAgain} />
      <Notification showNotification={showNotification} />
    </div>
  );
}

export default App;
