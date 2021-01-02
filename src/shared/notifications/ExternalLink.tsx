import React from 'react'

type Props = {
  to: string
}

const ExternalLink: React.FC<Props> = React.memo(({ to: url, children }) => {
  return (
    <a href={url} target='_blank' rel='noopener noreferrer'>
      {children}
    </a>
  )
})

export default ExternalLink
