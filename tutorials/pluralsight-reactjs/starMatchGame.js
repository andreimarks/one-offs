// STAR MATCH - Starting Template
//
// View Functions: State => UI
//
// For every behavior you're trying to implement, there are two aspects to it.
// 1. The actual logic for the behavior. (App logic to change state)
// 2. The UI logic to describe what this behavior is going to be changing. (UI logic to describe state)

// To design your UI logic, you need to come up with what elements you need to place on the state.
// Here, for PlayNumbers, we will have to maintain some containers of data on the state. 4 states, which of these containers should we place on the state to enable us to describe all the possible states?
// General advice for React statement components --> you should minimize the state. Don't place on the state anything that could be computed from the other things you place on the state.
// When you design state elements, make sure they're enough to represent all the possible states and also make sure the minimum to represent all the possible states.

// You want component props to be minimum and exact -- only the data that's needed to render the component and nothing else.
// If you pass more information than needed, it might rerender itself in more cases than necessary.

//
// Behavior Functions: State => New State
//

// Now we have state elements and a UI description to honor the state elements. We now need logic to figure out how to do transactions on the state elements.

//
// Resetting State
//

// Structure of a React component should always be similar.
// 1. First few lines should be any hooks in to the state.
// 2. Any hooks into any side effects of this component.
// 3. Any computations based on the state.
// 4. Return state is just the description of the UI based on all the state and computations on that state.

// How to reset?
// Could just reset the state to the initial state manually in a functions.
// That's usually enough, except for when your components have side effects. Like subscribing to data or starting a timer.

//
// Using Side Effect Hooks
//

//
// Unmounting and Remounting Components
//

// Unmount and remount to the DOM by changing keys.

//
// Using Custom Hooks
//

// Can split some of the responsibilities that the big game component is currently handling (managing game state, rendering UI tree)
// Managing game state includes initializing the state and setting values on the state.
// Also making computations based on the state.
// Also rendering UI based on the state.

// Type 1. State Management
// Initializing the state
// Defining side effects
// Cleaning up side effects
// Transacting on the state using set calls.

// ^^ all that logic belongs in its own place, and React has a place to put that logic. A new function called a Custom Hook, which is a stateful function.

// It's basically just a normal function, but special in the sense that it is using special React hook functions. Always name this function starting with `use`.
// Should also fall the rule of hooks. Always use the react hooks function in the same order, so you can't define them conditionally.
// #1 Don't call Hooks inside loop or conditions. Can have those things inside of hooks, but can't use them to call hooks.
//---=-==--=-=-=-=--=-=
const StarsDisplay = props => (
  // Key goes here, because it's the dynamic element in the map.
  <>
    {utils.range(1, props.count).map(starId =>
      <div key={starId} className="star" />
    )}
  </>
);
// Be aware of top-level Javascript objects in your code and do not override them. Maybe use two name component names.
const PlayNumber = props => (
  // Key element is only needed on the immediate element in the loop.
  <button 
    className="number"
    style={{ backgroundColor: colors[props.status] }}
    onClick={() => props.onClick(props.number, props.status)}
  >
    {props.number}
  </button>
);

const PlayAgain = props => (
  <div className="game-done">
    <div 
      className="message"
      style={{ color: props.gameStatus === 'lost' ? 'red' : 'green' }}
    >
      {props.gameStatus == 'lost' ? 'Game Over' : 'Nice'}
    </div>
    <button onClick={props.onClick}>Play Again</button>
  </div>
);

// Custom hook
const useGameState = () => {
  const [stars, setStars] = useState(utils.random(1, 9));
  const [availableNums, setAvailableNums] = useState(utils.range(1,9));
  const [candidateNums, setCandidateNums] = useState([]);
  const [secondsLeft, setSecondsLeft] = useState(10);

  useEffect(() => { // Runs every time React renders 
    if (secondsLeft > 0 && availableNums.length > 0) {
      const timerId = setTimeout(() => {
        setSecondsLeft(secondsLeft - 1);
      }, 1000);
      return () => clearTimeout(timerId);
    }
  });
  
  const setGameState = (newCandidateNums) => {
    if (utils.sum(newCandidateNums) != stars) {
      setCandidateNums(newCandidateNums);
    } else {
      const newAvailableNums = availableNums.filter(
        n => !newCandidateNums.includes(n)
      );
      setStars(utils.randomSumIn(newAvailableNums, 9));
      setAvailableNums(newAvailableNums);
      setCandidateNums([]);
    }
  };
  
  return { stars, availableNums, candidateNums, secondsLeft, setGameState };
};

