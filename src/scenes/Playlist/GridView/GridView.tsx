import React from 'react'
import styled from '@emotion/styled'

type Props = {
  data: any
}

const GridView: React.FC<Props> = ({ data }) => {
  console.log('the data!', data)
  return <GridViewContainer>{data.tracks.items.length}</GridViewContainer>
}

const GridViewContainer = styled.div`
  padding: 80px 200px;
`

export default GridView
