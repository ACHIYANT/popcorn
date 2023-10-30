import { useEffect } from "react";
export function useKey(key,action){
    useEffect(
        function () {
          function callback(e) {
            if (e.code.toLowerCase() === key.toLowerCase()) {
            // if (e.code === key) {
              // handleCloseMovieDetails();
              action?.();
            //   onCloseMovie();
              // console.log("CLOSING");
            }
          }
          document.addEventListener("keydown", callback);
          return function () {
            // console.log('removed')
            document.removeEventListener("keydown", callback);
          };
        },
        [action,key]
      );
}