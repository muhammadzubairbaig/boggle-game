import { useQuery } from '@tanstack/react-query';

interface DictionaryState {
  dictionary: Set<string>;
  error: string | null;
  isLoading: boolean;
}

const fetchDictionary = async (): Promise<Set<string>> => {
  const res = await fetch('/words.txt');
  if (!res.ok) throw new Error('Failed to fetch dictionary');
  const text = await res.text();
  const words = text.split('\n').map(word => word.trim().toLowerCase());
  return new Set(words);
};

export const useDictionary = (): DictionaryState => {
  const { data, error, isLoading } = useQuery({
    queryKey: ['dictionary'],
    queryFn: fetchDictionary,
  });

  return {
    dictionary: data || new Set<string>(),
    error: error ? 'Dictionary unavailable. Words won’t be validated.' : null,
    isLoading,
  };
};