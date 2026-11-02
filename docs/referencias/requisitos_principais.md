SITE PORTIFÓLIO
	## Requiisitos
		1.Rotas
			rota para cada projeto
				Exemplo: portifolio/api-python
				
			Tratamento de 404 - página amigavel para erro 404
				Rota inexistente - pagina com frase amigavel - exemplo: "ops, essa pagina ainda não existe!"
				Falha no carregamento da API - exemplo: "ops, tivemos um problema para carregar alguns dados, nossos devs já estão trabalhando nisso!"
			
		2.Estados de carregamento
			Todo dado vindo de API exibe os estados de carregamento, erro e lista vazia
			Indicador visual enquanto carrega (ex.: skeleton nos cards de projeto, spinner no envio do formulário)
 			Botão de enviar bloqueado durante o envio, evitando mensagens duplicadas
		
		3.Integração com GitHub
			Projetos carregados pela API do GitHub, sem cadastro manual
			Cada card exibe dados do repositório (ex.: descrição, linguagem, data da última atualização)
		
		4. Formulário de contato
			Valideção de cada campo com mensagens específicas para erros do usuário
				Exemplo: "e-mail inválido", "mensagem com no mínimo 20 caracteres"
		
		5.Dashboard
			Apenas o adm terá acesso ao dashboard, proteção por login
			Lista de mensagens recebidas, com opções de marcar como respondidas e importante
			Filtragem de mensagens (respondidas e não respondidas)
			Seleção dos projetos que aparecem em destaque na home
		
		6. Preferencias do usuario
			Tema claro/escuro persistido entre visitas (ex.: o site abre no escuro se o visitante saiu no escuro)
		 
		7. Interface
			Layout responsivo testado em celular e desktop
			Componentes visuais reaproveitados (ex.: o mesmo botão e o mesmo card em todas as páginas)
			Identidade visual própria, incluindo elementos 3D interativos (ex.: objeto na home que reage à rolagem)
		
		8. Performance
			Nota mínima de 80 em performance no Lighthouse, em modo mobile
			Imagens otimizadas em formato e tamanho, carregadas só quando aparecem na tela
			Dashboard e elementos pesados (ex.: cena 3D) carregados sob demanda, fora do pacote inicial do visitante
			Sem saltos de layout durante o carregamento
			Sem requisições repetidas à API do GitHub ao navegar entre páginas
			
		9.Testes
			Testes automatizados cobrindo, no mínimo, a validação do formulário e o bloqueio do dashboard sem login
		
		10. Arquitetura e padronização do código

			Estrutura de pastas com responsabilidades claras (ex.: `components`, `pages`, `services`, `hooks`)
			Componentes pequenos e reaproveitáveis, com a lógica separada da apresentação (ex.: chamadas à API em `services` ou em hooks personalizados, fora dos componentes visuais)
			Convenções de nomenclatura definidas (ex.: componentes em PascalCase, hooks começando com `use`), descritas no README e nas instruções do projeto para a IA
			Padrão de código verificado automaticamente (ex.: lint e formatação aplicados antes de cada commit)
		
		11. Segurança
			Qualquer dado ou informação sigilosa deve estar dentro do .env - acompanhado pelo .env.example
		
		FRONT-END
		
		### 1. Identidade Visual e Paleta de Cores (Monochrome High-Contrast)
			- Background principal: Preto absoluto (#000000) com um sutil padrão de grade em grid (linhas finas translúcidas).
			- Superfícies e Cards: Cinza chumbo escuro refinado (ex: rgba(32, 32, 32, 0.8)) com efeito de vidro fosco (backdrop-filter: blur).
			- Bordas: Delicadas, em tom prateado/branco translúcido (ex: rgba(255, 255, 255, 0.22)) que ganham brilho intenso ao passar o mouse.
			- Tipografia e Textos: Branco puro (#FFFFFF) para títulos e cinza neutro de alta legibilidade para descrições.

		### 2. Tipografia e Estrutura HTML
			Utilize uma pilha de fontes tipográficas de alto impacto:
			- Títulos Principais (H1, H2): Fonte geométrica marcante (ex: 'Syne', sans-serif) com variações de texto preenchido e texto vazado (contorno/outline com -webkit-text-stroke).
			- Corpo de Texto: Fonte limpa e contemporânea (ex: 'Inter', sans-serif).
			- Metadados, Tags e Menus: Estilo técnico/monoespaçado (ex: 'JetBrains Mono', monospace).
			- Estrutura HTML estritamente semântica (<header>, <nav>, <main>, <section>, <article>, <footer>) dividida em páginas modulares ou seções fluidas.

		### 3. Efeitos Visuais e Estilização em CSS Avançado
			- Glassmorphism & Spotlight: Cards com superfícies translúcidas, desfoque de fundo e um efeito de iluminação radial que acompanha o cursor do mouse no CSS.
			- Cards Fraturados (Split Effect): Na seção de projetos, crie um efeito visual estrutural utilizando clip-path e transformações 3D onde os cards parecem se dividir em metades simétricas e se encaixar perfeitamente.
			- Tipografia Cinética (Marquee): Faixas de texto gigantes em segundo plano que cruzam a tela na horizontal com efeito de repetição infinita.
			- Perspectiva 3D e Tilt: Estilize os elementos de skills e cards para utilizarem transformações em perspectiva (perspective, transform-style: preserve-3d) simulando profundidade física ao interagir.
