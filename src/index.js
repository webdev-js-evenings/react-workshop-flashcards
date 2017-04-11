import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import shortid from 'shortid';
import classNames from 'classnames';
import shallowCompare from 'react-addons-shallow-compare';
import { HashRouter as Router, Route, Link } from 'react-router-dom';
import shuffle from 'lodash.shuffle';

import './index.css';

const StyledHeader = styled.div`
  height: 50px;
  background: green;
  color: #fff;
`;

const StyledContent = styled.div`
  background: #fff;
  position: absolute;
  top: 50px;
  bottom: 0;
  width: 100%;
`;

const StyledCardContainer = styled.div`
  width: 400px;
  height: 400px;
  left: 50%;
  margin-left: -200px;
  position: absolute;
  perspective: 800px;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s;
`;

const StyledCard = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  transform-style: preserve-3d;
  transition: transform 1s;
  color: #fff;
  text-align: center;
  font-weight: bold;
  text-shadow: 0 0 5px #000;
`;

const StyledCardFace = styled.div`
  margin: 0;
  display: block;
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  background-color: ${props => props.front ? 'blue' : 'purple'}
  transform: ${props => !props.front ? 'rotateY( 180deg )' : 'rotateY(0)'};
  padding-top: 40%;
`;

/*

Card

*/

class Card extends React.Component {
  static propTypes = {
    active: React.PropTypes.bool,
    question: React.PropTypes.string,
    answer: React.PropTypes.string,
  };

  state = {
    flipped: false,
  };

  handleClick = e => {
    this.setState({
      flipped: !this.state.flipped,
    });
  };

  render() {
    return (
      <StyledCardContainer
        onClick={this.handleClick}
        className={classNames({
          cardContainer: true,
          active: this.props.active,
        })}
      >
        <StyledCard
          className={classNames({
            card: true,
            flipped: this.state.flipped,
          })}
        >
          <StyledCardFace front>{this.props.question}</StyledCardFace>
          <StyledCardFace>{this.props.answer}</StyledCardFace>
        </StyledCard>
      </StyledCardContainer>
    );
  }
}

/*

Row

*/

const Row = (
  {
    onRequestInputChange,
    onRequestRemoveCard,
    index,
    item,
  }
) => {
  const handleInputChange = e => {
    const value = e.target.value;
    const name = e.target.name;
    const obj = {
      [name]: value,
    };

    onRequestInputChange({ index, obj });
  };

  const handleRemoveCard = () => {
    onRequestRemoveCard(item.id);
  };

  return (
    <div>
      <input
        placeholder="Question"
        name="question"
        onChange={handleInputChange}
        defaultValue={item.question}
      />
      <input
        placeholder="Answer"
        name="answer"
        onChange={handleInputChange}
        defaultValue={item.answer}
      />
      <button onClick={handleRemoveCard}>Remove card</button>
    </div>
  );
};

/*

TrainingMode

*/

class TrainingMode extends React.Component {
  static propTypes = {
    cards: React.PropTypes.array,
  };

  state = {
    activeCardIndex: 0,
  };

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  componentDidUpdate() {
    console.log('re-render');
  }

  nextCard = () => {
    let newCardIndex = this.state.activeCardIndex + 1;
    if (newCardIndex > this.props.cards.length - 1) {
      newCardIndex = this.props.cards.length - 1;
    }

    this.setState({
      activeCardIndex: newCardIndex,
    });
  };

  prevCard = () => {
    let newCardIndex = this.state.activeCardIndex - 1;
    if (newCardIndex < 0) {
      newCardIndex = 0;
    }

    this.setState({
      activeCardIndex: newCardIndex,
    });
  };

  render() {
    return (
      <div>
        <button onClick={this.prevCard}>Prev</button>
        <button onClick={this.nextCard}>Next</button>
        <button onClick={this.props.onRequestRandomize}>Randomize</button>
        {this.props.cards.map((card, index) => (
          <Card
            key={card.id}
            question={card.question}
            answer={card.answer}
            active={this.state.activeCardIndex == index}
          />
        ))}
      </div>
    );
  }
}

/*

App

*/

const ENTER_KEY = 13;
const defaultState = {
  data: [
    {
      id: shortid.generate(),
      question: null,
      answer: null,
    },
  ],
};

class App extends React.Component {
  state = this._getInitialState();

  componentDidUpdate(prevProps, prevState) {
    if (prevState.data !== this.state.data) {
      const stringifiedData = JSON.stringify({ data: this.state.data });
      window.localStorage.setItem('appData', stringifiedData);
    }
  }

  _getInitialState() {
    let data;
    try {
      data = {
        ...defaultState,
        ...JSON.parse(window.localStorage.getItem('appData')),
      };
    } catch (e) {
      console.error('Error when parsing data from localStorage');
      data = defaultState;
    }
    return data;
  }

  addNewCard = () => {
    const newData = this.state.data.slice();
    newData.push({
      id: shortid.generate(),
    });

    this.setState({
      data: newData,
    });
  };

  handleInputChange = ({ index, obj }) => {
    const newData = [...this.state.data];
    newData[index] = Object.assign({}, newData[index], obj);

    this.setState({
      data: newData,
    });
  };

  handleRemoveCard = cardId => {
    const newData = this.state.data.filter(card => card.id !== cardId);
    this.setState({ data: newData });
  };

  handleKeyUp = e => {
    if (e.keyCode === ENTER_KEY) {
      this.addNewCard();
    }
  };

  randomize = () => {
    const newData = shuffle(this.state.data);
    this.setState({
      data: newData,
    });
  };

  render() {
    const cards = this.state.data.filter(card => card.question && card.answer);

    return (
      <Router>
        <div>
          <StyledHeader>
            <Link to="/">
              <button>
                Edit mode
              </button>
            </Link>

            <Link to="/training-mode">
              <button>
                Training mode
              </button>
            </Link>
          </StyledHeader>
          <StyledContent>
            <Route
              path="/training-mode"
              render={() => (
                <TrainingMode
                  cards={cards}
                  onRequestRandomize={this.randomize}
                />
              )}
            />
            <Route
              path="/"
              exact
              render={() => (
                <div tabIndex={-1} onKeyUp={this.handleKeyUp}>
                  <button onClick={this.addNewCard}>
                    Add new card
                  </button>
                  {this.state.data.map((item, index) => (
                    <Row
                      key={item.id}
                      index={index}
                      onRequestRemoveCard={this.handleRemoveCard}
                      onRequestInputChange={this.handleInputChange}
                      item={item}
                    />
                  ))}
                </div>
              )}
            />
          </StyledContent>
        </div>
      </Router>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
