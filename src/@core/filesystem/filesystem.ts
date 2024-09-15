// import { signal } from "@preact/signals";

// export interface Program {
//     name: string;
//     type: "executable";
// }

// export interface Directory {
// 	name: string;
// 	type: "directory";
// 	children: (Directory | Program)[];
// }

// export const filesystem = signal<Directory>({
//     name: "/",
//     type: "directory",
//     children: [
//         {
//             name: "home",
//             type: "directory",
//             children: []
//         }
//     ]
// });
