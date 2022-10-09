import React, { useCallback, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Header from './components/Header';
import Figure from './components/Figure';
import WrongLetters from './components/WrongLetters';
import Word from './components/Word';
import Popup from './components/Popup';
import Notification from './components/Notification';
import { showNotification as show } from './helpers/Helpers'; /* since we are using showNotification as state we can't use the same name so we change it */
import "./styles/App.scss";

function App() {
  const [playable, setPlayable] = useState(true);
  const [correctLetters, setCorrectLetters] = useState([]);
  const [wrongLetters, setWrongLetters] = useState([]);
  const [showNotification, setShowNotification] = useState(false);
  let [selectedWord, setSelectedWord] = useState("");

  const controllerRef = useRef(new AbortController());

  const newWords = useCallback(() => { // when it rerenders, it uses the old function 
    axios.get("https://random-word-api.herokuapp.com/word", {signal: controllerRef.current.signal}) // to abort a second axios call (react18 renders twice)
      .then((response) => {
        setSelectedWord(response.data[0]);
        // console.log('response', response.data[0]);
      })
      .catch((error) => {
        console.log("error", error);
      });
  }, []);

  useEffect(() => {
    newWords()
    const controller = controllerRef.current
    return () => {
      controller.abort()
    }
  }, [newWords])

  useEffect(() => {
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
  }, [correctLetters, wrongLetters, playable, selectedWord]);

  function playAgain() {
    setPlayable(true);
    // we need to empty arrays
    setCorrectLetters([]);
    setWrongLetters([]);
    newWords();
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