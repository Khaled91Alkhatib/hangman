import React, { useState } from 'react';

import Header from './components/Header';
import Figure from './components/Figure';
import WrongLetters from './components/WrongLetters';
import Word from './components/Word';
import Popup from './components/Popup';
import Notification from './components/Notification';
import "./styles/App.scss";

const words = ['application', 'universe', 'lot', 'development', 'evolution', 'basic', 'flight', 'vehicle'];
let selectedWord = words[Math.floor(Math.random() * words.length)];

function App() {
  const [playable, setPlayable] = useState(true);
  const [correctLetters, setCorrectLetters] = useState([]);
  const [wrongLetters, setWrongLetters] = useState([]);

  return (
    <div>
      <Header />
      <div className='game-container'>
        <Figure />
        <WrongLetters wrongLetters={wrongLetters} />
        <Word selectedWord={selectedWord} correctLetters={correctLetters} />
      </div>
    </div>
  );
}

export default App;
