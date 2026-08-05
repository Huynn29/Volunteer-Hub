import axios from "axios";

export const createEventAI = (prompt) => {

    return axios.post(
        "http://localhost:8000/ai/create-event",
        {
            prompt
        }
    );

};