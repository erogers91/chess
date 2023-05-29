import React, { useState } from 'react';
import './Chess.css';
import { isWhitePiece, isBlackPiece } from './helper_functions/chessUtils';

const Chess = () => {
    const [board, setBoard] = useState([
      ['♜', '♞', '♝', '♛', '♚', '♝', '♞', '♜'],
      ['♟', '♟', '♟', '♟', '♟', '♟', '♟', '♟'],
      ['', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', ''],
      ['♙', '♙', '♙', '♙', '♙', '♙', '♙', '♙'],
      ['♖', '♘', '♗', '♕', '♔', '♗', '♘', '♖'],
    ]);
  
    const [isWhiteTurn, setIsWhiteTurn] = useState(true);
    const [sourceSquare, setSourceSquare] = useState(null);
    const [validMoveSquares, setValidMoveSquares] = useState([]);
    const [capturedPieces, setCapturedPieces] = useState([]);
  

  const isMoveValid = (piece, sourceRow, sourceCol, targetRow, targetCol) => {
    // Perform move validation based on the piece type and the source and target positions
    // Return true if the move is valid, and false otherwise

    const targetPiece = board[targetRow][targetCol];

    // Invalid move because the target piece and the source piece are the same color
    if ((isWhiteTurn && isWhitePiece(targetPiece)) || (!isWhiteTurn && isBlackPiece(targetPiece))) {
      return false;
    }

    // Pawns
    if (piece === '♙' || piece === '♟') {
      const rowDiff = targetRow - sourceRow;
      const colDiff = Math.abs(targetCol - sourceCol);

      if (piece === '♙') {
        // White pawn moves
        if (rowDiff === -1 && colDiff === 0 && board[targetRow][targetCol] === '') {
          return true; // Move one square forward
        } else if (rowDiff === -2 && colDiff === 0 && sourceRow === 6 && board[targetRow][targetCol] === '') {
          return true; // Move two squares forward from the initial position
        } else if (rowDiff === -1 && colDiff === 1 && isBlackPiece(board[targetRow][targetCol])) {
          return true; // Capture diagonally
        }
      } else {
        // Black pawn moves
        if (rowDiff === 1 && colDiff === 0 && board[targetRow][targetCol] === '') {
          return true; // Move one square forward
        } else if (rowDiff === 2 && colDiff === 0 && sourceRow === 1 && board[targetRow][targetCol] === '') {
          return true; // Move two squares forward from the initial position
        } else if (rowDiff === 1 && colDiff === 1 && isWhitePiece(board[targetRow][targetCol])) {
          return true; // Capture diagonally
        }
      }
    }
    // Rooks
    if (piece === '♖' || piece === '♜') {
      const rowDiff = targetRow - sourceRow;
      const colDiff = targetCol - sourceCol;

      if ((rowDiff === 0 && Math.abs(colDiff) >= 1) || (colDiff === 0 && Math.abs(rowDiff) >= 1)) {
        if (isPathClear(sourceRow, sourceCol, targetRow, targetCol)) {
          return true; // Move along a straight line
        }
      }
    }
    // Knights
    if (piece === '♘' || piece === '♞') {
      const rowDiff = Math.abs(targetRow - sourceRow);
      const colDiff = Math.abs(targetCol - sourceCol);

      if ((rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2)) {
        return true; // Move in an L-shape
      }
    }
    // Bishops
    if (piece === '♗' || piece === '♝') {
      const rowDiff = targetRow - sourceRow;
      const colDiff = targetCol - sourceCol;

      if (Math.abs(rowDiff) === Math.abs(colDiff)) {
        if (isPathClear(sourceRow, sourceCol, targetRow, targetCol)) {
          return true; // Move along a diagonal line
        }
      }
    }
    // Queens
    if (piece === '♕' || piece === '♛') {
      const rowDiff = targetRow - sourceRow;
      const colDiff = targetCol - sourceCol;

      if (
        (rowDiff === 0 && Math.abs(colDiff) >= 1) ||
        (colDiff === 0 && Math.abs(rowDiff) >= 1) ||
        Math.abs(rowDiff) === Math.abs(colDiff)
      ) {
        if (isPathClear(sourceRow, sourceCol, targetRow, targetCol)) {
          return true; // Move along a straight or diagonal line
        }
      }
    }
    // Kings
    if (piece === '♔' || piece === '♚') {
      const rowDiff = Math.abs(targetRow - sourceRow);
      const colDiff = Math.abs(targetCol - sourceCol);

      if (rowDiff <= 1 && colDiff <= 1) {
        return true; // Move one square in any direction
      }
    }

    return false; // Invalid move
  };

  const isPathClear = (sourceRow, sourceCol, targetRow, targetCol) => {
    // Check if the path between the source and target positions is clear
    // Return true if the path is clear, and false otherwise

    const rowDiff = targetRow - sourceRow;
    const colDiff = targetCol - sourceCol;
    const rowStep = rowDiff === 0 ? 0 : rowDiff / Math.abs(rowDiff);
    const colStep = colDiff === 0 ? 0 : colDiff / Math.abs(colDiff);
    let currentRow = sourceRow + rowStep;
    let currentCol = sourceCol + colStep;

    while (currentRow !== targetRow || currentCol !== targetCol) {
      if (board[currentRow][currentCol] !== '') {
        return false; // Path is blocked by another piece
      }
      currentRow += rowStep;
      currentCol += colStep;
    }

    return true; // Path is clear
  };

  const handleSquareClick = (row, col) => {
    const piece = board[row][col];

    if (!sourceSquare && isWhiteTurn && isWhitePiece(piece)) {
      // Select a white piece
      setSourceSquare({ row, col });
      setValidMoveSquares(findValidMoveSquares(piece, row, col));
    } else if (!sourceSquare && !isWhiteTurn && isBlackPiece(piece)) {
      // Select a black piece
      setSourceSquare({ row, col });
      setValidMoveSquares(findValidMoveSquares(piece, row, col));
    } else if (validMoveSquares.includes(`${row}-${col}`)) {
      // Selected a valid move square
      const newBoard = [...board];
      const [sourceRow, sourceCol] = [sourceSquare.row, sourceSquare.col];

      // Move the piece to the target square
      const targetPiece = newBoard[row][col];
      newBoard[row][col] = newBoard[sourceRow][sourceCol];
      newBoard[sourceRow][sourceCol] = '';

      setBoard(newBoard);
      setIsWhiteTurn(!isWhiteTurn);
      setSourceSquare(null);
      setValidMoveSquares([]);

      // Capture the target piece if it exists
      if (targetPiece) {
        setCapturedPieces((prevCapturedPieces) => [...prevCapturedPieces, targetPiece]);
      }
    } else {
      // Invalid move, clear the selection
      setSourceSquare(null);
      setValidMoveSquares([]);
    }
  };

  const findValidMoveSquares = (piece, row, col) => {
    // Find all the valid move squares for the selected piece at the given position
    const validMoves = [];

    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (isMoveValid(piece, row, col, i, j)) {
          validMoves.push(`${i}-${j}`);
        }
      }
    }

    return validMoves;
  };

  const renderSquare = (row, col) => {
    const piece = board[row][col];
    const isSquareSelected = sourceSquare && sourceSquare.row === row && sourceSquare.col === col;
    const isValidMoveSquare = validMoveSquares.includes(`${row}-${col}`);
    const squareClasses = ['square'];

    if (isSquareSelected) {
      squareClasses.push('selected');
    }

    if (isValidMoveSquare) {
      squareClasses.push('valid-move');
    }

    if ((row + col) % 2 === 0) {
      squareClasses.push('light-square');
    } else {
      squareClasses.push('dark-square');
    }

    return (
      <div
        key={`${row}-${col}`}
        className={squareClasses.join(' ')}
        onClick={() => handleSquareClick(row, col)}
      >
        <span className={`piece ${isWhitePiece(piece) ? 'piece-white' : 'piece-black'}`}>{piece}</span>
      </div>
    );
  };

  const renderBoard = () => {
    const rows = [];

    for (let row = 0; row < 8; row++) {
      const squares = [];

      for (let col = 0; col < 8; col++) {
        squares.push(renderSquare(row, col));
      }

      rows.push(
        <div key={row} className="row">
          {squares}
        </div>
      );
    }

    return rows;
  };

  const renderCapturedPieces = () => {
    const whitePieces = capturedPieces.filter(isWhitePiece);
    const blackPieces = capturedPieces.filter(isBlackPiece);
  
    return (
      <div className="captured-pieces-container">

        <div>
        <span className="captured-pieces-label">Captured White Pieces:</span>
          <div className="captured-pieces-section">
            {whitePieces.map((piece, index) => (
              <div key={index} className={`captured-piece piece-white`}>
                {piece}
              </div>
            ))}
          </div>
        </div>

        <div className="divider"></div>

        <div>
        <span className="captured-pieces-label">Captured Black Pieces:</span>
          <div className="captured-pieces-section">
            {blackPieces.map((piece, index) => (
              <div key={index} className={`captured-piece piece-black`}>
                {piece}
              </div>
            ))}
          </div>
        </div>

      </div>
    );
  };

  return (
    <div>
      <div className="turn-indicator">
        {isWhiteTurn ? 'White Turn' : 'Black Turn'}
      <div className="chessboard">{renderBoard()}</div>
      <div className="captured-pieces">
      {renderCapturedPieces()}
    </div>
    </div>
    </div>
  );
  
};

export default Chess;
