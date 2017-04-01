class ZivotniCyklus extends React.Component {
  render() {
    return (
      <div>
        {this.props.children(window.innerHeight)}
      </div>
    );
  }
}

ReactDOM.render(
  <div>
    <h1>Ahoj</h1>
    <ZivotniCyklus>
      {info => <p>{info}</p>}
    </ZivotniCyklus>
  </div>,
  document.getElementById('root'),
);
