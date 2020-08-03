package GenerateFile;

use 5.028;

use strict;
use warnings;
no  warnings 'syntax';

use experimental 'signatures';
use experimental 'lexical_subs';

my %unique_files = (
    'xiangqi.mkdn'   =>  \&xiangqi
);

sub generate_file ($file) {
    #
    # Strip off the directory.
    #
    $file =~ s!^.*/!!;

    if (my $sub = $unique_files {$file}) {
        return $sub -> ();
    }

    my ($name, $type) = $file =~ /^([^-]+)(?:-([^.]+))?\.mkdn$/ or return "";
    $type //= "";
    my $heading = "";

    if ($name =~ /:/p) {
        $heading = ${^POSTMATCH};
        $name    = ${^PREMATCH};
    }

    my $piece = join ' ' => map {ucfirst} split /_/ => $name;
    $piece .= " (\u$heading)" if $heading;

    if ($type eq 'move') {
        return <<~ "--" =~ s/^\s+//gmr;
            # Move the $piece

            %% Template: move
        --
    }

    if ($type eq 'path') {
        return <<~ "--" =~ s/^\s+//gmr;
            # $piece\'s Path

            %% Template: path
        --
    }

    return "";
}


sub xiangqi () {
    my @pieces = (
        ['General',  'King',                       '5E25', '5C07'],
        ['Adviser',  'Ferz',                       '4ED5', '58EB'],
        ['Elephant', 'Alfil<sup>&dagger;</sup>',   '76F8', '8C61'],
        ['Chariot',  'Rook',                       '4FE5', '8ECA'],
        ['Horse',    'Knight<sup>&dagger;</sup>',  '508C', '99AC'],
        ['Cannon',   'Rook<sup>&ddagger;</sup>',   '70AE', '7832'],
        ['Soldier',  'Pawn<sup>&para;</sup>',      '5175', '5352'],
    );

    my $text = <<~ '--' =~ s/^\s+//grm;
        # Xiangqi (Chinese Chess)

        <div class = 'main'>
        [[
    --
    foreach my $piece (@pieces) {
        my ($name, $moves_as, $red, $black) = @$piece;
        $text .= "* $name (" .
                 "<span class = 'xiangqi-red'>&#x$red;</span>/" .
                 "<span class = 'xiangqi-black'>&#x$black;</span>)";
        if ($moves_as) {
            my $link = lc ($moves_as =~ s/<.*//r) . ".html";
            $text .= "; moves as [$moves_as]($link)";
        }
        $text .= ".\n";
    }

    $text .= <<~ '--' =~ s/^\s+//grm;

        <div class = 'footnotes'>
        <sup>&dagger;</sup>Cannot jump pieces.
        <sup>&ddagger;</sup>Captures differently.
        <sup>&para;</sup>More or less.
        </div>
        ]]
        </div>
    --

    $text
}


1;

__END__