const Game = (props) => {
  /*
  const [stars, setStars] = useState(utils.random(1, 9));
  const [availableNums, setAvailableNums] = useState(utils.range(1,9));
  const [candidateNums, setCandidateNums] = useState([]);
  const [secondsLeft, setSecondsLeft] = useState(10);
  // Timer...usually uses setInterval
  // Can also use setTimeout.
  
  useEffect(() => { // Runs every time React renders the page.
    // As is, will run everytime state changes. Need to make sure to clean up the side effect when necessary.
    // jscomplete.com/rgs-hooks for how to deal with
    // the timer reset issue.
    
    // To reset game, would also need to reset any side effects that you introduce in the game.
    // Another option to resetting the state is unmounting the component as well.
    if (secondsLeft > 0 && availableNums.length > 0) {
      const timerId = setTimeout(() => {
        setSecondsLeft(secondsLeft - 1);
      }, 1000);
      return () => clearTimeout(timerId);
    }
    
    //console.log("Done rendering"); // Intro side effect.
    //return () => console.log("Component is changing") // Clean side effect.;
  });
  */
  // Prefer declarative way of doing things instead of loops and manual array manipulation.
  // map/filter/reduce > for/while
  
  // When developing:
  // 1. Make things dynamic (get a better idea of what should be extracted on their own.)
  // 2. Extract components
  
  // Whenever you identify a data element that's used in the UI and is going to change value, you should make it into a state element.
  // Only optimize the elements on the state when you have enough clues about how they fit with the other elements on the state. It is normal for state elements to grow and shrink as they're designed.
  
  // Extracting Components for Reusability and Readability
  // Too many or too few components is bad.
  
  // One tip. Anytime you have items that share similar DATA or BEHAVIOR, that's a candidate for a component. E.g. the play number.
  
  // Concept behind extracting PlayNumber is reusability. We want to make it reusable and define shared behavior on it. The other guideline is readability.
  
  // Extracting StarsDisplay, it is a list of adjacent elements, but a react component should render a single component. BUT, if we don't want to introduce any new element nesting in the tree, just use the react fragment concept.
  
  const {
    stars,
    availableNums,
    candidateNums,
    secondsLeft,
    setGameState,
  } = useGameState();
  
  const candidatesAreWrong = utils.sum(candidateNums) > stars;
  //const gameIsDone = availableNums.length === 0;
  //const gameIsLost = secondsLeft === 0;
  const gameStatus = availableNums.length === 0
    ? 'won'
    : secondsLeft === 0 ? 'lost' : 'active';
  
  const resetGame = () => {
    setStars(utils.random(1, 9));
    setAvailableNums(utils.range(1, 9));
    setCandidateNums([]);
  };
  
  const numberStatus = (number) => {
    if (!availableNums.includes(number)) {
      return 'used';
    }
    if (candidateNums.includes(number)) {
      return candidatesAreWrong ? 'wrong' : 'candidate';
    }
    return 'available';
  };
  
  const onNumberClick = (number, currentStatus) => {
    // currentStatus => newStatus
    if (gameStatus !== 'active' || currentStatus == 'used') {
      return;
    }
    // candidateNums
    const newCandidateNums = 
      currentStatus === 'available'
        ? candidateNums.concat(number)
        : candidateNums.filter(cn => cn !== number);
    
    setGameState(newCandidateNums);
    /*
    if (utils.sum(newCandidateNums) != stars) {
      setCandidateNums(newCandidateNums);
    } else {
      
      const newAvailableNums = availableNums.filter(
        n => !newCandidateNums.includes(n)
      );
      setStars(utils.randomSumIn(newAvailableNums, 9));
      setAvailableNums(newAvailableNums);
      setCandidateNums([]);
    }
    */
  };
  
  return (
    <div className="game">
      <div className="help">
        Pick 1 or more numbers that sum to the number of stars
      </div>
      <div className="body">
        <div className="left">
          {gameStatus !== 'active' ? (
            <PlayAgain 
              onClick={props.startNewGame}
              gameStatus={gameStatus}
            />
          ) : (
            <StarsDisplay count={stars} />
          )}
        </div>
        <div className="right">
          {utils.range(1, 9).map(number =>
            <PlayNumber 
              key={number}
              status={numberStatus(number)}
              number={number}
              onClick={onNumberClick}
            />
          )}
        </div>
      </div>
      <div className="timer">Time Remaining: {secondsLeft}</div>
    </div>
  );
};

// If we change the key, React will treat it as a separate component.
const StarMatch = () => {
  const [gameId, setGameId] = useState(0);
  return <Game key={gameId} startNewGame={() => setGameId(gameId + 1)} />;
}
      
// Color Theme
const colors = {
  available: 'lightgray',
  used: 'lightgreen',
  wrong: 'lightcoral',
  candidate: 'deepskyblue',
};
      
// Math science
const utils = {
  // Sum an array
  sum: arr => arr.reduce((acc, curr) => acc + curr, 0),

  // Create an array of numbers between min and max (edges included)
  range: (min, max) => Array.from({ length: max - min + 1 }, (_, i ) => min + i),

  // Pick a random number between min and max (edges included)
  random: (min, max) => min + Math.floor(Math.random() * (max - min + 1)),

  // Given an array of numbers and a max...
  // Pick a random sum (< max) from the set of all available sums in arr
  randomSumIn: (arr, max) => {
    const sets = [[]];
    const sums = [];
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0, len = sets.length; j < len; j++) {
        const candidateSet = sets[j].concat(arr[i]);
        const candidateSum = utils.sum(candidateSet);
        if (candidateSum <= max) {
          sets.push(candidateSet);
          sums.push(candidateSum);
        }
      }
    }
    return sums[utils.random(0, sums.length - 1)];
  }
};

ReactDOM.render(<StarMatch />, mountNode);
