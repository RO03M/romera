import type { HydrationData } from "../types";

export const home: HydrationData = {
	name: "/home",
	type: "dir",
	nodes: [
		{
			name: "/hello",
			type: "file",
			content: "Hello world!"
		},
		{
			name: "/romera",
			type: "dir",
			nodes: [
				{
					name: "/desktop",
					type: "dir",
					nodes: [
						{
							name: "/Sobre mim",
							type: "file",
							content: `Olá, me chamo Romera!

Sou um desenvolvedor de software que começou a estudar sobre computação em 2016

Gosto de resolver problemas e de entender a fundo as soluções para os mesmos, além de sempre tentar buscar a melhor solução para o momento.

Desde o ínicio da minha carreira sempre consegui entender e aprender rapidamente, além de me dispor a ajudar a minha equipe.

No quesito de tecnologia eu já passei por várias, mas as que eu mais possuo experiência são Typescript/React/NextJs, PHP/Laravel, Rust, Java/Spring Boot e diversas outras mais ligadas ao cenário da web. Mas estou disposto a aprender qualquer ferramenta necessária para o meu desenvolvimento e o da minha equipe.`
						},
						{
							name: "/Projetos",
							type: "dir"
						}
					]
				}
			]
		}
	]
};
