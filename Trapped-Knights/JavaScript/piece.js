function piece_movements (name) {
    piece = new Piece ({piece: chess_pieces [name]});

    piece . draw ();

    make_credits_line (name);
}
