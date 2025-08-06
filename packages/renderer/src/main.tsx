import './index.css'
import { App } from './App.tsx'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from './components/ui/provider.tsx'
import { Code, Container, Link } from '@chakra-ui/react'
import { ConfigProvider } from './context/ConfigContext.tsx'
import { DraftProvider } from './context/DraftContext.tsx'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider>
      <Container>
        <ConfigProvider>
          <DraftProvider>
            <App />
          </DraftProvider>
        </ConfigProvider>
      </Container>
      <Code pos={'absolute'} left={1} bottom={1}>{import.meta.env.VITE_VERSION}</Code>
      <Code
        pos={'absolute'}
        right={1}
        bottom={1}
      >
        Desenvolvido por:&nbsp;
        <Link
          variant="underline"
          href="https://github.com/Humildeficador"
          target='_blank'
          colorPalette="cyan"
        >
          Humildeficador
        </Link>
      </Code>
    </Provider>
  </StrictMode>,
)
