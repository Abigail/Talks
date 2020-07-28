class Board {
    //
    // Construct a board. We take the following options:
    //
    //  - size:       The size (in squares, not pixels) of the board,
    //                Defaults to 13, for a 13 x 13 board. 
    //  - width:      The width of the board (in squares). Only needed
    //                for non-square boards. Defaults to size.
    //  - heigth:     The heigth of the board (in squares). Only needed
    //                for non-square boards. Defaults to size.
    //  - rect_size:  The size of the squares of the board, in internal
    //                coordinates. Defaults to 10. It's very unlikely
    //                to be ever needed.
    //  - addto:      CSS identifier of element the SVG images should
    //                be placed in. Defaults to '.inner'.
    //  - id:         id of the SVG images. Defaults to 'board'.
    //
    constructor (args = {}) {
        this . rect_size = args . rect_size || 10;
        this . addto     = args . addto     || '.inner';
        this . id        = args . id        || 'board';

        let size         = args . size      || 13;
        let width        = args . width     || size;
        let height       = args . height    || size;

        //
        // Derived values.
        //   - min_x, min_y, max_x, max_y:
        //            The minimum/maximum coordinates of the squares on
        //            the board.
        //
        let min_x = "min_x" in args ? args . min_x
                                    : - (Math . floor (width  / 2));
        let min_y = "min_y" in args ? args . min_y
                                    : - (Math . floor (height / 2));
        let max_x = "max_x" in args ? args . max_x
                                    : min_x + width  - 1;
        let max_y = "max_y" in args ? args . max_y
                                    : min_y + height - 1;

        this . min_x = min_x;
        this . min_y = min_y;
        this . max_x = max_x;
        this . max_y = max_y;
    }

    //
    // Width and height are derived from the min_x, max_x values.
    //
    width () {
        return (this . max_x - this . min_x + 1);
    }
    height () {
        return (this . max_y - this . min_y + 1);
    }

    //
    // Set the bounding box. Useful if you first need a board object
    // to calculate boundaries.
    //
    set_bounding_box (min_x, min_y, max_x, max_y) {
        this . min_x = min_x;
        this . min_y = min_y;
        this . max_x = max_x;
        this . max_y = max_y;
    }

    //
    // Create the board: just the SVG image appropriately sized
    //
    create_board (args = {}) {
        let rect_size = this . rect_size;

        let width     = this . width  ();
        let height    = this . height ();
        
        //
        // Calculate the parameters for the viewbox.
        // 
        let viewbox_min_x  = (this . min_x - .5)  * rect_size;
        let viewbox_min_y  = (this . min_y - .5)  * rect_size;
        let viewbox_width  =         width        * rect_size;
        let viewbox_height =         height       * rect_size;

        //
        // Create the (empty) SVG image, and place it in
        // the relevant container.
        //
        let board = SVG () . addTo   (this . addto)
                           . id      (this . id)
                           . size    ('100%', '100%')
                           . viewbox (viewbox_min_x, viewbox_min_y,
                                      viewbox_width, viewbox_height);

        if (args . preserveAspectRatio) {
            board . attr ({preserveAspectRatio: args . preserveAspectRatio});
        }

        this . board = board;
    }


    //
    // Draw the empty board.
    //
    draw (args = {}) {
        let rect_size = this . rect_size;

        this . create_board (args);

        let board = this . board;

        //
        // Create the squares; we place the *centers* on specific
        // locations.
        //
        let x, y;
        for (x = this . min_x; x <= this . max_x; x ++) {
            for (y = this . min_y; y <= this . max_y; y ++) {
                let class_name = (x + y) % 2 ? "odd" : "even";
                let value      = this . to_value (x, y);
                let id_name    = "value-" + value;
                let rect = board . rect     (rect_size, rect_size)
                                 . cx       (x * rect_size)
                                 . cy       (y * rect_size)
                                 . id       (id_name)
                                 . addClass (class_name);
                if (args . with_values) {
                    this . place_value (value);
                }
            }
        }
    }

    //
    // Given a piece, draw the path it takes until trapped, or out of moves
    //
    draw_path (args = {}) {
        let piece = args  . piece;
        let moves = piece . run_list;
        let rect_size = this . rect_size;
        let delay     = args . delay || 20;

        //
        // Find bounding box
        //
        let [min_x, min_y] = this . positions ({value: moves [0]});
        let [max_x, max_y] = [min_x, min_y];

        for (let i = 1; i < moves . length; i ++) {
            let [x, y] = this . positions ({value: moves [i]});
            if (x < min_x) {min_x = x}
            if (x > max_x) {max_x = x}
            if (y < min_y) {min_y = y}
            if (y > max_y) {max_y = y}
        }

        this . set_bounding_box (min_x, min_y, max_x, max_y);

        this . create_board ();
        let board = this . board;

        //
        // Draw tiny dots
        //
        for (let x = min_x; x <= max_x; x ++) {
            for (let y = min_y; y <= max_y; y ++) {
                board . circle   (.2 * rect_size)
                      . center   ( x * rect_size, y * rect_size)
                      . addClass ("path-dot");
            }
        }

        //
        // Start dot
        //
        let [old_x, old_y] = this . positions ({value: moves [0]});
        board . circle   (.3 * rect_size)
              . center   (old_x * rect_size, old_y * rect_size)
              . addClass ("path-point");

        //
        // Path
        //
        for (let i = 1; i < moves . length; i ++) {
            let [old_x, old_y] = this . positions ({value: moves [i - 1]});
            let [new_x, new_y] = this . positions ({value: moves [i]});
            setTimeout (function () {
                board . line     (old_x * rect_size, old_y * rect_size,
                                  new_x * rect_size, new_y * rect_size) 
                      . addClass ("path-line");
                board . circle   (.3 * rect_size)
                      . center   (new_x * rect_size, new_y * rect_size)
                      . addClass ("path-point")
            }, delay * i);
        }

        //
        // Place the piece itself
        //
        let [final_x, final_y] =
             this . positions ({value: moves [moves . length - 1]});

        setTimeout (
            function (me) {
                me . place_piece (piece, {x: final_x, y: final_y})
            },
            delay * (moves . length - 1),
            this
        );

    }

    //
    // Find the x, y coordinates.
    //   - if args contains "x", and "y", use (x, y)
    //   - if args contains "value", convert this to coordinates
    //   - else, use (0, 0)
    //
    find_coordinates (args) {
        if (("x" in args) && ("y" in args)) {
            return [args . x, args . y];
        }
        if ("value" in args) {
            return this . to_coordinates (args . value);
        }
        return [0, 0];
    }

    //
    // Returns true if a position is on the board
    //
    on_board (args = {}) {
        let [x, y, value] = this . positions (args);
        if (x >= this . min_x && x <= this . max_x &&
            y >= this . min_y && y <= this . max_y) {
            return 1;
        }
        else {
            return 0;
        }
    }


    //
    // Place a circle on a specific location
    //
    place_circle (args) {
        let [x, y, value] = this . positions (args);

        let rect_size = this . rect_size;

        this . board . circle (.8 * rect_size)
                     . center (x * rect_size, y * rect_size)
                     . addClass ("circle");
    }

    //
    // Place an image on a specific location
    //
    place_image (image_name, args) {
        let [x, y, value] = this . positions (args);

        let path  = '../Images/' + image_name;
        let image = this . board . image (path);

        //
        // Scale the image to be 80% of the size a square,
        // and place it 10% away from the edges.
        //
        let rect_size = this . rect_size;
        image . size   (rect_size * .8, rect_size * .8);
        image . center (rect_size *  x, rect_size *  y);

        if ("id" in args) {
            image . id (args . id);
        }
        if ("class" in args) {
            image . addClass (args . class);
        }

        return (image);
    }

    //
    // Place a piece on a particular location. This just draws the
    // image on the given spot, and sets some coordinates.
    //
    place_piece (piece, args) {
        let [x, y, value] = this . positions (args);

        args . x     = x;
        args . y     = y;
        args . value = value;
        args . id    = "chess-piece";

        let image    = this . place_image (piece . image, args);

        this . current_piece               = {};
        this . current_piece . image       = image;
        this . current_piece . coordinates = [x, y];
        this . current_piece . value       = value;
    }

    //
    // Move current piece along a series of moves.
    //
    move_piece (args) {
        let move_list      = args . move_list;

        let current_piece  = this . current_piece;
        let image          = current_piece . image;
        let rect_size      = this . rect_size;

        let duration       = args . duration || 400;
        let delay          = args . delay    || 100;

        let callback       = args . callback || function (args) {1};

        let runner = image . animate ();

        let start = args . start || 0;
        let end   = move_list . length - 1;
        if (args . end && args . end < end) {
            end = args . end;
        }

        let me = this;

        let min_x = this . min_x;
        let min_y = this . min_y;
        let max_x = this . max_x;
        let max_y = this . max_y;

        for (let i = start; i <= end; i ++) {
            //
            // Get the next value or coordinates to move to;
            // for now, assume it's always a value.
            //
            let target = move_list [i];

            let [x, y, value] = this . positions ({value: target});

            //
            // If we're outside of the board, stop.
            //
            if (x < min_x || x > max_x || y < min_y || y > max_y) {
                break;
            }

            let [new_x, new_y, new_value] = this . positions ({value: target});

            let [old_x, old_y] = current_piece . coordinates;
            let  old_value     = current_piece . value;

            runner . animate ({duration: duration})
                   . center (new_x * rect_size, new_y * rect_size)
                   . after (function () {
                         me . hide_value (new_value);
                         me . place_circle ({x: old_x, y: old_y});
                         callback ({
                            value: new_value,
                            x:     new_x,
                            y:     new_y,
                            move:  i});
                     })
                   . delay (delay);
            ;

            current_piece . coordinates = [new_x, new_y];
            current_piece . value       =  new_value;
        }
    }



    //
    // Place text on a particular spot
    //
    place_text (text, args) {
        let [x, y, value] = this . positions (args);

        let rect_size = this . rect_size;

        let plain = this . board . plain (text)
                                 . attr ({x: x * rect_size,
                                          y: y * rect_size});

        if ("id" in args) {
            plain . id (args . id);
        }
        if ("class" in args) {
            plain . addClass (args . class);
        }

        return plain;
    }

    //
    // Place a given value on the corresponding square
    //
    place_value (value) {
        this . place_text (value, {value: value,
                                   id: "number-" + value,
                                   class: "number"});
    }

    //
    // Hide the given value from sight.
    //
    hide_value (value) {
        $('#number-' + value) . css ('display', 'none');
    }


    //
    // Place a series of values, with delays
    //
    place_values (args) {
        let from_value = args . from_value || 1;
        let to_value   = args . to_value;
        let init_delay = args . init_delay || 0;
        let delay      = args . delay      || 0;

        let count = 0;
        let value;
        if (delay || init_delay) {
            for (value = from_value; value <= to_value; value ++, count ++) {
                setTimeout (function (board, value) {
                                board . place_value (value)
                            },
                            init_delay + count * delay, 
                            this, value);
            }
        }
        else {
            for (value = from_value; value <= to_value; value ++) {
                this . place_value (value);
            }
        }
    }

    //
    // Takes the x, y coordinates of a square, returns the corresponding value
    //
    to_value (x, y) {
        let real_x = x - this . min_x;
        let real_y = y - this . min_y;

        return (real_y * (this . width ()) + real_x + 1);
    }

    //
    // Take a value, return the x, y coordinates (0, 0) is top-left corner.
    //
    to_coordinates (value) {
        let v = value - 1;
        let y = Math . floor (v / this . width ());
        let x = v % this . width ();

        return [x, y];
    }

    //
    // Returns three values: x, y, value
    //     - if x and y are given, use them, and calculate value
    //     - else, if value is given, use that, and calculate x, y
    //     - else, assume value = 1, and calculate x, y
    //
    positions (args) {
        let x, y, value;
        if ("x" in args && "y" in args) {
            value = this . to_value (args . x, args . y)
            x     = args . x;
            y     = args . y;
        }
        else {
            value  = args . value || 1;
            [x, y] = this . to_coordinates (value);
        }
        return [x, y, value];
    }
}



