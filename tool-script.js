document.querySelector('#menu').addEventListener('click', function onClick() {
    document.querySelector('nav ul').classList.toggle('showmenu');
})

let user;
const fetchData = async(username) => {
    const url = 'https://twitter135.p.rapidapi.com/UserByScreenName/?username=' + username;
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '3b4d35c541msh1412e847d6aaeb1p1fee73jsn399963a5957c',
            'X-RapidAPI-Host': 'twitter135.p.rapidapi.com'
        }
    };

    let response = await fetch(url, options);
    if(!response.ok) {
        console.log("Error: " + response.status);
    }
    
    const result =  await response.json();
    if(!result.data.user){
        alert("Wrong username");
    }
    const dataobj = {
        username: result.data.user.result.legacy.name,
        tweets: result.data.user.result.legacy.statuses_count,
        followers: result.data.user.result.legacy.followers_count,
        following: result.data.user.result.legacy.friends_count
    }
    
    return dataobj;
}

const updateData = (dataobj, idprefix) => {
    const idsuffix = ['username', 'tweets', 'followers', 'following'];
    for(const id of idsuffix) {
        document.getElementById(idprefix + id).innerHTML = dataobj[id];
    }
}

userform.onsubmit = async (event) => {
    event.preventDefault();
    const username = document.forms['userform']['username'].value;
    user = await fetchData(username);
    console.log(user);
    updateData(user, 'user-');
}
competitorForm.onsubmit = async (event) => {
    event.preventDefault();
    if(!user){
        alert("Please generate your data first");
        return;
    }
    const username = document.forms['competitorForm']['username'].value;
    const response = await fetchData(username);
    updateData(response, 'competitor-');
    let userData = [user.tweets, user.followers, user.following];
    let competitorData = [response.tweets, response.followers, response.following];
    // createChart(userData, user.username, competitorData, response.username);
    createRadialChart(user.tweets, user.username, response.tweets, response.username,  'radial-chart1', 'Tweet');
    createRadialChart(user.followers, user.username, response.followers, response.username,  'radial-chart2', 'Followers');
    createRadialChart(user.following, user.username, response.following, response.username,  'radial-chart3', 'Following');
}

const createRadialChart = (userData, userName, competitorData, competitorName, chartId, chartTitle) => {
    const comparisonChart = document.getElementById(chartId).getContext('2d');
    let chart = new Chart(comparisonChart, {
        type: 'doughnut',
        data: {
            datasets: [{
                label: userName,
                data: [userData],
                backgroundColor: [
                  '#043873',
                ],
                borderColor: [
                  'white',
                ],
                borderWidth: 5,
                circumference: (compariosnChart) => {
                    const datapoints = compariosnChart.chart.data.datasets.map((datapoint, index) => {
                        return datapoint.data[0];
                    });
                    const maxValue = Math.max(...datapoints);
                    return compariosnChart.dataset.data[0]/maxValue * 360;
                }
              }, 
                {
                label: competitorName,
                data: [competitorData],
                backgroundColor: [
                  '#ed775c',
                ],
                borderColor: [
                  'white',
                ],
                borderWidth: 5,
                circumference: (compariosnChart) => {
                    const datapoints = compariosnChart.chart.data.datasets.map((datapoint, index) => {
                        return datapoint.data[0];
                    });
                    const maxValue = Math.max(...datapoints);
                    return compariosnChart.dataset.data[0]/maxValue * 360;
                }
            }]
        },
        options: {
            borderRadius: 10,
            cutout: '85%',
            maintainAspectRatio: false,
            plugins: { title: { display: true, text: chartTitle,font: {size: 20} } }
        },
    })

    document.querySelector('.chart-card').style.display = 'flex';
}

// createRadialChart(12, "Subhajit", 900, "Somnath",  'radial-chart1', 'Tweet');
// createRadialChart(12, "Subhajit", 900, "Somnath",  'radial-chart2', 'followers');
// createRadialChart(12, "Subhajit", 900, "Somnath",  'radial-chart3', 'following');
