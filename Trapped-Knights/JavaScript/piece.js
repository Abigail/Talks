//
// This contains the various functions which are called from the
// loaded () method -- which is the method being called after
// the page was loaded.
//


//
// piece_movements:
//   Method to set up the image which shows the movement of the piece.
//
function piece_movements (name) {
    piece = new Piece ({piece: chess_pieces [name]});

    piece . draw ();

    make_credits_line (name);
}
