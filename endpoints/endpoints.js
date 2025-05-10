import * as dotenv from "dotenv";
import {AxiosHelper} from "../axiosHelper.js";

dotenv.config();

const axios = new AxiosHelper()

async function getRepoByUsername(username) {
    return await axios.request(
        {
            method: 'GET',
            endpoint: `/users/${username}/repos`,
            body: '',
            headers: {
                'Authorization': process.env.API_KEY,
                'Accept': 'application/vnd.github+json',
                'X-GitHub-Api-Version': '2022-11-28'
            }
        })
}

async function getCommitsByRepoName(repoName) {
    const request = await axios.request(
        {
            method: 'GET',
            endpoint: `/repos/${repoName}/commits`,
            body:'',
            headers: {
                'Authorization': process.env.API_KEY,
                'Accept': 'application/vnd.github+json',
                'X-GitHub-Api-Version': '2022-11-28'
            },
            param: {
                per_page: 1000
            }
        });

    const allCommits = {};
    request.data.map((commit, index) => {
        allCommits[index + 1] = {
            hash: commit.sha,
            date: commit.commit.author.date.replace("T", " ").replace("Z", ""),
            message: commit.commit.message,
        };
    });

    return allCommits
}

export async function getRepoInfo(username) {
    const response = await getRepoByUsername(username)

    let dict = {}

    await Promise.all(
        response.data.map(async (repo) => {
            const commits = await getCommitsByRepoName(repo.full_name);
            dict[repo.full_name] = {
                url: repo.html_url,
                firstCommit: repo.created_at.replace("T", " ").replace("Z", ""),
                lastCommit: repo.pushed_at.replace("T", " ").replace("Z", ""),
                language: repo.language,
                description: repo.description === null ? "No description" : repo.description,
                commits: commits
            };
        })
    );

    return dict
}