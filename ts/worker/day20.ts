import { AdventOutput } from '../common/common';
import { reverseString } from 'utility';

let EXTRACT_ID = /Tile (\d+):/;

function parseBoarders(tile: string[]): [string[], number] {
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

    return [tile_boarders, id];
}

function rotate90(tile: string[]): string[] {
    let header = tile[0];
    let body = tile.slice(1);

    let new_tile = [header];
    for (let i = 0; i < body[0].length; i++) {
        let new_line = '';
        for (let j = 0; j < body.length; j++) {
            new_line += body[j][i];
        }
        new_tile.push(new_line);
    }

    return new_tile;
}

function tileEquality(boarders: string[], tile: string[]): boolean {
    let [adj_boarders] = parseBoarders(tile);
    adj_boarders.sort();
    let this_boarders = boarders.concat();
    this_boarders.sort();
    for (let i = 0; i < this_boarders.length; i++) {
        if (adj_boarders[i] !== this_boarders[i]) {
            return false;
        }
    }
    return true;
}

let SEAMONSTER = ('                  # \n' +
                  '#    ##    ##    ###\n' +
                  ' #  #  #  #  #  #   '
).split('\n').map(x => x.split('').map(y => y === '#'));



export default function (input: readonly string[]): AdventOutput {
    let tiles = input.join('\n').split('\n\n').map(x => x.split('\n'));
    let boarders = new Map<string, string[][]>();
    tiles.forEach(tile => parseBoarders(tile)[0].forEach((boarder) => {
        let adj_tiles = boarders.get(boarder);
        if (typeof adj_tiles !== 'object') {
            adj_tiles = [];
            boarders.set(boarder, adj_tiles);
        }
        adj_tiles.push(tile);
    }));
    let part1 = 1;
    let corners: string[][] = [];
    tiles.forEach(tile => {
        let [tile_boarders, id] = parseBoarders(tile);
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
    });
    corners = corners.concat(corners.map(x => rotate90(x)));

    let part2 = 0;
    corners.forEach(corner => {
        let grid: string[][][] = [];
        let line: string[][] = [];
        let [corner_boarders] = parseBoarders(corner);
        if (boarders.get(corner_boarders[0])!.length !== 1) {
            corner = [corner[0]].concat(corner.slice(1).reverse());
        }
        if (boarders.get(corner_boarders[4])!.length !== 1) {
            corner = [corner[0]].concat(corner.slice(1).map(x => reverseString(x)));
        }
        line.push(corner);
        while (true) {
            if (grid.length !== 0) {
                let [top_boarders] = parseBoarders(grid[grid.length - 1][0]);
                let adj = boarders.get(top_boarders[2])!;
                adj = adj.filter(x => !tileEquality(top_boarders, x));
                if (adj.length === 0) {
                    break;
                }
                if (adj.length === 2) {
                    throw 'Unknown error';
                }

                let next_tile = adj[0];
                let [next_boarders] = parseBoarders(next_tile);

                if (next_boarders.slice(4, 8).reduce((acc, val) => acc || val === top_boarders[2], false)) {
                    next_tile = rotate90(next_tile);
                    [next_boarders] = parseBoarders(next_tile);
                }

                if (boarders.get(next_boarders[4])!.length !== 1) {
                    next_tile = [next_tile[0]].concat(next_tile.slice(1).map(x => reverseString(x)));
                }

                if (top_boarders[2] !== next_boarders[0] && top_boarders[2] !== next_boarders[1]) {
                    next_tile = [next_tile[0]].concat(next_tile.slice(1).reverse());
                }

                line.push(next_tile);
            }
            while (true) {
                let [tile_boarders] = parseBoarders(line[line.length - 1]);
                let adj = boarders.get(tile_boarders[6])!;
                adj = adj.filter(x => !tileEquality(tile_boarders, x));
                if (adj.length === 0) {
                    break;
                }
                if (adj.length === 2) {
                    throw 'Unknown error';
                }
                let next_tile = adj[0];
                let [next_boarders] = parseBoarders(next_tile);

                if (next_boarders.slice(0, 4).reduce((acc, val) => acc || val === tile_boarders[6], false)) {
                    next_tile = rotate90(next_tile);
                    [next_boarders] = parseBoarders(next_tile);
                }

                let flip_y = grid.length === 0 && boarders.get(next_boarders[0])!.length !== 1;
                if (grid.length !== 0) {
                    let [top_boarders] = parseBoarders(grid[grid.length - 1][line.length]);
                    if (top_boarders[2] !== next_boarders[0] && top_boarders[3] !== next_boarders[0]) {
                        flip_y = true;
                    }
                }
                if (flip_y) {
                    next_tile = [next_tile[0]].concat(next_tile.slice(1).reverse());
                }
                if (next_boarders[4] !== tile_boarders[6] && next_boarders[4] !== tile_boarders[7]) {
                    next_tile = [next_tile[0]].concat(next_tile.slice(1).map(x => reverseString(x)));
                }

                line.push(next_tile);
            }
            grid.push(line);
            line = [];
        }
        let rastor_image = [];
        let rows = grid.length * grid[0][0].length;
        let columns = grid[0].length * grid[0][0][1].length;
        for (let i = 0; i < rows; i++) {
            let tile_row_offset = Math.floor(i / grid[0][0].length);
            let pixel_row_offset = i % grid[0][0].length;
            if (pixel_row_offset === 0 || pixel_row_offset === 1 || pixel_row_offset === grid[0][0].length - 1) {
                continue;
            }
            let new_row = [];
            for (let j = 0; j < columns; j++) {
                let tile_column_offset = Math.floor(j / grid[0][0][1].length);
                let pixel_column_offset = j % grid[0][0][1].length;
                if (pixel_column_offset === 0 || pixel_column_offset === grid[0][0][1].length - 1) {
                    continue;
                }
                new_row.push(grid[tile_row_offset][tile_column_offset][pixel_row_offset][pixel_column_offset] === '#');
            }
            rastor_image.push(new_row);
        }

        let monster_visable = false;
        for (let i = 0; i < rastor_image.length - SEAMONSTER.length; i++) {
            for (let j = 0; j < rastor_image[0].length - SEAMONSTER[0].length; j++) {
                let monster_found = true;
                for (let a = 0; a < SEAMONSTER.length; a++) {
                    for (let b = 0; b < SEAMONSTER[0].length; b++) {
                        monster_found &&= !SEAMONSTER[a][b] || rastor_image[i + a][j + b];
                    }
                }
                if (monster_found) {
                    monster_visable = true;
                    for (let a = 0; a < SEAMONSTER.length; a++) {
                        for (let b = 0; b < SEAMONSTER[0].length; b++) {
                            if (SEAMONSTER[a][b]) {
                                rastor_image[i + a][j + b] = false;
                            }
                        }
                    }
                }
            }
        }
        if (monster_visable) {
            part2 = rastor_image.reduce((acc, val) => acc + val.reduce((acc, val) => acc + Number(val), 0), 0);
        }
    });

    return { part1: String(part1), part2: String(part2) };
}
