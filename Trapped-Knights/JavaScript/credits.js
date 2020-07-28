function make_credits_line (piece) {

    let credits = chess_pieces [piece] ['credits'];

    let line;

    line = "<a href = '" + credits . link         + "'>"     +
                           credits . name         + "</a>. " +
           "<a href = '" + credits . licence_link + "'>"     +
                           credits . licence      + "</a>";

    $('.credits') . html ("Chess piece credits: " + line);
}
