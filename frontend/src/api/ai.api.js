import axios from "axios";

export const createEventAI = (prompt) => {

    return axios.post(
        "https://volunteer-hub-ai.onrender.com/ai/create-event",
        {
            prompt
        }
    );

};