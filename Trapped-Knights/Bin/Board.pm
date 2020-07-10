use 5.028;

use strict;
use warnings;
no  warnings 'syntax';

use lib "/Users/abigail/Perl/CPAN/Chess-Infinite/lib/";
use lib ".";

use experimental 'signatures';
use experimental 'lexical_subs';

use Chess::Infinite::Board::Spiral;
use Chess::Infinite;

my $KNIGHT = "\x{265E}";

use SVG;

package Board {
    use Hash::Util::FieldHash qw [fieldhash];
    use Common;

    our @ISA = qw [Common];

    fieldhash my %square_width;    # Pixels
    fieldhash my %square_height;   # Pixels
    fieldhash my %board_width;     # Squares
    fieldhash my %board_height;    # Squares
    fieldhash my %offset_top;      # Pixels
    fieldhash my %offset_left;     # Pixels
    fieldhash my %shift;

    sub new ($class) {
        bless do {\my $var} => $class;
    }

    sub init ($self, %args) {
        $square_width  {$self} = $args {square_width}  // 60;
        $square_height {$self} = $args {square_height} // $square_width {$self};
        $board_width   {$self} = $args {board_width}   // 13;
        $board_height  {$self} = $args {board_height}  // $board_width  {$self};
        $offset_top    {$self} = $args {offset_top}    // 50;
        $offset_left   {$self} = $args {offset_left}   // $offset_top   {$self};
        $shift         {$self} = $args {shift}         // [0, 0];

        $self -> set_svg (SVG:: -> new (
            width  => $square_width  {$self} * $board_width  {$self} +
                                               $offset_left  {$self},
            height => $square_height {$self} * $board_height {$self} +
                                               $offset_top   {$self},
        ));

        $self -> init_style;
        $self -> init_board;
    }

    sub init_style ($self) {
        my $style     = $self -> svg -> style;

        $style -> CDATA (<<~ "--");
            rect.odd      {fill: brown;}
            rect.even     {fill: rgb(232,235,239);}
            text          {text-anchor: middle;}
            text.text     {font-size: 40px;}
            text.number   {font-size: 20px;}
            circle.target {fill: black;}
        --
        $style;
    }


    sub draw_square ($self, $x, $y) {
        my $class = ($x + $y) % 2 ? "odd" : "even";

        $self -> svg -> rect (
            x      =>  $offset_left {$self} + $x * $square_width  {$self},
            y      =>  $offset_top  {$self} + $y * $square_height {$self},
            width  =>  $square_width  {$self},
            height =>  $square_height {$self},
            class  =>  $class,
        );

        $self;
    }

    sub init_board ($self) {
        foreach my $y (0 .. $board_height {$self} - 1) {
            foreach my $x (0 .. $board_width {$self} - 1) {
                $self -> draw_square ($x, $y);
            }
        }

        $self;
    }

    sub real_coordinates ($self, $x, $y) {
        (int $board_width  {$self} / 2 + $x - $shift {$self} [0],
         int $board_height {$self} / 2 + $y - $shift {$self} [1]);
    }

    sub label ($self, $number, $text = undef) {
        #
        # Offset *in* square
        #
        my $sq_offset_x = $square_width  {$self} / 2;
        my $sq_offset_y = $square_height {$self} / 2 + 5;

        my ($x, $y) = Chess::Infinite::Board::Spiral::
                                      -> to_coordinates ($number);

        #
        # Coordinates of middle square
        #
        my ($middle_x, $middle_y) = $self -> real_coordinates ($x, $y);

        #
        # Offset *to* square
        #
        my $offset_x = $middle_x * $square_width  {$self} +
                                   $offset_left   {$self};
        my $offset_y = $middle_y * $square_height {$self} +
                                   $offset_top    {$self};

        my $text_x = $offset_x + $sq_offset_x;
        my $text_y = $offset_y + $sq_offset_y;

        my $id     = "text-$number";
           $id    .= "-a" if defined $text;
        my $class  = defined $text ? "text" : "number";

        $self -> svg -> text (
               x => $text_x,
               y => $text_y,
              id => $id,
           class => $class,
        ) -> cdata ($text // $number);

        $self
    }

    sub clear_text ($self, $label) {
        $self -> svg -> style -> CDATA ("#$label  {display: none}");
    }

    sub circle ($self, $number) {
        #
        # Map number coordinates
        #
        my ($x, $y) = Chess::Infinite::Board::Spiral::
                                          -> to_coordinates ($number);
        $x -= $shift {$self} [0];
        $y -= $shift {$self} [1];
        my $real_x = $x + int $board_width  {$self} / 2;
        my $real_y = $y + int $board_height {$self} / 2;
        my $cx = ($real_x + .5) * $square_width  {$self} + $offset_left {$self};
        my $cy = ($real_y + .5) * $square_height {$self} + $offset_top  {$self};

        $self -> svg -> circle (cx => $cx,
                                cy => $cy,
                                 r => $square_width {$self} / 4,
                             class => "target");
    }

    sub move ($self, $piece, $from, $to) {
        if ($from) {
            $self -> clear_text ("text-$from-a");
            $self -> circle ($from);
        }
        $self -> clear_text ("text-$to");
        $self -> label ($to, $piece);
        $self;
    }
}


__END__
