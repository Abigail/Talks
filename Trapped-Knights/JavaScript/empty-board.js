var board;

function loaded () {
    board = new Spiral ({});

    board . draw ();

    var max_value = board . max_value;

    nav . add_todo (function () {board . place_value (1)});
    nav . add_todo (function () {
        board . place_values ({from_value:       2,
                               to_value:         9,
                               delay:          500})
    });
    nav . add_todo (function () {
        board . place_values ({from_value:      10,
                               to_value:        64,
                               delay:          100})
    });
    nav . add_todo (function () {
        board . place_values ({from_value:       65,
                               to_value:  max_value,
                               delay:            25})
    });

}
