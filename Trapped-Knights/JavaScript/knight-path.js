let board;

function loaded () {
    let knight = chess_pieces . knight;

    board = new Spiral;

    board . draw_path ({piece: knight});
}
