export interface ArrayT<T> {
	[key: string]: T | undefined;
}

export interface Lobby {
	owner: Player;
	players: Player[];
}

export interface Gui {
	screen: Roact.Element;
	tree: Roact.Tree;
}
