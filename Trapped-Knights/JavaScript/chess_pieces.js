//
// chess_pieces contains configuration data for the chess pieces.
// Part of it is generated, and in chess_pieces_generated.js.
// Another part is static, found below in 'info'. This is then
// merged into 'chess_pieces'.
//

let info = {
    knight:                 {manual_moves:   5},
   'silver_general:south':  {spiral_args:   {min_x: -12, min_y: - 3, size: 17}},
   'silver_general:west' :  {spiral_args:   {min_x: - 9, min_y: -10}},
};


for (name in info) {
    for (key in info [name]) {
        chess_pieces [name] [key] = info [name] [key];
    }
}
