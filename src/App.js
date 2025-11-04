import React from 'react';

function App() {
  function ChessGame() {
  const initialBoard = [
    ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
    ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
    ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
  ];

  const [board, setBoard] = React.useState(initialBoard);
  const [selectedSquare, setSelectedSquare] = React.useState(null);
  const [currentPlayer, setCurrentPlayer] = React.useState('white');
  const [validMoves, setValidMoves] = React.useState([]);

  const pieceSymbols = {
    'K': '♔', 'Q': '♕', 'R': '♖', 'B': '♗', 'N': '♘', 'P': '♙',
    'k': '♚', 'q': '♛', 'r': '♜', 'b': '♝', 'n': '♞', 'p': '♟'
  };

  const isWhitePiece = (piece) => piece && piece === piece.toUpperCase();
  const isBlackPiece = (piece) => piece && piece === piece.toLowerCase() && piece !== piece.toUpperCase();

  const isValidMove = (fromRow, fromCol, toRow, toCol, piece) => {
    if (toRow < 0 || toRow > 7 || toCol < 0 || toCol > 7) return false;
    const targetPiece = board[toRow][toCol];
    if (targetPiece && ((isWhitePiece(piece) && isWhitePiece(targetPiece)) || (isBlackPiece(piece) && isBlackPiece(targetPiece)))) return false;

    const pieceLower = piece.toLowerCase();
    const rowDiff = toRow - fromRow;
    const colDiff = toCol - fromCol;

    switch (pieceLower) {
      case 'p':
        const direction = isWhitePiece(piece) ? -1 : 1;
        if (colDiff === 0 && !targetPiece) {
          if (rowDiff === direction) return true;
          if ((isWhitePiece(piece) && fromRow === 6 && rowDiff === -2) || (isBlackPiece(piece) && fromRow === 1 && rowDiff === 2)) {
            return !board[fromRow + direction][fromCol];
          }
        }
        if (Math.abs(colDiff) === 1 && rowDiff === direction && targetPiece) return true;
        return false;

      case 'n':
        return (Math.abs(rowDiff) === 2 && Math.abs(colDiff) === 1) || (Math.abs(rowDiff) === 1 && Math.abs(colDiff) === 2);

      case 'b':
        if (Math.abs(rowDiff) !== Math.abs(colDiff)) return false;
        return isPathClear(fromRow, fromCol, toRow, toCol);

      case 'r':
        if (rowDiff !== 0 && colDiff !== 0) return false;
        return isPathClear(fromRow, fromCol, toRow, toCol);

      case 'q':
        if (rowDiff !== 0 && colDiff !== 0 && Math.abs(rowDiff) !== Math.abs(colDiff)) return false;
        return isPathClear(fromRow, fromCol, toRow, toCol);

      case 'k':
        return Math.abs(rowDiff) <= 1 && Math.abs(colDiff) <= 1;

      default:
        return false;
    }
  };

  const isPathClear = (fromRow, fromCol, toRow, toCol) => {
    const rowStep = toRow > fromRow ? 1 : toRow < fromRow ? -1 : 0;
    const colStep = toCol > fromCol ? 1 : toCol < fromCol ? -1 : 0;
    let currentRow = fromRow + rowStep;
    let currentCol = fromCol + colStep;

    while (currentRow !== toRow || currentCol !== toCol) {
      if (board[currentRow][currentCol]) return false;
      currentRow += rowStep;
      currentCol += colStep;
    }
    return true;
  };

  const getValidMoves = (row, col) => {
    const moves = [];
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        if (isValidMove(row, col, r, c, board[row][col])) {
          moves.push([r, c]);
        }
      }
    }
    return moves;
  };

  const handleSquareClick = (row, col) => {
    if (selectedSquare) {
      const [selectedRow, selectedCol] = selectedSquare;
      const piece = board[selectedRow][selectedCol];

      if (isValidMove(selectedRow, selectedCol, row, col, piece)) {
        const newBoard = board.map(r => [...r]);
        newBoard[row][col] = piece;
        newBoard[selectedRow][selectedCol] = null;
        setBoard(newBoard);
        setCurrentPlayer(currentPlayer === 'white' ? 'black' : 'white');
        setSelectedSquare(null);
        setValidMoves([]);
      } else if (board[row][col] && ((currentPlayer === 'white' && isWhitePiece(board[row][col])) || (currentPlayer === 'black' && isBlackPiece(board[row][col])))) {
        setSelectedSquare([row, col]);
        setValidMoves(getValidMoves(row, col));
      } else {
        setSelectedSquare(null);
        setValidMoves([]);
      }
    } else if (board[row][col]) {
      if ((currentPlayer === 'white' && isWhitePiece(board[row][col])) || (currentPlayer === 'black' && isBlackPiece(board[row][col]))) {
        setSelectedSquare([row, col]);
        setValidMoves(getValidMoves(row, col));
      }
    }
  };

  const isValidMoveSquare = (row, col) => {
    return validMoves.some(([r, c]) => r === row && c === col);
  };

  const resetGame = () => {
    setBoard(initialBoard);
    setSelectedSquare(null);
    setCurrentPlayer('white');
    setValidMoves([]);
  };

  return React.createElement('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px', fontFamily: 'Arial, sans-serif', background: '#2c3e50', minHeight: '100vh' } },
    React.createElement('h1', { style: { color: 'white', marginBottom: '10px' } }, 'Chess Game'),
    React.createElement('div', { style: { color: 'white', fontSize: '20px', marginBottom: '20px', fontWeight: 'bold' } }, 'Current Player: ', currentPlayer === 'white' ? '♔ White' : '♚ Black'),
    React.createElement('div', { style: { border: '4px solid #34495e', boxShadow: '0 8px 16px rgba(0,0,0,0.3)' } },
      board.map((row, rowIndex) =>
        React.createElement('div', { key: rowIndex, style: { display: 'flex' } },
          row.map((piece, colIndex) => {
            const isLight = (rowIndex + colIndex) % 2 === 0;
            const isSelected = selectedSquare && selectedSquare[0] === rowIndex && selectedSquare[1] === colIndex;
            const isValidMove = isValidMoveSquare(rowIndex, colIndex);
            return React.createElement('div', {
              key: colIndex,
              onClick: () => handleSquareClick(rowIndex, colIndex),
              style: {
                width: '60px',
                height: '60px',
                background: isSelected ? '#f39c12' : isValidMove ? '#2ecc71' : isLight ? '#f0d9b5' : '#b58863',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '40px',
                transition: 'all 0.2s',
                border: isValidMove ? '3px solid #27ae60' : 'none',
                boxSizing: 'border-box'
              }
            }, piece ? pieceSymbols[piece] : '');
          })
        )
      )
    ),
    React.createElement('button', {
      onClick: resetGame,
      style: {
        marginTop: '20px',
        padding: '12px 30px',
        fontSize: '16px',
        background: '#e74c3c',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: 'bold',
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
      }
    }, 'Reset Game')
  );
}
}

export default App;