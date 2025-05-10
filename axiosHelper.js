import axios from "axios";


export class AxiosHelper {
    constructor() {
        this.baseUrl = "https://api.github.com"
        this.handler = axios.create({baseURL: this.baseUrl})
        this.defaultHeader = {"Content-Type": "Application/json"}
    }

    async request({method, endpoint, body, headers}) {
        const option = {
            method,
            url: endpoint,
            data: body
        }

        if (headers === undefined) {
            option.headers = {...this.defaultHeader}
        } else {
            option.headers = headers
        }

        console.log(`METHOD: ${method}, URL: ${this.baseUrl}${endpoint}, ${body ? "with body" : "without body"}`)

        if (body) {
            console.log(`BODY: ${JSON.stringify(body, null, 2)}`)
        }

        return this.handler
            .request(option)
            .then(response => response)
            .catch((error) => error.response)
    }

}