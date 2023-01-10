//React
import { useCallback,useState, useEffect } from 'react';

//Css
import './App.css';

//Dados
import { wordsList } from './data/words';

//Componentes
import StartScreen from './components/StartScreen';
import Game from './components/Game';
import GameOver from './components/GameOver';

const stages = [
  {id: 1, name: "start"},
  {id: 2, name: "game"},
  {id: 3, name: "end"},
];

function App() {

  const guessesQtd = 3

  const [gameStage, setGameStage] = useState(stages[0].name);
  const [words] = useState(wordsList);

  const [pickedWord, setPickedWord] = useState("")
  const [pickedCategory, setPickedCategory] = useState("")
  const [letters, setLetters] = useState([])

  const [guessedLetters, setGuessedLetters] = useState([])
  const [wrongLetters, setWrongLetters] = useState([])
  const [guesses, setGuesses] = useState(guessesQtd)
  const [score, setScore] = useState(0)


  const pickedWordAndCategory = useCallback(() => {
    const categories = Object.keys(words)

    const category = categories[Math.floor(Math.random() * Object.keys(categories).length)]

    // pick a random word
    const word = words[category][Math.floor(Math.random() * words[category].length)]

    return {word, category};
  }, [words])

  //Começando o jogo
  const startGame = useCallback(() => {
    //Clear all letters
    clearLetterStates()

    // pick woed and pick category
    const {word, category} = pickedWordAndCategory(); 

    //create an array of letters
    let wordLetters = word.split("")

    wordLetters = wordLetters.map((l) => l.toLowerCase())

    setPickedWord(word);
    setPickedCategory(category);
    setLetters(wordLetters)

    setGameStage(stages[1].name)
  },[pickedWordAndCategory]);

  //Process the letter input
  const verifyLetter = (letter) => {
  
    const normalizedLetter = letter.toLowerCase();

    if(guessedLetters.includes(normalizedLetter) || 
        wrongLetters.includes(normalizedLetter)
      ){
      return;
    }

    if(letters.includes(normalizedLetter)){
      setGuessedLetters((actualGuessedLetters) => [
        ...actualGuessedLetters, 
        normalizedLetter
      ])
    }else{
      setWrongLetters((actualWrongLetters) => [
        ...actualWrongLetters,
        normalizedLetter
      ]);

      setGuesses((actualGuesses) => actualGuesses - 1)
    }
    
  }
  const clearLetterStates = () => {
    setGuessedLetters([]);
    setWrongLetters([])
  }

  useEffect(() => {
    if(guesses <= 0) {
      //reset
      clearLetterStates()

      setGameStage(stages[2].name);
    }
  }, [guesses]);

  useEffect(() => {

    const uniqueLetters = [...new Set(letters)]

    if(guessedLetters.length === uniqueLetters.length){
      setScore((actualScore) => actualScore += 100)

      startGame();
    }

  },[guessedLetters,letters,startGame])

  //Reiniciar o Jogo
  const retry = () =>{
    setScore(0);
    setGuesses(guessesQtd);

    setGameStage(stages[0].name)
  }

  return (
    <div className="App">
      {gameStage === "start" && <StartScreen startGame={startGame}/>}
      {gameStage === "game" && 
        <Game 
          verifyLetter={verifyLetter} 
          pickedWord={pickedWord} 
          pickedCategory={pickedCategory} 
          letters={letters} 
          guessedLetters={guessedLetters}
          wrongLetters={wrongLetters}
          guesses={guesses}
          score={score}
        />}
      {gameStage === "end" && 
        <GameOver 
          retry={retry}
          score={score}  
        />}
    </div>
  );
}

export default App;
