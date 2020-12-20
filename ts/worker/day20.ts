import { AdventOutput } from '../common/common';
import { reverseString } from 'utility';

let EXTRACT_ID = /Tile (\d+):/;

function forEachBoarder(tile: string[], fn: (boarders: string[], id: number) => void): void {
    let match = EXTRACT_ID.exec(tile[0]);
    let id = Number(match![1]);
    let tile_boarders = [];
    tile_boarders.push(tile[1]);
    tile_boarders.push(reverseString(tile[1]));
    tile_boarders.push(tile[tile.length - 1]);
    tile_boarders.push(reverseString(tile[tile.length - 1]));

    for (let i = 0; i < tile[1].length; i += tile[1].length - 1) {
        let column = '';
        for (let j = 1; j < tile.length; j++) {
            column += tile[j][i];
        }
        tile_boarders.push(column);
        tile_boarders.push(reverseString(column));
    }

    fn(tile_boarders, id);

}

export default function (input: readonly string[]): AdventOutput {
    let tiles = input.join('\n').split('\n\n').map(x => x.split('\n'));
    let boarders = new Map<string, string[][]>();
    tiles.forEach(tile => forEachBoarder(tile, (tile_boarders) => tile_boarders.forEach((boarder) => {
        let adj_tiles = boarders.get(boarder);
        if (typeof adj_tiles !== 'object') {
            adj_tiles = [];
            boarders.set(boarder, adj_tiles);
        }
        adj_tiles.push(tile);
        /*if (count > 2) {
            throw 'Dupe boarder';
        }*/
    })));
    let part1 = 1;
    let corners: string[][] = [];
    tiles.forEach(tile => forEachBoarder(tile, (tile_boarders, id) => {
        let edge_count = 0;
        for (let boarder of tile_boarders) {
            let count = boarders.get(boarder)!.length;
            if (count === 1) {
                edge_count++;
            }
        }
        if (edge_count === 4) {
            part1 *= id;
            corners.push(tile);
        }
    }));

    corners.forEach(corner => {
        let grid: string[][][] = [];
        let line: string[][] = [];
        forEachBoarder(corner, (corner_boarders) => {
            if (boarders.get(corner_boarders[0])!.length !== 1) {
                corner = [corner[0]].concat(corner.slice(1).reverse());
            }
            if (boarders.get(corner_boarders[4])!.length !== 1) {
                corner = [corner[0]].concat(corner.slice(1).map(x => reverseString(x)));
            }
            line.push(corner);
            let done = false;
            while (!done) {
                let line_done = false;
                if (grid.length !== 0) {
                    forEachBoarder(grid[grid.length - 1][0], (top_boarders) => {
                        let adj = boarders.get(top_boarders[2])!;
                        adj = adj.filter(x => top_boarders.slice(4, 8).reduce((acc, val) => {
                            let same = true;
                            for (let i = 1; i < val.length; i++) {
                                same &&= x[i][0] === val[i - 1];
                            }
                            return acc && !same;
                        }, Boolean(true)));
                        if (adj.length === 0) {
                            done = true;
                            return;
                        }
                        if (adj.length === 2) {
                            throw 'Unknown error';
                        }

                        let next_tile = adj[0];
                        forEachBoarder(next_tile, (next_boarders) => {
                            if (boarders.get(corner_boarders[4])!.length !== 1) {
                                next_tile = [next_tile[0]].concat(next_tile.slice(1).map(x => reverseString(x)));
                            }

                            if (top_boarders[2] !== next_boarders[0] && top_boarders[2] !== next_boarders[1]) {
                                next_tile = [next_tile[0]].concat(next_tile.slice(1).reverse());
                            }
                        });

                        line.push(next_tile);
                    });
                }
                if (done) {
                    break;
                }
                while (!line_done) {
                    forEachBoarder(line[line.length - 1], (tile_boarders) => {
                        let adj = boarders.get(tile_boarders[6])!;
                        adj = adj.filter(x => tile_boarders.slice(0, 4).reduce((acc, val) => acc && x[1] !== val, Boolean(true)));
                        if (adj.length === 0) {
                            line_done = true;
                            return;
                        }
                        if (adj.length === 2) {
                            throw 'Unknown error';
                        }
                        let next_tile = adj[0];
                        forEachBoarder(next_tile, (next_boarders) => {
                            let rotate_y = grid.length === 0 && boarders.get(next_boarders[0])!.length !== 1;
                            if (grid.length !== 0) {
                                forEachBoarder(grid[grid.length - 1][line.length - 1], (top_boarders) => {
                                    if (top_boarders[2] !== next_boarders[0] && top_boarders[3] !== next_boarders[0]) {
                                        rotate_y = true;
                                    }
                                })
                            }
                            if (rotate_y) {
                                next_tile = [next_tile[0]].concat(next_tile.slice(1).reverse());
                            }
                            if (next_boarders[4] !== tile_boarders[6] && next_boarders[4] !== tile_boarders[7]) {
                                next_tile = [next_tile[0]].concat(next_tile.slice(1).map(x => reverseString(x)));
                            }
                        });

                        line.push(next_tile);
                    })
                }
                grid.push(line);
                line = [];
            }
        });
    });

    return { part1: String(part1) };
}
