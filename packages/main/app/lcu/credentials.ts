import { authenticate, Credentials, LeagueClient } from 'league-connect';

export let credentials: Credentials | null = null

export async function useCredentials() {
  console.log('Criando credenciais.')
  credentials = await authenticate({
    awaitConnection: true
  })

  if (!credentials) throw new Error('Não foi possivel criar as credenciais.')

  console.log('Credenciais criada com sucesso.')

  const client = new LeagueClient(credentials)

  client.on('connect', (newCredentials) => {
    credentials = newCredentials
    console.log('Nova sessão do LC detectada, credenciais atualizadas.')
  })

  client.on('disconnect', () => {
    console.log('Sessão do LC encerrada.')
  })

  client.start()
}