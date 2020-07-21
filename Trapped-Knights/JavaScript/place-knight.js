var spiral;

function loaded () {
    spiral = new Spiral ({});

    spiral . draw ();

    spiral . place_values ({from_value: 1,
                           to_value: 225,});

    nav . add_todo (function () {
        $('#number-1') . css ('display', 'none');
    })
}
