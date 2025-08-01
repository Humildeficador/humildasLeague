import { Flex, Input, InputGroup, Tabs, type TabsValueChangeDetails, } from '@chakra-ui/react';
import { LuSearch } from 'react-icons/lu';

import { useState, type ChangeEvent } from 'react';
import { ChampionList } from './ChampionList';

export function ChampionSearch() {
  const [tabSelected, setTabSelected] = useState<string>('picks')
  const [inputValue, setInputValue] = useState('')

  function handleInputValue(e: ChangeEvent<HTMLInputElement>) {
    setInputValue(e.currentTarget.value.trim())
  }

  function handleTabChange({ value }: TabsValueChangeDetails) {
    setTabSelected(value)
  }

  return (
    <div>
      <Tabs.Root defaultValue="picks" variant={'outline'} onValueChange={handleTabChange}>
        <Tabs.List>
          <Tabs.Trigger value="picks" color={'cyan.500'} >
            Picks
          </Tabs.Trigger>
          <Tabs.Trigger value="bans" color={'orange.600'}>
            Ban
          </Tabs.Trigger>
          <InputGroup flex={'1'} startElement={<LuSearch />} pl={'10rem'}>
            <Input
              width={'220px'}
              placeholder='Busque o campeão'
              size={'xs'}
              value={inputValue}
              onChange={handleInputValue}
            />
          </InputGroup>
        </Tabs.List>
        <Tabs.Content value={tabSelected}>
          <Flex>
            <ChampionList searchChamp={inputValue} setSearchChamp={setInputValue} tabSelected={tabSelected} />
          </Flex>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  )
}

