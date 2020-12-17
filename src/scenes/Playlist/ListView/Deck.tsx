import React from 'react'
import styled from '@emotion/styled'

const Deck: React.FC = () => {
  return (
    <DeckContainer>
      <RelativeContainer>
        <Platform />
        <Bowl />
      </RelativeContainer>
    </DeckContainer>
  )
}

const RelativeContainer = styled.div`
  position: relative;
  width: 300px;
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
`

const Bowl = styled.div`
  position: absolute;
  width: 280px;
  height: 280px;
  border-radius: 100%;
  background: #ffffff;
  box-shadow: inset 4px 4px 8px #e3e3e3, inset -4px -4px 8px #ffffff;
`

const Platform = styled.div`
  position: absolute;
  border-radius: 100%;
  background: linear-gradient(145deg, #ffffff, #e6e6e6);
  box-shadow: 30px 30px 60px #cfcfcf, -30px -30px 60px #ffffff;
  width: 300px;
  height: 300px;
`

const DeckContainer = styled.div`
  height: 100vh;
  position: fixed;
  top: 0;
  right: 0;
  display: flex;
  align-items: center;
  padding-right: 30px;
`

export default Deck
