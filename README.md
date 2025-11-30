# Harry Potter App --- Desafio Individual II

**React Native + Expo + React Native Paper + Expo Router**

Aplicativo móvel que consome a API pública de Harry Potter
(`hp-api.onrender.com`) e apresenta personagens, feitiços e páginas
temáticas das quatro casas de Hogwarts.

> Trabalho acadêmico desenvolvido para a disciplina **Coding Mobile**\
> Professor: Geraldo Júnior\
> Aluno: **Renato Delgado**\
> Curso: Análise e Desenvolvimento de Sistemas --- Senac Pernambuco
> (2025)

------------------------------------------------------------------------

## ✨ Funcionalidades

-   Seleção de Casas de Hogwarts com tema visual\
-   Lista completa de personagens com busca e filtro por casa\
-   Detalhe rico do personagem (casa, varinha, patrono, etc.)\
-   Lista de feitiços com descrição\
-   Tela "Sobre" com créditos\
-   Navegação fluida via **expo-router** (layout com tabs)\
-   Componentes do **React Native Paper** (Material Design 3)\
-   Splash screen e loading personalizado\
-   Gradientes, animações sutis e design imersivo

------------------------------------------------------------------------

## 🧰 Tecnologias utilizadas

-   **Expo SDK 51+**\
-   **React Native** + **TypeScript**\
-   **expo-router** (file-based routing)\
-   **React Native Paper** (UI components)\
-   **Axios** (consumo da API)\
-   **expo-linear-gradient**\
-   **Context API** (tema dinâmico por casa)

------------------------------------------------------------------------

## 🌐 API utilizada

https://hp-api.onrender.com/api\
API pública não oficial do universo Harry Potter.

------------------------------------------------------------------------

## 📁 Estrutura de pastas (principais)

    app/
    ├── (tabs)/
    │   ├── index.tsx          → Tela inicial (Casas)
    │   ├── characters.tsx     → Lista de personagens
    │   ├── spells.tsx         → Lista de feitiços
    │   └── about.tsx          → Sobre o projeto
    ├── character/[id].tsx     → Detalhe do personagem
    ├── loading.tsx            → Tela de carregamento
    └── _layout.tsx            → Root layout + providers
    components/
    └── MagicLoader.tsx
    services/
    └── api.ts                 → Configuração do Axios
    contexts/
    └── HouseThemeContext.tsx  → Tema dinâmico por casa

------------------------------------------------------------------------

## ▶️ Como rodar o projeto

``` powershell
# 1. Clonar o repositório
git clone <seu-repo>
cd harry-potter-app

# 2. Instalar dependências
npm install

# 3. Iniciar o projeto (limpando cache)
npx expo start -c

# 4. Abrir no dispositivo
- Android: pressione "a"
- iOS: pressione "i" (apenas macOS)
- Ou escaneie o QR code com o app Expo Go
```

------------------------------------------------------------------------

## 🖼️ Screenshots

Crie a pasta `screenshots/` na raiz do projeto e coloque imagens com
estes nomes:

    screenshots/
      home.jpg
      characters.jpg
      character-detail.jpg
      spells.jpg
      spell-detail.jpg
      about.jpg
      loading.jpg

E o README exibirá automaticamente.

------------------------------------------------------------------------

## 📜 Licença / Observações

Projeto acadêmico, sem fins comerciais.\
Todo o conteúdo de Harry Potter pertence à Warner Bros. e J.K. Rowling.\
A API utilizada é pública e usada apenas para fins educacionais.

------------------------------------------------------------------------

## ✨ Feito com dedicação e um pouco de magia

**Renato Delgado --- 2025**
