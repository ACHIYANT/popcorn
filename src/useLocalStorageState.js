import { useEffect,useState } from "react";
export function useLocalStorageState(initialState,key){

    const [value, setValue] = useState(function () {
        const stored = localStorage.getItem(key);

        // if (!stored) return [];
        // return JSON.parse(stored);

        // Instead of cheking above line we can also do this in one more Way by using initialState.

        return stored ? JSON.parse(stored) : initialState;

      });

    useEffect(
        function () {
          localStorage.setItem(key, JSON.stringify(value));
        },
        [value,key]
      );

      return [value,setValue];
}