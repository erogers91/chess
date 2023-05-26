import React, { useState } from 'react';
import './Chess.css';

const Chess = () => {
  const [isWhiteTurn, setIsWhiteTurn] = useState(true);
  const [sourceSquare, setSourceSquare] = useState(null);
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

  const isWhitePiece = (piece) => {
    const whitePieces = ['♙', '♖', '♘', '♗', '♕', '♔'];
    return whitePieces.includes(piece);
  };

  const isBlackPiece = (piece) => {
    const blackPieces = ['♟', '♜', '♞', '♝', '♛', '♚'];
    return blackPieces.includes(piece);
  };

  const isMoveValid = (piece, sourceRow, sourceCol, targetRow, targetCol) => {
    // Perform move validation based on the piece type and the source and target positions
    // Return true if the move is valid, and false otherwise
    
    const targetPiece = board[targetRow][targetCol];
  
    // Invalid move because the target piece and the source piece are the sane color
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

      if (rowDiff === 0 || colDiff === 0) {
        // Check for obstructing pieces along the horizontal or vertical path
        const stepRow = rowDiff === 0 ? 0 : rowDiff > 0 ? 1 : -1;
        const stepCol = colDiff === 0 ? 0 : colDiff > 0 ? 1 : -1;

        let currentRow = sourceRow + stepRow;
        let currentCol = sourceCol + stepCol;

        while (currentRow !== targetRow || currentCol !== targetCol) {
          if (board[currentRow][currentCol] !== '') {
            return false; // Obstructed path
          }
          currentRow += stepRow;
          currentCol += stepCol;
        }

        return true; // Move horizontally or vertically
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
        // Check for obstructing pieces along the diagonal path
        const stepRow = rowDiff > 0 ? 1 : -1;
        const stepCol = colDiff > 0 ? 1 : -1;

        let currentRow = sourceRow + stepRow;
        let currentCol = sourceCol + stepCol;

        while (currentRow !== targetRow || currentCol !== targetCol) {
          if (board[currentRow][currentCol] !== '') {
            return false; // Obstructed path
          }
          currentRow += stepRow;
          currentCol += stepCol;
        }

        return true; // Move diagonally
      }
    }
  
    // Queens
    if (piece === '♕' || piece === '♛') {
      const rowDiff = targetRow - sourceRow;
      const colDiff = targetCol - sourceCol;

      if (rowDiff === 0 || colDiff === 0 || Math.abs(rowDiff) === Math.abs(colDiff)) {
        // Check for obstructing pieces along the horizontal, vertical, or diagonal path
        const stepRow = rowDiff === 0 ? 0 : rowDiff > 0 ? 1 : -1;
        const stepCol = colDiff === 0 ? 0 : colDiff > 0 ? 1 : -1;

        let currentRow = sourceRow + stepRow;
        let currentCol = sourceCol + stepCol;

        while (currentRow !== targetRow || currentCol !== targetCol) {
          if (board[currentRow][currentCol] !== '') {
            return false; // Obstructed path
          }
          currentRow += stepRow;
          currentCol += stepCol;
        }

        return true; // Move horizontally, vertically, or diagonally
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

    // If none of the conditions match, the move is invalid
    return false;
};

  const handleMove = (targetSquare) => {
    if (sourceSquare) {
      const { row: sourceRow, col: sourceCol } = sourceSquare;
      const { row: targetRow, col: targetCol } = targetSquare;
  
      // Perform move validation and logic
      const pieceAtSource = board[sourceRow][sourceCol];
      const pieceAtTarget = board[targetRow][targetCol];
  
      // Check if it is the turn of the player to move their pieces
      if ((isWhiteTurn && isWhitePiece(pieceAtSource)) || (!isWhiteTurn && isBlackPiece(pieceAtSource))) {
        // Validate the move based on the piece type and the source and target positions
        if (isMoveValid(pieceAtSource, sourceRow, sourceCol, targetRow, targetCol)) {
          // Move is valid, update the board state
          const updatedBoard = [...board];
          updatedBoard[targetRow][targetCol] = pieceAtSource;
          updatedBoard[sourceRow][sourceCol] = '';
  
          setBoard(updatedBoard);
  
          // Switch the turn to the opposite player
          setIsWhiteTurn((prevState) => !prevState);
        } else {
          // Invalid move for the specific piece type
          // Handle the invalid move accordingly
        }
      }
  
      // Reset the sourceSquare after the move is made
      setSourceSquare(null);
    } else {
      // Set the clicked square as the sourceSquare if it contains a piece
      if (board[targetSquare.row][targetSquare.col] !== '') {
        setSourceSquare(targetSquare);
      }
    }
  };

  return (
    <div className="chessboard">
      <div className="turn-indicator">
        {isWhiteTurn ? "White's Turn" : "Black's Turn"}
      </div>
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className="row">
          {row.map((piece, columnIndex) => {
            const square = { row: rowIndex, col: columnIndex };
            const isSelected =
              sourceSquare &&
              sourceSquare.row === rowIndex &&
              sourceSquare.col === columnIndex;
            const isValidMove =
              isSelected &&
              isMoveValid(
                board[sourceSquare.row][sourceSquare.col],
                sourceSquare.row,
                sourceSquare.col,
                rowIndex,
                columnIndex
              );
            const classNames = `square ${
              (rowIndex + columnIndex) % 2 === 0 ? 'light-square' : 'dark-square'
            }${isSelected ? ' selected' : ''}${
              isValidMove ? ' valid-move' : ''
            }`;

            return (
              <div
                key={columnIndex}
                className={classNames}
                onClick={() => handleMove(square)}
              >
                {piece && <div className="piece">{piece}</div>}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Chess;
