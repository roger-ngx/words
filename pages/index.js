import { useState, useEffect } from 'react';
import { Button, CircularProgress, FormControl, Input, InputAdornment, InputLabel, Paper } from '@material-ui/core'
import { AccountCircle } from '@material-ui/icons'
import Head from 'next/head'
import { useRouter } from 'next/router';
import { isEmpty, trim } from 'lodash';
import { API_SERVER_ADDRESS } from 'constants/defaults';

export default function Home() {

  const [ username, setUsername ] = useState('');
  const [ error, setError ] = useState('');
  const [ loading, setLoading ] = useState(false);

  const router = useRouter();

  const onLogin = () => {
    setLoading(true);
    fetch(API_SERVER_ADDRESS + '/api/user/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({username})
    }).then(res =>res.json())
    .then(data => {
      if(data.err === 0){
        localStorage.setItem('currentUser', username);
        router.push('/home');
      } else {
        setError(data.message);
      }
    }).finally(() => {
      setLoading(false);
    });
  }
  
  const onSignup = () => {
    setLoading(true);

    fetch(API_SERVER_ADDRESS + '/api/user/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({username})
    }).then(res =>res.json())
    .then(data => {
      if(data.err === 0){
        localStorage.setItem('currentUser', username);
        router.push('/home');
      } else {
        setError(data.message);
      }
    }).finally(() => {
      setLoading(false);
    });
  }

  useEffect(() => {
    if(localStorage.getItem('currentUser')){
      router.push('/home');
    }
  }, []);

  return (
    <div className="container">
      <Head>
        <title>Words</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div>
          <Paper style={{padding: 24}}>
            <div style={{display: 'flex', flexDirection: 'column'}}>
              <FormControl>
                <InputLabel>Type your nickname</InputLabel>
                <Input
                  value={trim(username)}
                  onChange={e => setUsername(e.target.value)}
                  startAdornment={
                    <InputAdornment position='start'>
                      <AccountCircle />
                    </InputAdornment>
                  }
                />
              </FormControl>
              {
                !isEmpty(error) && <p style={{color: 'red'}}>{error}</p>
              }
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  marginTop: 24
                }}
              >
                {
                  !loading &&
                  <> 
                    <Button
                      style={{flex: 1, marginRight: 12}}
                      variant='contained'
                      color='primary'
                      onClick={onSignup}
                      disabled={isEmpty(trim(username))}
                    >
                      Signup
                    </Button>

                    <Button
                      style={{flex: 1, marginLeft: 12}}
                      variant='outlined'
                      color='default'
                      onClick={onLogin}
                      disabled={isEmpty(trim(username))}
                    >
                      Login
                    </Button>
                  </>
                }
                {
                  loading &&
                  <Button
                    style={{flex: 1, marginRight: 12}}
                    variant='contained'
                    color='primary'
                    disabled
                  >
                    <CircularProgress size={24} />
                  </Button>
                }
              </div>
            </div>
          </Paper>
        </div>
      </main>

      <footer>
        Powered by Words
      </footer>

      <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 0 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        footer {
          width: 100%;
          height: 100px;
          border-top: 1px solid #eaeaea;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        footer img {
          margin-left: 0.5rem;
        }

        footer a {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        .title a {
          color: #0070f3;
          text-decoration: none;
        }

        .title a:hover,
        .title a:focus,
        .title a:active {
          text-decoration: underline;
        }

        .title {
          margin: 0;
          line-height: 1.15;
          font-size: 4rem;
        }

        .title,
        .description {
          text-align: center;
        }

        .description {
          line-height: 1.5;
          font-size: 1.5rem;
        }

        code {
          background: #fafafa;
          border-radius: 5px;
          padding: 0.75rem;
          font-size: 1.1rem;
          font-family: Menlo, Monaco, Lucida Console, Liberation Mono,
            DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace;
        }

        .grid {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;

          max-width: 800px;
          margin-top: 3rem;
        }

        .card {
          margin: 1rem;
          flex-basis: 45%;
          padding: 1.5rem;
          text-align: left;
          color: inherit;
          text-decoration: none;
          border: 1px solid #eaeaea;
          border-radius: 10px;
          transition: color 0.15s ease, border-color 0.15s ease;
        }

        .card:hover,
        .card:focus,
        .card:active {
          color: #0070f3;
          border-color: #0070f3;
        }

        .card h3 {
          margin: 0 0 1rem 0;
          font-size: 1.5rem;
        }

        .card p {
          margin: 0;
          font-size: 1.25rem;
          line-height: 1.5;
        }

        .logo {
          height: 1em;
        }

        @media (max-width: 600px) {
          .grid {
            width: 100%;
            flex-direction: column;
          }
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  )
}
