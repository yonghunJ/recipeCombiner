"use client"; // This is a client component 👈🏽

import axios from 'axios';
import React, { useState } from 'react'

export default function Home() {
  const [firstRecipe, setFirstRecipe] = useState(''); 
  const [secondRecipe, setSecondRecipe] = useState(''); 
  const [result, setResult] = useState('레시피1, 레시피2, 주의사항을 입력하고 Combined Recipe버튼을 눌러주세요');
  const [language, setLanguage] = useState('english');
  const [caution, setCaution] = useState('');
  const [loading, setLoading] = useState(false);

  const clickCombination = async () => {

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.NEXT_PUBLIC_RECIPE_COMBINER}`
    }
    let prompt = `I would like to develop a dessert that is unique and not famous. 
      It needs to be professional recipe and generate deatil such as time details(boil 4:30 mins)
      proper amount of ingredient(17mg of sugar, 2 tb of soy sauce)...
      You don't need to use all ingredient in recipe 1 or recipe 2. Combining two recipe's sequence is boring.
      You can remove some part and you can add new way to make a food. The goal is to make a dessert that everyone like.
      For example) Kimbab + french fry, Adding french fry to the kimbab itself it not what we want. Think creactively and make a new dessert that no one might think of it.
      You might want to boil, dry cut, steam, fry procdure If needed
      You MUST answer back with each step like 1. xxxxx 2. yyyyyy 3. zzzzz
      The return langauge MUST ${language}
      Here is also what you need to consider ${caution}
      
    `
    firstRecipe?.length >= 1 ? prompt += `\nHere is a recipe or food 1 '''${firstRecipe}'''` : null
    secondRecipe?.length >= 1 ? prompt += `\n Here is a recipe 2 or food 2 '''${secondRecipe}'''` : null
 
    setResult("Loading... Please wait at least 2 minutes")
    try {
      setLoading(true)
      const result = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
        "model": "gpt-4",
        "temperature":0.3,
        "messages": [
          {
            "role": "system",
            "content": "You will combine two recipe into one. You need to generate dessert recipe which people mostly like a lot"
          },
          {
            "role": "user",
            "content": prompt
          }
        ]
        },
        {
          headers
        });
      setResult(result.data.choices[0].message.content)
      setLoading(false)
    } catch(e) {
      setResult("Error... 화면새로고침해서 다시시도해보세요 ... 계속 작동안하면 개발자에게 문의하세요")
    }

  }
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
            <button onClick={clickCombination} className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30 btn btn-outline btn-info">
        {
          loading == false ?
              'Combined Recipe'
              : ''
            }
            </button>
        {console.log(loading)}
        <div>
          <span className="label-text">결과 값:{language =="english" ? "English": "Korean"}</span> 
          <input onClick={()=>{setLanguage(language=="english"?"korean":"english")}}type="checkbox" className="toggle toggle-primary" checked={language =="english" ? true: false} />
        </div>
      </div>
      {result}
      <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-2 lg:text-left">
        <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30">
          <h2 className={`mb-3 text-2xl font-semibold`}>Recipe 1{' '}</h2>
          <textarea 
            value={firstRecipe} // ...force the input's value to match the state variable...
            onChange={e => setFirstRecipe(e.target.value)} // ... and update the state variable on any edits!
            placeholder="Write down a recipe" 
            className="textarea textarea-bordered textarea-lg w-full " ></textarea>
        </div>
       
        <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30">
          <h2 className={`mb-3 text-2xl font-semibold`}>Recipe 2{' '}</h2>
          <textarea 
            value={secondRecipe} // ...force the input's value to match the state variable...
            onChange={e => setSecondRecipe(e.target.value)} // ... and update the state variable on any edits!
            placeholder="Write down a recipe" 
            className="textarea textarea-bordered textarea-lg w-full " ></textarea>
        </div>
      </div>
      <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-1 lg:text-left">
        <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30">
          <h2 className={`mb-3 text-2xl font-semibold`}>주의사항{' '}</h2>
          <textarea 
            value={caution} // ...force the input's value to match the state variable...
            onChange={e => setCaution(e.target.value)} // ... and update the state variable on any edits!
            placeholder="주의사항을 적어주세요" 
            className="textarea textarea-bordered textarea-lg w-full " ></textarea>
        </div>
      </div>
    </main>
  )
}
