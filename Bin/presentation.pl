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
use Chess::Infinite;

use Board;
use Piece;

my $KING     = "\x{265A}";
my $QUEEN    = "\x{265B}";
my $ROOK     = "\x{265C}";
my $BISHOP   = "\x{265D}";
my $KNIGHT   = "\x{265E}";
my $PAWN     = "\x{265F}";

my $ARCH_BISHOP    = "\x{271E}";   # Outlined Latin Cross
my $CHANCELLOR     = "\x{271D}";   # Latin Cross
my $AMAZON         = "\x{1F3F9}";  # Bow and arrow
my $SAMURAI        = "\x{58EB}";   # CJK Unified Ideograph
my $MONK           = "\x{1F64F}";  # Person With Folded Hands
my $ELEPHANT       = "\x{1F418}";
my $HORSE          = "\x{1F40E}";
my $CAMEL          = "\x{1F42B}";
my $ZEBRA          = "\x{1F993}";
my $HAWK           = "\x{1F985}";  # Hawk

my $BLACK_SHOGI    = "\x{2617}";
my $WHITE_SHOGI    = "\x{2616}";

my $W_ARROW  = "\x{2190}";
my $N_ARROW  = "\x{2191}";
my $E_ARROW  = "\x{2192}";
my $S_ARROW  = "\x{2193}";
my $NW_ARROW = "\x{2196}";
my $NE_ARROW = "\x{2197}";
my $SE_ARROW = "\x{2198}";
my $SW_ARROW = "\x{2199}";

my @wazir_targets  = ([1, 0], [-1, 0], [0, 1], [0, -1]);
my @ferz_targets   = ([1, 1], [1, -1], [-1, -1], [-1, 1]);
my @knight_targets = ([1, 2], [2, 1], [-1, 2], [2, -1],
                      [1, -2], [-2, 1], [-1, -2], [-2, -1]);
my @camel_targets  = ([1, 3], [3, 1], [-1, 3], [3, -1],
                      [1, -3], [-3, 1], [-1, -3], [-3, -1]);
my @zebra_targets  = ([2, 3], [3, 2], [-2, 3], [3, -2],
                      [2, -3], [-3, 2], [-2, -3], [-3, -2]);
my @king_targets   = ([ 1, 1], [ 1, 0], [ 1, -1], [ 0, 1], [ 0, -1],
                      [-1, 1], [-1, 0], [-1, -1]);
my @bishop_arrows  = ([$NE_ARROW,  1, -1], [$SE_ARROW,  1,  1], 
                      [$SW_ARROW, -1,  1], [$NW_ARROW, -1, -1]);
my @rook_arrows    = ([$N_ARROW, 0, -1], [$E_ARROW,  1, 0],
                      [$S_ARROW, 0,  1], [$W_ARROW, -1, 0]);

sub handle_piece;

BEGIN {
    opendir my $dir, "../Images" or die $!;
    foreach my $file (readdir $dir) {
        next unless $file =~ /\.svg/;
        unlink "../Images/$file" or die $!;
    }
    Common:: -> slide ("title", 1);
}
END {
    Common:: -> slide ("questions", 1);
    my @list = Common:: -> list;
    open my $fh, ">", "../Src/index" or die $!;
    say $fh $_ for @list;
    close $fh or die $!;
    chdir ".." or die $!;
    system "./present";
}


#       margin_left    =>  5,
#       margin_top     =>  5,
#       margin_bottom  => 10,
#       margin_right   => 20,

sub make_route ($piece, %args) {
    my $svg = Chess::Infinite::Grapher:: -> route (
        piece          => $piece,
        show_path      =>  1,
        show_terminals =>  1,
        colours        => "black,black",
        svg            =>  1,
        show_visited   =>  1,
        %args,
    );
    $svg -> style -> CDATA (<<~ '--');
        svg  {background-color: rgb(232,235,239);}
    --
    $svg;
}

sub route ($piece, $name, %args) {
    Common:: -> new -> init -> set_svg (make_route ($piece, %args))
                            -> save ("route-$name", inline => 1);
}

