export const BOARD_SIZES = [4, 5] as const;
export type BoardSize = (typeof BOARD_SIZES)[number];