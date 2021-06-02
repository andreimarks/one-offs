const testData = [];

const CardList = (props) => (
  <div>
    {props.profiles.map(profile => <Card key={profile.id} {...profile}/>)}
  </div>
);

function Card(props) {
  const profile = props;
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

function Form(props) {
    const [state, setState] = useState({ userName: '' })
    const handleSubmit = async (event) => {
      event.preventDefault();
      const resp = await axios.get(`https://api.github.com/users/${state.userName}`);
      props.onSubmit(resp.data);
      setState({ userName: ''});
    };
  
    return (
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          value={state.userName}
          onChange={event => setState({userName: event.target.value })}
          placeholder="Github username" 
          required 
        />
        <button>Add card</button>
      </form>
    );
}

function App(props) {
  const [state, setState] = useState( {
    profiles: testData,
  });
  
  const addNewProfile = (profileData) => {
    console.log('App', profileData);
    setState(prevState => ({
      profiles: [...prevState.profiles, profileData]
    }))
  };

  return (
    <div>
      <div className="header">{props.title}</div>
      <Form onSubmit={addNewProfile} />
      <CardList profiles={state.profiles} />
    </div>
  );
}	

ReactDOM.render(
	<App title="The GitHub Cards App" />,
  mountNode,
);
