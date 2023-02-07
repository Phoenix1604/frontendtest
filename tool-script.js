//for toggle navbar
document.querySelector('#menu').addEventListener('click', function onClick() {
    document.querySelector('nav ul').classList.toggle('showmenu');
})

const loadToolPage = () => {
    return window.location.href = "./toolpage.html";
}

let user; // variable to store user data
// fetch data from the api
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
        alert("We are at capacity. Please try again after sometime");
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

//update the card details with the fetched data (DOM Manipulation)
const updateData = (dataobj, idprefix) => {
    const idsuffix = ['username', 'tweets', 'followers', 'following'];
    for(const id of idsuffix) {
        document.getElementById(idprefix + id).innerHTML = dataobj[id];
    }
}

const generateComparisonData = (competitorData) => {
    let tweetText, tweetColor, followersText, followersColor;
    if(user.tweets >= competitorData.tweets) {
        tweetText = "+ " + (user.tweets - competitorData.tweets);
        tweetColor = "#008000";
    } else {
        tweetText = "- " + (competitorData.tweets - user.tweets);
        tweetColor = "#ba181b";
    }

    if(user.followers >= competitorData.followers) {
        followersText = "+ " + (user.followers - competitorData.followers);
        followersColor = "#008000";
    } else {
        followersText = "- " + (competitorData.followers - user.followers);
        followersColor = "#ba181b";
    }

    const compareTweets = document.getElementById('compare-tweets');
    compareTweets.innerHTML = tweetText;
    compareTweets.style.display = 'block';
    compareTweets.style.color = tweetColor;

    const compareFollowers = document.getElementById('compare-followers');
    compareFollowers.innerHTML = followersText;
    compareFollowers.style.display = 'block';
    compareFollowers.style.color = followersColor;
}

// userform submit 
userform.onsubmit = async (event) => {
    event.preventDefault();
    const username = document.forms['userform']['username'].value;
    user = await fetchData(username);
    console.log(user);
    updateData(user, 'user-');
}
competitorForm.onsubmit = async (event) => {
    event.preventDefault();
    if(!user){ //if user first try to generate competitors data
        alert("Please generate your data first");
        return;
    }
    const username = document.forms['competitorForm']['username'].value;
    const response = await fetchData(username);
    updateData(response, 'competitor-');
    generateComparisonData(response);
    createRadialChart(user.tweets, user.username, response.tweets, response.username,  'radial-chart1', 'Tweet');
    createRadialChart(user.followers, user.username, response.followers, response.username,  'radial-chart2', 'Followers');
    createRadialChart(user.following, user.username, response.following, response.username,  'radial-chart3', 'Following');
    window.scrollTo({top: (2*window.innerHeight), left: 0, behavior: 'smooth'});
}

const createRadialChart = (userData, userName, competitorData, competitorName, chartId, chartTitle) => {
    document.querySelector('.chart-card').style.display = 'flex';
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
                    return compariosnChart.dataset.data[0]/maxValue * 270;
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
                    return compariosnChart.dataset.data[0]/maxValue * 270;
                }
            }]
        },
        options: {
            borderRadius: 10,
            cutout: '70%',
            maintainAspectRatio: false,
            plugins: { title: { display: true, text: chartTitle,font: {size: 20} } }
        },
        plugins:[{ // plugin into create chart labels with the twitter names
            id: 'circularLabel',
            afterDatasetsDraw: ((chart, args, plugins) => {
                const {ctx, data, scales} = chart;
                ctx.save();
                ctx.font = 'bold 12px sans-serif';
                ctx.textAlign = 'right';
                ctx.textBaseline = 'middle';

                for(let i = 0; i< data.datasets.length; i++) {
                    ctx.fillStyle = data.datasets[i].backgroundColor[0];
                    const outerRadius = chart.getDatasetMeta(i).controller.outerRadius;
                    const innerRadius = chart.getDatasetMeta(i).controller.innerRadius;
                    const width = outerRadius - innerRadius;
                    const xCorr = chart.getDatasetMeta(i).data[0].x;
                    const yCorr = chart.getDatasetMeta(i).data[0].y;
                    ctx.fillText(data.datasets[i].label, xCorr -5, yCorr - innerRadius - (width/2));
                }
                
            })
        }]
    })
}