# Humildas League

Esse app foi desenvolvido com o propósito de automatizar algumas ações no client do League of Legends.

## Features

- Auto-Accept
- Auto-Pick
- Auto-Ban

## Funcionamento

O app funciona em cima de uma lib chamada de [League Connect](https://github.com/junlarsen/league-connect), basicamente usa o arquivo lockfile do League Client para criar uma conexão WS local naquela porta que intercepita os eventos WS.

Para observar os endpoint usei o [Needlework.Net](https://github.com/BlossomiShymae/Needlework.Net).

Para observar outros tipos de fetch usei o developer tools do [PenguLoader](https://github.com/PenguLoader/PenguLoader).

Juntando tudo isso, junto com o sistema de autenticação do [League Connect](https://github.com/junlarsen/league-connect), crio uma requisição HTTP para o endpoint referente a ação com o body esperado.

Quase um `man-in-the-middle`

## Download

Todos os download estão nas releases junto com seu patch notes.

## Acesso

Atualmente o app necessita de uma key de acesso, porém se você tiver conhecimento o suficiente pode compilar ele (já que é open-source) e usa-lo.

Para conseguir uma key você pode entrar em contato comigo no Discord (Humildeficador).

## Desenvolvimento

O app é desenvolvido usando o [Electron](https://github.com/electron/electron) como framework principal, permitindo criar uma aplicação desktop utilizando tecnologias web.

O stack utilizado é:

- **TypeScript (TSC)** – Utilizado para transpilação de TypeScript para JavaScript.

- **Vite + React + TypeScript** – Para o desenvolvimento do front-end:
`npm create vite@latest -- --template react-ts`.

- **Electron-Forge** – Toolset responsável por todo o processo de build, empacotamento e geração dos instaladores.

- **Squirrel.Windows** – Utilizado em conjunto com o Electron-Forge para gerar instaladores `.exe`.

## Instalação e Build local

Se você quiser rodar o projeto localmente ou compilar sua própria versão, aqui vai um passo a passo:

```bash
# Clone o repositório

git clone https://github.com/Humildeficador/humildasLeague.git
cd humildasLeague

# Instale as dependências
npm install
```

### Pré-Ajuste Necessários

Antes de iniciar o projeto, você precisará realizar algumas modificações no código para desabilitar a autenticação via IPC (caso não tenha uma key de acesso).

#### 1. **Editar o App.tsx para remover a renderização condicional.**

Arquivo `packages/renderer/src/App.tsx`

```tsx
return (
    <>
      {currentSummoner ?
        <Flex justifyContent={'end'} mt={-2} pb={1} color={'cyan.500'} h={'24px'}>
          {currentSummoner.gameName}{`#`}{currentSummoner.tagLine}
        </Flex> :
        <Flex justifyContent={'end'} mt={-2} pb={1} color={'cyan.500'} h={'24px'}>
          <Spinner color={'cyan.500'} animationDuration={'0.8s'} mr={2} />
        </Flex>
      }
      <Flex justifyContent={'space-between'}>
        <div>
          <Stack w={'150px'} maxW={'220px'}>
            <EnablePlugin type='accept' />
            <EnablePlugin type='pick' />
            <EnablePlugin type='ban' />
          </Stack>
        </div>
        <ChampionSearch />
      </Flex>
    </>
  )
```

#### 2. **Remover o IPC is-authenticate.**

- **Arquivo:** `packages/main/index.ts`

```ts
ipcMain.handle('is-authenticate', async (_, token: string, currentSummoner) => {
  const { authenticate } = await import('./app/authenticate/authenticate')
  return authenticate(token, currentSummoner)
})
```

- **Arquivo:** `packages/main/preload.ts`

```ts
contextBridge.exposeInMainWorld('authenticate', {
  verify: async (token: string, currentSummoner: { gameName: string, tagLine: string }) => {
    return ipcRenderer.invoke('is-authenticate', token, currentSummoner)
  }
})
```

### Rodando a aplicação

Para iniciar a aplicação em modo de desenvolvimento ou produção

```bash
# Rodar em modo de desenvolvimento (hot reload)
npm run dev

# Rodar em modo de produção local
npm run start
```

### Build (Make) do projeto

Antes de rodar o make, você precisará ajustar o arquivo principal do Electron para garantir que ele sempre carregue o HTML empacotado:

#### 1. **Editar o arquivo dist/packages/main/app/index.js**


Substitua o seguinte bloco:

```js
  if (process.env.NODE_ENV === "development") {
    // Código para ambiente de desenvolvimento
    win.loadURL('http://localhost:5173/')
  } else if (process.env.NODE_ENV === "production") {
    // Código para ambiente de produção
    win.loadFile(path.join(__dirname, '../../renderer/index.html'))
    win.setMenu(null)
    win.removeMenu()
  }
```

Por:

```js
win.loadFile(path.join(__dirname, '../../renderer/index.html'))
```

### Gerenado o Instalador

Após os ajudes, configure o `package.json` e o `forge.config.json` conforme desejado e execute

```bash
npm run forge:make
```

o instalador será gerado na pasta `/out`
