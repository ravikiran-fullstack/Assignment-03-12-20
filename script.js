function createDomElement(ele, eleClass = '', eleId = ''){
  const element = document.createElement(ele);
  eleClass !== ''? element.setAttribute('class', eleClass): '';
  eleId !== ''? element.setAttribute('id', eleId): '';
  return element;
}

/////////////////////////////////////// JS code for home.html///////////////////////
function onHomePageLoad(){
  generateHtmlForHomePage();
}

function generateHtmlForHomePage() {
  const containerHome = createDomElement('div', 'container', 'homePageContainer');
  const rowHome = createDomElement('div', 'row');
  const colHome = createDomElement('div', 'col-12 text-center homePage');

  const homePageTitle = createDomElement('h3', 'homePageTitle');
  homePageTitle.innerHtml = 'Quick Quiz';

  const playHref = createDomElement('a', 'btn btn-primary playBtn');
  playHref.text = 'Play';
  playHref.href = '/game.html';

  const highScoresHref = createDomElement('a', 'btn btn-primary highScoreBtn');
  highScoresHref.text = 'High Scores';
  highScoresHref.href = '/highScores.html';

  colHome.append(homePageTitle, playHref, highScoresHref);

  rowHome.append(colHome);
  containerHome.append(rowHome);
  document.body.append(containerHome);
}
/////////////////////////////////////// JS code for home.html END///////////////////////

/////////////////////////////////////// JS code for game.html START///////////////////////
let scoreCount = 0;
let qsDone = 0;
let showQuestionNum = 0;

async function onGamePageLoad(){
  // Fetch questions from opentdb 
  const questionsRawData = await fetchQuestions();

  //Refactor the questionsRawData
  const refactoredData = refactorQuestionsRawData(questionsRawData);

  // Generate game page layout
  generateHtmlForGamePage(refactoredData);

  //Set Game Initial Configs
  setGameConfig();
}

async function fetchQuestions(){
  const url = 'https://opentdb.com/api.php?amount=10&type=multiple';
  try{
    const res = await fetch(url);
    const data = await res.json();
    return data;
  } catch(err){
    console.log(err);
  }
}

function refactorQuestionsRawData(questionsRawData){
  return questionsRawData.results.map(ele => {
      const obj = {};
      obj.question = ele.question;
      let count = 1;
      obj.answers = ele.incorrect_answers.map(answer => {
        return {num: count++, answer: answer, isCorrect: false}
      })   
      obj.answers.push({num: count++, answer: ele.correct_answer, isCorrect: true});
      
      return obj;
  });
}

function generateHtmlForGamePage(questionsData){
  const containerGame = createDomElement('div', 'container', 'gamePageContainer');
  const rowGame = createDomElement('div', 'row');
  const colGame = createDomElement('div', 'col-12 text-center');
  const resultsDiv = generateResultsHtml();
  colGame.append(resultsDiv);
    //Loading gif to create an illusion of precessing 
    const loadingIndicator = createDomElement('div', 'hide', 'loadingIndicator');
      const gifImage = createDomElement('img', 'img-fluid', '');
      gifImage.src = './images/loading.gif';
    loadingIndicator.append(gifImage);
  colGame.append(loadingIndicator);
  for(let i = 0; i < questionsData.length; i++ ){
    const qDiv = generateChallengeHtml(questionsData[i], i);
    if(i === showQuestionNum){
      qDiv.classList.remove('hide');
    }
    colGame.append(qDiv);
  }

  colGame.append();
  rowGame.append(colGame);
  containerGame.append(rowGame);
  document.body.append(containerGame);
}

function generateResultsHtml(){
    const div = createDomElement('div', 'results');
      const divQsDone = createDomElement('div');
        const pQsDoneText = createDomElement('p');
        pQsDoneText.append(document.createTextNode('Questions Done'));
        const pQsDone = createDomElement('p', '', 'qsDone');
        pQsDone.innerHTML = '0/10';
      divQsDone.append(pQsDoneText, pQsDone);  

      const divResultsRange = createDomElement('div');
        const pResultsRangeText = createDomElement('p');
        pResultsRangeText.append(document.createTextNode('Range'));
        const progressResultsRange = createDomElement('progress', '', 'progressResultsRange');
        progressResultsRange.value = 0;
        progressResultsRange.max = 10;
      divResultsRange.append(pResultsRangeText, progressResultsRange);  

      const divScore = createDomElement('div');
        const pScoreText = createDomElement('p');
        pScoreText.append(document.createTextNode('Score'))
        const pScore = createDomElement('p', '', 'pScore');
        pScore.innerHTML = 0;
      divScore.append(pScoreText, pScore);

      div.append(divQsDone, divResultsRange, divScore);
    return div;
}

