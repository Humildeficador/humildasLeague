import './index.css'
import { App } from './App.tsx'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from './components/ui/provider.tsx'
import { Code, Container, Link } from '@chakra-ui/react'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider>
      <Container>
        <App />
      </Container>
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
