function logRandom() {
  console.log(Math.random());
}

function Button() {
  // a, b = useState()
  // a) state object (getter)
  // b) updater function (setter)
  const [counter, setCounter] = useState(5);
	
  //return <button onClick={logRandom}>{counter}</button>;
  return <button onClick={() => setCounter(counter*2)}>{counter}</button>;
}

ReactDOM.render(
  <Button />, 
  document.getElementById('mountNode'),
);
