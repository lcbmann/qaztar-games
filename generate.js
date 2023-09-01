import { config } from "dotenv"
config()

import OpenAI from "openai";

const openai = new OpenAI();

async function generateArrivalText() {
    const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: `Suggest a short arrival text message for a fleet pulling into new land from the sea. 
        Examples: 
        'The fleet pulls into a small cape, the sun low in the evening sky. Tiny waves lap against the side of the boat.', 
        'The fleet passes around a bend, revealing a new land ahead. The evening sunbeams shatter across the cresting waves.', 
        'The fleet glides along a shoreline of white sand, cliffs framing a beach ahead. Gusts of wind billow in the sails.', 
        'The fleet drops anchor at the base of a shore, its sailors weary after their journey. The sand sparkles under the bright sunlight.'
        `}]
    })
    console.log(completion.choices[0].message.content);
}

module.exports = {generateArrivalText};
