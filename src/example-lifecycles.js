window.ReactDOM = ReactDOM;

class ZivotniCyklus extends React.Component {
  state = {
    counter: 0,
  };

  componentWillUnmount() {
    console.log('Unmounting');
  }

  componentDidMount() {
    console.log('jsem mounted', window.innerWidth);
  }

  componentDidUpdate(prevProps, prevState) {
    console.log('DidUpdate');
    console.log('OldState', prevState);
    console.log('CurrentState', this.state);
  }

  addOne = () => {
    this.setState({
      counter: this.state.counter + 1,
    });
  };

  render() {
    return (
      <div>
        <h1>Kliknul jsem: {this.state.counter}</h1>
        <button onClick={this.addOne}>
          Klikni do me
        </button>
      </div>
    );
  }
}

ReactDOM.render(
  <div>
    <ZivotniCyklus />
  </div>,
  document.getElementById('root'),
);
