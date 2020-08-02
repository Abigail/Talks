package GenerateFile;

use 5.028;

use strict;
use warnings;
no  warnings 'syntax';

use experimental 'signatures';
use experimental 'lexical_subs';


sub generate_file ($file) {
    #
    # Strip off the directory.
    #
    $file =~ s!^.*/!!;
    my ($name, $type) = $file =~ /^([^-]+)(?:-([^.]+))?\.mkdn$/ or return "";
    $type //= "";

    my $piece = join ' ' => map {ucfirst} split /_/ => $name;

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


1;

__END__
