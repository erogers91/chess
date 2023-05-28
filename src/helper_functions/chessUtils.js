//Helper Functions
export const isWhitePiece = (piece) => {
    const whitePieces = ['♙', '♖', '♘', '♗', '♕', '♔'];
    return whitePieces.includes(piece);
};

export const isBlackPiece = (piece) => {
    const blackPieces = ['♟', '♜', '♞', '♝', '♛', '♚'];
    return blackPieces.includes(piece);
};
