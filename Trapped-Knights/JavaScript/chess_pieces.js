//
// chess_pieces contains configuration data for the chess pieces.
// Part of it is generated, and in chess_pieces_generated.js.
// Another part is static, found below in 'info'. This is then
// merged into 'chess_pieces'.
//

let info = {
    knight:  {manual_moves:   5},
};


for (name in info) {
    for (key in info [name]) {
        chess_pieces [name] [key] = info [name] [key];
    }
}