my $board = Board:: -> new -> init;
$board -> save ("empty-board");

#
# Creating the spiral
#
$board -> label (1) -> save ("board");
$board -> label (2) -> save ("board");
$board -> label ($_) for 3 .. 9;
$board -> save ("board");
$board -> label ($_) for 10 .. 49;
$board -> save ("board");
$board -> label ($_) for 50 .. 81;
$board -> save ("board");
$board -> label ($_) for 82 .. 169;
$board -> save ("board");


#
# Place the knight.
#
$board -> clear_text ("text-1");
$board -> label (1, $KNIGHT);
$board -> save ("start");

#
#  Slides about the Knight
#
{
    my $knight = Piece:: -> new -> init (piece => "Knight")
                                -> set_piece ($KNIGHT);
    $knight -> save ("knight");

    $knight -> target ( 1, -2);
    $knight -> target ( 1,  2);
    $knight -> target (-1,  2);
    $knight -> target (-1, -2);
    $knight -> target ( 2, -1);
    $knight -> target ( 2,  1);
    $knight -> target (-2,  1);
    $knight -> target (-2, -1);
    
    $knight -> save ("knight");
}
$board -> save ("start");

#
# Move knight
#
my @list = qw [
    1 10 3 6 9 4 7 2 5 8 11 14 29 32 15 12 27 24 45 20 23 44 41 18 35 38 19
    16 33 30 53 26 47 22 43 70 21 40 17 34 13 28 25 46 75 42 69 104 37 62 95
    58 55 86 51 48 77 114 73 108 151 68 103 64 67 36 39 66 63 96 59 56 87 52
    49 78 115 74 71 106 149 102 99 140 61 94 31 54 85 50 79 116
];
for (my $i = 1; $i < @list; $i ++) {
    my $from = $list [$i - 1];
    my $to   = $list [$i];
    $board -> move ($KNIGHT, $from, $to);
    $board -> save ("moved");
}


#
# Get a new board
#
my $board2 = Board:: -> new -> init (shift => [10, -23]);
my @values = (1124 .. 1136, 1263 .. 1275, 1410 .. 1422, 1565 .. 1577,
              1728 .. 1740, 1899 .. 1911, 2078 .. 2090, 2265 .. 2277,
              2460 .. 2472, 2663 .. 2675, 2874 .. 2886, 3093 .. 3105,
              3320 .. 3332);

#
# Find the move list of the knight
#
my $spiral = Chess::Infinite::Board::Spiral:: -> new -> init;
my $knight = piece "Knight";
   $knight -> run;
my $value_list = $knight -> value_list;
my @last = splice @$value_list, -6;
my %value_list = map {$_ => 1} @$value_list;

$board2 -> label ($_)  for grep {!$value_list {$_}} @values;
$board2 -> circle ($_) for grep { $value_list {$_}} @values;
$board2 -> move ($KNIGHT, 1, $last [0]);
$board2 -> save ("end-game");

for (my $i = 1; $i < @last; $i ++) {
    $board2 -> move ($KNIGHT, $last [$i - 1], $last [$i]);
    $board2 -> save ("end-game");
}

route $knight, "knight";



