import './App.css';
import { useState } from 'react';

function App() {
    const [joke, setJoke] = useState<string>('');

    const [amountOfJokes, setAmountOfJokes] = useState<number>(1);

    interface Joke {
        error: boolean;
        category: string;
        type: string;
        joke?: string;
        setup?: string;
        delivery?: string;
        flags: {
            nsfw: boolean;
            religious: boolean;
            political: boolean;
            racist: boolean;
            sexist: boolean;
            explicit: boolean;
        };
        id: number;
        safe: boolean;
        lang: string;
    }
    async function getTheJoke(jokesAmount: number): Promise<void> {
        try {
            const response = await fetch(
                `https://v2.jokeapi.dev/joke/Any?amount=${jokesAmount}`
            );
            const data = await response.json();

            let allJokes = '';

            if (jokesAmount > 1) {
                data.jokes.forEach((joke: Joke, index: number) => {
                    allJokes +=
                        joke.type === 'twopart'
                            ? `${index + 1}.- ${joke.setup}\n - ${
                                  joke.delivery
                              }\n\n`
                            : `${index + 1}. ${joke.joke}\n\n`;
                });
            } else {
                if (data.type === 'twopart') {
                    allJokes = `- ${data.setup}\n - ${data.delivery}`;
                } else {
                    allJokes = data.joke;
                }
            }

            setJoke(allJokes);
        } catch (error) {
            console.error('Error fetching joke:', error);
        }
    }

    function increaseJokesAmount(): void {
        setAmountOfJokes(amountOfJokes + 1);
    }
    function decreaseJokesAmount(): void {
        if (amountOfJokes > 1) {
            setAmountOfJokes(amountOfJokes - 1);
        }
    }

    return (
        <>
            <div>
                <h1>Joke generator</h1>
                <p className="mt-2">Just click to "Get a Joke" button</p>

                <pre className="mt-5 mb-10">{joke}</pre>
                <p>How many jokes would you ganerate?</p>
                <div className="flex flex-row gap-2.5 items-center justify-center mt-2 mb-20">
                    <button onClick={increaseJokesAmount}>+</button>
                    {amountOfJokes}
                    <button onClick={decreaseJokesAmount}>-</button>
                </div>

                <button
                    onClick={() => {
                        getTheJoke(amountOfJokes);
                    }}
                >
                    Get a Joke
                </button>
            </div>
        </>
    );
}

export default App;