function generateChallengeHtml(challenge, index){
  const id = 'q'+index;
    const qDiv = createDomElement('div', 'hide', id);
      const question = createDomElement('div', 'question', '');
        const questionPara = createDomElement('p');
        const questionParaText = document.createTextNode('Q'+(index+1)+': '+challenge.question);
        questionPara.append(questionParaText);
      question.append(questionPara);
    qDiv.append(question);    

    challenge.answers.forEach(answerObj => {
      const answerDiv = generateAnswerHtml(answerObj);
      qDiv.append(answerDiv);
    })

  return qDiv;
} 

function generateAnswerHtml(answerObj){
    const answerDiv = createDomElement('div', 'answer');
      const answerNum = createDomElement('p', 'answerNum');
      answerNumText = document.createTextNode(answerObj.num);
      answerNum.append(answerNumText);
      const answerValue = createDomElement('p', 'answerValue');
        answerValueText = document.createTextNode(answerObj.answer);
      answerValue.append(answerValueText);
    answerDiv.append(answerNum, answerValue);
    let value = answerObj.answer;
    let isCorrect = answerObj.isCorrect;
    let d = this;
    answerDiv.setAttribute('onclick',`updateResults(this, "${value}", "${isCorrect}")`);
  return answerDiv;
}

function setGameConfig(){
  scoreCount = 0;
  questionsAnswered = 0;
  if(localStorage.getItem('score')){
    localStorage.setItem('score', null);
  }
} 

async function showQuestion(questionNum){
  await delay();
  document.getElementById(`q${questionNum-1}`).classList.add('hide');
  document.getElementById('loadingIndicator').classList.remove('hide');
  await delay();
  document.getElementById('loadingIndicator').classList.add('hide');
  document.getElementById(`q${questionNum}`).classList.remove('hide');
}

function delay(){
  return new Promise((res, rej) => {
    setTimeout(() => {
      res();
    }, 1000)
  })
}

function updateResults(ele, value, isCorrect){
  const parentElement = ele.parentElement;
  parentElement.style.pointerEvents = 'none';
  //pointer-events: none;
  if(isCorrect === "true"){
    ele.classList.add('correct');
    scoreCount++;
  } else{
    ele.classList.add('wrong');
  }

  questionsAnswered++;
  document.getElementById('qsDone').innerHTML = `${questionsAnswered}/10`
  document.getElementById('pScore').innerHTML = scoreCount * 10; 
  document.getElementById('progressResultsRange').value = scoreCount;
  
  updateLocalStorage(scoreCount);
  
  if(questionsAnswered === 10){
    movetoEndPage();
  } else{
    showQuestionNum++;
    showQuestion(showQuestionNum);
  }
}

function updateLocalStorage(scoreCount){
    localStorage.setItem('score', scoreCount);
}

async function movetoEndPage(){
  resetGame();
  //Introduces delay
  await delay();
  document.getElementById(`q9`).classList.add('hide');
  document.getElementById('loadingIndicator').classList.remove('hide');
  setTimeout(()=>{
    document.getElementById('loadingIndicator').classList.add('hide');
    window.location.replace("/end.html");
  }, 3000);
}

function resetGame(){
  scoreCount = 0;
  qsDone = 0;
  showQuestionNum = 0;
}


/////////////////////////////////////// JS code for end.html START///////////////////////
function onEndPageLoad(){
  generateEndPageHtml();
  updateScoreInEndPage();
}

