export class Pos {
    r!: number;
    c!: number;
}

export class MoveDto {
    gameId!: number;
    from!: Pos;
    to!: Pos;
    room?: string;
}

export class NewGameDto {
    room?: string;
}
