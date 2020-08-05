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
    horse:                  {path_args:     {delay: 200}},
    janggi_elephant:        {spiral_args:   {min_x: -4,  min_y: -8, size: 15},
                             path_args:     {delay: 200}},
    wazir:                  {path_args:     {delay:  50}},
    dabbaba:                {path_args:     {delay: 100}},
    threeleaper:            {path_args:     {delay: 200}},
    ferz:                   {path_args:     {delay:  50}},
    alfil:                  {path_args:     {delay: 100}},
    tripper:                {path_args:     {delay: 200}},
};


for (name in info) {
    for (key in info [name]) {
        chess_pieces [name] [key] = info [name] [key];
    }
}
