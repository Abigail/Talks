#!/opt/perl/bin/perl

use 5.028;

use strict;
use warnings;
no  warnings 'syntax';

use lib "/Users/abigail/Perl/CPAN/Chess-Infinite/lib/";
use lib ".";

use experimental 'signatures';
use experimental 'lexical_subs';

use Chess::Infinite::Board::Spiral;
use Common;

use SVG;


package Piece {
    use Hash::Util::FieldHash qw [fieldhash];
    our @ISA = qw [Common];

    fieldhash my %square_width;    # Pixels
    fieldhash my %square_height;   # Pixels
    fieldhash my %board_width;     # Squares
    fieldhash my %board_height;    # Squares
    fieldhash my %offset_top;      # Pixels
    fieldhash my %offset_left;     # Pixels
    fieldhash my %piece;
    fieldhash my %font_size;

    sub new ($class) {
        bless do {\my $var} => $class;
    }

    sub init ($self, %args) {
        $square_width  {$self} = $args {square_width}  // 85;
        $square_height {$self} = $args {square_height} // $square_width {$self};
        $board_width   {$self} = $args {board_width}   //  7;
        $board_height  {$self} = $args {board_height}  // $board_width  {$self};
        $offset_top    {$self} = $args {offset_top}    // 50;
        $offset_left   {$self} = $args {offset_left}   // $offset_top   {$self};
        $piece         {$self} = $args {piece} // die;
        $font_size     {$self} = $square_width {$self} * .8;

        my $width  = $square_width  {$self} * $board_width  {$self} +
                                              $offset_left {$self};
        my $height = $square_height {$self} * (1 + $board_height {$self}) +
                                               $offset_top  {$self};

        $self -> set_svg (SVG:: -> new (
            width  => $width,
            height => $height,
        ));

        $self -> init_style;
        $self -> init_board;

        $self -> svg -> text (x => ($width + $square_width {$self}) / 2,
                              y => $height - $font_size {$self} / 2,
                              class => "label")
                     -> cdata ($piece {$self});

        $self;
    }

    sub init_style ($self) {
        my $font_size = $font_size {$self};

        $self -> svg -> style -> CDATA (<<~ "--");
            rect.odd      {fill: brown;}
            rect.even     {fill: rgb(232,235,239);}
            text          {font-size: ${font_size}px;
                           text-anchor: middle;}
            circle.target {fill: black;}
            circle.free   {fill: none; stroke: black}
        --

        $self;
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
        (int $board_width  {$self} / 2 + $x,
         int $board_height {$self} / 2 + $y);
    }

    sub set_piece ($self, $text, $x = 0, $y = 0) {
        #
        # Offset *in* square
        #
        my $sq_offset_x = $square_width  {$self} / 2;
        my $sq_offset_y = $square_height {$self} / 2 + $font_size {$self} / 4;

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

        $self -> svg -> text (
            x  => $text_x,
            y  => $text_y,
        ) -> cdata ($text);

        $self
    }

    sub target ($self, $x, $y) {
        my ($real_x, $real_y) = $self -> real_coordinates ($x, $y);

        my $cx = ($real_x + .5) * $square_width  {$self} + $offset_left {$self};
        my $cy = ($real_y + .5) * $square_height {$self} + $offset_top  {$self};

        $self -> svg -> circle (cx => $cx,
                                cy => $cy,
                                 r => $square_width {$self} / 4,
                                class => "target");
        $self;
    }
    sub free   ($self, $x, $y) {
        my ($real_x, $real_y) = $self -> real_coordinates ($x, $y);

        my $cx = ($real_x + .5) * $square_width  {$self} + $offset_left {$self};
        my $cy = ($real_y + .5) * $square_height {$self} + $offset_top  {$self};

        $self -> svg -> circle (cx => $cx,
                                cy => $cy,
                                 r => $square_width {$self} / 4,
                                class => "free");
        $self;
    }
}

__END__
