import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    )
}

class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square
                key={i}
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        )
    }

    genSquare(columns, rows) {
        const board = []
        for (let row = 0; row < rows; row++) {
            let eachColumn = []
            for (let column = 0; column < columns; column++) {
                let squareIndex = row * columns + column;
                eachColumn.push(this.renderSquare(squareIndex))
            }
            board.push(
                <div key={row} className="board-row">
                    {eachColumn}
                </div>
            );
        }
        return board
    }

    render() {
        return (
            <div>
                {this.genSquare(this.props.columns, this.props.rows)}
            </div>
        )
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
            }],
            stepNumber: 0,
            xIsNext: true,
            columns: 3,
            rows: 3,
            listIsReversed: false,
        }
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    getCurrentStepIndex() {
        const history = this.state.history;
        const stepNumber = this.state.stepNumber;
        const current = history[stepNumber].squares;
        const previous = stepNumber > 0 ? history[stepNumber - 1].squares : Array(9).fill(null);

        let currentStepIndex = null;
        for (let i = 0; i < current.length; i++) {
            if (current[i] !== previous[i]) {
                currentStepIndex = i;
                break;
            }
        }
        return currentStepIndex;
    }

    getStepCoordinateFrom(i) {
        let columns = this.state.columns;
        return i !== null ?
            (<div>current step: {i % columns + 1}, {parseInt(i / columns) + 1}</div>) :
            null;
    }

    reverseList() {
        this.setState({
            listIsReversed: !this.state.listIsReversed,
        })
    }

    render() {
        let history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        let moves = history.map((step, move) => {
            const desc = move ?
                'Go to move #' + move :
                'Go to game start';
            return (
                <li key={move}>
                    <button className="jumpHistory" onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });

        if (this.state.listIsReversed) {
            moves.reverse();
        }

        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        let stepCoordinate = this.getStepCoordinateFrom(this.getCurrentStepIndex());

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                        columns={this.state.columns}
                        rows={this.state.rows}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <button onClick={() => this.reverseList()}>change list order</button>
                    <ol className="historyList" reversed={this.state.listIsReversed}>{moves}</ol>
                    <div>{stepCoordinate}</div>
                </div>
            </div>
        );
    }
}

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}
