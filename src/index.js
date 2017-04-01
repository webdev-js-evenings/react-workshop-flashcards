import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import shortid from 'shortid';

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

const Row = (
  { onRequestQuestionChange, onRequestAnswerChange, index, item },
) => {
  const handleQuestionChange = e => {
    const value = e.target.value;
    onRequestQuestionChange(index, value);
  };

  const handleAnswerChange = e => {
    const value = e.target.value;
    onRequestAnswerChange(index, value);
  };

  return (
    <div>
      <input
        placeholder="Question"
        onChange={handleQuestionChange}
        defaultValue={item.question}
      />
      <input placeholder="Answer" onChange={handleAnswerChange} />
    </div>
  );
};

const ENTER_KEY = 13;

class App extends React.Component {
  state = {
    data: [
      {
        id: shortid.generate(),
        question: null,
        answer: null,
      },
    ],
    activeMode: 'edit',
  };

  addNewCard = () => {
    const newData = this.state.data.slice();
    newData.push({
      id: shortid.generate(),
    });

    this.setState({
      data: newData,
    });
  };

  handleQuestionChange = (index, text) => {
    const newData = [...this.state.data];
    newData[index].question = text;

    this.setState({
      data: newData,
    });
  };

  handleAnswerChange = (index, text) => {
    const newData = [...this.state.data];
    newData[index].answer = text;

    this.setState({
      data: newData,
    });
  };

  handleKeyUp = e => {
    if (e.keyCode === ENTER_KEY) {
      this.addNewCard();
    }
  };

  render() {
    let content = (
      <div>
        <h1>Training mode</h1>
      </div>
    );
    if (this.state.activeMode === 'edit') {
      content = (
        <div tabIndex={-1} onKeyUp={this.handleKeyUp}>
          <button onClick={this.addNewCard}>
            Add new card
          </button>
          {this.state.data.map((item, index) => (
            <Row
              key={item.id}
              index={index}
              onRequestQuestionChange={this.handleQuestionChange}
              onRequestAnswerChange={this.handleAnswerChange}
              item={item}
            />
          ))}
        </div>
      );
    }

    return (
      <div>
        <StyledHeader>
          <button onClick={() => this.setState({ activeMode: 'edit' })}>
            Edit mode
          </button>

          <button onClick={() => this.setState({ activeMode: 'training' })}>
            Training mode
          </button>
        </StyledHeader>
        <StyledContent>
          {content}
        </StyledContent>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
