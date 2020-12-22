import { AdventOutput } from '../common/common';

function combat(player1: number[], player2: number[], recursive: boolean): [boolean, number[]] {
    let seen_decks = new Set<string>();

    while (player1.length > 0 && player2.length > 0) {
        let player1_id = player1.map(x => String.fromCharCode(x)).join('');
        let player2_id = player2.map(x => String.fromCharCode(x)).join('');
        let id = String.fromCharCode(player1.length) + player1_id + player2_id;
        
        if (seen_decks.has(id)) {
            return [true, player1];
        }
        seen_decks.add(id);

        let carda = player1[0];
        let cardb = player2[0];
        player1.shift();
        player2.shift();

        let player1_won_round = carda > cardb;
        if (recursive && player1.length >= carda && player2.length >= cardb) {
            let new_deck_play1 = player1.slice(0, carda);
            let new_deck_play2 = player2.slice(0, cardb);

            player1_won_round = combat(new_deck_play1, new_deck_play2, recursive)[0];
        }

        if (player1_won_round) {
            player1.push(carda, cardb);
        } else {
            player2.push(cardb, carda);
        }
    }

    let winner = player1;
    let player1_won = player1.length !== 0;
    if (!player1_won) {
        winner = player2;
    }

    return [player1_won, winner];
}

export default function(input: readonly string[]): AdventOutput {
    let decks = input.join('\n').split('\n\n').map(x => x.split('\n'));

    let player1 = decks[0].slice(1).map(x => Number(x));
    let player2 = decks[1].slice(1).map(x => Number(x));

    let part1_win = combat(player1.concat(), player2.concat(), false)[1];
    let part1 = String(part1_win.reduce((acc, val, index) => { 
        index = part1_win.length - index;
        return acc + val * index;
    }, 0));

    let part2_win = combat(player1, player2, true)[1];
    let part2 = String(part2_win.reduce((acc, val, index) => { 
        index = part2_win.length - index;
        return acc + val * index;
    }, 0));

    return { part1, part2 };
}
