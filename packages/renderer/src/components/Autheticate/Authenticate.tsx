import { Center, Field, Input } from '@chakra-ui/react'
import { useState, type KeyboardEvent } from 'react'
import { isValidToken } from '../../utils/auth'
import { setToken } from '../../utils/storage'

/* interface Props {
  setToken: (token: string) => void
} */

export function Authenticate(/* { setToken }: Props */) {
  const [invalid, setInvalid] = useState(false)
  const [message, setMessage] = useState<string>('')

  async function handlerInputToken(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key !== 'Enter' || e.currentTarget.value.trim() === '') return

    const token = e.currentTarget.value
    const isValid = await isValidToken(token)
    if (isValid && isValid.code !== 200) {
      setInvalid(true)
      setMessage(isValid.message || 'Erro desconhecido')
    } else {
      setToken(token)
      setInvalid(false)
    }
  }

  return (
    <Center>
      <Field.Root invalid={invalid}>
        <Field.Label>Key de acesso</Field.Label>
        <Input
          onKeyDown={handlerInputToken}
          placeholder='Cole a key de acesso concedida pelo Humilde 🖤'
        />
        <Field.ErrorText>
          {message}
        </Field.ErrorText>
      </Field.Root>
    </Center>
  )
}