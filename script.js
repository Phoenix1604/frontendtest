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
    console.log(response);
    updateData(response, 'competitor-');
    let userData = [user.tweets, user.followers, user.following];
    let competitorData = [response.tweets, response.followers, response.following];
    createChart(userData, user.username, competitorData, response.username);
}

const createChart = async(userData, userName, competitorData, competitorName) => {
    const comparisonChart = document.getElementById('bar-chart').getContext('2d');
    let chart = await new Chart(comparisonChart, {
        type: 'bar',
        data: {
            labels: ["Tweets", "Followers", "Following"],
            datasets: [
                {
                    data: userData,
                    backgroundColor: ["#043873", "#043873", "#043873"], 
                    label: userName
                }, 
                {
                    data: competitorData,
                    backgroundColor: ["#FF9B85", "#FF9B85", "#FF9B85"],
                    label: competitorName
                }
            ]
        },
        options: {
            indexAxis: 'y',
            plugins: {
                title: {
                    display: true,
                    text: "Comparison",
                    align: "start",
                    font: {
                        size: 24,
                        family: "Nunito",
                    }
                },
                legend: {
                    labels: {
                        usePointStyle: true,
                        pointStyle: "circle",
                        font: {
                            size: 20,
                            font: "Nunito"
                        },
                    },
                    align: "end"
    
                }
            },
            tooltips: {
                enabled: false
            },
            // responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                //   barPercentage: 0.75,
                  gridLines: {
                    display: true,
                    drawTicks: true,
                    drawOnChartArea: false
                  },
                  ticks: {
                    color: '#a5a58d',
                    font: {
                        size: 20,
                        font: "Nuinto"
                    }
                    
                  }
                   
                },
                x: {
                    gridLines: {
                      display: true,
                      drawTicks: false,
                      tickMarkLength: 5,
                      drawBorder: false
                    },
                  ticks: {
                    padding: 5,
                    beginAtZero: true,
                    fontColor: '#555759',
                    fontFamily: 'Nuinto',
                    fontSize: 11, 
                  }
                }
            }
    }})

    document.getElementById('chart').style.visibility = 'visible';
}

