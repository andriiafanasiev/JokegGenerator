import './App.css';
import { useState } from 'react';

function App() {
    const [joke, setJoke] = useState<string>('');

    async function getTheJoke(): Promise<void> {
        try {
            const response = await fetch('https://v2.jokeapi.dev/joke/Any');
            const data = await response.json();
            if (!data.joke) {
                setJoke(`- ${data.setup}\n - ${data.delivery}`);
            } else {
                setJoke(data.joke);
            }

            console.log(data);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <>
            <div>
                <h1>Joke generator</h1>
                <p className="mt-2">Just click to "Get a Joke" button</p>

                <pre className="mt-5 mb-10">{joke}</pre>
                <button
                    onClick={() => {
                        getTheJoke();
                    }}
                >
                    Get a Joke
                </button>
            </div>
        </>
    );
}

export default App;
