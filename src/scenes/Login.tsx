import React from 'react'
import styled from '@emotion/styled'
import { RouteComponentProps } from '@reach/router'

const Login: React.FC<RouteComponentProps> = () => {
  const [loading, setLoading] = React.useState<boolean>(false)

  const handleClick = React.useCallback(() => {
    setLoading(true)
  }, [])

  return (
    <LoginScene>
      <Button href='http://localhost:3001/login' onClick={handleClick}>
        {loading ? 'please hold ...' : 'login w/ spotify'}
      </Button>
    </LoginScene>
  )
}

const LoginScene = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 30px;
`

const Button = styled.a`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 450px;
  height: 200px;

  border-radius: 35px;
  background: linear-gradient(145deg, #ffffff, #e2dfe4);
  box-shadow: 26px 26px 54px #c6c4c8, -26px -26px 54px #ffffff;

  &:hover {
    background: linear-gradient(145deg, #e2dfe4, #ffffff);
  }
`

export default Login
