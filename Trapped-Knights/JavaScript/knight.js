let piece;

function loaded () {
    piece = new Piece ({piece: chess_pieces . knight});

    piece . draw ();

    let credits = chess_pieces . knight . credits;

    let line;

    line = "<a href = '" + credits . link         + "'>"     +
                           credits . name         + "</a>. " +
           "<a href = '" + credits . licence_link + "'>"     +
                           credits . licence      + "</a>";

    $('.credits') . html ("Chess piece credits: " + line);
}