function generateEndPageHtml(){
    const containerEnd = createDomElement( "div", "container");
    const rowEnd = createDomElement("div", "row");
    const colEnd = createDomElement("div", "col-md-6 offset-md-3 endPage");
    
    const pScore = createDomElement('p', 'text-center mt-5', 'scoreEndPage');
    pScore.innerHTML = 'Score:';

    const inputUserName = createDomElement('input', 'mt-2', 'userName');
    inputUserName.placeholder = 'User Name';
    inputUserName.type = 'text';
    inputUserName.addEventListener('keyup', enableSave);

    const saveBtn = createDomElement('button', 'btn btn-info mt-3', 'saveScoreBtn');
    saveBtn.innerHTML = "Save";
    saveBtn.disabled = true;
    saveBtn.addEventListener('click', saveScore)

    const playAgainBtn = createDomElement('button', 'btn btn-primary mt-3', 'playAgain');
    playAgainBtn.innerHTML = 'Play Again';
    playAgainBtn.addEventListener('click', goToPlayAgain);

    const goHomeBtn = createDomElement('button', 'btn mt-3', 'goHome');
    goHomeBtn.innerHTML = 'Go Home';
    goHomeBtn.addEventListener('click', goToHome);

    colEnd.append(pScore, inputUserName, saveBtn, playAgainBtn, goHomeBtn);
    rowEnd.append(colEnd);
    containerEnd.append(rowEnd);
    document.body.append(containerEnd);
}

function updateScoreInEndPage(){
  if(localStorage.getItem('score') !== null){
    document.getElementById('scoreEndPage').innerHTML = 'Score '+localStorage.getItem('score');
  }
}

function enableSave(){
  const userName = document.getElementById('userName').value;
  if(userName){
    document.getElementById('saveScoreBtn').disabled = false;
  } else {
    document.getElementById('saveScoreBtn').disabled = true;
  }
}

function saveScore(){
  let highScores = [];
  if(localStorage.getItem('highScores')){
    highScores = JSON.parse(localStorage.getItem('highScores'));
  } else {
    highScores = [];
  }
  const score = localStorage.getItem('score');
  const userName = document.getElementById('userName').value;
  const highScore = {userName, score}
  highScores.push(highScore);
  localStorage.setItem('highScores', JSON.stringify(highScores));
}

/////////////////////////////////////// JS code for highScores.html START///////////////////////

function onHighScoresPageLoad(){
  generateHighScorePageHtml();
  populateHighScoresList();
  findHighestScore();
}

function findHighestScore(){
  if(localStorage.getItem('highScores')){
    let highScores = JSON.parse(localStorage.getItem('highScores'));
    highScores.sort((a,b) => (a.score > b.score) ? -1 : ((b.score > a.score) ? 1 : 0));
    document.getElementById('highestScorer').innerHTML = `${highScores[0].userName} - ${highScores[0].score}`
  } else {
    document.getElementById('statusMessage').innerHTML = 'No Scores yet, please play the game first!'
  }
}

function populateHighScoresList(){
  if(localStorage.getItem('highScores')){
    let highScores = JSON.parse(localStorage.getItem('highScores'));
    generateHighScoresList(highScores);
  }
}

function generateHighScoresList(highScores){
  const table = createDomElement('table', 'table table-bordered mt-5');
  const tr = createDomElement('tr');
    const tdUserName = createDomElement('td', 'font-weight-bold text-center');
    tdUserName.innerHTML = 'UserName';
    const tdUserScore = createDomElement('td', 'font-weight-bold text-center');
    tdUserScore.innerHTML = 'Score';
    tr.append(tdUserName, tdUserScore);
    table.append(tr);
  highScores.forEach(highScore => {
    const tr = createDomElement('tr');
      const pUserName = createDomElement('td', 'text-center');
      pUserName.innerHTML = highScore.userName;
      const pScore = createDomElement('td', 'text-center');
      pScore.innerHTML = highScore.score; 
      tr.append(pUserName, pScore);  
      table.append(tr);
  })
  document.getElementById('highScoresList').append(table);  
}

function goToPlayAgain(){
  window.location.replace("/game.html");
}


function goToHome(){
  window.location.replace("/index.html");
}


function generateHighScorePageHtml(){
  const containerH = createDomElement( "div", "container mt-5");
  const row = createDomElement("div", "row");
  const col = createDomElement("div", "col-md-6 offset-md-3 endPage");
  
  const h2 = createDomElement('h2', 'pageTitle text-center');
  h2.innerHTML = 'High Scores';
  const h3 = createDomElement('h3', 'text-center', 'highestScorer');


  const statusMessage = createDomElement('h5', 'text-center', 'statusMessage');

  const highScoresList = createDomElement('div','', 'highScoresList');

  const goHomeBtn = createDomElement('button', 'btn btn-info mt-2', 'goHome');
  goHomeBtn.addEventListener('click', goToHome);
  goHomeBtn.innerHTML = 'Go Home';
  
  col.append(h2, h3, highScoresList, statusMessage, goHomeBtn);
  row.append(col);
  containerH.append(row);
  document.body.append(containerH);
}