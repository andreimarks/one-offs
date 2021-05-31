function logRandom() {
  console.log(Math.random());
}

function Button(props) {
  // a, b = useState()
  // a) state object (getter)
  // b) updater function (setter)
	const handleClick = () => props.onClickFunction(props.increment); 
  
  return (
    //<button onClick={() => props.onClickFunction(props.increment) }>
    <button onClick={handleClick}>
      +{props.increment}
    </button>
  );
}

// Display
function Display(props) {
  return (
    <div>{props.message}</div>
  );
}

// App
function App() {
  const [counter, setCounter] = useState(0);
  const incrementCounter = (incrementValue) => setCounter(counter+incrementValue);
  
  return (
    <div>
      <Button onClickFunction={incrementCounter} increment={1} />
      <Button onClickFunction={incrementCounter} increment={5} />
      <Button onClickFunction={incrementCounter} increment={10} />
      <Button onClickFunction={incrementCounter} increment={100} />
      <Display message={counter} />
    </div>
  );
}

ReactDOM.render(
  //[<Button />, <Display />], 
  /*
  <div>
    <Button />
    <Display />
  </div>,
  ,
  */
  /*
  <React.Fragment>
    <Button />
    <Display />
  </React.Fragment>,
  */
  /*
  <>
    <Button />
    <Display />
  </>,
  */
  <App />,
  document.getElementById('mountNode'),
);
