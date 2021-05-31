/*
const testData = [
			{name: "Dan Abramov", avatar_url: "https://avatars0.githubusercontent.com/u/810438?v=4", company: "@facebook"},
      {name: "Sophie Alpert", avatar_url: "https://avatars2.githubusercontent.com/u/6820?v=4", company: "Humu"},
  		{name: "Sebastian Markbåge", avatar_url: "https://avatars2.githubusercontent.com/u/63648?v=4", company: "Facebook"},
	];
*/

const testData = [];

class ConditionalStyle extends React.Component {
  render() {
    return (
      <div style={{ color: Math.random() < 0.5 ? 'green' : 'red' }}>
        How do you like this?
      </div>
    );
  }
}

const CardList = (props) => (
  //<Card {...testData[0]} />
  //<Card {...testData[1]} />
  // Key Property -- something React needs whenever you render a dynamic list of children like we're doing in the CardList Component. If you don't specify some kind of identity for the dynamic element, React will just assume that the position of the element is its identity. Could cause problems if reordering elements.
  <div>
    {props.profiles.map(profile => <Card key={profile.id} {...profile}/>)}
  </div>
);

class Card extends React.Component {
	render() {
    // Javascript styles are good for conditional styling.
    const profile = this.props;
  	return (
    	<div className="github-profile" style={{ margin: '1rem' }}>
    	  <img src={profile.avatar_url} />
        <div className="info" style={{display:'inline-block', marginLeft: 10}}>
          <div className="name">{profile.name}</div>
          <div className="company">{profile.company}</div>
        </div>
    	</div>
    );
  }
}

class Form extends React.Component {
    //userNameInput = React.createRef();
    state = { userName: '' }
    handleSubmit = async (event) => {
      event.preventDefault(); // Important to do this or else the page will be resubmitted.
      // Can use the native fetch() call to make an ajax call, here using axios.
      // Note -- the below code fetches a response, and then says what to do with it. A bad mix -- a component should not have this much responsibility. Whole app should not really depend directly on a library. Should have a small agent-type module that has one responsibility -- to communicate with external apis, and make the code only depend on that module.
      // Can also extract the logic of managing the userName state input into its own component. 
      const resp = await axios.get(`https://api.github.com/users/${this.state.userName}`);
      console.log(
        //this.userNameInput.current.value
        this.state.userName 
      );
      console.log(
        resp.data
      );
      this.props.onSubmit(resp.data);
      this.setState({ userName: ''});
    };
  
    render() {
      return (
        // ref is like a fancy id that React keeps in memory. Reads directly from the DOM elements.
        // Otherwise, can control the value directly from React itself, instead of DOM elements. Labeled as controlled components.
        <form onSubmit={this.handleSubmit}>
          <input 
            type="text" 
            value={this.state.userName}
            // This is the syntax we need to use to change the state of a class component. Different from function component hooks because it's always named setState, it receives an object, and merges that object with the current state of the component.
            onChange={event => this.setState({userName: event.target.value })}
            placeholder="Github username" 
            //ref={this.userNameInput} 
            required 
          />
          <button>Add card</button>
        </form>
      );
    }
}

class App extends React.Component {
  // Required for state management.
  // Option 1
  /*
  constructor(props) {
    super(props);
    this.state = {
      profiles: testData
    };
  }
  */
  // Option 2
  // Note: not normal JS, but is transpiled via Babel.
  state = {
    profiles: testData,
  };
  
  addNewProfile = (profileData) => {
    console.log('App', profileData);
    this.setState(prevState => ({
      profiles: [...prevState.profiles, profileData]
    }))
  };
  
	render() {
  	return (
    	<div>
    	  <div className="header">{this.props.title}</div>
        <Form onSubmit={this.addNewProfile} />
        <CardList profiles={this.state.profiles} />
        <ConditionalStyle />
    	</div>
    );
  }	
}

ReactDOM.render(
	<App title="The GitHub Cards App" />,
  mountNode,
);