//
// Contains the calculations for a spiral. A spiral lables the
// squares in the following way:
//
//     17  16  15  14  13
//     18   5   4   3  12
//     19   6   1   2  11
//     20   7   8   9  10
//     21  22  23  24  25  ...
//
// The calculations have been lifted from Chess::Infinite::Board::Spiral.
//
class Spiral extends Board {
    //
    // Takes the x, y coordinates of a square, returns the corresponding value
    //
    to_value (x, y) {
        let abs_x = Math . abs (x);
        let abs_y = Math . abs (y);
        let max   = abs_x > abs_y ? abs_x : abs_y;
        let base  = Math . pow (2 * max - 1, 2);

        return y ==  max ? base + 7 * max + x
             : x == -max ? base + 5 * max + y
             : y == -max ? base + 3 * max - x
             :             base + 1 * max - y;
    }


    //
    // Takes value, returns a pair of x, y coordinates
    //
    to_coordinates (value) {
        let base = Math . ceil  (Math . sqrt (value));
        let ring = Math . floor (base / 2);
        let left = value - Math . pow (2 * ring - 1, 2);

        let x_val, y_val;

        if (left <= 2 * ring) {
            x_val =     ring;
            y_val =     ring - left;
        }
        else if (left <= 4 * ring) {
            x_val = 3 * ring - left;
            y_val =   - ring;
        }
        else if (left <= 6 * ring) {
            x_val =    - ring;
            y_val = -5 * ring + left;
        }
        else if (left <= 8 * ring) {
            x_val = -7 * ring + left;
            y_val =      ring;
        }

        return [x_val, y_val];
    }
}