sub handle_piece (%args) {
    my $piece_name = $args {piece_name};
    my $character  = $args {character};
    my $targets    = $args {targets};
    my $arrows     = $args {arrows};
    my $free       = $args {free};
    my $heading    = $args {heading};
    my $name       = $args {name} // (lc $piece_name) =~ s/\s+//gr 
                                                      =~ s!/!-!gr;
    my $max_steps  = $args {max_steps} // 50;
    my $board_size = $args {board_size} // 13;

    my $movement_board = Piece:: -> new -> init      (piece => $piece_name)
                                        -> set_piece ($character);
    if ($heading) {
        foreach my $thingy (@{$targets || []}, @{$arrows || []},
                            @{$free    || []}) {
            if ($heading eq 'east') {
                @$thingy [-1, -2] = (- $$thingy [-2],   $$thingy [-1]);
            }
            elsif ($heading eq 'south') {
                @$thingy [-1, -2] = (- $$thingy [-1], - $$thingy [-2]);
            }
            elsif ($heading eq 'west') {
                @$thingy [-1, -2] = (  $$thingy [-2], - $$thingy [-1]);
            }
        }
        if ($arrows) {
            foreach my $arrow (@$arrows) {
                if ($heading eq 'east') {
                    if ($$arrow [0] eq $E_ARROW) {
                        $$arrow [0] = $N_ARROW;
                    }
                    elsif ($$arrow [0] eq $S_ARROW) {
                        $$arrow [0] = $E_ARROW;
                    }
                    elsif ($$arrow [0] eq $W_ARROW) {
                        $$arrow [0] = $S_ARROW;
                    }
                    elsif ($$arrow [0] eq $N_ARROW) {
                        $$arrow [0] = $W_ARROW;
                    }
                }
                else {
                    ...
                }
            }
        }
    }
                                        
    if ($targets) {
        foreach my $target (@$targets) {
            $movement_board -> target (@$target);
        }
    }
    if ($arrows) {
        foreach my $arrow (@$arrows) {
            $movement_board -> set_piece (@$arrow)
        }
    }
    if ($free) {
        foreach my $free (@$free) {
            $movement_board -> free (@$free)
        }
    }

    $movement_board -> save ($name, index_me => 1);

    unless (%args {no_run}) {
        my $piece = piece $piece_name, heading => $heading;
           $piece -> run (max_moves => $args {max_moves} // 2000);
        unless (%args {skip_steps}) {
            my $board = Board:: -> new -> init (board_width => $board_size);
            $board -> label ($_) for 2 .. ($board_size ** 2);
            $board -> label (1, $character);
            $board -> save ("board-$name");

            my $value_list = $piece -> value_list;
            foreach my $move (1 .. $max_steps) {
                last if $move >= @$value_list;
                my $from = $$value_list [$move - 1];
                my $to   = $$value_list [$move];
                last if $to > ($board_size ** 2);
                $board -> move ($character, $from, $to);
                $board -> save ("board-$name");
            }
        }

        my %route_params;

        route $piece, $name, %route_params;
    }
}


#
# KING
#
handle_piece  piece_name =>  "King",
              character  =>  $KING,
              targets    =>  [[ 1, 1], [ 1, 0], [ 1, -1],
                              [ 0, 1],          [ 0, -1],
                              [-1, 1], [-1, 0], [-1, -1]],
              max_steps  =>  50,
              max_moves  =>  4000,
;

#
# ROOK
#
handle_piece  piece_name =>  "Rook",
              character  =>  $ROOK,
              arrows     =>  [[$N_ARROW, 0, -1], [$E_ARROW,  1, 0],
                              [$S_ARROW, 0,  1], [$W_ARROW, -1, 0]],
              no_run     =>  1;

#
# QUEEN
#
handle_piece  piece_name =>  "Queen",
              character  =>  $QUEEN,
              arrows     =>  [[$N_ARROW,   0, -1], [$E_ARROW,   1,  0],
                              [$S_ARROW,   0,  1], [$W_ARROW,  -1,  0],
                              [$NE_ARROW,  1, -1], [$SE_ARROW,  1,  1],
                              [$SW_ARROW, -1,  1], [$NW_ARROW, -1, -1]],
              no_run     =>  1;


#
# BISHOP
#
{
    my $piece = Piece:: -> new -> init (piece => "Bishop")
                               -> set_piece ($BISHOP);

    $piece   -> set_piece ($NE_ARROW,  1, -1);
    $piece   -> set_piece ($SE_ARROW,  1,  1);
    $piece   -> set_piece ($SW_ARROW, -1,  1);
    $piece   -> set_piece ($NW_ARROW, -1, -1);
    
    $piece   -> save ("bishop");


    my $board_bishop = Board:: -> new -> init;
    $board_bishop -> label ($_) for 1 .. 169;
    $board_bishop -> clear_text ("text-1");
    $board_bishop -> label (1, $BISHOP);
    $board_bishop -> save ("board-bishop");

    my $bishop = piece "bishop";
       $bishop -> run (max_moves => 2000);
    my $value_list = $bishop -> value_list;
    foreach my $val (1 .. 49) {
        my $from = $$value_list [$val - 1];
        my $to   = $$value_list [$val];
        last if $to > 169;
        $board_bishop -> move ($BISHOP, $from, $to);
        $board_bishop -> save ("board-bishop");
    }

    route $bishop, "bishop", show_visited => 1;
}

#
# PAWN
#
handle_piece  piece_name =>  "Pawn",
              character  =>  $PAWN,
              targets    =>  [[0, -1]],
              no_run     =>  1;

Common:: -> slide ("shogi", 1);


#
# Shogi
#
{
    my $piece = Piece:: -> new -> init (piece => "Golden General")
                               -> set_piece ($BLACK_SHOGI);
  # $piece  -> target ( 1,  1);
    $piece  -> target ( 1,  0);
    $piece  -> target ( 1, -1);

    $piece  -> target ( 0,  1);
    $piece  -> target ( 0, -1);

  # $piece  -> target (-1,  1);
    $piece  -> target (-1,  0);
    $piece  -> target (-1, -1);

    $piece   -> save ("goldgeneral", index_me => 1);
}



handle_piece  piece_name =>  "Silver General",
              character  =>  $WHITE_SHOGI,
              targets    =>  [[1, 1], [1, -1], [0, -1], [-1, 1], [-1, -1]];

handle_piece  piece_name =>  "Shogi Knight",
              character  =>  $BLACK_SHOGI,
              targets    =>  [[-1, -2], [1, -2]],
              max_moves  =>  20;

handle_piece  piece_name =>  "Lance",
              character  =>  $BLACK_SHOGI,
              arrows     =>  [[$N_ARROW, 0, -1]],
              no_run     =>  1;

handle_piece  piece_name =>  "Dragon Horse",
              character  =>  $BLACK_SHOGI,
              arrows     =>  [[$NE_ARROW,  1, -1], [$SE_ARROW,  1,  1],
                              [$SW_ARROW, -1,  1], [$NW_ARROW, -1, -1]],
              targets    =>  [[1, 0], [-1, 0], [0, 1], [0, -1]],
              no_run     =>  1;

handle_piece  piece_name =>  "Dragon King",
              character  =>  $BLACK_SHOGI,
              arrows     =>  [[$N_ARROW, 0, -1], [$E_ARROW,  1, 0],
                              [$S_ARROW, 0,  1], [$W_ARROW, -1, 0]],
              targets    =>  [[1, 1], [-1, 1], [-1, -1], [1, -1]],
              no_run     =>  1;

Common:: -> slide ("xiangqi");

handle_piece  piece_name =>  "Elephant",
              character  =>  $ELEPHANT,
              targets    =>  [[2, 2], [-2, 2], [-2, -2], [2, -2]],
              free       =>  [[1, 1], [-1, 1], [-1, -1], [1, -1]],
              max_moves  =>  500;

handle_piece  piece_name =>  "Horse",
              character  =>  $HORSE,
              targets    =>  [[1, 2], [-1, 2], [-1, -2], [1, -2],
                              [2, 1], [2, -1], [-2, -1], [-2, 1]],
              free       =>  [@wazir_targets],
              max_steps  =>  100,
              board_size =>  15;


handle_piece  piece_name =>  "Cannon/Chariot",
              character  =>  $ROOK,
              arrows     =>  [[$N_ARROW, 0, -1], [$E_ARROW,  1, 0],
                              [$S_ARROW, 0,  1], [$W_ARROW, -1, 0]],
              no_run     =>  1;

Common:: -> slide ("janggi");

handle_piece  piece_name =>  "Janggi Elephant",
              character  =>  $ELEPHANT,
              targets    =>  [[2, 3], [-2, 3], [-2, -3], [2, -3],
                              [3, 2], [3, -2], [-3, -2], [-3, 2]],
              free       =>  [[1, 0], [-1, 0], [ 0,  1], [0, -1],
                              [2, 1], [2, -1], [-2, 1], [-2, -1],
                              [1, 2], [-1, 2], [1, -2], [-1, -2]],
              max_steps  =>  500,
              board_size =>  19;

Common:: -> slide ("combined");

handle_piece  piece_name => "Chancellor",
              character  => $CHANCELLOR,
              targets    => \@knight_targets,
              arrows     => \@rook_arrows,
              no_run     => 1;

handle_piece  piece_name => "Amazon",
              character  => $AMAZON,
              targets    => \@knight_targets,
              arrows     => [@rook_arrows, @bishop_arrows],
              no_run     => 1;

handle_piece  piece_name => "Samurai",
              character  => $SAMURAI,
              targets    => [@knight_targets, @king_targets],
              no_run     => 1;

handle_piece  piece_name => "Monk",
              character  => $MONK,
              targets    => [[0, 1], [-1, 0], [1, 0], [0, -1]],
              arrows     => [@bishop_arrows],
              no_run     => 1;

handle_piece  piece_name => "Archbishop",
              character  => $ARCH_BISHOP,
              targets    => [[1, 2], [2, 1], [-1, 2], [2, -1],
                             [1, -2], [-2, 1], [-1, -2], [-2, -1]],
              arrows     =>  [[$NE_ARROW,  1, -1], [$SE_ARROW,  1,  1],
                              [$SW_ARROW, -1,  1], [$NW_ARROW, -1, -1]],
              max_steps  =>  200,
              max_moves  => 7000;


Common:: -> slide ("leapers");

handle_piece  piece_name => "Wazir",
              character  => "W",
              targets    => \@wazir_targets,
              no_run     => 1;

handle_piece  piece_name => "Ferz",
              character  => "F",
              targets    => \@ferz_targets;

handle_piece  piece_name => "Camel",
              character  => $CAMEL,
              targets    => \@camel_targets,
              max_moves  => 4000;

handle_piece  piece_name => "Zebra",
              character  => $ZEBRA,
              targets    => \@zebra_targets,
              max_moves  => 5000;

Common:: -> slide ("other-01");

handle_piece  piece_name => "Hawk",
              character  => $HAWK,
              targets    => [[2, 2], [2, 0], [2, -2], [0, 2], [0, -2],
                             [-2, 2], [-2, 0], [-2, -2],
                             [3, 3], [3, 0], [3, -3], [0, 3], [0, -3],
                             [-3, 3], [-3, 0], [-3, -3]],
              skip_steps => 1;

handle_piece  piece_name => "Gnohmon",
              character  => "\x{011C}",
              targets    => [[1, -2], [-1, -2], [1, 2], [-1, 2],
                             [0, 1], [0, -1]],
              arrows     => [[$N_ARROW, 0, -3], [$E_ARROW,  3, 0],
                             [$S_ARROW, 0,  3], [$W_ARROW, -3, 0]],
              skip_steps => 1;


handle_piece  piece_name => "Gnohmon",
              character  => "\x{011E}",
              targets    => [[1, -2], [-1, -2], [1, 2], [-1, 2],
                             [0, 1], [0, -1]],
              arrows     => [[$N_ARROW, 0, -3], [$E_ARROW,  3, 0],
                             [$S_ARROW, 0,  3], [$W_ARROW, -3, 0]],
              heading    => 'east',
              skip_steps => 1;

handle_piece  piece_name => "Drunk Elephant",
              character  => $ELEPHANT,
              targets    => [@ferz_targets, [0, -1], [1, 0], [-1, 0]],
              skip_steps => 1;

handle_piece  piece_name => "Falcon",
              character  => $HAWK,
              arrows     => [[$NE_ARROW, 1, -1], [$NW_ARROW, -1, -1],
                             [$S_ARROW, 0, 1]],
              skip_steps => 1;

handle_piece  piece_name => "Hunter",
              character  => $AMAZON,
              arrows     => [[$SE_ARROW, 1,  1], [$SW_ARROW, -1,  1],
                             [$N_ARROW, 0, -1]],
              skip_steps => 1;


__END__

__END__
