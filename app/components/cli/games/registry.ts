import { SnakeGame } from "./SnakeGame";

export interface GameDefinition {
    id: string;
    description: string;
    component: React.ComponentType<{ onExit: () => void }>;
}

export const GAMES_REGISTRY: Record<string, GameDefinition> = {
    snake: {
        id: "snake",
        description: "Classic Snake Game",
        component: SnakeGame
    }
};

export const getAvailableGames = () => Object.keys(GAMES_REGISTRY);

export const getGame = (id: string) => GAMES_REGISTRY[id];
