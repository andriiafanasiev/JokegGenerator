import './App.css';
import { useState } from 'react';
import topics from './topics';

function App() {
    const [joke, setJoke] = useState<string>('');
    const [amountOfJokes, setAmountOfJokes] = useState<number>(1);

    const [blockedTopics, setBlockedTopics] = useState<{
        [key: string]: boolean;
    }>({});

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
            let url = `https://v2.jokeapi.dev/joke/Any?amount=${jokesAmount}`;

            if (Object.keys(blockedTopics).length !== 0) {
                url += '?blacklistFlags=';

                Object.keys(blockedTopics).forEach((topic: string) => {
                    url += topic;
                });
            }

            const response = await fetch(url);
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
        <div className="flex flex-col items-center p-4 md:p-8 lg:p-12 w-full max-w-2xl mx-auto text-center">
            <h1 className="text-2xl md:text-3xl font-bold">Joke Generator</h1>
            <p className="mt-2">Just click the "Get a Joke" button</p>

            <pre className="mt-5 mb-10 p-4 rounded-md w-full overflow-auto break-words whitespace-pre-wrap">
                {joke}
            </pre>

            <p className="text-lg">How many jokes would you generate?</p>
            <div className="flex flex-row gap-2.5 items-center justify-center mt-2 mb-10">
                <button
                    className="px-3 py-1  text-white rounded-lg"
                    onClick={increaseJokesAmount}
                >
                    +
                </button>
                <span className="text-xl font-medium">{amountOfJokes}</span>
                <button
                    className="px-3 py-1 text-white rounded-lg"
                    onClick={decreaseJokesAmount}
                >
                    -
                </button>
            </div>
            <h4 className="text-xl">Blacklist</h4>
            <div className="flex flex-row gap-5 mb-2 mb-9">
                {topics.map((topic: string) => (
                    <label className="flex items-center gap-2" key={topic}>
                        <input
                            type="checkbox"
                            name={topic}
                            id={topic}
                            checked={blockedTopics[topic]}
                            onChange={() =>
                                setBlockedTopics((prevTopics) => ({
                                    ...prevTopics,
                                    [topic]: !prevTopics[topic],
                                }))
                            }
                        />
                        {topic}
                    </label>
                ))}
            </div>

            <button
                className="px-6 py-2 text-white rounded-lg w-full sm:w-auto"
                onClick={() => getTheJoke(amountOfJokes)}
            >
                Get a Joke
            </button>
        </div>
    );
}

export default App;
