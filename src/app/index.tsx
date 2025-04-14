import Board from '@/component/layout/board/board';
import { AppProvider } from '@/app/provider';

/**
 * The main App component that renders the Board component within the AppProvider.
 * This is a single-page application without routing, directly rendering the Board
 * as the primary content. AppProvider sets up React Query for data fetching.
 */
export const App = () => {
  return (
    <AppProvider>
      <div className="min-h-screen bg-gray-100 text-center">
        <Board />
      </div>
    </AppProvider>
  );
};