//
// Board to show how a piece moves
//

class Piece extends Board {
    //
    // We're using a different default size
    //
    constructor (args) {
        if (!("size" in args)) {
            args . size = 7;
        }

        super (args);

        this . piece = args . piece;
    }

    draw (args = {}) {
        //
        // Draw the board, using the parent class
        //
        args  . preserveAspectRatio = 'xMaxYMin meet';
        super . draw (args);

        //
        // Draw the chess piece
        //
        let piece     = this . piece;
        let element   = this . place_image (piece . image,
                                          ({id: "chess-piece"}));

        let rect_size = this . rect_size;
        let me        = this;

        //
        // For all the places a piece can jump to, move the
        // piece to the destination, then quickly move it
        // back, leaving a circle where it jumped to.
        //
        if ("moves" in piece) {
            piece . moves . forEach (item => {
                let [x, y, steps] = item;
                let move = 0;
                let [this_x, this_y] = [0, 0];

                while (1) {
                    this_x += x;
                    this_y += y;
                    if (!this . on_board ({x: this_x, y: this_y})) {
                        break;
                    }
                    let [tx, ty] = [this_x, this_y];
                    element . animate ({duration: 500,
                                        delay:    move ? 200 : 500})
                            . dmove (x * rect_size,
                                     y * rect_size)
                            . after (function () {
                                  me . place_circle ({x: tx, y: ty});
                              });
                    move ++;
                    if (steps > 0 && move >= steps) {
                        break;
                    }
                }

                //
                // Move the piece back to the center
                //
                element . animate ({duration:   50,
                                    delay:     500,})
                        . center (0, 0);
            });
        }
    }
}
