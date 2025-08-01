import { useState } from 'react';
import { CheckboxCard, type CheckboxCheckedChangeDetails } from '@chakra-ui/react';

interface Props {
  type: string
}

type TypeValue = {
  [key: string]: string
}

export function EnablePlugin({ type }: Props) {
  const [switchValue, setSwitchValue] = useState(false)

  const textValue: TypeValue = {
    'accept': 'Auto-Accept',
    'pick': 'Auto-Pick',
    'ban': 'Auto-Ban'
  }

  async function handleSwitchValue({ checked }: CheckboxCheckedChangeDetails) {
    setSwitchValue(props => !props)
    if (type === 'accept') {
      await window.lcuAPI.autoAccept(checked as boolean)
    } else {
      await window.lcuAPI.champSelect(type, checked as boolean)
    }
  }

  return (
    <CheckboxCard.Root
      size={'sm'}
      variant={'surface'}
      colorPalette="cyan"
      checked={switchValue}
      onCheckedChange={handleSwitchValue}
    >
      <CheckboxCard.HiddenInput />
      <CheckboxCard.Control display={'flex'} alignItems={'center'}>
        <CheckboxCard.Content>
          <CheckboxCard.Label>{textValue[type]}</CheckboxCard.Label>
        </CheckboxCard.Content>
        <CheckboxCard.Indicator />
      </CheckboxCard.Control>
    </CheckboxCard.Root>
  )
}