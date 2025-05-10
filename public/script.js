document.getElementById('searchForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    const username = document.getElementById('usernameInput').value.trim();
    if (username) {
        await loadRepos(username);
    }
});

async function loadRepos(username = 'Matterlinkk') {
    const response = await fetch(`/repos?username=${username}`);
    const data = await response.json();

    const tbody = document.querySelector('#repoTable tbody');
    tbody.innerHTML = '';

    if (!data || Object.keys(data).length === 0) {
        tbody.innerHTML = `<tr><td colspan="7">No repositories found.</td></tr>`;
        return;
    }

    Object.entries(data).forEach(([name, repo]) => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${name}</td>
            <td><a href="${repo.url}" target="_blank">${repo.url}</a></td>
            <td>${repo.language || 'N/A'}</td>
            <td>${repo.description}</td>
            <td>${repo.firstCommit}</td>
            <td>${repo.lastCommit}</td>
            <td><button data-id="${name}">Toggle</button></td>
        `;

        const commitRow = document.createElement('tr');
        const commitCell = document.createElement('td');
        commitCell.colSpan = 7;
        const commitList = document.createElement('div');
        commitList.className = 'commit-list';

        const commits = repo.commits;
        for (let key in commits) {
            const { hash, date, message } = commits[key];
            const item = document.createElement('div');
            item.textContent = `${date} - ${message} (${hash.slice(0, 7)})`;
            commitList.appendChild(item);
        }

        commitCell.appendChild(commitList);
        commitRow.appendChild(commitCell);

        row.querySelector('button').addEventListener('click', () => {
            commitList.style.display = commitList.style.display === 'none' ? 'block' : 'none';
        });

        tbody.appendChild(row);
        tbody.appendChild(commitRow);
    });
}

window.onload = () => loadRepos();
